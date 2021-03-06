/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program. If not, see http://www.gnu.org/licenses/ or
  write to the Free Software Foundation, Inc., 51 Franklin Street,
  Fifth Floor, Boston, MA, 02110-1301 USA, or download the license from
  the following URL: https://evan.network/license/
*/

/**
 * Load basic text (used for css)
 *
 * @param      {string}  load    SystemJS payload properties
 * @return     {string}  location adjusted to return only text
 */
exports.translate = function(load) {
  if (this.builder && this.transpiler) {
    load.metadata.format = 'esm';
    return 'exp' + 'ort var __useDefault = ' + JSON.stringify(load.source) + '; exp' + 'ort default __useDefault;';
  }

  load.metadata.format = 'amd';
  return 'def' + 'ine(function() {\nreturn ' + JSON.stringify(load.source) + ';\n});';
}