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

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as core from '../core';
import * as lightwallet from '../lightwallet';
import { getWeb3Constructor } from '../web3';
var latestKeyProvider;
/**
 * Encryption Key handler.
 *
 * @class      KeyProvider (keys, accountId)
 */
var KeyProvider = /** @class */ (function () {
    /**
     * @param _keys     keys to set
     * @param accountId additional account id to use KeyProvider for only one account
     */
    function KeyProvider(keys, accountId) {
        this.origin = new evanGlobals.CoreBundle.KeyProvider({});
        this.origin.keys = keys || {};
        this.accountId = accountId;
        this.Web3 = getWeb3Constructor();
    }
    /**
     * runs setKeysForAccount with the current logged in account.
     */
    KeyProvider.prototype.setKeys = function () {
        return __awaiter(this, void 0, void 0, function () {
            var encryptionKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.origin.currentAccountHash = this.Web3.utils.soliditySha3(this.accountId || core.activeAccount());
                        this.origin.currentAccount = this.accountId || core.activeAccount();
                        if (!!this.origin.keys[this.origin.currentAccountHash]) return [3 /*break*/, 2];
                        return [4 /*yield*/, lightwallet.getEncryptionKey()];
                    case 1:
                        encryptionKey = _a.sent();
                        this.setKeysForAccount(this.origin.currentAccountHash, encryptionKey);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Uses an account id and an encryptionKey to set account specific encryption
     * keys.
     *
     * @param      {boolean}  accountId      account id to use
     * @param      {string}   encryptionKey  encryption key for the account
     */
    KeyProvider.prototype.setKeysForAccount = function (accountHash, encryptionKey) {
        var soliditySha3 = this.Web3.utils.soliditySha3;
        if (accountHash.length === 42) {
            accountHash = soliditySha3(accountHash);
        }
        this.origin.keys[accountHash] = encryptionKey;
        this.origin.keys[soliditySha3(accountHash, accountHash)] = encryptionKey;
        this.origin.keys[soliditySha3('mailboxKeyExchange')] =
            '346c22768f84f3050f5c94cec98349b3c5cbfa0b7315304e13647a4918ffff22'; // accX <--> mailbox edge key
    };
    /**
     * Checks if the keys for the current logged in users are set and returns the
     * key.
     *
     * @param      {CryptoInfo}       info    crypto info
     * @return     {Promise<string>}  promise that is resulting the wanted key
     */
    KeyProvider.prototype.getKey = function (info) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setKeys()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.origin.getKey(info)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return KeyProvider;
}());
export { KeyProvider };
/**
 * Returns a new KeyProvider or if another was created before
 *
 * @return     {<type>}  The latest key provider.
 */
export function getLatestKeyProvider() {
    if (!latestKeyProvider) {
        latestKeyProvider = new KeyProvider({});
    }
    return latestKeyProvider;
}
