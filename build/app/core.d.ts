/**
 * Logout the current user. Removes the active account, provider and terms of use acceptance.
 *
 * @param      {boolean}  disabledReload  disable window reload
 */
declare function logout(disabledReload?: boolean): void;
/**
 * Get the current, in local storage, configured provider.
 *
 * @return     {string}  The current provider (internal, external, agent-executor).
 */
declare function getCurrentProvider(): any;
/**
 * Check if we should use internal provider.
 *
 * @return     {boolean}  True if internal provider, False otherwise.
 */
declare function isInternalProvider(): boolean;
/**
 * Checks if a injected web3 provider exists an returns it's name
 */
declare function getExternalProvider(): string;
/**
 * Sets the current provider that should be used.
 *
 * @param      {string}  provider  provider to switch to
 */
declare function setCurrentProvider(provider: string): void;
/**
 * Get the current selected account included the check of the current provider.
 *
 * @return     {string}  account id of the current user (0x0...)
 */
declare function activeAccount(): string;
/**
 * Checks the current url parameters if agent executor login parameters are given.
 *
 * @return     {any}  all agent-exeutor parameters for requesting smart-agents and decrypting the
 *                    profile ({ accountId, agentUrl, key, token, })
 */
export declare function getAgentExecutor(): Promise<any>;
/**
 * Returns the current (in the localStorage) saved account id
 *
 * @return     {string}  account id;
 */
declare function getAccountId(): any;
/**
 * Sets an account id as active one to the local storage.
 *
 * @param      {string}  accountId  account id to set to the localStorage
 */
declare function setAccountId(accountId: string): void;
/**
 * Checks if an external provider is activated and returns it's active account
 * id
 *
 * @return     {string}  The external account.
 */
declare function getExternalAccount(): any;
/**
 * Watches for account changes and reload the page if nessecary
 */
declare function watchAccountChange(): void;
/**
 * Return the name of the current used browser =>
 * https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
 *
 * @return     {string}  opera / firefox / safari / ie / edge / chrome
 */
declare function currentBrowser(): "opera" | "firefox" | "safari" | "ie" | "edge" | "chrome";
/**
 * Gets the balance of the provided or current account id
 *
 * @param      {string}  accountId  account id to get the balance from
 * @return     {number}  The balance for the specific account id
 */
declare function getBalance(accountId?: string): Promise<number>;
export { logout, getCurrentProvider, isInternalProvider, getExternalProvider, setCurrentProvider, activeAccount, getAccountId, setAccountId, getExternalAccount, watchAccountChange, currentBrowser, getBalance };
