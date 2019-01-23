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
/********************* !IMPORTANT: dont export it to avoid security leaks! ************************/
/**
 * cache existing vault locally
 */
var _vault;
/**
 * custom encryption keys, to overwrite the default one (password salted using accountId)
 */
var _customEncryptionKeys = {};
/**************************************************************************************************/
/**
 * cached password function, can set during the application runtime to implement
 * own password retrieve functions
 */
var passwordFunction;
/**
 * returns CoreBundle.keystore (eth-lightwallet/lib/keystore)
 *
 * @return     {any}  CoreBundle.keystore
 */
function getKeyStore() {
    return evanGlobals.CoreBundle.keystore;
}
/**
 * returns CoreBundle.Mnemonic
 *
 * @return     {any}  CoreBundle.Mnemonic.
 */
function getMnemonicLib() {
    return evanGlobals.CoreBundle.Mnemonic;
}
/**
 * Generates a new random seed.
 *
 * @return     {string}  12 word mnemomnic
 */
function generateMnemonic() {
    return getKeyStore().generateRandomSeed();
}
/**
 * Creates a new vault instance to handle lightwallet interactions.
 *
 * @param      {string}  mnemonic  mnemonic to create new vault.
 * @param      {string}  password  password to encrypt the vault.
 * @return     {vault}   vault created using mnemonic, encrypted via password
 */
function createVault(mnemonic, password) {
    return new Promise(function (resolve, reject) {
        getKeyStore().createVault({
            seedPhrase: mnemonic,
            password: password,
            hdPathString: 'm/45\'/62\'/13\'/7'
        }, function (err, vault) {
            if (err) {
                reject(err);
            }
            else {
                resolve(vault);
            }
        });
    });
}
/**
 * Serializes a specific vault and saves it to the local storage.
 *
 * @param      {any}     vault   vault to save locally
 */
function setVaultActive(vault) {
    window.localStorage['evan-vault'] = vault.serialize();
    _vault = vault;
}
/**
 * Create new vault, set it active and set first account id
 *
 * @param      {string}  mnemonic  mnemonic to use
 * @param      {string}  password  password to encrypt mnemonic
 */
function createVaultAndSetActive(mnemonic, password) {
    return __awaiter(this, void 0, void 0, function () {
        var vault, accounts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getNewVault(mnemonic, password)];
                case 1:
                    vault = _a.sent();
                    accounts = getAccounts(vault, 1);
                    setVaultActive(vault);
                    window.localStorage['evan-account'] = accounts[0];
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Gets the pwDerivedKey to interact with the vault.
 *
 * @param      {any}           vault         vault to unlock
 * @param      {string}        password      password of the locked vault
 * @return     {Promise<any>}  pwDerivedKey
 */
function keyFromPassword(vault, password) {
    return new Promise(function (resolve, reject) {
        vault.keyFromPassword(password, function (err, pwDerivedKey) {
            if (err) {
                reject();
            }
            else {
                resolve(pwDerivedKey);
            }
        });
    });
}
/**
 * Creates an new vault and unlocks it
 *
 * @param      {string}  mnemonic  mnemonic to use for the vault
 * @param      {string}  password  password to encrypt the vault
 * @return     {any}  The new vault.
 */
function getNewVault(mnemonic, password) {
    return __awaiter(this, void 0, void 0, function () {
        var vault, pwDerivedKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createVault(mnemonic, password)];
                case 1:
                    vault = _a.sent();
                    return [4 /*yield*/, keyFromPassword(vault, password)];
                case 2:
                    pwDerivedKey = _a.sent();
                    vault.pwDerivedKey = pwDerivedKey;
                    vault.encryptionKey = getEncryptionKeyFromPassword(getPrimaryAccount(vault), password);
                    // if the accountId was specified externally, we should load the first account to be able to run
                    // calls for this account
                    getAccounts(vault, 1);
                    return [2 /*return*/, vault];
            }
        });
    });
}
/**
 * Get an specific amount of accounts from the vault.
 *
 * @param      {any}  vault   vault to get accounts from
 * @param      {number}  amount  number of accounts to return
 * @return     {Array<string>}  The accounts.
 */
