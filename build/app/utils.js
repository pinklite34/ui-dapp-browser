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
/**
 * global available array that includes dev mode available dapps, when devMode is
 * enabled, else undefined
 */
export var devMode;
/**
 * add a bcc ready promise, so some functionallities can wait for finishing bcc has loaded
 */
export var setBccReady;
export var bccReady = new Promise(function (resolve, reject) {
    setBccReady = resolve;
});
/**
 * Initial loading cache values
 */
var percentageThreshold = 100 / 9;
var evanLogoRectAnimated = [];
var lastPercentage = 0;
var lastAnimationFrame;
/**
 * Checks if we are running in devMode, if true, load dev-dapps from local file server, if false do nothing
 *
 * @return     {<type>}  { description_of_the_return_value }
 */
export function setUpDevMode() {
    return __awaiter(this, void 0, void 0, function () {
        var host, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    host = window.location.host;
                    devMode = evanGlobals.devMode = ['pwa'];
                    return [2 /*return*/];
                case 1:
                    _a.devMode = _b.sent();
                    if (evanGlobals.devMode.externals) {
                        evanGlobals.devMode = evanGlobals.devMode.externals;
                    }
                    else {
                        evanGlobals.devMode = null;
                    }
                    devMode = evanGlobals.devMode;
                    _b.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
/**
 * Check if a dev application is available
 *
 * @param      {string}   name    string of the dapp to check
 * @return     {boolean}  True if DApp is available for development, False otherwise.
 */
export function isDevAvailable(name) {
    if (evanGlobals.devMode) {
        return evanGlobals.devMode.indexOf(name.replace(/\-/g, '')) !== -1;
    }
    return false;
}
/**
 * Sends an event using window.dispatchEvent
 *
 * @param      {string}  name    event name
 * @param      {any}     data    data that should be send
 */
export function sendEvent(name, data) {
    window.dispatchEvent(new CustomEvent(name, {
        detail: data
    }));
}
/**
 * predefined events for global usage
 */
export var events = {
    /**
     * sends the event, that a sub DApp starts loading
     */
    loadingSubDApp: function () { return sendEvent('loading-sub-dapp'); },
    /**
     * Sends the event, that a sub DApp finished loading
     */
    finishLoadingSubDApp: function () { return sendEvent('loading-sub-dapp-finished'); },
};
/**
 * Show Error during the initial loading, when no UI framework is loaded
 */
export function showError() {
    var errorElement = document.querySelectorAll('.evan-logo-error')[0];
    if (errorElement) {
        errorElement.style.display = 'block';
        errorElement.querySelectorAll('button')[0].onclick = function () {
            window.location.reload();
        };
    }
}
/**
 * Sets the current loading progress (animates evan.network logo)
 *
 * @param      {number}  percentage  current loading percentage
 */
export function setProgress(percentage) {
    try {
        // cache progress el to handle faster animations
        if (percentage > lastPercentage) {
            lastPercentage = percentage;
        }
        // calculate the count of bars that should be animated
        var rectsToAnimate = Math.round(lastPercentage / percentageThreshold) - 1;
        for (var i = 0; i < rectsToAnimate; i++) {
            if (!evanLogoRectAnimated[i]) {
                evanLogoRectAnimated[i] = true;
                // animate the symbols on the next animation frame to improve animation performance
                (function (index) {
                    window.requestAnimationFrame(function () {
                        var rectElement = document.getElementById("evan-logo-rect-" + (index + 1));
                        if (rectElement) {
                            rectElement.setAttribute('class', 'animate-1');
                        }
                    });
                })(i);
            }
        }
    }
    catch (ex) { }
}
/**
 * Takes the latest progress percentage and raise it with the incoming value.
 *
 * @param      {number}  percentage  percentage to add
 * @param      {any}     returnObj   additional return object for raising
 *                                   loading progress and returning object
 *                                   instantly
 * @return     {string}  additional returnObject
 */
export function raiseProgress(percentage, returnObj) {
    lastPercentage += percentage;
    setProgress(percentage);
    return returnObj;
}
/**
 * Returns the current loading progress.
 *
 * @return     {number}  The loading progress.
 */
export function getLoadingProgress() {
    return lastPercentage;
}
/**
 * Log a message according to localStorage settings to the log
 *
 * @param      {stromg}  message  message to log
 * @param      {string}  level    level to log (log / verbose)
 */
export function devLog(message, level) {
    if (evanGlobals.CoreRuntime && evanGlobals.CoreRuntime.description && evanGlobals.CoreRuntime.description.log) {
        evanGlobals.CoreRuntime.description.log(message, level);
    }
    message = null;
}
/**
 * Log a message according to localStorage settings to the log
 *
 * @param      {stromg}  message  message to log
 * @param      {string}  level    level to log (log / verbose)
 */
export function log(message, level) {
    if (evanGlobals.CoreRuntime && evanGlobals.CoreRuntime.description && evanGlobals.CoreRuntime.description.log) {
        evanGlobals.CoreRuntime.description.log(message, level);
    }
    message = null;
}
/**
 * Adds an deviceready event handler and wait for the result to resolve the promise. If we are on a
 * desktop device, dont wait for deviceready, it will be never called.
 *
 * @return     {Promise<void>}  resolved when deviceready event is emitted
 */
export function onDeviceReady() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (window.cordova) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return document.addEventListener('deviceready', resolve); })];
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Removes the text after the last dot.
 *
 * @param      {string}  ensAddress  ens address to get the name for
 * @return     {string}  dappname including sub ens paths
 */
export function getDAppName(ensAddress) {
    var dappName = ensAddress.replace(/\-/g, '');
    try {
        dappName = /^(.*)\.[^.]+$/.exec(dappName)[1];
    }
    catch (ex) { }
    return dappName;
}
/**
 * Gets the color theme.
 *
 * @return     {string}  the current color theme
 */
export function getColorTheme() {
    return window.localStorage['evan-color-theme'] || '';
}
/**
 * Adds the current color theme class to the body.
 *
 * @param      {string}  colorTheme  the color theme name (e.g. light)
 */
export function activateColorTheme(colorTheme) {
    // remove previous evan themes
    var splitClassName = document.body.className.split(' ');
    splitClassName.forEach(function (className) {
        if (className.indexOf('evan') !== -1) {
            document.body.className = document.body.className.replace(className, '');
        }
    });
    if (colorTheme) {
        document.body.className += " evan-" + colorTheme;
    }
}
