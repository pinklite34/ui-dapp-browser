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
import * as lightwallet from './lightwallet';
import * as routing from './routing';
import * as utils from './utils';
/**
 * save the current account for later usage
 */
var lastAccount = '';
/**
 * valid login providers
 */
var validProviders = [
    'metamask',
    'internal',
];
/**
 * external executor variables
 */
var agentExecutor;
/**
 * Logout the current user. Removes the active account, provider and terms of use acceptance.
 *
 * @param      {boolean}  disabledReload  disable window reload
 */
function logout(disabledReload) {
    // reset account and providers
    setCurrentProvider('');
    setAccountId('');
    // clear localStorage values
    delete window.localStorage['evan-terms-of-use'];
    delete window.localStorage['evan-account'];
    delete window.localStorage['evan-provider'];
    // remove decrypted vault from runtime and localStorage
    lightwallet.deleteActiveVault();
    // unregister notifications
    window.localStorage['evan-notifications'] = 'false';
    utils.sendEvent('evan-notifications-toggled');
    // reload the window
    setTimeout(function () {
        window.location.reload();
    });
}
/**
 * Get the current, in local storage, configured provider.
 *
 * @return     {string}  The current provider (internal, external, agent-executor).
 */
function getCurrentProvider() {
    if (agentExecutor) {
        return 'agent-executor';
    }
    else if (evanGlobals.queryParams.provider) {
        return evanGlobals.queryParams.provider;
    }
    else {
        var currentProvider = window.localStorage['evan-provider'];
        if (currentProvider && validProviders.indexOf(currentProvider) !== -1) {
            return currentProvider;
        }
    }
}
/**
 * Check if we should use internal provider.
 *
 * @return     {boolean}  True if internal provider, False otherwise.
 */
function isInternalProvider() {
    var currentProvider = getCurrentProvider();
    if (currentProvider === 'internal') {
        return true;
    }
}
/**
 * Checks if a injected web3 provider exists an returns it's name
 */
function getExternalProvider() {
    var web3 = window.web3;
    if (web3) {
        if (web3.currentProvider && web3.currentProvider.isMetaMask) {
            return 'metamask';
        }
    }
}
/**
 * Sets the current provider that should be used.
 *
 * @param      {string}  provider  provider to switch to
 */
function setCurrentProvider(provider) {
    window.localStorage['evan-provider'] = provider;
}
/**
 * Get the current selected account included the check of the current provider.
 *
 * @return     {string}  account id of the current user (0x0...)
 */
function activeAccount() {
    switch (getCurrentProvider()) {
        case 'metamask': {
            if (window.web3) {
                setAccountId(getExternalAccount());
            }
            break;
        }
        case 'internal': {
            // if the url was opened using an specific accountId, use this one!
            if (evanGlobals.queryParams.accountId) {
                return evanGlobals.queryParams.accountId;
            }
            var vault = lightwallet.loadVault();
            // get the first account from the vault and set it as evan-account to localStorage
            if (vault) {
                var accounts = lightwallet.getAccounts(vault);
                var accountId = getAccountId();
                if (accounts.indexOf(accountId) === -1) {
                    if (accounts.length > 0) {
                        window.localStorage['evan-account'] = accounts[0];
                    }
                    else {
                        delete window.localStorage['evan-account'];
                    }
                }
            }
            else {
                delete window.localStorage['evan-account'];
            }
            break;
        }
        case 'agent-executor': {
            return agentExecutor.accountId;
        }
    }
    return getAccountId();
}
/**
 * Checks the current url parameters if agent executor login parameters are given.
 *
 * @return     {any}  all agent-exeutor parameters for requesting smart-agents and decrypting the
 *                    profile ({ accountId, agentUrl, key, token, })
 */
