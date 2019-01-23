/**
 * Smart contracts solc representation.
 */
export declare class Solc {
    SmartContracts: any;
    /**
     * Constructor of the Solc. Takes unformatted SmartContracts.
     *
     * @param SmartContracts Smart contracts export of the smart contracts project.
     */
    constructor(SmartContracts: any);
    /**
     * Takes the unformatted contracts from the constructor and format the object contract keys
     * AbstractENS.sol => AbstractENS
     *
     * @return Formatted Smart Contracts objects with shorted key names.
     */
    getContracts(): {};
}
