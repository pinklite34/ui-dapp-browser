/**
 * Returns the Web3 Constructor from blockchain-core and overwrites the send
 * function
 *
 * @return     {any}  The web 3 constructor.
 */
export declare function getWeb3Constructor(): any;
/**
 * Returns a new web3 instances. If a web3 currentProvider is provided, it will
 * be used.
 *
 * @param      {string}  url     url for the web socket connection
 * @return     {any}     web3 instance
 */
export declare function getWeb3Instance(url: string): any;
