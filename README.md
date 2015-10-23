# rgx

A web application for writing and checking regular expressions in multiple 
dialects.

Visit www.rgx.io for the actual application.

## Installation

Required packages for core:

- `node.js` (v0.12+ or v4.0+) and its package manager `npm`
- elasticsearch

- `npm install` inside the root to get the node packages ready

To get the dialects set-up, visit each dialect's README under `dialects/`.

## Running

`/path/to/node ./server.js`

## Development

### Construct Spec

**Capture sample**

```javascript
{
  "offset": Array(Number, Number),
  "captures": Array(Array(Number,Number)),
  "status": "RC_MATCH"
}
```

**Bad pattern sample**

```javascript
{
  "status": "RC_BADPATTERN",
  "error": String
}
```

## License

This file is part of rgx.

rgx is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

rgx is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with rgx. If not, see <http://www.gnu.org/licenses/>.