/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program. If not, see http://www.gnu.org/licenses/ or
  write to the Free Software Foundation, Inc., 51 Franklin Street,
  Fifth Floor, Boston, MA, 02110-1301 USA, or download the license from
  the following URL: https://evan.network/license/

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

require('console.table');

// enable dev logs
process.env.DBCP_LOGLEVEL = 'debug';

// runtime parameters
const enableDeploy = process.argv.indexOf('--disable-deploy') === -1;

// node_modules
const path = require('path');
const exec = require('child_process').exec;
const fs = require('fs');
const replace = require('gulp-replace');
const del = require('del');
const minify = require('gulp-minify');
const cleanCss = require('gulp-clean-css');
const request = require('request');
const http = require('http');
const https = require('https');
const inquirer = require('inquirer');
const IpfsApi = require('ipfs-api');
const Web3 = require('web3');
const gulp = require('gulp');

// blockchain-core / DBCP stuff
const {
  AccountStore,
  createDefaultRuntime,
  Ipfs,
  Wallet,
  ExecutorWallet
} = require('@evan.network/api-blockchain-core');

// search for root ui-dapp-browser path
let runFolder = process.cwd();
while (runFolder.indexOf('ui-dapp-browser', runFolder.length - 'ui-dapp-browser'.length) === -1) {
  process.chdir(path.resolve(runFolder, '..'));
  runFolder = process.cwd();
}

// path parameters
const advancedDeployment = process.argv.indexOf('--advanced') !== -1;
const configPath = path.resolve(process.argv[process.argv.indexOf('--config') + 1]);
const dappDeploymentFolder = path.resolve('deployment');
const dappFolder = path.resolve('..');
const ionicDeploymentFolder = path.resolve('www');
const licensesFolder = path.resolve('licenses');
const originFolder = path.resolve('runtime/external');
const platformFolder = path.resolve('platforms');
const runtimeFolder = path.resolve('runtime');

// globals
let config;
let deploymentAccount;
let deploymentDomain;
let initialized;
let ipfsConfig;
let ipfsInstance;
let ipfsUrl;
let runtime;
let web3;

// values will be overwritten after the deployment configuration was loaded, to check, which dapp
// should be bind on an ips hash
let ipnsPrivateKeys = { };
let ipnsHashes = { };

// Original ipns hashes for the testnet that also are entered per default into the UI for
// development. By deploying other inps hashes for the several base libs and dapps, the testnet
// hashes will be replaced by the entered ones.
const testnetIpnsHashes = {
  bcc: 'Qme9gmKpueriR7qMH5SNW3De3b9AFBkUGvFMS8ve1SuYBy',
  bccdocs: 'QmYmsPTdPPDLig6gKB1wu1De4KJtTqAXFLF1498umYs4M6',
  dappbrowser: 'QmeaaYgC38Ai993NUKbgvfBw11mrmK9THb6GtR48TmcsGj',
  dbcpdocs: 'QmSXPThSm6u3BDE1X4C9QofFfcNH86cCWAR1W5Sqe9VWKn',
  licenses: 'QmT1FwnYyURjLj7nKMwEuTPUBc5uJ6z1zAVsYnKfUL1X1q',
  smartcontracts: 'QmRMz7yzMqjbEqXNdcmqk2WMFcXtpY41Nt9CqsLwMgkF43',
  uidocs: 'QmReXE5YkiXviaHNG1ASfY6fFhEoiDKuSkgY4hxgZD9Gm8',
  pxStatus: 'QmYgEK2oynRAdB9UTeCs76EFMU9mcutj1izXpi7ckSdzbS'
};

// dapp-browser files that should be copied by default for browser
const dappBrowserFiles = [
  'build/app.min.js',
  'build/vendor.min.js',
  'build/dapp-root.css',
];

// ipfs + ipns default values and configurations
let dbcps = [
  {
    name: 'web3.min.js',
    file: 'QmXVX173ygohnfg8rxzhynrNFHLTLKUqcBEKAFrEZGA9JN',
    version: '1.0.0-beta.26',
    dapp: {}
  },
  {
    name: 'ipfs-api/dist/index.min.js',
    file: 'QmczFSf23jB7RhT5ptnkycCf57hTGdfUE1Pa2qbZe4pmEN',
    version: '17.5.0',
    dapp: {}
  }
];

// version mapping for version bump select
const versionMap = [
  'major',
  'minor',
  'snapshot'
];

