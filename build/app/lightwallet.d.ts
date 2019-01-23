/**
 * returns CoreBundle.Mnemonic
 *
 * @return     {any}  CoreBundle.Mnemonic.
 */
declare function getMnemonicLib(): any;
/**
 * Generates a new random seed.
 *
 * @return     {string}  12 word mnemomnic
 */
declare function generateMnemonic(): any;
/**
 * Creates a new vault instance to handle lightwallet interactions.
 *
 * @param      {string}  mnemonic  mnemonic to create new vault.
 * @param      {string}  password  password to encrypt the vault.
 * @return     {vault}   vault created using mnemonic, encrypted via password
 */
declare function createVault(mnemonic: string, password: string): Promise<any>;
/**
 * Serializes a specific vault and saves it to the local storage.
 *
 * @param      {any}     vault   vault to save locally
 */
declare function setVaultActive(vault: any): void;
/**
 * Create new vault, set it active and set first account id
 *
 * @param      {string}  mnemonic  mnemonic to use
 * @param      {string}  password  password to encrypt mnemonic
 */
declare function createVaultAndSetActive(mnemonic: string, password: string): Promise<void>;
/**
 * Gets the pwDerivedKey to interact with the vault.
 *
 * @param      {any}           vault         vault to unlock
 * @param      {string}        password      password of the locked vault
 * @return     {Promise<any>}  pwDerivedKey
 */
declare function keyFromPassword(vault: any, password: string): Promise<any>;
/**
 * Creates an new vault and unlocks it
 *
 * @param      {string}  mnemonic  mnemonic to use for the vault
 * @param      {string}  password  password to encrypt the vault
 * @return     {any}  The new vault.
 */
declare function getNewVault(mnemonic: string, password: string): Promise<any>;
/**
 * Get an specific amount of accounts from the vault.
 *
 * @param      {any}  vault   vault to get accounts from
 * @param      {number}  amount  number of accounts to return
 * @return     {Array<string>}  The accounts.
 */
declare function getAccounts(vault: any, amount?: number): Array<string>;
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
declare function getPrivateKey(vault: any, accountId: string): any;
/**
 * Load locked vault from localStorage or unlocked memory vault.
 *
 * @return     {any}  deserialized, cached vault
 */
declare function loadVault(): any;
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
declare function setPasswordFunction(newPasswordFunction: Function): void;
/**
 * Shows the global-password modal.
 *
 * @param      {string}           accountId  additional account id to get the
 *                                           password from
 * @return     {Promise<string>}  password input
 */
declare function getPassword(accountId?: string): Promise<string>;
/**
 * Return current unlocked vault. Asks for password when vault is locked.
 *
 * @return     {Promise<any>}  unlocked vault
 */
declare function loadUnlockedVault(): Promise<any>;
/**
 * Returns the encryption key for the current password.
 *
 * @return     {string}  encryption key
 */
declare function getEncryptionKey(): Promise<string>;
/**
 * Hashes a password using sha3.
 *
 * @param      {string}  password  password that should be hashed
 * @return     {string}  The encryption key from password.
 */
declare function getEncryptionKeyFromPassword(accountId: string, password: string): string;
/**
 * Overwrites the encryption key for the current vault.
 *
 * @param      {string}  encryptionKey  the encryption key that should be used
 */
declare function overwriteVaultEncryptionKey(accountId: string, encryptionKey: string): Promise<void>;
/**
 * Remove current active vault from browser.
 */
declare function deleteActiveVault(): void;
/**
 * Returns if an mnemonic is a valid mnemonic. (wrapper for getKeyStore().isSeedValid)
 *
 * @param      {string}   mnemonic  The mnemonic
 * @return     {boolean}  True if valid mnemonic, False otherwise.
 */
declare function isValidMnemonic(mnemonic: string): any;
/**
 * Returns if an word is a valid mnemonic word.
 *
 * @param      {string}   word    word to check
 * @return     {boolean}  True if valid mnemonic word, False otherwise.
 */
declare function isValidMnemonicWord(word: string): boolean;
export { createVault, createVaultAndSetActive, deleteActiveVault, generateMnemonic, getAccounts, getEncryptionKey, getEncryptionKeyFromPassword, getMnemonicLib, getNewVault, getPassword, getPrivateKey, isValidMnemonic, isValidMnemonicWord, keyFromPassword, loadUnlockedVault, loadVault, overwriteVaultEncryptionKey, setPasswordFunction, setVaultActive, };
