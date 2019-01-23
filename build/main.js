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
import * as bccHelper from './app/bcc/bcc';
import * as core from './app/core';
import * as dapp from './app/dapp';
import * as ipfs from './app/ipfs';
import * as lightwallet from './app/lightwallet';
import * as loading from './app/loading';
import * as notifications from './app/notifications';
import * as queue from './app/queue';
import * as routing from './app/routing';
import * as solc from './app/solc';
import * as utils from './app/utils';
import * as web3Helper from './app/web3';
import { AccountStore } from './app/bcc/AccountStore';
import { config } from './app/config';
import { KeyProvider, getLatestKeyProvider } from './app/bcc/KeyProvider';
import { Solc } from './app/solc';
import { startWatchers } from './app/watchers';
import { updateCoreRuntime, getCoreOptions } from './app/bcc/bcc';
/**
 * add page load performance tracking
 */
window['evanloadTime'] = Date.now();
/**************************************************************************************************/
/**
 * Keep orignal Promise from ZoneJS and restore it after bcc browserified was loaded, which
 * is overwriting the ZoneJS Promise
 *
 * bcc:23126 Unhandled promise rejection Error: Zone.js has detected that ZoneAwarePromise
 * `(window|global).Promise` has been overwritten.
 */
// TODO: when bcc is loaded multiple times, zoneJS should also be saved
var zoneJSPromise = window['Promise'];
var System = window['System'];
var getDomainName = dapp.getDomainName;
var web3;
var CoreRuntime;
var definition;
var nameResolver;
delete window['System'];
// prefill bcc for systemjs plugin usage
evanGlobals = {
    core: core,
    ipfsCatPromise: ipfs.ipfsCatPromise,
    lightwallet: lightwallet,
    restIpfs: ipfs.restIpfs,
    System: System,
    queryParams: routing.getQueryParameters()
};
// evanGlobals.System.map['bcc'] = `bcc.${ getDomainName() }!dapp-content`;
// evanGlobals.System.map['bcc-profile'] = `bcc.${ getDomainName() }!dapp-content`;
// evanGlobals.System.map['bcc-bc'] = `bcc.${ getDomainName() }!dapp-content`;
// evanGlobals.System.map['@evan.network/ui-dapp-browser'] = `dapp-browser!dapp-content`;
// evanGlobals.System.map['@evan.network/api-blockchain-core'] = `bcc.${ getDomainName() }!dapp-content`;
// evanGlobals.System.map['@evan.network/dbcp'] = `bcc.${ getDomainName() }!dapp-content`;
// evanGlobals.System.map['smart-contracts'] = `smartcontracts.${ getDomainName() }!dapp-content`;
// evanGlobals.System.map['@evan.network/smart-contracts-core'] = `smartcontracts.${ getDomainName() }!dapp-content`;
/**
 * Starts the whole dapp-browser.
 */
