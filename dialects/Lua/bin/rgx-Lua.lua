#!/usr/bin/env lua

------------------
--
-- This file is part of rgx.
--
-- rgx is free software: you can redistribute it and/or modify
-- it under the terms of the GNU Affero General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- rgx is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU Affero General Public License for more details.
--
-- You should have received a copy of the GNU Affero General Public License
-- along with rgx. If not, see <http://www.gnu.org/licenses/>.
--
------------------

-- local rgx   = rgx
local json  = require 'dkjson'

-- if not rgx or not rgx.test_construct then
--   return error("rgx.lua: _G['rgx'] or rgx.test_construct implementation is missing!")
-- end

local function matcher(pattern, subject, flags)
  local success, match_or_error = pcall(function()
    return { subject:find(pattern) }
  end)

  if not success then
    return nil, match_or_error
  else
    return match_or_error
  end

  -- offset the match starting point (if any) by -1 because Lua indexing starts at 1
  -- if match[1] then
  --   match = {
  --     table.remove(match, 1) -1, -- the match begin offset
  --     table.remove(match, 1) -1, -- the match end offset
  --     match -- the captures, if any
  --   }
  -- else
  --   return nil, "invalid regular expression; " .. match[1]
  -- end

  -- return match
end

local function onInput(json_construct)
  local construct = json.decode(json_construct)

  if not construct then
    return { status = "error", message = "ERR_INVALID_JSON" }
  end

  if not construct.pattern or not construct.subject then
    return { status = "error", message = "ERR_MISSING_PATTERN" }
  end

  local result, err = matcher(construct.pattern, construct.subject, construct.flags)

  if not result then
    return {
      status = "RC_BADPATTERN",
      message  = err
    }
  elseif #result == 0 then
    return { status = "RC_NOMATCH" }
  end

  local captures = {}
  local offset = {}

  -- offset the match starting point (if any) by -1 because Lua indexing starts at 1
  if result[1] then
    offset = { result[1]-1, result[2] }
  end

  -- map the captures as [b,e] offset arrays
  for i=3, #result, 1 do
    local start_at, end_at = construct.subject:find(result[i])

    table.insert(captures, { start_at - 1, end_at })
  end

  return {
    status = "RC_MATCH",
    offset = offset,
    captures = captures
  }
end

print('ready')

while true do
  local message, _ = io.read("*l")

  if message then
    print(json.encode(onInput(message)))
  else
    break
  end
end

-- rgx.Lua = {
--   test = function(json_construct)
--     return rgx.test_construct(json_construct, matcher)
--   end,

--   flags = function()
--     return json.encode(flags)
--   end
-- }
