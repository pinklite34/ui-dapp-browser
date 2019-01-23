import { AccountStore } from './AccountStore';
/**
 * returns the coreOptions for creation a new bcc CoreBundle and SmartContracts object.
 *
 * @param      {any}           CoreBundle      blockchain-core ipfs bundle import
 *                                             (System.import('bcc'))
 * @param      {any}           SmartContracts  smart-contracts ipfs bundle import
 *                                             (System.import('smart-contractssmart-contracts'))
 * @param      {any}           provider        current signing provider (internal or external)
 * @return     {Promise<any>}  core options
 */
declare function getCoreOptions(CoreBundle: any, SmartContracts: any, provider?: string): Promise<any>;
/**
 * Loads the current core options and initializes a new CoreRuntime instance.
 *
 * @param      {any}           CoreBundle      blockchain-core ipfs bundle
 * @param      {any}           SmartContracts  smart-contracts ipfs bundle
 * @return     {Promise<any>}  CoreRuntime instance
 */
declare function updateCoreRuntime(CoreBundle: any, SmartContracts: any): Promise<any>;
/**
 * Returns the existing executor or creates a new one, for the active current provider.
 *
 * @param      {any}                           CoreBundle    blockchain-core ipfs bundle
 * @param      {string}                        provider      the current selected provider that
 *                                                           should be loaded
 * @param      {AccountStore}                  accountStore  account store to use for the internal
 *                                                           signer
 * @return     {ProfileBundle.SignerInternal}  the new Signer Object
 */
declare function getSigner(CoreBundle: any, provider?: any, accountStore?: AccountStore): any;
/**
 * run keyExchange.setPublicKey
 *
 * @param      {any}            CoreBundle  blockchain-core ipfs bundle
 * @param      {string}         accountId   Account id to set the exchange keys for
 * @return     {Promise<void>}  resolved when done
 */
declare function setExchangeKeys(CoreBundle: any, accountId?: string): Promise<void>;
/**
 * Setup / update initial blockchain-core structure for current account id and signer.
 *
 * @param      {any}            CoreBundle      blockchain-core ipfs bundle
 * @param      {any}            SmartContracts  smart-contracts ipfs bundle
 * @param      {string}         activeAccount   account id to use
 * @param      {provider}       provider        provider to use (internal, external, agent)
 * @return     {Promise<void>}  solved when bcc is updated
 */
declare function startBCC(CoreBundle: any, SmartContracts: any, activeAccount?: any, provider?: any): Promise<void>;
/**
 * Returns an new blockchain-core profile instance. !Attention : It's only builded for load values
 * to check for public and private keys (e.g. used by onboarding or global-password) Executor is the
 * normal one from the global core!!!
 *
 * @param      {any}                    CoreBundle  blockchain-core ipfs bundle
 * @param      {string}                 accountId   account id to create a new profile instance for
 * @return     {ProfileBundle.Profile}  The profile for account.
 */
declare function getProfileForAccount(CoreBundle: any, accountId: string): Promise<any>;
/**
 * Check if the password for a given account id and its profile is valid.
 *
 * @param      {any}      CoreBundle      blockchain-core ipfs bundle
 * @param      {string}   accountId       account id to check
 * @param      {string}   password        password to check
 * @param      {string}   encryptionSalt  encryption salt to retrieve the encryption key with
 *                                        (default account id)
 * @return     {boolean}  True if account password valid, False otherwise
 */
declare function isAccountPasswordValid(CoreBundle: any, accountId: string, password: string, encryptionSalt?: string): Promise<boolean>;
/**
 * Wraps the original create default runtime bcc function to simplify key and account map
 * management.
 *
 * @param      {any}     CoreBundle     blockchain-core ipfs bundle
 * @param      {string}  accountId      account id to create the runtime for
 * @param      {string}  encryptionKey  enryption key of the users profile
 * @param      {string}  privateKey     account id's private key
 * @param      {any}     config         overwrite the ui configuration with a custom config
 * @param      {any}     web3           overwrite the CoreRuntime web3 with a new one
 * @param      {any}     dfs            overwrite the CoreRuntime dfs with a new one
 * @return     {any}     the new bcc defaultruntime
 */
declare function createDefaultRuntime(CoreBundle: any, accountId: string, encryptionKey: string, privateKey: string, runtimeConfig?: any, web3?: any, dfs?: any): Promise<any>;
export { createDefaultRuntime, getCoreOptions, getProfileForAccount, getSigner, isAccountPasswordValid, setExchangeKeys, startBCC, updateCoreRuntime, };
