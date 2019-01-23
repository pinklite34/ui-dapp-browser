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
var _this = this;
import * as utils from './utils';
import * as routing from './routing';
// hold the last received notifications, so applications can check against them, also
// when they didn't received the event
export var notifications = [];
// wrap firebase to access it easily
var firebase;
// only run one onNotificationToggled function
var awaitNotificationToggled = Promise.resolve();
/**
 * Register the token for the current devices.
 *
 * @param      {string}         token   token of the current devices
 * @return     {Promise<void>}  Resolved when done
 */
var registerDevice = function (token) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        utils.log("New notification token: " + token, 'info');
        return [2 /*return*/];
    });
}); };
/**
 * Load the token from firebase and register the user in the smart-agent.
 *
 * @return     {Promise<void>}  Resolved when done
 */
var getToken = function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                firebase.getToken(function (token) { return resolve(token); }, function (error) { return reject(error); });
            })];
    });
}); };
var onTokenRefresh = function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        firebase.onTokenRefresh(function (token) {
            window.localStorage['evan-notification-token'] = token;
            // save this server-side and use it to push notifications to this device
            registerDevice(token);
        }, function (error) {
            utils.log('Error while refreshing notification token!', 'error');
        });
        return [2 /*return*/];
    });
}); };
/**
 * Grant permissions for the current device (only IOS).
 *
 * @return     {Promise<void>}  Resolved when done
 */
var grantPermission = function () {
    return new Promise(function (resolve, reject) {
        firebase.grantPermission(function (data) {
            resolve(data && data.isEnabled);
        }, function (error) {
            reject(new Error('Error while granting permissions: ' + error));
        });
    });
};
/**
 * Subscribe the current user for evan.network notifications.
 *
 * @param      {string}         eventName  event name to subscribe for
 * @return     {Promise<void>}  Resolved when done
 */
var subscribe = function (eventName) {
    return new Promise(function (resolve, reject) {
        firebase.subscribe(eventName, function (data) {
            resolve();
        }, function (error) {
            reject(new Error('Error during subscribe: ' + error));
        });
    });
};
/**
 * Unsubscribe the current user for evan.network notifications.
 *
 * @param      {string}         eventName  event name to unsubscribe for
 * @return     {Promise<void>}  Resolved when done
 */
var unsubscribe = function (eventName) {
    return new Promise(function (resolve, reject) {
        firebase.unsubscribe(eventName, function (data) {
            resolve();
        }, function (error) {
            reject(new Error('Error during unsubscribe: ' + error));
        });
    });
};
/**
 * Check if the user has enabled push notifications.
 * @return     {Promise<boolean>}  True if has permissions, False otherwise.
 */
var hasPermissions = function () {
    return new Promise(function (resolve, reject) {
        firebase.hasPermission(function (data) {
            resolve(data.isEnabled);
        });
    });
};
/**
 * Grant permissions for the current device (only IOS).
 *
 * @return     {Promise<void>}  Resolved when done
 */
var unregister = function () {
    return new Promise(function (resolve, reject) {
        firebase.unregister(function (data) {
            resolve();
        }, function (error) {
            reject(new Error('Error during unregistering: ' + error));
        });
    });
};
/**
 * Register and unregister device if notifications was enabled.
 */
