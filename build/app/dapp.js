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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as utils from './utils';
import { config } from './config';
import { finishDAppLoading } from './loading';
import { watchForEveLow } from './watchers';
/**
 * Set defaults for preloaded applications.
 */
export var loadedDeps = {};
loadedDeps["bcc." + getDomainName() + "!dapp-content"] = true;
loadedDeps["smartcontracts." + getDomainName() + "!dapp-content"] = true;
/**
 * check warnings only, after the first DApp was loaded
 */
var firstDApp = true;
/**
 * Splits an version, removes non number characters, reduce length to 3 and adds
 * missing numbers.
 *
 * @param      {string}  versionString  Version that should be splitted
 *                                      ("0.1.0")
 * @return     {Array<number|string>}  The splitted version.
 */
function getSplittedVersion(versionString) {
    // get splitted version
    var splittedVersion = versionString
        .replace(/\~|\^/g, '').split('.')
        .map(function (versionNumber) { return parseInt(versionNumber, 10); });
    // remove more than three version numbers
    splittedVersion.splice(3, splittedVersion.length);
    // fill missing version numbers
    while (splittedVersion.length < 3) {
        splittedVersion.push(0);
    }
    return splittedVersion;
}
/**
 * Returns the ipfs hash to the dbcp of the child with the correct version.
 *
 * = > if its the latest version, the ipfs hash will be replaced by using the ens address.
 *     As a result of this, the ens & dapp loader plugin will also resolve dev versions,
 *     if the latest version is required.
 *
 * @param      {string}  requiredVersion  version that should be loaded from the
 *                                        child
 * @param      {string}  childENS         ens address of the child (the current
 *                                        deployed version is not listed in the
 *                                        versions object, the function sets the
 *                                        ens address within the versions object
 *                                        with the current version)
 * @param      {any}     childDefinition  DBCP definition of the child
 * @return     {string}  The version dbcp hash from the specific DApp version.
 */
function getVersionDBCPHashFromDAppVersion(requiredVersion, childENS, childDefinition) {
    if (childDefinition && childDefinition) {
        var childVersions = childDefinition.versions || {};
        childVersions[childDefinition.version] = childENS.replace(/-/g, '');
        var versionKeys = Object.keys(childVersions);
        var splittedVersion = getSplittedVersion(requiredVersion);
        // check if the dependencies should uses upward compatibiltiy
        if (requiredVersion.startsWith('~')) {
            splittedVersion[2] = '*';
        }
        else if (requiredVersion.startsWith('^')) {
            splittedVersion[1] = '*';
            splittedVersion[2] = '*';
        }
        var versionToLoad = [0, 0, 0];
        for (var i = 0; i < versionKeys.length; i++) {
            var splittedChild = getSplittedVersion(versionKeys[i]);
            var isValid = true;
            for (var x = 0; x < 3; x++) {
                // check if we found an entry
                if (splittedVersion[x] !== splittedChild[x] && splittedVersion[x] !== '*') {
                    isValid = false;
                    break;
                }
                // direct return as valid, if e.g. the minor of the versionToLoad load than the new check
                // version (1.0.2 is lower than 1.1.0)
                if (splittedVersion[x] === '*' && versionToLoad[x] < splittedChild[x]) {
                    break;
                }
                // check if a higher * value is selected
                if (splittedVersion[x] === '*' && versionToLoad[x] > splittedChild[x]) {
                    isValid = false;
                    break;
                }
            }
            if (isValid) {
                versionToLoad = splittedChild;
            }
        }
        requiredVersion = versionToLoad.join('.');
        // if the version was not found, throw error
        if (versionKeys.indexOf(requiredVersion) !== -1) {
            // check for IPFS hash or usal ens domain name
            if (childVersions[requiredVersion].indexOf('Qm') === 0) {
                return childVersions[requiredVersion] + "!dapp-content";
            }
            else {
                return childVersions[requiredVersion] + "." + getDomainName() + "!dapp-content";
            }
        }
        else {
            var msg = "Version not found: " + requiredVersion + " for DApp " + childDefinition.name;
            console.error(msg);
            throw new Error("Version not found: " + requiredVersion + " for DApp " + childDefinition.name);
        }
    }
    else {
        var msg = "Invalid DApp definition detected";
        console.error(msg);
        console.dir(childDefinition);
        throw new Error("Invalid DApp definition detected");
    }
}
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
export function getDAppDependencies(originName, ensDefinition, depTree, deep) {
    if (depTree === void 0) { depTree = []; }
    if (deep === void 0) { deep = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var deps, dependencies, depKeys, _i, depKeys_1, dependency, subDefinition, versionLocation, previousDefinition;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deps = [];
                    depTree.unshift(deps);
                    if (!(deep > 19)) return [3 /*break*/, 1];
                    console.dir(ensDefinition);
                    console.error('Recursive dependency detected.');
                    throw new Error('Recursive dependency detected.');
                case 1:
                    deep++;
                    if (!(ensDefinition && ensDefinition.dapp && ensDefinition.dapp.dependencies)) return [3 /*break*/, 8];
                    dependencies = ensDefinition.dapp.dependencies;
                    if (!(typeof dependencies === 'object' && dependencies !== null)) return [3 /*break*/, 8];
                    depKeys = Object.keys(dependencies);
                    _i = 0, depKeys_1 = depKeys;
                    _a.label = 2;
                case 2:
                    if (!(_i < depKeys_1.length)) return [3 /*break*/, 8];
                    dependency = depKeys_1[_i];
                    return [4 /*yield*/, evanGlobals.System
                            .import(dependency + "." + getDomainName() + "!ens")];
                case 3:
                    subDefinition = _a.sent();
                    versionLocation = getVersionDBCPHashFromDAppVersion(dependencies[dependency], dependency, subDefinition);
                    if (!(versionLocation.indexOf('Qm') === 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, evanGlobals.System
                            .import(versionLocation.replace('!dapp-content', '') + "!ens")];
                case 4:
                    previousDefinition = _a.sent();
                    // use the latest version history, to be sure, that the correct latest version is
                    // included
                    previousDefinition.versions = subDefinition.versions;
                    // overwrite latest sub definition
                    subDefinition = previousDefinition;
                    _a.label = 5;
                case 5:
                    deps.unshift({
                        name: dependency,
                        definition: subDefinition,
                        location: versionLocation
                    });
                    // load recursive dependencies
                    return [4 /*yield*/, getDAppDependencies(dependency, subDefinition, depTree, deep)];
                case 6:
                    // load recursive dependencies
                    _a.sent();
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 2];
                case 8: return [2 /*return*/, depTree];
            }
        });
    });
}
/**
 * Load all dependencies of the dapp using SystemJS and register its ens names, so each DApp can
 * load the dependency using it within import statements.
 *
 * @param      {string}        dappEns           ens of the dapp
 * @param      {boolean}       useDefaultDomain  decide if the default domain should be used
 * @return     {Promise<any>}  ens definition from the DApp
 */
