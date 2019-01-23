/**
 * IndexDB store wrapper
 *
 * @class      IDBStore (name)
 */
export declare class IDBStore {
    readonly storeName: string;
    readonly _dbp: Promise<IDBDatabase>;
    /**
     * @param      {string}  dbName     database name
     * @param      {string}  storeName  store name within the database
     */
    constructor(dbName?: string, storeName?: string);
    /**
     * Runs an transaction for within the IDB store
     *
     * @param      {IDBTransactionMode}  type      The type
     * @param      {Function}            callback  callback function, that is called
     *                                             when the transaction is finished
     */
    _withIDBStore(type: IDBTransactionMode, callback: ((store: IDBObjectStore) => void)): Promise<void>;
}
/**
 * Gets a key from the IDB store.
 *
 * @param      {IDBValidKey}  key     key to load
 * @param      {IDBStore}     store   idb store to load the data from
 * @return     {Type}         returns a key value from idb store
 */
export declare function get<Type>(key: IDBValidKey, store?: IDBStore): Promise<Type>;
/**
 * sets a key value in a idb store
 *
 * @param      {IDBValidKEy}  key     key to set the value for
 * @param      {any}          value   value to set
 * @param      {store}        store   idb store to set the value in
 */
export declare function set(key: IDBValidKey, value: any, store?: IDBStore): Promise<void>;
/**
 * delete a key from an idb store
 *
 * @param      {IDBValidKey}  key     key to delete
 * @param      {IDBStore}     store   idb store to delete the data from
 */
export declare function del(key: IDBValidKey, store?: IDBStore): Promise<void>;
/**
 * Clears an idb store
 *
 * @param      {IDBStore}  store   idb store to clear
 */
export declare function clear(store?: IDBStore): Promise<void>;
/**
 * Gets the keys from an idb store
 *
 * @param      {IDBStore}                store   The store
 * @return     {Promise<IDBValidKey[]>}  keys of the idb
 */
export declare function keys(store?: any): Promise<IDBValidKey[]>;
