/**
 * crypto info in insecue data part
 */
export interface CryptoInfo {
    algorithm: string;
    keyLength: number;
    originator: string;
}
/**
 * Encryption Key handler.
 *
 * @class      KeyProvider (keys, accountId)
 */
export declare class KeyProvider {
    accountId: string;
    origin: any;
    keys: any;
    profile: any;
    Web3: any;
    /**
     * @param _keys     keys to set
     * @param accountId additional account id to use KeyProvider for only one account
     */
    constructor(keys: any, accountId?: string);
    /**
     * runs setKeysForAccount with the current logged in account.
     */
    setKeys(): Promise<void>;
    /**
     * Uses an account id and an encryptionKey to set account specific encryption
     * keys.
     *
     * @param      {boolean}  accountId      account id to use
     * @param      {string}   encryptionKey  encryption key for the account
     */
    setKeysForAccount(accountHash: string, encryptionKey: string): void;
    /**
     * Checks if the keys for the current logged in users are set and returns the
     * key.
     *
     * @param      {CryptoInfo}       info    crypto info
     * @return     {Promise<string>}  promise that is resulting the wanted key
     */
    getKey(info: CryptoInfo): Promise<string>;
}
/**
 * Returns a new KeyProvider or if another was created before
 *
 * @return     {<type>}  The latest key provider.
 */
export declare function getLatestKeyProvider(): any;