/********************************** bcc runtime ************************************************/
async function createRuntime() {
  // deployment configuration and accounts
  try {
    config = require(process.argv[process.argv.indexOf('--config') + 1]);

    if (!config || !config.bcConfig || !config.runtimeConfig) {
      throw new Error('No or invalid config file specified!');
    }

    deploymentAccount = Object.keys(config.runtimeConfig.accountMap)[0];
    ipfsConfig = JSON.parse(JSON.stringify(config.runtimeConfig.ipfs));
    ipfsUrl = `${ ipfsConfig.protocol }://${ ipfsConfig.host }:${ ipfsConfig.port }`;

    ipnsHashes = config.ipnsHashes || { };
    ipnsPrivateKeys = config.ipnsPrivateKeys || { };
  } catch (ex) {
    console.error(ex);
    throw new Error(`No or invalid config file specified!`);
  }

  // initialize dependencies
  const accountId = Object.keys(config.runtimeConfig.accountMap)[0];
  const provider = new Web3.providers.WebsocketProvider(
    config.runtimeConfig.web3Provider,
    { clientConfig: { keepalive: true, keepaliveInterval: 5000 } });
  web3 = new Web3(provider, null, { transactionConfirmationBlocks: 1 });

  const dfs = new Ipfs({
    dfsConfig: config.runtimeConfig.ipfs,
    privateKey: '0x' + config.runtimeConfig.accountMap[accountId],
    accountId: accountId,
    web3: web3,
  });

  const signer = accountId.toLowerCase();
  const toSignedMessage = web3.utils.soliditySha3(new Date().getTime() + accountId).replace('0x', '');
  const hexMessage = web3.utils.utf8ToHex(toSignedMessage);
  const signedMessage = web3.eth.accounts.sign(toSignedMessage, '0x' + config.runtimeConfig.accountMap[accountId]);
  config.runtimeConfig.ipfs.headers = {
    authorization: `EvanAuth ${accountId},EvanMessage ${hexMessage},EvanSignedMessage ${signedMessage.signature}`
  };
  ipfsInstance = new IpfsApi(config.runtimeConfig.ipfs);

  const runtime = await createDefaultRuntime(web3, dfs, {
    accountMap: config.runtimeConfig.accountMap,
    nameResolver: config.bcConfig.nameResolver,
  });

  // replace executor with wallet if required
  if (config.runtimeConfig.walletAddress) {

    const walletAddress = config.runtimeConfig.walletAddress
    const wallet = new Wallet(Object.assign({}, runtime))
    wallet.load(walletAddress)
    const executorWallet = new ExecutorWallet({
      contractLoader: runtime.contractLoader,
      accountId: deploymentAccount,
      config: JSON.parse(JSON.stringify(runtime.executor.config)),
      signer: runtime.executor.signer,
      wallet,
      web3: web3,
    })
    executorWallet.eventHub = runtime.eventHub;
    deploymentAccount = config.runtimeConfig.walletAddress
    // replace executor usages in runtime submodules
    for (let key of Object.keys(runtime)) {
      if (runtime[key].executor) {
        runtime[key].executor = executorWallet;
      } else if (runtime[key].options && runtime[key].options.executor) {
        runtime[key].options.executor = executorWallet;
      }
    }
    // set executor in runtime (top level)
    runtime.innerExecutor = runtime.executor
    runtime.innerAccount = accountId
    runtime.walletAddress = walletAddress
    runtime.executor = executorWallet
  }
  // set correct gas price
  runtime.executor.defaultOptions = { gasPrice: config.dappConfigSwitches.gasPrice }

  return runtime;
}

/********************************** ipfs functions ************************************************/

const requestFileFromEVANIpfs = function(hash) {
  return new Promise((resolve, reject) => {
    let pinTimeout = setTimeout(() => {
      pinTimeout = false;

      resolve();
    }, 20 * 1000);

    request(`${ ipfsUrl }/ipfs/${hash}`, function (error, response, body) {
      if (pinTimeout) {
        clearTimeout(pinTimeout);

        resolve();
      }
    });
  });
}

const pinToEVANIpfs = function(ipfsHash) {
  console.log(`${ ipfsConfig.host }: pinning hash "${ipfsHash}"...`);

  return ipfsInstance.pin.add(ipfsHash);
}

/**
 * Run "ipfs add -r ${path}" and returns the hash of the newly deployed folder
 * @param {string} folderName   FolderName that should be deployed (is used to splice out the ipfs folder hash)
 * @param {string} path         Path thath should be deployed (including folderName)
 */
async function deployIPFSFolder(folderName, path) {
  return new Promise((resolve, reject) => {
    ipfsInstance.util.addFromFs(path, { recursive: true}, (err, result) => {
      if (err) { throw err }
      resolve(result[result.length-1].hash || result[result.length-1].Hash);
    })
  });
  // return new Promise((resolve, reject) => {
  //   exec(`ipfs add -r ${ path }`, {

  //   }, (err, stdout, stderr) => {
  //     if (err) {
  //       reject(err);
  //     } else {
  //       const regex = new RegExp('(Qm[^\\s]+)\\s' + folderName + '\n$', 'g');
  //       const folderHash = regex.exec(stdout)[1];

  //       resolve(folderHash);
  //     }
  //   })
  // })
}