var onNotificationsToggled = function () {
    // wait for last toggle to be finished
    return awaitNotificationToggled = awaitNotificationToggled
        .then(function () { return __awaiter(_this, void 0, void 0, function () {
        var isPermitted, token, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 11, , 12]);
                    if (!(window.localStorage['evan-notifications'] === 'true')) return [3 /*break*/, 10];
                    isPermitted = true;
                    if (!(window['cordova'] && window['cordova'].platformId === 'ios')) return [3 /*break*/, 4];
                    return [4 /*yield*/, hasPermissions()];
                case 1:
                    isPermitted = _a.sent();
                    // if ios is not permitted, grantPermissions
                    return [4 /*yield*/, grantPermission()];
                case 2:
                    // if ios is not permitted, grantPermissions
                    _a.sent();
                    if (!!isPermitted) return [3 /*break*/, 4];
                    return [4 /*yield*/, hasPermissions()];
                case 3:
                    isPermitted = _a.sent();
                    _a.label = 4;
                case 4:
                    if (!isPermitted) return [3 /*break*/, 9];
                    return [4 /*yield*/, getToken()];
                case 5:
                    token = _a.sent();
                    return [4 /*yield*/, registerDevice(token)];
                case 6:
                    _a.sent();
                    window.localStorage['evan-notification-token'] = token;
                    // subscribe for token changes
                    onTokenRefresh();
                    if (!!window.localStorage['evan-notification-subscribed']) return [3 /*break*/, 8];
                    // subscribe for even notifications
                    return [4 /*yield*/, subscribe('evan-notification')];
                case 7:
                    // subscribe for even notifications
                    _a.sent();
                    // set we are subscribed
                    window.localStorage['evan-notification-subscribed'] = true;
                    _a.label = 8;
                case 8: 
                // return a new Promise to handle initial notifications
                // the function will be called immediatly, if the app was opened with a new notification
                // if this is the case, run the resolve using the called notification
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        // use an timeout of 100ms to ensure, that the resolve is called, even when no
                        // notification is clicked
                        var initialOnNotification = setTimeout(resolve, 100);
                        // watch for opening notifications
                        firebase.onNotificationOpen(function (notification) {
                            // hold the last received notification, so applications can check against them, also
                            // when they didn't received the event
                            notifications.push(notification);
                            // send the event to all dapps
                            utils.sendEvent('evan-notification', notification);
                            // log the notification
                            try {
                                console.log("New push notification: " + JSON.stringify(notification));
                                utils.log("New push notification: " + JSON.stringify(notification), 'info');
                            }
                            catch (ex) { }
                            // clear the timeout, to don't run resolve twice
                            window.clearTimeout(initialOnNotification);
                            // resolve using the new notification
                            resolve(notification);
                        }, function (ex) {
                            utils.log("Error while onNotificationOpen: " + (ex && ex.message ? ex.message + ' ' + ex.stack : ex), 'error');
                        });
                    })];
                case 9:
                    utils.log('User disabled push notifications!', 'warning');
                    _a.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    ex_1 = _a.sent();
                    utils.log("" + (ex_1 && ex_1.message ? ex_1.message + ' ' + ex_1.stack : ex_1), 'error');
                    return [3 /*break*/, 12];
                case 12:
                    // reset everything if notifications are disabled or we have not permissiosn
                    delete window.localStorage['evan-notification-token'];
                    delete window.localStorage['evan-notification-subscribed'];
                    return [4 /*yield*/, unsubscribe('evan-notification')];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, unregister()];
                case 14:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); })
        .catch(function (ex) {
        utils.log("" + (ex && ex.message ? ex.message + ' ' + ex.stack : ex), 'error');
    });
};
/**
 * Return the url of an notification that should be opened.
 *
 * @param      {any}     notification  firebase notification object
 * @return     {string}  dapp path to open
 */
export var getDAppUrlFromNotification = function (notification) { return __awaiter(_this, void 0, void 0, function () {
    var notificationPath, rootDApp, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(!notification.standalone || notification.standalone === 'false')) return [3 /*break*/, 3];
                _a = routing.getActiveRootENS() || routing.defaultDAppENS;
                if (_a) return [3 /*break*/, 2];
                return [4 /*yield*/, routing.getDefaultDAppENS()];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                rootDApp = _a;
                notificationPath = "#/" + rootDApp + "/" + notification.path;
                return [3 /*break*/, 4];
            case 3:
                notificationPath = "#/" + notification.path;
                _b.label = 4;
            case 4: 
            // return notificationPath and return falsly provided multiple start slashes
            return [2 /*return*/, notificationPath.replace(/\/\//g, '/')];
        }
    });
}); };
/**
 * Initialize the plugin.
 */
export var initialize = function () { return __awaiter(_this, void 0, void 0, function () {
    var initialNotification;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // set the firebase for quick access
                firebase = window['FirebasePlugin'];
                if (!firebase) return [3 /*break*/, 2];
                return [4 /*yield*/, onNotificationsToggled()];
            case 1:
                initialNotification = _a.sent();
                window.addEventListener('evan-notifications-toggled', onNotificationsToggled, false);
                _a.label = 2;
            case 2: return [2 /*return*/, initialNotification];
        }
    });
}); };