function getAccounts(vault, amount) {
    if (amount) {
        if (!vault.pwDerivedKey) {
            throw new Error('could not generate new addresses on locked vault!');
        }
        vault.generateNewAddress(vault.pwDerivedKey, amount);
    }
    var accounts = vault.getAddresses();
    return accounts.map(function (account) { return evanGlobals.CoreRuntime.web3.utils.toChecksumAddress(account); });
}
/**
 * Get the first account from the vault.
 *
 * @param      {any}  vault   vault to get accounts from
 * @return     {string}  The account.
 */
function getPrimaryAccount(vault) {
    return getAccounts(vault, 1)[0];
}
/**
 * Gets the private key for an account.Given the derived key, decrypts and returns the private key
 * corresponding to address. This should be done sparingly as the recommended practice is for the
 * keystore to sign transactions using signing.signTx, so there is normally no need to export
 * private keys.
 *
 * @param      {any}     vault      vault where the account lives
 * @param      {string}  accountId  account to get the private key from
 * @return     {<type>}  The private key.
 */
function getPrivateKey(vault, accountId) {
    return vault.exportPrivateKey(accountId.toLowerCase(), vault.pwDerivedKey);
}
/**
 * Load locked vault from localStorage or unlocked memory vault.
 *
 * @return     {any}  deserialized, cached vault
 */
function loadVault() {
    if (!_vault && window.localStorage['evan-vault']) {
        try {
            _vault = getKeyStore().deserialize(window.localStorage['evan-vault']);
        }
        catch (ex) { }
        ;
    }
    return _vault;
}
/**
 * Sets the password function. The dapp-browser does not includes any library / framework / css that
 * handles a good and nice ui development (e.g. angular, react, bootstrap, ...). To handle coporate
 * design and a better DApp development freedom, each DApp must specify its own password dialog. In
 * case of Angular 5 development have a look at the default one, provided by the angular-core:
 * globalPasswordDialog
 * https://github.com/evannetwork/ui-angular-core/blob/4f539a2f5492b137d6be82c133427871073c3929/src/services/evan/bcc.ts#L300
 *
 * @param      {Function}  newPasswordFunction  The new password function
 */
function setPasswordFunction(newPasswordFunction) {
    passwordFunction = newPasswordFunction;
}
/**
 * Shows the global-password modal.
 *
 * @param      {string}           accountId  additional account id to get the
 *                                           password from
 * @return     {Promise<string>}  password input
 */
function getPassword(accountId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!evanGlobals.queryParams.password) return [3 /*break*/, 1];
                    return [2 /*return*/, evanGlobals.queryParams.password];
                case 1:
                    if (!passwordFunction) return [3 /*break*/, 3];
                    return [4 /*yield*/, passwordFunction(accountId)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    console.error('No password function for lightwallet service set...');
                    throw new Error('No password function for lightwallet service set...');
            }
        });
    });
}
/**
 * Return current unlocked vault. Asks for password when vault is locked.
 *
 * @return     {Promise<any>}  unlocked vault
 */