async function deployToIpns(dapp, hash, retry) {
  const chainId = await web3.eth.net.getId();
  if (chainId !== 508674158) {
    console.log(`ipns publish currently only working for testnet!`);
    return;
  }

  if (!ipnsPrivateKeys[dapp]) {
    throw new Error(`ipns key for dapp ${ dapp } not registered!`);
  }

  if (deploymentDomain !== 'evan') {
    throw new Error(`deploymentDomain ${ deploymentDomain } is not evan, IPNS will not be enrolled!`);
  }

  return new Promise((resolve, reject) => {
    const options = {
      hostname: '35.178.171.238',
      port: '8080',
      path: `/api/smart-agents/ipns-publish/add-or-update?key=${ ipnsPrivateKeys[dapp] }&hash=${ hash }`,
      headers : config.runtimeConfig.ipfs.headers,
      method : 'GET'
    };

    runtime.logger.log(JSON.stringify(config.runtimeConfig.ipfs.headers))

    const req = http.request(options, (res) => {
      res.setEncoding('utf8')
      res.on('data', (chunk) => {  })
      res.on('end', async () => {
        runtime.logger.log(`${ ipfsConfig.host }: pinned hash  "${ hash }"`)
        resolve()
      })
    })

    req.on('error', async (e) => {
      runtime.logger.log(`${ ipfsConfig.host }: failed to pin hash "${ hash }"; ${ e.message || e }`)
      await keyPressToContinue();
      reject(e)
    })

    req.on('timeout', async () => {
      runtime.logger.log(`${ ipfsConfig.host }: timeout during pinning of hash "${ hash }"`)
      await keyPressToContinue();
      resolve()
    })

    // write data to request body
    req.write('')
    req.end()
  })

  // /api/smart-agents/ipns-publish/add-or-update?key=testnet-evan.network-dapp-browser&hash=

}

keyPressToContinue = async function() {
  console.log('press any key to continue...');

  await new Promise(resolve => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', () => resolve());
  });
}

const clearConsole = function() {
  console.clear();
  console.log(`\n\nevan.network - deployment (${ deploymentDomain || '---' }) ${ !enableDeploy ? '- (deployment disabled)' : '' }\n`);
};

/********************************** dapps deployment functions ************************************/
/**
 * Checks all testnet hashes and configurations and replace them with the correct ones that are
 * passed to the script.
 */
