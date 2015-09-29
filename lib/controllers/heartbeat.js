module.exports = function(app, heartbeatMonitor) {
  app.get('/api/heartbeat', function(req, res) {
    res.status(200).json(heartbeatMonitor.getStatusMap());
  });
};