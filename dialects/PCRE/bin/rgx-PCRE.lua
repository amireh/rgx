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
-- rgx.lua:
-- Uses lrexlib's pcre module to test a PCRE pattern on a subject.
--
------------------
-- local rgx       = rgx
-- local cliargs = require 'lua_cliargs'
local rex_pcre  = require 'rex_pcre'
local json      = require 'dkjson'

-- if not rgx or not rgx.test_construct then
--   return error("rgx.lua: _G['rgx'] or rgx.test_construct implementation is missing!")
-- end

local function matcher(raw_pattern, subject, flags)
  -- embed the compilation flags inline-style
  pattern = '(?' .. (flags or '') .. ':' .. raw_pattern .. ')'

  local success, rex_or_msg = pcall(rex_pcre.new, pattern)
  if not success then
    return nil, "invalid regular expression; " .. rex_or_msg
  end

  return { rex_or_msg:exec(subject) }
end

local flags = {
  ["i"] = "makes matching case insensitive",
  ["m"] = "matching will span across line feeds",
  ["s"] = "makes .* match everything, including control characters",
  ["x"] = "Extended",
  ["U"] = "Ungreedy",
  ["X"] = "Extra",
  ["J"] = "Duplicate names"
}

local function onInput(json_construct)
  local construct = json.decode(json_construct)

  if not construct then
    return { status = "error", error = "ERR_INVALID_JSON" }
  end

  if not construct.pattern or not construct.subject then
    return { status = "error", error = "ERR_MISSING_PATTERN" }
  end

  local result, err = matcher(construct.pattern, construct.subject, construct.flags)

  if not result then
    return {
      status = "RC_BADPATTERN",
      error  = err
    }
  end

  if #result > 0 then
    captures = {}
    offset = {}

    -- offset the match starting point (if any) by -1 because Lua indexing starts at 1
    if result[1] then
      offset = { result[1]-1, result[2] }
    end

    -- map the captures as [b,e] offset arrays
    for i=1,#result[3],2 do
      if result[3][i] == false or result[3][i+1] < result[3][i] then
        -- table.insert(captures, {})
      else
        table.insert(captures, { result[3][i]-1, result[3][i+1] })
      end
    end

    return {
      status = "RC_MATCH",
      offset = offset,
      captures = captures
    }
  else
    return { status = "RC_NOMATCH" }
  end
end

-- error('hi')
print('ready')

while true do
  local json_construct = io.read("*l")

  -- print('decoding ' .. tostring(json_construct))

  if json_construct then
    print(json.encode(onInput(json_construct)))
  else
    break
  end
end