function loadUnlockedVault() {
    return __awaiter(this, void 0, void 0, function () {
        var vault, primaryAccount, password, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(evanGlobals.queryParams.mnemonic && evanGlobals.queryParams.password)) return [3 /*break*/, 2];
                    return [4 /*yield*/, getNewVault(evanGlobals.queryParams.mnemonic, evanGlobals.queryParams.password)];
                case 1:
                    vault = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    vault = loadVault();
                    _b.label = 3;
                case 3:
                    if (!(vault && !vault.pwDerivedKey)) return [3 /*break*/, 6];
                    return [4 /*yield*/, getPassword()];
                case 4:
                    password = _b.sent();
                    _a = vault;
                    return [4 /*yield*/, keyFromPassword(vault, password)];
                case 5:
                    _a.pwDerivedKey = _b.sent();
                    // only load the encryption key, when it wasn't set before (could be overwritten by using
                    // overwriteVaultEncryptionKey for old or custom logic accounts)
                    primaryAccount = getPrimaryAccount(vault);
                    if (!_customEncryptionKeys[primaryAccount]) {
                        vault.encryptionKey = getEncryptionKeyFromPassword(getPrimaryAccount(vault), password);
                    }
                    _b.label = 6;
                case 6:
                    // if the accountId was specified externally, we should load the first account to be able to run
                    // calls for this account
                    primaryAccount = primaryAccount || getPrimaryAccount(vault);
                    if (_customEncryptionKeys[primaryAccount]) {
                        vault.encryptionKey = _customEncryptionKeys[primaryAccount];
                    }
                    return [2 /*return*/, vault];
            }
        });
    });
}
/**
 * Returns the encryption key for the current password.
 *
 * @return     {string}  encryption key
 */
function getEncryptionKey() {
    return __awaiter(this, void 0, void 0, function () {
        var currentProvider, vault, password;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!evanGlobals.agentExecutor) return [3 /*break*/, 1];
                    return [2 /*return*/, evanGlobals.agentExecutor.key];
                case 1:
                    currentProvider = evanGlobals.core.getCurrentProvider();
                    if (!(currentProvider === 'internal')) return [3 /*break*/, 3];
                    return [4 /*yield*/, loadUnlockedVault()];
                case 2:
                    vault = _a.sent();
                    if (vault) {
                        return [2 /*return*/, vault.encryptionKey];
                    }
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, getPassword()];
                case 4:
                    password = _a.sent();
                    return [2 /*return*/, getEncryptionKeyFromPassword(evanGlobals.CoreRuntime.web3.eth.defaultAccount, password)];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Hashes a password using sha3.
 *
 * @param      {string}  password  password that should be hashed
 * @return     {string}  The encryption key from password.
 */
function getEncryptionKeyFromPassword(accountId, password) {
    return evanGlobals.CoreBundle.CoreRuntime.nameResolver
        .sha3(accountId + password)
        .replace(/0x/g, '');
}
/**
 * Overwrites the encryption key for the current vault.
 *
 * @param      {string}  encryptionKey  the encryption key that should be used
 */
function overwriteVaultEncryptionKey(accountId, encryptionKey) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            _customEncryptionKeys[accountId] = encryptionKey;
            return [2 /*return*/];
        });
    });
}
/**
 * Remove current active vault from browser.
 */
function deleteActiveVault() {
    _vault = '';
    delete window.localStorage['evan-vault'];
}
/**
 * Returns if an mnemonic is a valid mnemonic. (wrapper for getKeyStore().isSeedValid)
 *
 * @param      {string}   mnemonic  The mnemonic
 * @return     {boolean}  True if valid mnemonic, False otherwise.
 */
function isValidMnemonic(mnemonic) {
    try {
        return getKeyStore().isSeedValid(mnemonic);
    }
    catch (ex) {
        return false;
    }
}
/**
 * Returns if an word is a valid mnemonic word.
 *
 * @param      {string}   word    word to check
 * @return     {boolean}  True if valid mnemonic word, False otherwise.
 */
function isValidMnemonicWord(word) {
    return getMnemonicLib().Words.ENGLISH.indexOf(word) !== -1;
}
export { createVault, createVaultAndSetActive, deleteActiveVault, generateMnemonic, getAccounts, getEncryptionKey, getEncryptionKeyFromPassword, getMnemonicLib, getNewVault, getPassword, getPrivateKey, isValidMnemonic, isValidMnemonicWord, keyFromPassword, loadUnlockedVault, loadVault, overwriteVaultEncryptionKey, setPasswordFunction, setVaultActive, };