export function loadDAppDependencies(dappEns, useDefaultDomain) {
    return __awaiter(this, void 0, void 0, function () {
        var ensDefinition, depCategories, lastPercentage, depCount, loadingSteps, zoneJSPromise, _i, depCategories_1, depCategory;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    utils.devLog("Loading dapp: " + dappEns, 'trace');
                    window['evanDApploadTime'] = Date.now();
                    if (dappEns.indexOf('0x') !== 0 && useDefaultDomain) {
                        dappEns = dappEns + "." + getDomainName();
                    }
                    return [4 /*yield*/, evanGlobals.System.import(dappEns + "!ens")];
                case 1:
                    ensDefinition = _a.sent();
                    return [4 /*yield*/, getDAppDependencies(dappEns, ensDefinition)];
                case 2:
                    depCategories = _a.sent();
                    lastPercentage = utils.getLoadingProgress();
                    depCount = 1;
                    depCategories.forEach(function (depCategory) { return depCategory.forEach(function (dep) { return depCount++; }); });
                    loadingSteps = (100 - lastPercentage) / depCount;
                    zoneJSPromise = window['Promise'];
                    _i = 0, depCategories_1 = depCategories;
                    _a.label = 3;
                case 3:
                    if (!(_i < depCategories_1.length)) return [3 /*break*/, 6];
                    depCategory = depCategories_1[_i];
                    if (!(depCategory.length > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, Promise.all(depCategory.map(function (dep) { return __awaiter(_this, void 0, void 0, function () {
                            var ex_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        // set systemjs map
                                        evanGlobals.System.map[dep.name] = dep.location;
                                        if (!!loadedDeps[dep.location]) return [3 /*break*/, 5];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        // preimport application to handle references in code
                                        return [4 /*yield*/, evanGlobals.System.import(dep.name)];
                                    case 2:
                                        // preimport application to handle references in code
                                        _a.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        ex_1 = _a.sent();
                                        console.error(ex_1);
                                        throw ex_1;
                                    case 4:
                                        loadedDeps[dep.location] = true;
                                        _a.label = 5;
                                    case 5:
                                        utils.raiseProgress(loadingSteps);
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    window['Promise'] = zoneJSPromise;
                    utils.raiseProgress(loadingSteps);
                    return [2 /*return*/, ensDefinition];
            }
        });
    });
}
/**
 * loads a DApp description and register it's dependencies. Returns the js exported module and the
 * loaded ens definition.
 *
 * @param      {string}   dappEns           ens address
 * @param      {boolean}  useDefaultDomain  decide if the default domain should be used
 * @return     {any}      returns { module: { ... }, ensDefinition: {...}}
 */
export function loadDApp(dappEns, useDefaultDomain) {
    return __awaiter(this, void 0, void 0, function () {
        var ensDefinition, loadedModule;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadDAppDependencies(dappEns, useDefaultDomain)];
                case 1:
                    ensDefinition = _a.sent();
                    return [4 /*yield*/, evanGlobals.System.import(dappEns + "!dapp-content")];
                case 2:
                    loadedModule = _a.sent();
                    return [2 /*return*/, {
                            module: loadedModule,
                            ensDefinition: ensDefinition
                        }];
            }
        });
    });
}
/**
 * Loads an DApp from ENS, resolves it's dependencies and runs the startDApp function or, in case of
 * an html entrypoint, adds an iframe and loads the url
 *
 * @param      {string}         dappEns           ens address to load the dapp from
 * @param      {Element}        container         element where DApp was started
 * @param      {boolean}        useDefaultDomain  add current default ens domain to
 * @return     {Promise<void>}  resolved when DApp started
 */