export function getAgentExecutor() {
    return __awaiter(this, void 0, void 0, function () {
        var token_1, agentUrl_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(typeof agentExecutor === 'undefined')) return [3 /*break*/, 4];
                    token_1 = routing.getQueryParameterValue('agent-executor');
                    agentUrl_1 = routing.getQueryParameterValue('agent-executor-url') ||
                        utils.devMode ? 'http://localhost:8080' : 'https://agents.evan.network';
                    if (!token_1) return [3 /*break*/, 2];
                    // use a promise await to implement an timeout (this function will be called at the beginning
                    // of the page load, so everything will stop working, when agent not responds)
                    return [4 /*yield*/, (new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                            var timedOut, agentTimeout, accountId, key;
                            return __generator(this, function (_a) {
                                timedOut = false;
                                agentTimeout = setTimeout(function () {
                                    agentExecutor = false;
                                    timedOut = true;
                                    resolve();
                                }, 10 * 1000);
                                accountId = routing.getQueryParameterValue('agent-executor-account-id');
                                key = routing.getQueryParameterValue('agent-executor-key');
                                // if all parameters are valid, set the executor agent
                                if (accountId && key) {
                                    agentExecutor = { accountId: accountId, agentUrl: agentUrl_1, key: key, token: token_1, };
                                }
                                else {
                                    agentExecutor = false;
                                }
                                // if the timeout wasn't triggered => resolve it normally
                                if (!timedOut) {
                                    window.clearTimeout(agentTimeout);
                                    resolve();
                                }
                                return [2 /*return*/];
                            });
                        }); }))];
                case 1:
                    // use a promise await to implement an timeout (this function will be called at the beginning
                    // of the page load, so everything will stop working, when agent not responds)
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    agentExecutor = false;
                    _a.label = 3;
                case 3:
                    evanGlobals.agentExecutor = agentExecutor;
                    _a.label = 4;
                case 4: return [2 /*return*/, agentExecutor];
            }
        });
    });
}
/**
 * Returns the current (in the localStorage) saved account id
 *
 * @return     {string}  account id;
 */
function getAccountId() {
    if (agentExecutor) {
        return agentExecutor.accountId;
    }
    else if (window.localStorage['evan-account']) {
        var checkSumAddress = evanGlobals.CoreRuntime.web3.utils.toChecksumAddress(window.localStorage['evan-account']);
        return checkSumAddress;
    }
}
/**
 * Sets an account id as active one to the local storage.
 *
 * @param      {string}  accountId  account id to set to the localStorage
 */
function setAccountId(accountId) {
    window.localStorage['evan-account'] = accountId;
}
/**
 * Checks if an external provider is activated and returns it's active account
 * id
 *
 * @return     {string}  The external account.
 */
function getExternalAccount() {
    if (window.web3 && window.web3.eth) {
        return evanGlobals.CoreRuntime.web3.utils.toChecksumAddress(window.web3.eth.defaultAccount);
    }
}
/**
 * Watches for account changes and reload the page if nessecary
 */
function watchAccountChange() {
    var dialogIsOpen = false;
    setInterval(function () {
        var currAccount = activeAccount();
        var urlRoute = routing.getRouteFromUrl();
        var isOnboarding = urlRoute.indexOf('onboarding') === 0;
        if (isOnboarding) {
            if (urlRoute.indexOf('/onboarding') !== -1 && getCurrentProvider() === 'metamask') {
                isOnboarding = false;
            }
        }
        if (!dialogIsOpen && !isOnboarding && lastAccount && currAccount !== lastAccount) {
            dialogIsOpen = true;
            window.location.reload();
        }
        lastAccount = currAccount;
    }, 1000);
}
/**
 * Return the name of the current used browser =>
 * https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
 *
 * @return     {string}  opera / firefox / safari / ie / edge / chrome
 */
function currentBrowser() {
    if ((!!window['opr'] && !!window['opr'].addons) || !!window['opera'] ||
        navigator.userAgent.indexOf(' OPR/') >= 0) {
        return 'opera';
    }
    else if (typeof window['InstallTrigger'] !== 'undefined') {
        return 'firefox';
    }
    else if (/constructor/i.test(window['HTMLElement']) ||
        (function (p) { return p.toString() === '[object SafariRemoteNotification]'; })(!window['safari'] || (typeof window['safari'] !== 'undefined' && window['safari'].pushNotification))) {
        return 'safari';
    }
    else if ( /*@cc_on!@*/false || !!document['documentMode']) {
        return 'ie';
    }
    else if (!!window['StyleMedia']) {
        return 'edge';
    }
    else if (!!window['chrome'] && !!window['chrome'].webstore) {
        return 'chrome';
    }
}
/**
 * Gets the balance of the provided or current account id
 *
 * @param      {string}  accountId  account id to get the balance from
 * @return     {number}  The balance for the specific account id
 */
function getBalance(accountId) {
    if (accountId === void 0) { accountId = activeAccount(); }
    return new Promise(function (resolve, reject) {
        return evanGlobals.CoreRuntime.web3.eth.getBalance(accountId, function (err, balance) {
            if (err) {
                reject(err);
            }
            else {
                resolve(parseFloat(evanGlobals.CoreRuntime.web3.utils.fromWei(balance, 'ether')));
            }
        });
    });
}
export { logout, getCurrentProvider, isInternalProvider, getExternalProvider, setCurrentProvider, activeAccount, getAccountId, setAccountId, getExternalAccount, watchAccountChange, currentBrowser, getBalance };