const replaceConfigurationValues = async function(folderPath) {
  const replacePaths = [ `${ folderPath }/**/*.js`, `${ folderPath }/**/*.html`, ];

  // replace testnet ipns values
  for (let dappKey of Object.keys(ipnsHashes)) {
    if (testnetIpnsHashes[dappKey]) {
      await new Promise(resolve => gulp
        .src(replacePaths)
        .pipe(replace(new RegExp(testnetIpnsHashes[dappKey], 'g'), ipnsHashes[dappKey]))
        .pipe(gulp.dest(folderPath))
        .on('end', () => resolve())
      );
    }
  }

  const replaceChain = gulp.src(replacePaths);

  const chainId = await web3.eth.net.getId();
  if (chainId !== 508674158) {
    replaceChain.pipe(replace(/\<div\ id\=\"evan\-testnet\"\>TESTNET\<\/div\>/g, ''))
  }

  // replace configuration values
  await new Promise(resolve => replaceChain
    // replace bcc configurations
    .pipe(replace(/window\.localStorage\[\'evan-ens-address\'\]/g, `window.localStorage['evan-ens-address'] || '${ config.bcConfig.nameResolver.ensAddress }'`))
    .pipe(replace(/window\.localStorage\[\'evan-ens-resolver\'\]/g, `window.localStorage['evan-ens-resolver'] || '${ config.bcConfig.nameResolver.ensResolver }'`))
    .pipe(replace(/window\.localStorage\[\'evan-bc-root\'\]/g, `window.localStorage['evan-bc-root'] || '${ config.bcConfig.nameResolver.labels.businessCenterRoot }'`))
    .pipe(replace(/window\.localStorage\[\'evan-ens-root\'\]/g, `window.localStorage['evan-ens-root'] || '${ config.bcConfig.nameResolver.labels.ensRoot }'`))
    .pipe(replace(/window\.localStorage\[\'evan-ens-events\'\]/g, `window.localStorage['evan-ens-events'] || ${ JSON.stringify(config.bcConfig.nameResolver.domains.eventhub) }`))
    .pipe(replace(/window\.localStorage\[\'evan-ens-profiles\'\]/g, `window.localStorage['evan-ens-profiles'] || ${ JSON.stringify(config.bcConfig.nameResolver.domains.profile) }`))
    .pipe(replace(/window\.localStorage\[\'evan-ens-mailbox\'\]/g, `window.localStorage['evan-ens-mailbox'] || ${ JSON.stringify(config.bcConfig.nameResolver.domains.mailbox) }`))
    // insert correct faucet account
    .pipe(replace(/faucetAccount\:\ \'0x4a6723fC5a926FA150bAeAf04bfD673B056Ba83D\'/g, `faucetAccount: '${ config.dappConfigSwitches.accounts.faucetAccount }'`))
    // insert correct ensRootOwner
    .pipe(replace(/0x4a6723fC5a926FA150bAeAf04bfD673B056Ba83D/g, config.bcConfig.ensRootOwner))

    // insert correct payment accounts
    // paymentAgentAccountId
    .pipe(replace(/0xAF176885bD81D5f6C76eeD23fadb1eb0e5Fe1b1F/g, config.dappConfigSwitches.accounts.paymentAgentAccount))
    // paymentChannelManagerAccountId
    .pipe(replace(/0x0A0D9dddEba35Ca0D235A4086086AC704bbc8C2b/g, config.dappConfigSwitches.accounts.paymentChannelManagerAccount))

    // web3 configurations
    .pipe(replace(/wss\:\/\/testcore.evan.network\/ws/g, `${ config.runtimeConfig.web3Provider }`))

    // ipfs config
    .pipe(replace(/\{\ host\:\ \'ipfs\.test\.evan\.network\'\,\ port\:\ \'443\'\,\ protocol\:\ \'https\'\ \}/g, JSON.stringify(ipfsConfig)))
    .pipe(replace(/https\:\/\/ipfs\.test\.evan\.network/g, ipfsUrl))

    // smart agent configuratiuon
    .pipe(replace(/https\:\/\/agents\.test\.evan\.network/g, config.dappConfigSwitches.url.coreSmartAgent))

    // payment agent configuratiuon
    .pipe(replace(/https\:\/\/payments\.test\.evan\.network/g, config.dappConfigSwitches.url.paymentSmartAgent))

    // insert the correct gas price
    .pipe(replace(
      /gasPrice\:\ window\.localStorage\[\'evan\-gas\-price\'\]\ \?\ parseInt\(window\.localStorage\[\'evan\-gas\-price\'\]\,\ 10\)\ \:\ 20000000000/g,
      `gasPrice: window.localStorage['evan-gas-price'] ? parseInt(window.localStorage['evan-gas-price'], 10) : ${ config.dappConfigSwitches.gasPrice }`
    ))

    // mainnet texts (e.g. for onboarding)
    .pipe(replace(/mainnetTexts\ \=\ false/g, `mainnetTexts = ${ config.dappConfigSwitches.mainnetTexts }`))

    .pipe(gulp.dest(folderPath))
    .on('end', () => resolve())
  );
}

const prepareDappsDeployment = async function(dapps) {
  console.log('    ...prepare dapps deployment');

  del.sync(`${dappDeploymentFolder}`, { force: true });

  await Promise.all(dapps.map(dapp => new Promise(resolve =>
    gulp
      .src(`${ originFolder }/${ dapp }/**/*`)
      .pipe(gulp.dest(`${ dappDeploymentFolder }/${ dapp }`))
      .on('end', async () => {
        del.sync([
          `${ dappDeploymentFolder }/${ dapp }/*.map`
        ], { force : true });

        resolve();
      })
  )));

  await replaceConfigurationValues(dappDeploymentFolder);
};

/**
 * Replace all german umlauts to uncodes.
 *
 * @return     {Promise}  resolved when done
 */
const replaceUmlauts = function() {
  console.log('    ...fixing umlauts');

  return new Promise(resolve => {
    gulp
      .src([
        `${ dappDeploymentFolder }/**/*.js`
      ])
      // replace german umlauts
      .pipe(replace(/Ä/g, '\\u00c4')).pipe(replace(/ä/g, '\\u00e4'))
      .pipe(replace(/Ö/g, '\\u00d6')).pipe(replace(/ö/g, '\\u00f6'))
      .pipe(replace(/Ü/g, '\\u00dc')).pipe(replace(/ü/g, '\\u00fc'))
      .pipe(replace(/ß/g, '\\u00df'))

      // replace weird stuff in angular-libs => gulp-uglify will transform special character encodes
      // to special characters and the ui will crash
      .pipe(replace('new RegExp("[^" + WS_CHARS + "]")', '/[^ \\f\\n\\r\\t\\v\\u1680\\u180e\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff]/'))
      .pipe(replace('new RegExp("[" + WS_CHARS + "]{2,}", \'g\')', '/[ \\f\\n\\r\\t\\v\\u1680\\u180e\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff]{2,}/g'))
      .pipe(gulp.dest(`${ dappDeploymentFolder }`))
      .on('end', () => {
        resolve();
      })
  });
}

const logDbcps = function() {
  clearConsole();
  console.log(`\n\nevan.network - Deployment (${ config.bcConfig.nameResolver.labels.ensRoot })\n`);
  console.log('-------------------------\n\n');

  console.table(dbcps.map(dbcp => {
    return {
      name: dbcp.name,
      version: dbcp.version,
      description: dbcp.dapp.descriptionHash,
      folder: dbcp.dapp.origin,
      ipns: dbcp.dapp.ipns || ipnsHashes[dbcp.name],
      file: dbcp.file
    }
  }));
  console.log('--------------------------\n');

  const ionicInstallation = getDbcpFromList('Ionic DApp');

  console.log('Open ionic app : \n');
  if (ionicInstallation) {
    console.log(`${ ipfsUrl }/ipfs/${ ionicInstallation.dapp.origin }/index.html`);
  }
  console.log(`${ ipfsUrl }/ipns/QmeaaYgC38Ai993NUKbgvfBw11mrmK9THb6GtR48TmcsGj/index.html`);
  console.log('\n--------------------------\n');
}

const addDbcpToList = function(dbcp) {
  for (let i = 0; i < dbcps.length; i++) {
    if (dbcps[i].name === dbcp.name) {
      dbcps.splice(i, 1);

      break;
    }
  }

  dbcps.push(dbcp);
}

const getDbcpFromList = function(name) {
  return dbcps.find(dbcp => dbcp.name === name);
}

const updateDBCPVersion = function(dbcp, version, beforeHash) {
  let splittedVersion = (dbcp.public.version || '').split('.');
  splittedVersion = splittedVersion.map(versionNumber => parseInt(versionNumber));
  splittedVersion.splice(3, splittedVersion.length);

  // fill missing version numbers
  while (splittedVersion.length < 3) {
    splittedVersion.push(0);
  }

  if (!dbcp.public.versions) {
    dbcp.public.versions = { };
  }

  const versionBump = versionMap.indexOf(version);
  if (versionBump > -1) {
    splittedVersion[versionBump] = splittedVersion[versionBump] + 1;

    if (versionBump < 1) {
      splittedVersion[1] = 0;
    }

    if (versionBump < 2) {
      splittedVersion[2] = 0;
    }
  }

  // set latest version
  if (beforeHash) {
    dbcp.public.versions[dbcp.public.version] = beforeHash;
    dbcp.public.version = splittedVersion.join('.');
  }
}

function saveDBCPFile(dbcpPath, dbcp) {
  fs.writeFileSync(dbcpPath, JSON.stringify(dbcp, null, 2));
}

/**
 * Use external folders of the
 * @param {Array<string>} externals   Array of folder paths that should be deployed
 * @param {Ipfs} ipfs                 Blockchain-Core IPFS instance
 */
async function deployDApps(externals, version) {
  console.log('    ...deploying dapps');

  for (let external of externals) {
    const currIndex = externals.indexOf(external);

    // build status
    const statusTable = [ ];
    for (let i = 0; i < externals.length; i++) {
      statusTable.push({
        name: `${ i + 1 }. ${ externals[i] }`,
        status: i < currIndex ? 'done' : i > currIndex ? 'pending' : 'deploying'
      });
    }

    clearConsole();

    console.log(`\n\nDeploying Dapps... (${ currIndex + 1} / ${ externals.length })\n`);
    console.table(statusTable);
    console.log('\n\n');

    try {
      const folderName = `${dappDeploymentFolder}/${external}`;
      const externalDbcpPath = `${ runtimeFolder }/external/${external}`;
      let dbcp = require(`${ externalDbcpPath }/dbcp.json`);
      let dbcpPath;

      try {
        dbcpPath = require(`${ externalDbcpPath }/dbcpPath.json`).dbcpPath;
      } catch (ex) { }

      // add support for sub ens domains
      let address = dbcp.public.name;
      address += `.${ deploymentDomain }`;

      let beforeHash = await runtime.nameResolver.getContent(address);
      if (beforeHash) {
        beforeHash = beforeHash.startsWith('Qm') ? beforeHash : Ipfs.bytes32ToIpfsHash(beforeHash);
      }
      dbcp.public.dapp.origin = await deployIPFSFolder(external, `${folderName}`);

      if (dbcp.public.versions) {
        dbcp.public.versions[dbcp.public.version] = dbcp.public.dapp.origin;
      }

      updateDBCPVersion(dbcp, version, beforeHash);
      saveDBCPFile(`${ runtimeFolder }/external/${external}/dbcp.json`, dbcp);

      if (dbcpPath) {
        saveDBCPFile(dbcpPath, dbcp);
      }

      // check if the address was claimed before
      //   --> trace from first level and claim permanent addresses when no owner was set before
      const splitEns = address.split('.');
      for (let i = splitEns.length; i > -1; i--) {
        const checkAddress = splitEns.slice(i, splitEns.length).join('.');

        const owner = await runtime.executor.executeContractCall(
          runtime.nameResolver.ensContract, 'owner', runtime.nameResolver.namehash(checkAddress));
        if (owner === '0x0000000000000000000000000000000000000000') {
          try {
            await runtime.nameResolver.claimPermanentAddress(checkAddress, deploymentAccount);
          } catch (ex) {
            // claim permanent address is only needed for root addresses
            await runtime.nameResolver.setAddress(checkAddress, '0x0000000000000000000000000000000000000000', deploymentAccount);
          }
        }
      }

      // set the description
      await runtime.description.setDescriptionToEns(address, {
        public: dbcp.public
      }, deploymentAccount);

      let descriptionHash = await runtime.nameResolver.getContent(address);

      await pinToEVANIpfs(Ipfs.bytes32ToIpfsHash(descriptionHash));
      await pinToEVANIpfs(dbcp.public.dapp.origin);

      if (ipnsPrivateKeys[dbcp.public.name] ) {
        try {
          await deployToIpns(dbcp.public.name, dbcp.public.dapp.origin);
        } catch (ex) {
          console.log(`   Failed to publish to ipns : ${ external }`);
          console.dir(ex);
        }
      }

      addDbcpToList(dbcp.public);
    } catch (ex) {
      console.log(`   Failed to deploy dbcp : ${ external }`);
      console.dir(ex);

      await keyPressToContinue();
    }
  }

  return dbcps;
}

const loadDbcps = async function(externals) {
  console.log('\nLoading deployed DApps...');

  const promises = [ ];
  for (let external of externals) {
    promises.push((async () => {
      try {
        let dbcp = require(`${originFolder}/${external}/dbcp.json`);
        dbcp = Object.assign(dbcp.public, dbcp.private);

        let address = dbcp.name;
        address += `.${ deploymentDomain }`;

        let descriptionHash = await runtime.nameResolver.getContent(address);

        if (descriptionHash) {
          descriptionHash = descriptionHash.startsWith('Qm') ? descriptionHash : Ipfs.bytes32ToIpfsHash(descriptionHash);

          let loaded = await runtime.description.getDescriptionFromEns(address);
          loaded = Object.assign(loaded.public, loaded.private);

          dbcp.dapp.origin = loaded.dapp.origin;

          addDbcpToList(dbcp);
        }
      } catch (ex) {
        console.log(`   Failed to load dbcp : ${ external }`);
        console.dir(ex);
      }
    })());
  }

  return await Promise.all(promises);
}

/********************************** ionic functions ***********************************************/
prepareIonicDeploy = async function () {
  console.log('    ...prepare dapp-browser deployment');
  await del.sync(`${ionicDeploymentFolder}`, { force: true });

  await new Promise(resolve => gulp
    .src([
      'index.html',
      'favicon.ico',
      'manifest.json',
      'logo.png',
      'cache.manifest',
      'cordova.js'
    ]
    .map(file => `${ runtimeFolder }/${ file }`))
    .pipe(gulp.dest(ionicDeploymentFolder))
    .on('end', () => resolve())
  );

  // copy dbcp description
  await new Promise(resolve => gulp
    .src([ `${ dappFolder }/dbcp.json` ])
    .pipe(gulp.dest(ionicDeploymentFolder))
    .on('end', () => resolve())
  );

  await new Promise(resolve => gulp
    .src(dappBrowserFiles.map(file => `${runtimeFolder}/${file}`))
    .pipe(gulp.dest(`${ ionicDeploymentFolder }/build`))
    .on('end', () => resolve())
  );

  // insert correct inps values for the current configuration
  await replaceConfigurationValues(ionicDeploymentFolder);
};

const prepareIonicAppBuild = async function(platform) {
  const dapps = loadDApps();

  await initializeDBCPs(dapps);
  await prepareIonicDeploy();

  console.log('copy platform cordova assets...');
  await new Promise((resolve, reject) => gulp
    .src([
      `${platformFolder}/${ platform }/platform_www/**/*`,
    ])
    .pipe(gulp.dest(ionicDeploymentFolder))
    .on('end', () => resolve())
  );

  console.log('enable cordova loading...');
  await new Promise((resolve, reject) => gulp
    .src([
      `${ionicDeploymentFolder}/index.html`,
    ])
    .pipe(replace(
      /<!-- insertcordovahere -->/g,
      '<script src="cordova.js"></script>'
    ))
    .pipe(gulp.dest(ionicDeploymentFolder))
    .on('end', () => resolve())
  );

  await del.sync(`${ ionicDeploymentFolder }/build`, { force: true });
}

const ionicDeploy = async function (version) {
  console.log('    ...deploying dapp-browser');

  const folderHash = await deployIPFSFolder('www', ionicDeploymentFolder);

  await pinToEVANIpfs(folderHash);
  await deployToIpns('dappbrowser', folderHash);

  addDbcpToList({
    name: 'dapp-browser._evan',
    version: '-.-.-',
    dapp: {
      origin: folderHash,
      ipns: ipnsHashes.dappbrowser
    }
  });
};

const licensesDeploy = async function() {
  console.log('    ...deploy licenses');

  const folderHash = await deployIPFSFolder('licenses', licensesFolder);

  await pinToEVANIpfs(folderHash);
  await deployToIpns('licenses', folderHash);

  addDbcpToList({
    name: 'licenses._evan',
    version: '-.-.-',
    dapp: {
      origin: folderHash,
      ipns: ipnsHashes.dappbrowser
    }
  });
};

/********************************** uglify functions ***********************************************/

const uglifyJS = async function(folder) {
  return new Promise((resolve, reject) => {
    gulp
      .src([
        `${folder}/**/*.js`,
        `${folder}/**/*.json`
      ])
      .pipe(minify({
        ext: {
          src: '.js',
          min: '.js'
        },
        noSource: true,
        mangle: {
          reserved: [ 'DAGNode', 'Block' ]
        }
      }))
      .pipe(replace('isMultiaddr=function(', 'isMultiaddr=function(){return true;},function('))
      .pipe(gulp.dest(folder))
      .on('end', () => {
        resolve()
      });
  });
}

const uglifyCSS = async function (folder) {
  return new Promise((resolve, reject) => {
    gulp
      .src(`${folder}/**/*.css`)
      .pipe(cleanCss())
      .pipe(gulp.dest(folder))
      .on('end', () => resolve());
  });
};

const uglify = async function(mode, folder) {
  console.log(`    ...uglify sources (${ mode })`);
  console.log(`      ...Uglify js`);
  await uglifyJS(folder);
  console.log(`      ...Uglify css`);
  await uglifyCSS(folder);
};

/********************************** menu functions ************************************************/
const loadDApps = function() {
  return fs
    .readdirSync(originFolder)
    .map(name => `${originFolder}/${name}`)
    .filter(source => fs.lstatSync(source).isDirectory())
    .map(dappPath => {
      const splitted = dappPath.split('/');

      return splitted[splitted.length - 1];
    });
}

const initializeDBCPs = async function(dapps) {
  initialized = true;
  clearConsole();

  runtime = await createRuntime();

  if (!deploymentDomain) {
    clearConsole();
    const prompt = inquirer.createPromptModule();

    deploymentDomain = (await prompt([{
      name: 'deploymentDomain',
      message: 'On which domain do you want to deploy your DApps?',
      type: 'input',
      default: runtime.nameResolver.getDomainName(config.bcConfig.nameResolver.domains.root),
      required: true
    }])).deploymentDomain;
  }

  await loadDbcps(dapps);
}

const deploymentMenu = async function() {
  const dapps = loadDApps();

  if (!initialized) {
    await initializeDBCPs(dapps);
  }

  if (advancedDeployment) {
    dapps.push('dapp-browser._evan');
    dapps.push('licenses._evan');

    dbcps.push({
      name: 'dapp-browser._evan',
      version: '-.-.-',
      dapp: {
        origin: '',
        ipns: ipnsHashes.dappbrowser
      }
    });

    dbcps.push({
      name: 'licenses._evan',
      version: '-.-.-',
      dapp: {
        origin: '',
        ipns: ipnsHashes.licenses
      }
    });
  }

  const questions = [
    {
      name: 'dapps',
      message: `Which DApps do you want to deploy? (${ deploymentDomain })`,
      type: 'checkbox',
      choices: [ ],
      validate: (dapps) => {
        // if no advaned deployment was selected, it could be possible, that exit was selected,
        // so we need to stop the application
        if (dapps.filter(dapp => dapp === 'exit').length > 0) {
          process.exit();
        }

        return true;
      }
    },
    {
      name: 'version',
      message: 'Which version number to you want to raise?',
      type: 'list',
      default: false,
      choices: [
        {
          name: 'replace',
          value: 'replace',
        },
        {
          name: 'snapshot',
          value: 'snapshot',
        },
        {
          name: 'minor',
          value: 'minor',
        },
        {
          name: 'major',
          value: 'major',
        },
      ],
      when: (results) => {
        if (results.deploymentType !== 'exit') {
          return true;
        } else {
          return false;
        }
      }
    },
    {
      name: 'uglify',
      message: 'Do you want to uglify the code?',
      type: 'list',
      default: false,
      choices: [
        {
          name: 'Keep it normal ugly',
          value: false,
        },
        {
          name: 'Uglify',
          value: true,
        },
        new inquirer.Separator(),
      ],
      when: (results) => {
        if (results.deploymentType !== 'exit') {
          return true;
        } else {
          return false;
        }
      }
    }
  ];

  // search for the longest dapp name for a good looking output
  let dappNameLength = 0;
  dapps.forEach(dappName => {
    if (dappNameLength < (dappName.length + 10)) {
      dappNameLength = dappName.length + 10;
    }
  });

  // add choices for dapps
  for (let i = 0; i < dapps.length; i++) {
    const choice = {
      name : dapps[i],
      value : dapps[i]
    };

    // fill ui choice name until the longest dappname is reached
    while (choice.name.length < dappNameLength) {
      choice.name = choice.name + ' ';
    }

    choice.name = choice.name + '.' + deploymentDomain;

    // search for loaded dbcps and add the verison to the display
    const foundDBCP = dbcps.filter(desc => desc.name === dapps[i]);
    if (foundDBCP.length > 0) {
      choice.name = ' ' + choice.name + ` (${ foundDBCP[0].version }) - ${ foundDBCP[0].dapp.origin }`;
    } else {
      choice.name = ' ' + choice.name + ` (not deployed)`;
    }

    questions[0].choices.push(choice);
  }

  // sort them using parent domains
  questions[0].choices = questions[0].choices.sort((a, b) => {
    const reverseA = a.value.split('.').reverse();
    const reverseB = b.value.split('.').reverse();

    for (let i = 0; i < reverseA.length; i++) {
      if (reverseB.length < i || reverseA[i] < reverseB[i]) {
        return -1;
      }

      if (reverseA[i] > reverseB[i]) {
        return 1;
      }
    }
  });

  if (advancedDeployment) {
    questions[0].choices.splice(0, 0, new inquirer.Separator());
    questions[0].choices.splice(3, 0, new inquirer.Separator());
  }
  questions[0].pageSize = questions[0].choices.length;

  try {
    await new Promise((resolve, reject) => {
      var prompt = inquirer.createPromptModule();

      clearConsole();
      prompt(questions)
        .then(async results => {
          clearConsole();

          // stop the program, when exit was selected
          if (results.dapps.indexOf('exit') !== -1) {
            process.exit();
          }

          // ionic dapp deployment
          const ionicDAppIndex = results.dapps.indexOf('dapp-browser._evan');
          if (ionicDAppIndex !== -1) {
            // remove dapp-browser._evan as normal dapp, would break the deployment process
            results.dapps.splice(ionicDAppIndex, 1);

            await prepareIonicDeploy();

            if (results.uglify) {
              await uglify('dapp-browser._evan', ionicDeploymentFolder);
            }

            await replaceUmlauts();

            if (enableDeploy) {
              await ionicDeploy(results.version);
            }
          }

          // check if licenses should be deployed
          const licensesIndex = results.dapps.indexOf('licenses._evan');
          if (licensesIndex !== -1) {
            // remove licenses._evan as normal dapp, would break the deployment process
            results.dapps.splice(ionicDAppIndex, 1);

            await licensesDeploy();
          }

          // start deployment of dapps
          await prepareDappsDeployment(results.dapps);

          if (results.uglify) {
            await uglify('DApps', dappDeploymentFolder);
          }

          await replaceUmlauts();

          if (enableDeploy) {
            await deployDApps(results.dapps, results.version);
          }

          resolve();
        });
    })

    await deploymentMenu();
  } catch(ex) {
    console.log(`   Error: `);
    console.dir(ex);

    await keyPressToContinue();
  }
};

gulp.task('deploy', deploymentMenu);

gulp.task('prepare-ionic-android', async function() {
  await prepareIonicAppBuild('android');
});

gulp.task('prepare-ionic-ios', async function() {
  await prepareIonicAppBuild('ios');
});