export function startDApp(dappEns, container, useDefaultDomain) {
    if (container === void 0) { container = document.body; }
    return __awaiter(this, void 0, void 0, function () {
        var ensDefinition, entrypoint, dappModule, iframe;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadDAppDependencies(dappEns, useDefaultDomain)];
                case 1:
                    ensDefinition = _a.sent();
                    if (!(ensDefinition.dapp && ensDefinition.dapp.entrypoint)) return [3 /*break*/, 6];
                    if (!ensDefinition.dapp.origin) {
                        dappEns = ensDefinition.name + "." + getDomainName();
                    }
                    entrypoint = ensDefinition.dapp.entrypoint;
                    if (!entrypoint.endsWith('.js')) return [3 /*break*/, 4];
                    return [4 /*yield*/, evanGlobals.System.import(dappEns + "!dapp-content")];
                case 2:
                    dappModule = _a.sent();
                    return [4 /*yield*/, dappModule.startDApp(container, ensDefinition.name, dappEns)];
                case 3:
                    _a.sent();
                    // check warnings, after first DApp was opened
                    if (firstDApp) {
                        firstDApp = false;
                        setTimeout(function () { return watchForEveLow(); }, 3000);
                    }
                    return [3 /*break*/, 5];
                case 4:
                    if (entrypoint.endsWith('.html')) {
                        iframe = document.createElement('iframe');
                        iframe.className += ' evan-dapp';
                        // dev mode checks
                        if (utils.isDevAvailable(ensDefinition.name)) {
                            iframe.setAttribute('src', window.location.origin + "/external/" + ensDefinition.name + "/" + ensDefinition.dapp.entrypoint + "#/" + dappEns);
                        }
                        else {
                            iframe.setAttribute('src', evanGlobals.restIpfs.api_url("/ipfs/" + ensDefinition.dapp.origin + "/" + ensDefinition.dapp.entrypoint + "#/" + dappEns));
                            finishDAppLoading();
                        }
                        container.appendChild(iframe);
                    }
                    else {
                        throw new Error('Invalid entry point defined!');
                    }
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6: throw new Error('No entry point defined!');
                case 7: return [2 /*return*/];
            }
        });
    });
}
/**
 * builds a full domain name for the current bcc config
 *
 * @param      {Array<string>}  subLabels  used to enhance nameResolver config
 * @return     {<type>}         The domain name.
 */
export function getDomainName() {
    var subLabels = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        subLabels[_i] = arguments[_i];
    }
    var domainConfig = config.nameResolver.domains.root;
    if (Array.isArray(domainConfig)) {
        return subLabels.filter(function (label) { return label; }).concat(domainConfig.map(function (label) { return config.nameResolver.labels[label]; })).join('.').toLowerCase();
    }
    else {
        return domainConfig;
    }
}
