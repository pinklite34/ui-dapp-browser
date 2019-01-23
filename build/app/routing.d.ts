export declare let router: any;
export declare let defaultDAppENS: any;
export declare let history: any;
/**
 * Go to onboarding. (#/onboarding.evan)
 */
export declare function goToOnboarding(): void;
/**
 * Go to dashboard.  (#/dashboard.evan)
 */
export declare function goToDashboard(): void;
/**
 * Determines if the user is on the onboarding page.
 *
 * @return     {boolean}  True if onboarding, False otherwise.
 */
export declare function isOnboarding(): boolean;
/**
 * Gets the active root ens.
 *
 * @return     {string}  The active root ens.
 */
export declare function getActiveRootENS(): string;
/**
 * Gets the default DApp ens.
 *
 * @return     {string}  default DApp ens path
 */
export declare function getDefaultDAppENS(): Promise<string>;
/**
 * Prerouting checks to handle if the user was logged in and onboared. Navigates to onboarding /
 * default dapp ens when necessary.
 */
export declare function beforeRoute(): Promise<void>;
/**
 * Function to check if the route DApp hash changed => run beforeRoute and set
 * the route active
 *
 * @return     {void}  resolved when routed
 */
export declare function onRouteChange(): Promise<void>;
/**
 * Initialize the whole routing mechanism.
 *
 * @param      {string}  initialRoute  initial route that should replace the default ens url paths
 *                                     (eg. dashboard.evan => my-initial-route.evan)
 * @return     {void}    resolved when routing was created
 */
export declare function initialize(initialRoute: string): Promise<void>;
/**
 * Takes the current url, removes #, /#, #/ and returns the original hash value
 * without query params
 *
 * @return     {string}  transforms #/dapp/dapp1?param1=est to dapp/dapps
 */
export declare function getRouteFromUrl(): string;
/**
 * Takes the current navigation history and writes it to the sessionStorage if the user navigates to
 * another page and navigates back
 */
export declare function updateHistory(): void;
/**
 * Parse the url queryParams and return a specific parameter from it
 *
 * @param      {string}  name    name of the parameter
 * @param      {string}  url     url to parse, detail is window.location.href
 * @return     {string}  value of the parameter / null if not defined
 */
export declare function getQueryParameterValue(name: any, url?: string): string;
/**
 * Returns a bare object of the URL's query parameters.
 * You can pass just a query string rather than a complete URL.
 * The default URL is the current page.
 *
 * @return     {any}  all parameters with its values
 */
export declare function getQueryParameters(url?: string): {};
