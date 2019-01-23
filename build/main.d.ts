import * as bccHelper from './app/bcc/bcc';
import * as core from './app/core';
import * as dapp from './app/dapp';
import * as ipfs from './app/ipfs';
import * as lightwallet from './app/lightwallet';
import * as loading from './app/loading';
import * as notifications from './app/notifications';
import * as queue from './app/queue';
import * as routing from './app/routing';
import * as solc from './app/solc';
import * as utils from './app/utils';
import * as web3Helper from './app/web3';
import { AccountStore } from './app/bcc/AccountStore';
import { config } from './app/config';
import { KeyProvider, getLatestKeyProvider } from './app/bcc/KeyProvider';
import { Solc } from './app/solc';
import { getCoreOptions } from './app/bcc/bcc';
/**
 * is inserted when the application was bundled, used to prevent window usage
 */
declare let evanGlobals: any;
declare const System: any;
declare const getDomainName: typeof dapp.getDomainName;
declare let web3: any;
declare let CoreRuntime: any;
declare let definition: any;
declare let nameResolver: any;
/**
 * Starts the whole dapp-browser.
 */
export declare function initializeEvanNetworkStructure(): Promise<void>;
export { AccountStore, bccHelper, config, core, CoreRuntime, dapp, definition, evanGlobals, getCoreOptions, getDomainName, getLatestKeyProvider, ipfs, KeyProvider, lightwallet, loading, nameResolver, notifications, queue, routing, solc, Solc, System, utils, web3, web3Helper, };
