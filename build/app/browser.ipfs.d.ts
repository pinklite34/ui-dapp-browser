declare const ipfs: any;
/**
 * set localProvider configuration
 *
 * @param      {any}  opts    e.g. {host: 'localhost', port: '5001'}
 */
declare function setProvider(opts: any): void;
/**
 * build the api connection url
 *
 * @param      {string}  path    path to build the api url for ()
 * @return     {string}  full api enchanced path
 *
 * Usage:
 *  restIpfs.api_url(`/ipfs/Qmb...`) => http://localhost:5001/api/v0/ipfs/Qmb
 *
 */
declare function api_url(path: any): string;
/**
 * Check if brovider is set
 *
 * @param      {Function}  callback  callback function on invalid provider
 * @return     {boolean}   true if provider set, false if provider unset
 */
declare function ensureProvider(callback: any): boolean;
/**
 * Submit a new rest request
 *
 * @param      {any}  opts    options for the request
 *
 * Usage:
 *  request({ callback: callback, uri: ('/ipfs/' + ipfsHash) })
 */
declare function request(opts: any): void;
/**
 * Adds a file to the ipfs
 *
 * @param      {string}    input     string input of the file
 * @param      {Function}  callback  callback called when finished adding
 */
declare function add(input: any, callback: any): void;
/**
 * Returns a string that is loaded from a ipfs hash
 *
 * @param      {string}    ipfsHash  ipfs hash to load
 * @param      {Function}  callback  callback that is called when finished request
 */
declare function catText(ipfsHash: any, callback: any): void;
/**
 * Alias for catText
 */
declare const cat: any;
/**
 * Serializes a json object and saves it using ipfs.add
 *
 * @param      {any}       jsonObject  json object to save
 * @param      {Function}  callback    callback that is called when finished request
 */
declare function addJson(jsonObject: any, callback: any): void;
/**
 * Load data from an ipfs hash and tries an JSON.parse on the result
 *
 * @param      {string}    ipfsHash  ipfs hash to load
 * @param      {Function}  callback  callback that is called when finished request
 */
declare function catJson(ipfsHash: any, callback: any): void;
/**
 * Determines if an object is an buffer.
 *
 * @param      {any}      obj     object to check
 * @return     {boolean}  True if buffer, False otherwise
 */
declare function isBuffer(obj: any): boolean;
export { ipfs, setProvider, api_url, ensureProvider, request, add, catText, cat, addJson, catJson, isBuffer, };
