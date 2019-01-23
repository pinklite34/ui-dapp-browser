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
import { config } from '../config';
import { ipfsConfig } from '../ipfs';
import { IPFSCache } from '../ipfs-cache';
import { getWeb3Instance } from '../web3';
import { Solc } from '../solc';
import * as core from '../core';
import { AccountStore } from './AccountStore';
import { KeyProvider, getLatestKeyProvider } from './KeyProvider';
import * as lightwallet from '../lightwallet';
var internalWeb3;
/**
 * returns the coreOptions for creation a new bcc CoreBundle and SmartContracts object.
 *
 * @param      {any}           CoreBundle      blockchain-core ipfs bundle import
 *                                             (System.import('bcc'))
 * @param      {any}           SmartContracts  smart-contracts ipfs bundle import
 *                                             (System.import('smart-contractssmart-contracts'))
 * @param      {any}           provider        current signing provider (internal or external)
 * @return     {Promise<any>}  core options
 */
function getCoreOptions(CoreBundle, SmartContracts, provider) {
    return __awaiter(this, void 0, void 0, function () {
        var coreOptions, existingWeb3;
        return __generator(this, function (_a) {
            coreOptions = {
                config: config,
                dfsConfig: ipfsConfig,
                ipfsCache: new IPFSCache(),
                solc: new Solc(SmartContracts),
            };
            // set default web socket provider or use localStorage parameters
            config.web3Provider = window.localStorage['evan-web3-provider'] || 'wss://testcore.evan.network/ws';
            if (provider === 'metamask') {
                existingWeb3 = window.web3;
                coreOptions.web3 = new CoreBundle.Web3();
                coreOptions.web3.setProvider(existingWeb3.currentProvider);
                coreOptions.web3.eth.defaultAccount = existingWeb3.eth.defaultAccount;
            }
            else {
                if (!coreOptions.web3) {
                    coreOptions.web3 = getWeb3Instance(config.web3Provider);
                }
            }
            return [2 /*return*/, coreOptions];
        });
    });
}
/**
 * Loads the current core options and initializes a new CoreRuntime instance.
 *
 * @param      {any}           CoreBundle      blockchain-core ipfs bundle
 * @param      {any}           SmartContracts  smart-contracts ipfs bundle
 * @return     {Promise<any>}  CoreRuntime instance
 */
function updateCoreRuntime(CoreBundle, SmartContracts) {
    return __awaiter(this, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCoreOptions(CoreBundle, SmartContracts)];
                case 1:
                    options = _a.sent();
                    CoreBundle.createAndSetCore(options);
                    return [2 /*return*/, CoreBundle.CoreRuntime];
            }
        });
    });
}
/**
 * Returns the existing executor or creates a new one, for the active current provider.
 *
 * @param      {any}                           CoreBundle    blockchain-core ipfs bundle
 * @param      {string}                        provider      the current selected provider that
 *                                                           should be loaded
 * @param      {AccountStore}                  accountStore  account store to use for the internal
 *                                                           signer
 * @return     {ProfileBundle.SignerInternal}  the new Signer Object
 */
function getSigner(CoreBundle, provider, accountStore) {
    if (provider === void 0) { provider = core.getCurrentProvider(); }
    if (accountStore === void 0) { accountStore = new AccountStore(); }
    var signer;
    if (provider === 'internal') {
        signer = new CoreBundle.SignerInternal({
            accountStore: accountStore,
            config: {},
            contractLoader: CoreBundle.CoreRuntime.contractLoader,
            web3: CoreBundle.CoreRuntime.web3,
            logLog: CoreBundle.logLog,
            logLogLevel: CoreBundle.logLogLevel
        });
    }
    else {
        signer = new CoreBundle.SignerExternal({
            logLog: CoreBundle.logLog,
            logLogLevel: CoreBundle.logLogLevel
        });
    }
    return signer;
}
/**
 * run keyExchange.setPublicKey
 *
 * @param      {any}            CoreBundle  blockchain-core ipfs bundle
 * @param      {string}         accountId   Account id to set the exchange keys for
 * @return     {Promise<void>}  resolved when done
 */
