import { IDBStore } from './idb-store';
/**
 * IPFS cache that uses an index db to store ipfs results in.
 *
 * @class      IPFSCache (name)
 */
export declare class IPFSCache {
    ipfsCacheStore: IDBStore;
    constructor();
    /**
     * gets an cached ipfs result
     *
     * @param      {string}        hash    ipfs hash to load the data from
     * @return     {Promise<any>}  ipfs cache result
     */
    get(hash: string): Promise<any>;
    /**
     * adds a ipfs value into the idb store cache
     *
     * @param      {string}  hash    ipfs hash to store the data for
     * @param      {any}     data    data to store for the ipfs hash
     */
    add(hash: string, data: any): Promise<void>;
}
