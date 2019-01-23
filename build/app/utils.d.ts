/**
 * global available array that includes dev mode available dapps, when devMode is
 * enabled, else undefined
 */
export declare let devMode: Array<any>;
/**
 * add a bcc ready promise, so some functionallities can wait for finishing bcc has loaded
 */
export declare let setBccReady: any;
export declare let bccReady: Promise<{}>;
/**
 * Checks if we are running in devMode, if true, load dev-dapps from local file server, if false do nothing
 *
 * @return     {<type>}  { description_of_the_return_value }
 */
export declare function setUpDevMode(): Promise<void>;
/**
 * Check if a dev application is available
 *
 * @param      {string}   name    string of the dapp to check
 * @return     {boolean}  True if DApp is available for development, False otherwise.
 */
export declare function isDevAvailable(name: any): boolean;
/**
 * Sends an event using window.dispatchEvent
 *
 * @param      {string}  name    event name
 * @param      {any}     data    data that should be send
 */
export declare function sendEvent(name: string, data?: any): void;
/**
 * predefined events for global usage
 */
export declare const events: {
    /**
     * sends the event, that a sub DApp starts loading
     */
    loadingSubDApp: () => void;
    /**
     * Sends the event, that a sub DApp finished loading
     */
    finishLoadingSubDApp: () => void;
};
/**
 * Show Error during the initial loading, when no UI framework is loaded
 */
export declare function showError(): void;
/**
 * Sets the current loading progress (animates evan.network logo)
 *
 * @param      {number}  percentage  current loading percentage
 */
export declare function setProgress(percentage: number): void;
/**
 * Takes the latest progress percentage and raise it with the incoming value.
 *
 * @param      {number}  percentage  percentage to add
 * @param      {any}     returnObj   additional return object for raising
 *                                   loading progress and returning object
 *                                   instantly
 * @return     {string}  additional returnObject
 */
export declare function raiseProgress(percentage: number, returnObj?: any): any;
/**
 * Returns the current loading progress.
 *
 * @return     {number}  The loading progress.
 */
export declare function getLoadingProgress(): number;
/**
 * Log a message according to localStorage settings to the log
 *
 * @param      {stromg}  message  message to log
 * @param      {string}  level    level to log (log / verbose)
 */
export declare function devLog(message: string, level?: string): void;
/**
 * Log a message according to localStorage settings to the log
 *
 * @param      {stromg}  message  message to log
 * @param      {string}  level    level to log (log / verbose)
 */
export declare function log(message: string, level?: string): void;
/**
 * Adds an deviceready event handler and wait for the result to resolve the promise. If we are on a
 * desktop device, dont wait for deviceready, it will be never called.
 *
 * @return     {Promise<void>}  resolved when deviceready event is emitted
 */
export declare function onDeviceReady(): Promise<any>;
/**
 * Removes the text after the last dot.
 *
 * @param      {string}  ensAddress  ens address to get the name for
 * @return     {string}  dappname including sub ens paths
 */
export declare function getDAppName(ensAddress: string): string;
/**
 * Gets the color theme.
 *
 * @return     {string}  the current color theme
 */
export declare function getColorTheme(): any;
/**
 * Adds the current color theme class to the body.
 *
 * @param      {string}  colorTheme  the color theme name (e.g. light)
 */
export declare function activateColorTheme(colorTheme: string): void;
