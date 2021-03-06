/**
 * This file is part of rgx.
 *
 * rgx is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * rgx is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with rgx. If not, see <http://www.gnu.org/licenses/>.
 */

#include <ctime>
#include <csignal>

#include <algol/utility.hpp>
#include <algol/configurator.hpp>

#include "kernel.hpp"
#include "connection.hpp"

namespace rgx {

  kernel::kernel()
  : configurable({"rgx"}),
    logger("rgx"),
    io_service_(),
    strand_(io_service_),
    acceptor_(io_service_),
    lua_engine_(),

    new_connection_(),

    running_(false),
    paused_(false),
    init_(false),

    pause_cb_(nullptr)
  {
    config_.nr_workers = 4;
    config_.listen_interface = "127.0.0.1";
    config_.port = "9400";
  }

  kernel::~kernel()
  {
  }

	/* +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ *
	 *	accessors
	 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ */

	/* +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ *
	 *	bootstrap
	 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ */

  void kernel::init()
  {
  }

  void kernel::configure(const config_t& in_cfg)
  {
    config_ = in_cfg;
  }

  void kernel::configure(const string_t& json_data)
  {
    info() << "Configuring.";

    string_t data = json_data;
    if (data.empty()) {
      std::ifstream cfg_stream(algol::path_t(algol::file_manager::singleton().bin_path() / "rgx.cfg").make_preferred().string());
      if (cfg_stream.is_open() && cfg_stream.good()) {
        cfg_stream.seekg(0, std::ios::end);
        data.reserve(cfg_stream.tellg());
        cfg_stream.seekg(0, std::ios::beg);

        data.assign((std::istreambuf_iterator<char>(cfg_stream)),
                         std::istreambuf_iterator<char>());
      } else {
        return;
      }
    }

    configurator cfg(data);
    cfg.run();

    lua_engine_.restart();
  }

  void kernel::run()
  {
    algol::path_t root = file_manager::singleton().root_path();

    info() << "binding at: " << config_.listen_interface << ":" << config_.port;

    init_ = true;

    // open the client acceptor with the option to reuse the address (i.e. SO_REUSEADDR).
    {
      // boost::asio::ip::tcp::resolver resolver(io_service_pool_.get_io_service());
      boost::asio::ip::tcp::resolver resolver(io_service_);
      boost::asio::ip::tcp::resolver::query query(config_.listen_interface, config_.port);
      boost::asio::ip::tcp::endpoint endpoint = *resolver.resolve(query);
      acceptor_.open(endpoint.protocol());
      acceptor_.set_option(boost::asio::ip::tcp::acceptor::reuse_address(true));
      acceptor_.bind(endpoint);
      acceptor_.listen();

      // accept connections
      accept();
    }

    if (lua_engine_.start((root / "../rgx_helpers.lua").string())) {
      lua_engine_.invoke("rgx_export", 0, 0);
      lua_engine_.run((root / "../PCRE/" / "rgx.lua").string());
      lua_engine_.run((root / "../Lua/" / "rgx.lua").string());
    }

    for (std::size_t i = 0; i < config_.nr_workers; ++i)
      workers_.create_thread(boost::bind(&kernel::work, boost::ref(this)));

    info() << "rgx running:";
    info() << "\taccepting connections on " << config_.nr_workers << " threads";
    info() << "\tconnections will time out every " << connection::get_timeout() << "s";

    running_ = true;

    // wait for all threads in the pool to exit
    workers_.join_all();
  }

  void kernel::cleanup()
  {
    if (!init_) {
      error()
        << "WARNING: attempting to clean up the kernel when it has "
        << "already been cleaned, or not run at all!";
      return;
    }

    info() << "cleaning up";

    new_connection_.reset();
    paused_connections_.clear();
    connections_.clear();

    lua_engine_.stop();

    init_ = false;
  }

  void kernel::work() {
    try {
      io_service_.run();
    } catch (std::exception& e) {
      error() << "an exception caught in a worker, aborting: " << e.what();
      throw e;
    }
  }

  void kernel::stop() {
    if (!is_running()) {
      error()
        << "WARNING: attempting to stop the kernel when it's not running!";

      if (init_)
        warn() << "received stop() command when I'm already offline";

      return;
    }

    info() << "shutting down gracefully, waiting for current jobs to finish, please wait";

    for (connection_ptr conn : connections_)
      conn->stop();

    connections_.clear();
    new_connection_.reset();

    io_service_.stop();

    info() << "stopped";
    running_ = false;
  }

  void kernel::pause(pause_callback_t cb) {
    // Locking the connection mutex is necessary since the acceptor
    // routine is affected by the paused_ flag which is toggled here
    info() << "Pausing...";
    {
      scoped_lock lock(conn_mtx_);

      paused_ = true;
      pause_cb_ = cb;
    }

    if (connections_.empty())
      on_paused();
  }

  void kernel::on_paused() {
    // Invoke the callback if any, otherwise resume()
    info() << "Paused.";

    if (pause_cb_)
      return pause_cb_();

    resume();
  }

  void kernel::resume() {
    scoped_lock lock(conn_mtx_);

    info() << "Resuming...";

    paused_ = false;

    for (auto c : paused_connections_) {
      connections_.push_back(c);
      c->start();
    }

    paused_connections_.clear();

    info() << "Resumed.";
  }

	/* +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ *
	 *	main routines
	 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+ */
   void kernel::accept() {
      new_connection_.reset(new connection(io_service_, lua_engine_));
      new_connection_->assign_close_handler(boost::bind(&kernel::close, this, _1));
      acceptor_.async_accept(new_connection_->socket(),
          boost::bind(&kernel::handle_accept, this,
            boost::asio::placeholders::error));
   }

   void kernel::handle_accept(const boost::system::error_code &e) {
    if (!e)
    {
      scoped_lock lock(conn_mtx_);

      // If the kernel is currently paused, new connections are tracked
      // in the paused connections container and will NOT be started
      // until the kernel is resumed
      if (is_paused()) {
        paused_connections_.push_back(new_connection_);
      } else {
        connections_.push_back(new_connection_);
        new_connection_->start();
      }

      // no matter whether we're paused or not, we still accept new connections
      accept();
    } else {
      error() << "couldn't accept connection! " << e;
      throw std::runtime_error("unable to accept connection, see log for more info");
    }
  }

  void kernel::close(connection_ptr conn) {
    // No longer using a strand in favor of locking
    // strand_.post( [&, conn]() { connections_.remove(conn); });

    scoped_lock lock(conn_mtx_);
    connections_.remove(conn);

    if (is_paused() && connections_.empty()) {
      on_paused();
    }
  }

  bool kernel::is_running() const {
    return running_;
  }
  bool kernel::is_paused() const {
    return paused_;
  }

  void kernel::set_option(string_t const& key, string_t const& value)
  {
    if (key == "listen_interface" || key == "interface")
      config_.listen_interface = value;
    else if (key == "port")
      config_.port = value;
    // else if (key == "nr_workers" || key == "workers")
      // config_.nr_workers = utility::convertTo<int>(value);
    else if (key == "connection timeout" || key == "timeout" || key == "conn_timeout") {
      timespec ts;
      if (!utility::string_to_seconds(value, &ts)) {
        error() << "invalid time value for 'connection timeout' => '" << value << "', defaulting to 5s";
        ts.tv_sec = 5;
      }

      connection::set_timeout(ts.tv_sec);
    }
    else {
      warn() << "unknown rgx config setting '"
        << key << "' => '" << value << "', discarding";
    }
  }

} // namespace rgx