export function initializeEvanNetworkStructure() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // activate color themes
                    utils.activateColorTheme(utils.getColorTheme());
                    // check if we are running in dev mode, load dev mode available modules
                    return [4 /*yield*/, utils.setUpDevMode()];
                case 1:
                    // check if we are running in dev mode, load dev mode available modules
                    _a.sent();
                    // set initial loadin step
                    utils.raiseProgress(5);
                    // check if angular-libs are already cached as the latest version => load it directly from ipfs
                    // simoultaniously to bcc
                    // const preloadAngular = dapp.preloadAngularLibs();
                    // load smart-contracts and blockchain-core minimal setup for accessing ens from ipfs
                    Promise
                        .all([
                        System
                            .import('https://ipfs.evan.network/ipns/Qme9gmKpueriR7qMH5SNW3De3b9AFBkUGvFMS8ve1SuYBy/bcc.js')
                            .then(function (CoreBundle) { return utils.raiseProgress(10, CoreBundle); }),
                        System
                            .import('https://ipfs.evan.network/ipns/QmRMz7yzMqjbEqXNdcmqk2WMFcXtpY41Nt9CqsLwMgkF43/compiled.js')
                            .then(function (SmartContracts) { return utils.raiseProgress(10, SmartContracts); }),
                        // check if an executor agent should be used for the application runtime
                        core.getAgentExecutor()
                    ])
                        .then(function (_a) {
                        var CoreBundle = _a[0], SmartContracts = _a[1];
                        return __awaiter(_this, void 0, void 0, function () {
                            var initialRoute, initialNotification, ex_1;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        // make it global available without loading it twice
                                        evanGlobals.CoreBundle = CoreBundle;
                                        evanGlobals.SmartContracts = SmartContracts;
                                        _b.label = 1;
                                    case 1:
                                        _b.trys.push([1, 7, , 8]);
                                        // initialize bcc and make it globally available
                                        return [4 /*yield*/, updateCoreRuntime(CoreBundle, SmartContracts)];
                                    case 2:
                                        // initialize bcc and make it globally available
                                        _b.sent();
                                        evanGlobals.CoreRuntime = CoreBundle.CoreRuntime;
                                        // tell everyone, that bcc was loaded and initialized
                                        utils.setBccReady();
                                        // set variables to export to dapps
                                        CoreRuntime = CoreBundle.CoreRuntime;
                                        definition = CoreRuntime.definition;
                                        nameResolver = CoreRuntime.nameResolver;
                                        web3 = CoreRuntime.web3;
                                        // restore zoneJSpromise
                                        window['Promise'] = zoneJSPromise;
                                        // wait for device ready event so we can load notifications
                                        // await preloadAngular;
                                        return [4 /*yield*/, utils.onDeviceReady()];
                                    case 3:
                                        // wait for device ready event so we can load notifications
                                        // await preloadAngular;
                                        _b.sent();
                                        // initialize queue
                                        queue.updateQueue();
                                        initialRoute = void 0;
                                        if (!window.cordova) return [3 /*break*/, 6];
                                        return [4 /*yield*/, notifications.initialize()];
                                    case 4:
                                        initialNotification = _b.sent();
                                        if (!initialNotification) return [3 /*break*/, 6];
                                        initialNotification.evanNotificationOpened = true;
                                        return [4 /*yield*/, notifications.getDAppUrlFromNotification(initialNotification)];
                                    case 5:
                                        initialRoute = _b.sent();
                                        _b.label = 6;
                                    case 6:
                                        // initialize dynamic routing and apply eventually clicked notification initial route
                                        routing.initialize(initialRoute);
                                        // add account watcher
                                        core.watchAccountChange();
                                        // watch for specific frontend events (low eve, ...)
                                        startWatchers();
                                        if (utils.devMode) {
                                            window['evanGlobals'] = evanGlobals;
                                        }
                                        return [3 /*break*/, 8];
                                    case 7:
                                        ex_1 = _b.sent();
                                        console.error(ex_1);
                                        utils.showError();
                                        return [3 /*break*/, 8];
                                    case 8: return [2 /*return*/];
                                }
                            });
                        });
                    })
                        .catch(function (ex) {
                        console.error(ex);
                        utils.showError();
                    });
                    return [2 /*return*/];
            }
        });
    });
}
System.originalImport = System.import;
/**
 * Overwrite SystemJS import to add additional logs for dev tracing.
 *
 * @param      {string}  pathToLoad  The path to load
 * @return     {Promise<any>}  SystemJS result
 */
System.import = function (pathToLoad) {
    utils.devLog("SystemJS import: " + pathToLoad, 'verbose');
    // if an export function with the following pattern (#***!dapp-content) was specified, replace the
    // export function for the System.import
    var exportFunction = pathToLoad.match(/#(.*)!/g);
    if (exportFunction && exportFunction.length > 0) {
        exportFunction = exportFunction[0].replace(/#|!/g, '');
        pathToLoad.replace(exportFunction, '!');
    }
    return System
        .originalImport(pathToLoad)
        .then(function (result) {
        // if an export function is selected and available, return only this value
        if (exportFunction && result[exportFunction]) {
            return result[exportFunction];
        }
        else {
            return result;
        }
    });
};
export { AccountStore, bccHelper, config, core, CoreRuntime, dapp, definition, evanGlobals, getCoreOptions, getDomainName, getLatestKeyProvider, ipfs, KeyProvider, lightwallet, loading, nameResolver, notifications, queue, routing, solc, Solc, System, utils, web3, web3Helper, };
initializeEvanNetworkStructure();
