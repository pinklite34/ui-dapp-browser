/**
 * default evan.network ipfs configuration
 */
export declare let ipfsConfig: {
    host: string;
    port: string;
    protocol: string;
    ipfsCache: any;
};
/**
 * Rest ipfs instance
 */
export declare const restIpfs: any;
/**
 * Format browser IPFS library to match the backend ipfs interface.
 *
 * @return     {files : ipfsApi}  The rest ipfs.
 */
export declare function getRestIpfs(): any;
/**
 * runs the restIpfs function and wraps it into a promise call
 *
 * @param      {string}        ipfsHash  ipfs hash to load
 * @return     {Promise<any>}  ipfs address content
 */
export declare function ipfsCatPromise(ipfsHash: string): Promise<any>;
