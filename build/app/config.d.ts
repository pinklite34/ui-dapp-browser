declare const config: {
    web3Provider: string;
    nameResolver: {
        ensAddress: any;
        ensResolver: any;
        labels: {
            businessCenterRoot: any;
            ensRoot: any;
            factory: string;
            admin: string;
            eventhub: string;
            profile: string;
            mailbox: string;
        };
        domains: {
            root: string[];
            factory: string[];
            adminFactory: string[];
            businessCenter: string[];
            eventhub: any;
            profile: any;
            profileFactory: string[];
            mailbox: any;
        };
    };
    smartAgents: {
        onboarding: {
            accountId: string;
        };
    };
    alwaysAutoGasLimit: number;
};
export { config };
