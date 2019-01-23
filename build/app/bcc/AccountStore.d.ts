/**
 * wrapper for evan.network accounts private keys
 *
 * @class      AccountStore (name)
 */
export declare class AccountStore {
    /**
     * account cache
     */
    private accounts;
    /**
     * overwrite the global vault with an specific one
     */
    private vault;
    constructor(vault?: any);
    /**
     * get private key for the current logged in account
     *
     * @return     {Promise<string>}  private key for this account
     */
    getPrivateKey(activeAccount?: string): Promise<string>;
}