function setExchangeKeys(CoreBundle, accountId) {
    if (accountId === void 0) { accountId = core.activeAccount(); }
    return __awaiter(this, void 0, void 0, function () {
        var targetPubKey, targetPrivateKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, CoreBundle.ProfileRuntime.profile.getPublicKey()];
                case 1:
                    targetPubKey = _a.sent();
                    return [4 /*yield*/, CoreBundle.ProfileRuntime.profile.getContactKey(accountId, 'dataKey')];
                case 2:
                    targetPrivateKey = _a.sent();
                    if (!!targetPrivateKey) {
                        CoreBundle.ProfileRuntime.keyExchange.setPublicKey(targetPubKey, targetPrivateKey);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Setup / update initial blockchain-core structure for current account id and signer.
 *
 * @param      {any}            CoreBundle      blockchain-core ipfs bundle
 * @param      {any}            SmartContracts  smart-contracts ipfs bundle
 * @param      {string}         activeAccount   account id to use
 * @param      {provider}       provider        provider to use (internal, external, agent)
 * @return     {Promise<void>}  solved when bcc is updated
 */
function startBCC(CoreBundle, SmartContracts, activeAccount, provider) {
    if (activeAccount === void 0) { activeAccount = this.core.activeAccount(); }
    if (provider === void 0) { provider = core.getCurrentProvider(); }
    return __awaiter(this, void 0, void 0, function () {
        var coreOptions, bccProfileOptions, agentExecutor, bccProfile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCoreOptions(CoreBundle, SmartContracts, provider)];
                case 1:
                    coreOptions = _a.sent();
                    return [4 /*yield*/, CoreBundle.createAndSetCore(coreOptions)];
                case 2:
                    _a.sent();
                    bccProfileOptions = {
                        accountId: core.activeAccount(),
                        CoreBundle: CoreBundle,
                        coreOptions: coreOptions,
                        keyProvider: getLatestKeyProvider(),
                        signer: getSigner(CoreBundle, provider),
                        SmartContracts: SmartContracts
                    };
                    if (!(provider === 'agent-executor')) return [3 /*break*/, 4];
                    return [4 /*yield*/, core.getAgentExecutor()];
                case 3:
                    agentExecutor = _a.sent();
                    bccProfileOptions.executor = new CoreBundle.ExecutorAgent({
                        agentUrl: agentExecutor.agentUrl,
                        config: {},
                        contractLoader: CoreBundle.CoreRuntime.contractLoader,
                        logLog: CoreBundle.logLog,
                        logLogLevel: CoreBundle.logLogLevel,
                        signer: bccProfileOptions,
                        token: agentExecutor.token,
                        web3: CoreBundle.CoreRuntime.web3,
                    });
                    _a.label = 4;
                case 4:
                    bccProfile = CoreBundle.createAndSet(bccProfileOptions);
                    if (provider === 'metamask') {
                        CoreBundle.ProfileRuntime.coreInstance.executor.eventHub.eventWeb3 = window.web3;
                    }
                    return [4 /*yield*/, CoreBundle.ProfileRuntime.keyProvider.setKeys()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, setExchangeKeys(CoreBundle, activeAccount)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Returns an new blockchain-core profile instance. !Attention : It's only builded for load values
 * to check for public and private keys (e.g. used by onboarding or global-password) Executor is the
 * normal one from the global core!!!
 *
 * @param      {any}                    CoreBundle  blockchain-core ipfs bundle
 * @param      {string}                 accountId   account id to create a new profile instance for
 * @return     {ProfileBundle.Profile}  The profile for account.
 */
function getProfileForAccount(CoreBundle, accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var keys, keyProvider, cryptoProvider, ipldInstance, sharing, dataContract, evanProfile;
        return __generator(this, function (_a) {
            keys = getLatestKeyProvider().keys;
            keyProvider = new KeyProvider(keys ? JSON.parse(JSON.stringify(keys)) : {}, accountId);
            cryptoProvider = new CoreBundle.CryptoProvider({
                unencrypted: new CoreBundle.Unencrypted(),
                aes: new CoreBundle.Aes(),
                aesEcb: new CoreBundle.AesEcb(),
                logLog: CoreBundle.logLog,
                logLogLevel: CoreBundle.logLogLevel
            });
            // set dummy encryption keys to prevent password dialog
            // !Attention : Only public key can be get! If you want to get crypted values
            //              set it by yourself
            keyProvider.setKeysForAccount(accountId, lightwallet.getEncryptionKeyFromPassword(accountId, 'unencrypted'));
            ipldInstance = new CoreBundle.Ipld({
                'ipfs': CoreBundle.CoreRuntime.dfs,
                'keyProvider': keyProvider,
                'cryptoProvider': cryptoProvider,
                defaultCryptoAlgo: 'aes',
                originator: accountId,
                logLog: CoreBundle.logLog,
                logLogLevel: CoreBundle.logLogLevel
            });
            sharing = new CoreBundle.Sharing({
                contractLoader: CoreBundle.CoreRuntime.contractLoader,
                cryptoProvider: cryptoProvider,
                description: CoreBundle.CoreRuntime.description,
                executor: CoreBundle.CoreRuntime.executor,
                dfs: CoreBundle.CoreRuntime.dfs,
                keyProvider: keyProvider,
                nameResolver: CoreBundle.CoreRuntime.nameResolver,
                defaultCryptoAlgo: 'aes',
                logLog: CoreBundle.logLog,
                logLogLevel: CoreBundle.logLogLevel
            });
            dataContract = new CoreBundle.DataContract({
                cryptoProvider: cryptoProvider,
                dfs: CoreBundle.CoreRuntime.dfs,
                executor: CoreBundle.CoreRuntime.executor,
                loader: CoreBundle.CoreRuntime.contractLoader,
                nameResolver: CoreBundle.CoreRuntime.nameResolver,
                sharing: sharing,
                web3: CoreBundle.CoreRuntime.web3,
                description: CoreBundle.CoreRuntime.description,
                logLog: CoreBundle.logLog,
                logLogLevel: CoreBundle.logLogLevel
            });
            evanProfile = new CoreBundle.Profile({
                ipld: ipldInstance,
                nameResolver: CoreBundle.CoreRuntime.nameResolver,
                defaultCryptoAlgo: 'aes',
                executor: CoreBundle.CoreRuntime.executor,
                contractLoader: CoreBundle.CoreRuntime.contractLoader,
                accountId: accountId,
                dataContract: dataContract,
                logLog: CoreBundle.logLog,
                logLogLevel: CoreBundle.logLogLevel
            });
            keyProvider.profile = evanProfile;
            return [2 /*return*/, evanProfile];
        });
    });
}
/**
 * Check if the password for a given account id and its profile is valid.
 *
 * @param      {any}      CoreBundle      blockchain-core ipfs bundle
 * @param      {string}   accountId       account id to check
 * @param      {string}   password        password to check
 * @param      {string}   encryptionSalt  encryption salt to retrieve the encryption key with
 *                                        (default account id)
 * @return     {boolean}  True if account password valid, False otherwise
 */
function isAccountPasswordValid(CoreBundle, accountId, password, encryptionSalt) {
    if (encryptionSalt === void 0) { encryptionSalt = accountId; }
    return __awaiter(this, void 0, void 0, function () {
        var profile, targetPrivateKey, ex_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getProfileForAccount(CoreBundle, accountId)];
                case 1:
                    profile = _b.sent();
                    // set the keys for the temporary profile using the password input, so we can try to get the
                    // private key
                    profile.ipld.keyProvider.setKeysForAccount(accountId, lightwallet.getEncryptionKeyFromPassword(encryptionSalt, password));
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, profile.getContactKey(accountId, 'dataKey')];
                case 3:
                    targetPrivateKey = _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    ex_1 = _b.sent();
                    return [3 /*break*/, 5];
                case 5:
                    if (!targetPrivateKey) return [3 /*break*/, 6];
                    return [2 /*return*/, true];
                case 6:
                    _a = encryptionSalt;
                    if (!_a) return [3 /*break*/, 8];
                    return [4 /*yield*/, isAccountPasswordValid(CoreBundle, accountId, password, '')];
                case 7:
                    _a = (_b.sent());
                    _b.label = 8;
                case 8:
                    if (!_a) return [3 /*break*/, 10];
                    // WARNING: for old accounts: overwrite current encryption key, to use the key without a
                    // accountId
                    return [4 /*yield*/, lightwallet.overwriteVaultEncryptionKey(accountId, lightwallet.getEncryptionKeyFromPassword('', password))];
                case 9:
                    // WARNING: for old accounts: overwrite current encryption key, to use the key without a
                    // accountId
                    _b.sent();
                    return [2 /*return*/, true];
                case 10: return [2 /*return*/, false];
            }
        });
    });
}
/**
 * Wraps the original create default runtime bcc function to simplify key and account map
 * management.
 *
 * @param      {any}     CoreBundle     blockchain-core ipfs bundle
 * @param      {string}  accountId      account id to create the runtime for
 * @param      {string}  encryptionKey  enryption key of the users profile
 * @param      {string}  privateKey     account id's private key
 * @param      {any}     config         overwrite the ui configuration with a custom config
 * @param      {any}     web3           overwrite the CoreRuntime web3 with a new one
 * @param      {any}     dfs            overwrite the CoreRuntime dfs with a new one
 * @return     {any}     the new bcc defaultruntime
 */
