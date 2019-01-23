/**
 * Set defaults for preloaded applications.
 */
export declare let loadedDeps: {};
/**
 * Loads all (sub) dependencies dbcp's of the provided dapp and set systemjs
 * maps to the correct dbcp hashes.
 *
 * Explanation:
 *   - load the latest dbcp.json from the dapp ens address
 *   - after this, the correct lib ipfs hash gets extracted from the version history of the latest
 *     dbcp.json
 *   - the new definition will loaded from the extracted ipfs hash and this versions will be
 *     overwritten by the latest one, to be sure, that all versions, including the latest one, are
 *     included
 *   - the used definition will now not the latest one, only the correct dbcp description of the
 *     desired version
 *   - dev version only used for DApps, that also requires the latest current version of the library
 *
 * @param      {string}           originName     name of the module that should
 *                                               be traversed
 * @param      {any}              ensDefinition  ens definition of the module
 *                                               that should be traversed
 *                                               (iterate through dependencies)
 * @param      {Array<Array<n>>}  depTree        dependency tree of a DApp
 * @param      {number}           deep           recursion count to prevent
 *                                               recursive dependency
 * @return     {Promise<Array<Array<n>>>}  dependency tree of a DApp
 *
 * Example:
 *  [
 *    [],
 *    [
 *      {
 *        "name": "angular-libs",
 *        "definition": {
 *          ...
 *        },
 *        "location": "angularlibs.evan!dapp-content"
 *      }
 *    ],
 *    [
 *      {
 *        "name": "angular-core",
 *        "definition": {
 *          ...
 *        },
 *        "location": "angularcore.evan!dapp-content"
 *      }
 *    ]
 *  ]
 */
export declare function getDAppDependencies(originName: string, ensDefinition: any, depTree?: any[], deep?: number): Promise<Array<any>>;
/**
 * Load all dependencies of the dapp using SystemJS and register its ens names, so each DApp can
 * load the dependency using it within import statements.
 *
 * @param      {string}        dappEns           ens of the dapp
 * @param      {boolean}       useDefaultDomain  decide if the default domain should be used
 * @return     {Promise<any>}  ens definition from the DApp
 */
export declare function loadDAppDependencies(dappEns: string, useDefaultDomain?: boolean): Promise<any>;
/**
 * loads a DApp description and register it's dependencies. Returns the js exported module and the
 * loaded ens definition.
 *
 * @param      {string}   dappEns           ens address
 * @param      {boolean}  useDefaultDomain  decide if the default domain should be used
 * @return     {any}      returns { module: { ... }, ensDefinition: {...}}
 */
export declare function loadDApp(dappEns: string, useDefaultDomain?: boolean): Promise<any>;
/**
 * Loads an DApp from ENS, resolves it's dependencies and runs the startDApp function or, in case of
 * an html entrypoint, adds an iframe and loads the url
 *
 * @param      {string}         dappEns           ens address to load the dapp from
 * @param      {Element}        container         element where DApp was started
 * @param      {boolean}        useDefaultDomain  add current default ens domain to
 * @return     {Promise<void>}  resolved when DApp started
 */
export declare function startDApp(dappEns: string, container?: HTMLElement, useDefaultDomain?: boolean): Promise<void>;
/**
 * builds a full domain name for the current bcc config
 *
 * @param      {Array<string>}  subLabels  used to enhance nameResolver config
 * @return     {<type>}         The domain name.
 */
export declare function getDomainName(...subLabels: any[]): string;
