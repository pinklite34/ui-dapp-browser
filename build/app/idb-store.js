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
import * as utils from './utils';
/**
 * IndexDB store wrapper
 *
 * @class      IDBStore (name)
 */
var IDBStore = /** @class */ (function () {
    /**
     * @param      {string}  dbName     database name
     * @param      {string}  storeName  store name within the database
     */
    function IDBStore(dbName, storeName) {
        if (dbName === void 0) { dbName = 'keyval-store'; }
        if (storeName === void 0) { storeName = 'keyval'; }
        this.storeName = storeName;
        this._dbp = new Promise(function (resolve, reject) {
            var openreq = indexedDB.open(dbName, 1);
            openreq.onerror = function () {
                reject(openreq.error);
            };
            openreq.onsuccess = function () {
                try {
                    openreq.result.createObjectStore(storeName);
                }
                catch (ex) { }
                resolve(openreq.result);
            };
            openreq.onblocked = function (event) {
                console.log('IndexDB blocked: ');
                resolve();
            };
            // First time setup: create an empty object store
            openreq.onupgradeneeded = function () {
                openreq.result.createObjectStore(storeName);
            };
        });
    }
    /**
     * Runs an transaction for within the IDB store
     *
     * @param      {IDBTransactionMode}  type      The type
     * @param      {Function}            callback  callback function, that is called
     *                                             when the transaction is finished
     */
    IDBStore.prototype._withIDBStore = function (type, callback) {
        var _this = this;
        return this._dbp.then(function (db) { return new Promise(function (resolve, reject) {
            var transaction = db.transaction(_this.storeName, type);
            transaction.oncomplete = function () { return resolve(); };
            transaction.onabort = transaction.onerror = function () { return reject(transaction.error); };
            callback(transaction.objectStore(_this.storeName));
        }); });
    };
    return IDBStore;
}());
export { IDBStore };
/**
 * cache the latest store
 */
var defaultStore;
/**
 * creates a new store or returns the latest one
 *
 * @return     {IDBStore}  idb store
 */
function getDefaultStore() {
    if (!defaultStore) {
        defaultStore = new IDBStore();
    }
    return defaultStore;
}
/**
 * Gets a key from the IDB store.
 *
 * @param      {IDBValidKey}  key     key to load
 * @param      {IDBStore}     store   idb store to load the data from
 * @return     {Type}         returns a key value from idb store
 */
export function get(key, store) {
    if (store === void 0) { store = getDefaultStore(); }
    var req;
    return store
        ._withIDBStore('readonly', function (idbStore) {
        req = idbStore.get(key);
    })
        .then(function () { return req.result; })
        // edge is throwing an exception, when the value is not set
        .catch(function (ex) {
        return undefined;
    });
}
/**
 * sets a key value in a idb store
 *
 * @param      {IDBValidKEy}  key     key to set the value for
 * @param      {any}          value   value to set
 * @param      {store}        store   idb store to set the value in
 */
export function set(key, value, store) {
    if (store === void 0) { store = getDefaultStore(); }
    return __awaiter(this, void 0, void 0, function () {
        var result, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, store._withIDBStore('readwrite', function (idbStore) {
                            idbStore.put(value, key);
                        })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 2:
                    ex_1 = _a.sent();
                    if (isQuotaExceeded(ex_1)) {
                        utils.sendEvent('evan-warning', {
                            type: 'quota-exceeded'
                        });
                    }
                    else {
                        utils.sendEvent('evan-warning', {
                            type: 'indexdb-not-available'
                        });
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * delete a key from an idb store
 *
 * @param      {IDBValidKey}  key     key to delete
 * @param      {IDBStore}     store   idb store to delete the data from
 */
export function del(key, store) {
    if (store === void 0) { store = getDefaultStore(); }
    return store._withIDBStore('readwrite', function (idbStore) {
        idbStore.delete(key);
    });
}
/**
 * Clears an idb store
 *
 * @param      {IDBStore}  store   idb store to clear
 */
export function clear(store) {
    if (store === void 0) { store = getDefaultStore(); }
    return store._withIDBStore('readwrite', function (idbStore) {
        idbStore.clear();
    });
}
/**
 * Gets the keys from an idb store
 *
 * @param      {IDBStore}                store   The store
 * @return     {Promise<IDBValidKey[]>}  keys of the idb
 */
export function keys(store) {
    if (store === void 0) { store = getDefaultStore(); }
    var idbKeys = [];
    return store._withIDBStore('readonly', function (idbStore) {
        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
        // And openKeyCursor isn't supported by Safari.
        (store.openKeyCursor || store.openCursor).call(store).onsuccess = function () {
            if (!this.result) {
                return;
            }
            idbKeys.push(this.result.key);
            this.result.continue();
        };
    }).then(function () { return idbKeys; });
}
/**
 * Determines if an error is a quota exceeded error.
 *   => http://crocodillon.com/blog/always-catch-localstorage-security-and-quota-exceeded-errors
 *
 * @param      {Exception}   ex      error object
 * @return     {boolean}  True if quota exceeded, False otherwise
 */
function isQuotaExceeded(ex) {
    var quotaExceeded = false;
    if (ex) {
        if (ex.code) {
            switch (ex.code) {
                case 22: {
                    quotaExceeded = true;
                    break;
                }
                case 1014: {
                    // Firefox
                    if (ex.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                        quotaExceeded = true;
                    }
                    break;
                }
            }
        }
        else if (ex.number === -2147024882) {
            // Internet Explorer 8
            quotaExceeded = true;
        }
    }
    return quotaExceeded;
}