function createDefaultRuntime(CoreBundle, accountId, encryptionKey, privateKey, runtimeConfig, web3, dfs) {
    if (runtimeConfig === void 0) { runtimeConfig = JSON.parse(JSON.stringify(config)); }
    return __awaiter(this, void 0, void 0, function () {
        var soliditySha3, accountHash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // fill web3 per default with the core runtime web3
                    web3 = web3 || CoreBundle.CoreRuntime.web3;
                    soliditySha3 = web3.utils.soliditySha3;
                    accountHash = soliditySha3(accountId);
                    runtimeConfig.keyConfig = {};
                    runtimeConfig.accountMap = {};
                    // set key config for the user accountId
                    runtimeConfig.keyConfig[accountHash] = encryptionKey;
                    runtimeConfig.keyConfig[soliditySha3(accountHash, accountHash)] = encryptionKey;
                    // set mailbox edge key
                    runtimeConfig.keyConfig[soliditySha3('mailboxKeyExchange')] =
                        '346c22768f84f3050f5c94cec98349b3c5cbfa0b7315304e13647a4918ffff22';
                    // set private key
                    runtimeConfig.accountMap[accountId] = privateKey;
                    return [4 /*yield*/, CoreBundle.createDefaultRuntime(web3, dfs || CoreBundle.CoreRuntime.dfs, runtimeConfig)];
                case 1: 
                // create the new runtime
                return [2 /*return*/, _a.sent()];
            }
        });
    });
}
export { createDefaultRuntime, getCoreOptions, getProfileForAccount, getSigner, isAccountPasswordValid, setExchangeKeys, startBCC, updateCoreRuntime, };
