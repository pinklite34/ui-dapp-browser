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
import { startDApp, getDomainName } from './dapp';
import * as core from './core';
/**
 * small navigation library Navigo is used to handle comfortable url route writing
 */
var Navigo = window['Navigo'];
var CoreBundle;
var CoreRuntime;
var lastRootENS;
export var router;
export var defaultDAppENS;
export var history;
/**
 * Go to onboarding. (#/onboarding.evan)
 */
export function goToOnboarding() {
    var hashOrigin = window.location.hash.replace(/#\/|#/g, '');
    var activeRoute = hashOrigin.split('?')[0];
    var queryParams = hashOrigin.split('?')[1];
    router.navigate("/onboarding." + getDomainName() + "?origin=" + activeRoute + (queryParams ? '&' + queryParams : ''));
}
/**
 * Go to dashboard.  (#/dashboard.evan)
 */
export function goToDashboard() {
    router.navigate("/dashboard." + getDomainName());
}
/**
 * Determines if the user is on the onboarding page.
 *
 * @return     {boolean}  True if onboarding, False otherwise.
 */
export function isOnboarding() {
    return window.location.hash.indexOf("/onboarding." + getDomainName()) !== -1;
}
/**
 * Gets the active root ens.
 *
 * @return     {string}  The active root ens.
 */
export function getActiveRootENS() {
    var splitted = window.location.hash.replace(/#\/|#/g, '').split('?')[0].split('/');
    if (splitted.length > 0) {
        return splitted[0];
    }
    else {
        return '';
    }
}
/**
 * Gets the default DApp ens.
 *
 * @return     {string}  default DApp ens path
 */
export function getDefaultDAppENS() {
    return __awaiter(this, void 0, void 0, function () {
        var host, hostDApp, definition, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    host = window.location.host;
                    if (!(!host.startsWith('ipfs') && !host.startsWith('localhost'))) return [3 /*break*/, 4];
                    hostDApp = host.replace('evan.network', 'evan');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, evanGlobals.System.import(hostDApp + "!ens")];
                case 2:
                    definition = _a.sent();
                    if (definition && definition.dapp && definition.dapp.origin) {
                        return [2 /*return*/, hostDApp];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    ex_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, "dashboard." + getDomainName()];
            }
        });
    });
}
/**
 * Prerouting checks to handle if the user was logged in and onboared. Navigates to onboarding /
 * default dapp ens when necessary.
 */
