export declare let notifications: any[];
/**
 * Return the url of an notification that should be opened.
 *
 * @param      {any}     notification  firebase notification object
 * @return     {string}  dapp path to open
 */
export declare const getDAppUrlFromNotification: (notification: any) => Promise<any>;
/**
 * Initialize the plugin.
 */
export declare const initialize: () => Promise<any>;
