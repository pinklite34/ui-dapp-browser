/**
 * global available queue instance
 */
export declare let entries: Array<any>;
/**
 * initialized queue database
 */
export declare let queueDB: any;
/**
 * save the last account id to check, for which account the queue was loaded
 */
export declare let lastAccountId: string;
/**
 * gets the queue db storage name for the active account
 *
 * @return     {string}  The storage name.
 */
export declare function getStorageName(): string;
/**
 * Gets the "evan-queue" object store
 *
 * @param      {any}  option  additional options for transaction
 * @return     {any}  The object store.
 */
export declare function getObjectStore(option?: any): any;
/**
 * Loads the queue db for the current user and updates all global queue entries from the index db
 *
 * @return     {Promise<Array<any>>}  global queue entry array
 */
export declare function updateQueue(): Promise<Array<any>>;
/**
 * store for the current user it scurrent global entries to the queue db
 *
 * @param      {Array<any>}  queueEntries  queue entries to save
 * @return     {Promise<any>}      objectStore.put result
 */
export declare function storeQueue(queueEntries: any): Promise<any>;