export function beforeRoute() {
    return __awaiter(this, void 0, void 0, function () {
        var isOnboarded, ex_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!core.getAccountId()) return [3 /*break*/, 5];
                    isOnboarded = false;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, evanGlobals.CoreBundle.isAccountOnboarded(core.getAccountId())];
                case 2:
                    isOnboarded = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    ex_2 = _a.sent();
                    return [3 /*break*/, 4];
                case 4:
                    if (!isOnboarded) {
                        goToOnboarding();
                    }
                    else {
                        if (!getActiveRootENS()) {
                            router.navigate("/" + defaultDAppENS);
                        }
                    }
                    return [3 /*break*/, 6];
                case 5:
                    if (!isOnboarding()) {
                        goToOnboarding();
                    }
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Function to check if the route DApp hash changed => run beforeRoute and set
 * the route active
 *
 * @return     {void}  resolved when routed
 */
export function onRouteChange() {
    return __awaiter(this, void 0, void 0, function () {
        var activeRootENS, ex_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    activeRootENS = getActiveRootENS();
                    if (!(lastRootENS !== activeRootENS)) return [3 /*break*/, 5];
                    lastRootENS = activeRootENS;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, beforeRoute()];
                case 2:
                    _a.sent();
                    activeRootENS = getActiveRootENS();
                    lastRootENS = activeRootENS;
                    return [4 /*yield*/, startDApp(activeRootENS)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    ex_3 = _a.sent();
                    console.log("Error while onRouteChange and startDApp (" + activeRootENS + ")");
                    console.error(ex_3);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Initialize the whole routing mechanism.
 *
 * @param      {string}  initialRoute  initial route that should replace the default ens url paths
 *                                     (eg. dashboard.evan => my-initial-route.evan)
 * @return     {void}    resolved when routing was created
 */
export function initialize(initialRoute) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    CoreBundle = evanGlobals.CoreBundle;
                    CoreRuntime = CoreBundle.CoreRuntime;
                    // load history from cache
                    if (window.performance.navigation.type === 1 && !window.sessionStorage['evan-route-reloaded']) {
                        history = [];
                    }
                    else {
                        try {
                            history = JSON.parse(window.sessionStorage['evan-route-history']);
                        }
                        catch (ex) { }
                    }
                    // setup history functions
                    history = history || [];
                    updateHistory();
                    // watch for window reload to save, that the current session was reloaded
                    delete window.sessionStorage['evan-route-reloaded'];
                    window.addEventListener('beforeunload', function (event) {
                        window.sessionStorage['evan-route-reloaded'] = true;
                    });
                    // if an default route was applied to the initialize function, navigate to it!
                    if (initialRoute) {
                        window.location.hash = initialRoute;
                    }
                    // create Navigo with angular # routing
                    router = new Navigo(null, true, '#');
                    return [4 /*yield*/, getDefaultDAppENS()];
                case 1:
                    defaultDAppENS = _a.sent();
                    // reset account, when the page was reloaded during profile creation
                    if (window.localStorage['evan-profile-creation']) {
                        delete window.localStorage['evan-profile-creation'];
                        core.logout(true);
                    }
                    // load current url for the first time
                    return [4 /*yield*/, onRouteChange()];
                case 2:
                    // load current url for the first time
                    _a.sent();
                    if (typeof window.onhashchange !== 'undefined') {
                        window.addEventListener('hashchange', onRouteChange);
                    }
                    else {
                        setInterval(onRouteChange, 100);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Takes the current url, removes #, /#, #/ and returns the original hash value
 * without query params
 *
 * @return     {string}  transforms #/dapp/dapp1?param1=est to dapp/dapps
 */
export function getRouteFromUrl() {
    return window.location.hash
        .replace('#!', '')
        .replace(/#\/|\/#/g, '')
        .split('?')[0];
}
/**
 * Takes the current navigation history and writes it to the sessionStorage if the user navigates to
 * another page and navigates back
 */
export function updateHistory() {
    window.sessionStorage['evan-route-history'] = JSON.stringify(history);
}
/**
 * Parse the url queryParams and return a specific parameter from it
 *
 * @param      {string}  name    name of the parameter
 * @param      {string}  url     url to parse, detail is window.location.href
 * @return     {string}  value of the parameter / null if not defined
 */
export function getQueryParameterValue(name, url) {
    if (url === void 0) { url = window.location.href; }
    // parse out the parameters
    var regex = new RegExp('[?&]' + name.replace(/[\[\]]/g, '\\$&') + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(url);
    if (!results || !results[2]) {
        return null;
    }
    else {
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
}
/**
 * Returns a bare object of the URL's query parameters.
 * You can pass just a query string rather than a complete URL.
 * The default URL is the current page.
 *
 * @return     {any}  all parameters with its values
 */
export function getQueryParameters(url) {
    if (url === void 0) { url = window.location.search.split('#')[0]; }
    // http://stackoverflow.com/a/23946023/2407309
    var urlParams = {};
    var queryString = url.split('?')[1];
    if (queryString) {
        var keyValuePairs = queryString.split('&');
        for (var i = 0; i < keyValuePairs.length; i++) {
            var keyValuePair = keyValuePairs[i].split('=');
            var paramName = keyValuePair[0];
            var paramValue = keyValuePair[1] || '';
            urlParams[paramName] = decodeURIComponent(paramValue.replace(/\+/g, ' '));
        }
    }
    return urlParams;
}
