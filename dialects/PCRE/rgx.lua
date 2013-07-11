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

-- local rgx       = require 'rgx_helpers'
local rgx       = rgx
local rex_pcre  = require 'rex_pcre'

if not rgx or not rgx.test_construct then
  return error("rgx.lua: _G['rgx'] or rgx.test_construct implementation is missing!")
end

local function matcher(pattern, subject, flags)
  -- embed the compilation flags inline-style
  pattern = '(?' .. (flags or '') .. ':' .. pattern .. ')'

  local success, rex_or_msg = pcall(rex_pcre.new, pattern)
  if not success then
    return nil, "invalid regular expression; " .. rex_or_msg
  end

  -- local match = { rex_pcre:find(subject, rex_or_msg) }
  local match = { rex_or_msg:tfind(subject) }

  -- offset the match starting point (if any) by -1 because Lua indexing starts at 1
  if match[1] then
    match[1] = match[1] - 1
    match[2] = match[2] - 1
  end

  return match
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

rgx.PCRE = {
  test = function(json_construct)
    return rgx.test_construct(json_construct, matcher)
  end,

  flags = function()
    return json.encode(flags)
  end
}