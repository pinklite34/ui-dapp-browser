/**
 * Start watchers for handling special frontend events. (e.g. eve's too low)
 */
export declare let startWatchers: () => void;
/**
 * Check if the current active accounts balance is low or empty and sends an event.
 *
 * @return     {Promise<void>}  resolved when done
 */
export declare let watchForEveLow: () => Promise<void>;
