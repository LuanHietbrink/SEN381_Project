import React, { useState, useEffect } from "react";
import EmployeeDashboardNav from '../Navigation/EmployeeNav/EmployeeDashboardNav';
import "./Dept Styles/ContractMaintenanceDept.css"

export function ContractMaintenanceDept() {
    // State variables to manage component state
    const [selectedOption, setSelectedOption] = useState("allContracts");

    const [allActiveContracts, setAllActiveContracts] = useState([]);
    const [allContracts, setAllContracts] = useState([]);
    const [businessContracts, setBusinessContracts] = useState([]);
    const [standardContracts, setStandardContracts] = useState([]);
    const [premiumContracts, setPremiumContracts] = useState([]);
    const [businessPromoContracts, setBusinessPromoContracts] = useState([]);
    const [premiumPromoContracts, setPremiumPromoContracts] = useState([]);
    const [loading, setLoading] = useState(true);

    // useEffect hook to fetch data based on the selected option
    useEffect(() => {
        // Function to fetch active contracts
        const getActiveContracts = async () => {
            try {
                const response = await fetch('api/service-contracts/active-contracts');
                const activeContracts = await response.json();

                if (activeContracts.length !== 0) {
                    setAllActiveContracts(activeContracts);
                    setLoading(false);
                } else {
                    setLoading(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Function to fetch all contracts
        const getAllContracts = async () => {
            try {
                const response = await fetch('api/service-contracts');
                const allContracts = await response.json();
                
                if (allContracts.length !== 0) {
                    setAllContracts(allContracts);
                    setLoading(false);
                } else {
                    setLoading(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Functions to fetch contracts of different types (Business, Standard, Premium, Business Promo, Premium Promo)
        // Each function fetches all contracts and then filters them by contract type
        // They also handle cases where no contracts of a certain type are found

        const getBusinessContracts = async () => {
            try {
                const response = await fetch('api/service-contracts');
                const allContracts = await response.json();
        
                // Filter contracts with contractType 'Business'
                const businessContracts = allContracts.filter(contract => contract.contractType === 'Business');
                
                if (businessContracts.length !== 0) {
                    setBusinessContracts(businessContracts);
                    setLoading(false);
                } else {
                    setLoading(true);
                }
            } catch (error) {
                console.error('Error fetching business contracts:', error);
            }
        };
        
        const getStandardContracts = async () => {
            try {
                const response = await fetch('api/service-contracts');
                const allContracts = await response.json();
        
                // Filter contracts with contractType 'Standard'
                const standardContracts = allContracts.filter(contract => contract.contractType === 'Standard');
        
                if (standardContracts.length !== 0) {
                    setStandardContracts(standardContracts);
                    setLoading(false);
                } else {
                    setLoading(true);
                }
            } catch (error) {
                console.error('Error fetching standard contracts:', error);
            }
        };
        
        const getPremiumContracts = async () => {
            try {
                const response = await fetch('api/service-contracts');
                const allContracts = await response.json();
        
                // Filter contracts with contractType 'Premium'
                const premiumContracts = allContracts.filter(contract => contract.contractType === 'Premium');

                if (premiumContracts.length !== 0) {
                    setPremiumContracts(premiumContracts);
                    setLoading(false);
                } else {
                    setLoading(true);
                }
            } catch (error) {
                console.error('Error fetching premium contracts:', error);
            }
        };    
        
        const getBusinessPromoContracts = async () => {
            try {
                const response = await fetch('api/service-contracts');
                const allContracts = await response.json();
        
                // Filter contracts with contractType 'Premium'
                const businessPromoContracts = allContracts.filter(contract => contract.contractType === 'Business Promo');
                
                if (businessPromoContracts.length !== 0) {
                    setBusinessPromoContracts(businessPromoContracts);
                    setLoading(false);
                } else {
                    setLoading(true);
                }
            } catch (error) {
                console.error('Error fetching business promo contracts:', error);
            }
        }; 

        const getPremiumPromoContracts = async () => {
            try {
                const response = await fetch('api/service-contracts');
                const allContracts = await response.json();
        
                // Filter contracts with contractType 'Premium'
                const premiumPromoContracts = allContracts.filter(contract => contract.contractType === 'Premium Promo');
        
                if (premiumPromoContracts.length !== 0) {
                    setPremiumPromoContracts(premiumPromoContracts);
                    setLoading(false);
                } else {
                    setLoading(true);
                }
            } catch (error) {
                console.error('Error fetching premium promo contracts:', error);
            }
        }; 

        // Conditionally call the appropriate data-fetching function based on the selected option
        if (selectedOption === "activeContracts") {
            getActiveContracts();
        } else if (selectedOption === "allContracts") {
            getAllContracts();
        } else if (selectedOption === "businessContracts") {
            getBusinessContracts();
        } else if (selectedOption === "standardContracts") {
            getStandardContracts();
        } else if (selectedOption === "premiumContracts") {
            getPremiumContracts();
        } else if (selectedOption === "businessPromoContracts") {
            getBusinessPromoContracts();
        } else if (selectedOption === "premiumPromoContracts") {
            getPremiumPromoContracts();
        }
    }, [selectedOption]);

    // Function to render a table of contracts
    const renderContractsTable = (contracts) => {
        // Function to format date in a human-readable way
        const formatDate = (date) => {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(date).toLocaleDateString(undefined, options);
        };

        // Sort the contracts by end date in ascending order
        contracts.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

        // Render the contracts table
        return (
            <div className='contracts-table-wrapper'>
                <table className="table contracts-table" aria-labelledby="tableLabel">
                    <thead>
                        <tr>
                            <th>Contract ID</th>
                            <th>Client ID</th>
                            <th>Package ID</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Contract Type</th>
                            <th>Service Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contracts.map(contract => (
                            <tr key={contract.contractId}>
                                <td>{contract.contractId}</td>
                                <td>{contract.clientId}</td>
                                <td>{contract.packageId}</td>
                                <td>{formatDate(contract.startDate)}</td>
                                <td>{formatDate(contract.endDate)}</td>
                                <td>{contract.contractType}</td>
                                <td>{contract.serviceLevel}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    // Conditional rendering of contract tables based on the selected option
    const allServiceContracts = loading ? <p><em>No Contracts Available.</em></p> : renderContractsTable(allContracts);
    const activeContracts = loading ? <p><em>No Active Contracts Available.</em></p> : renderContractsTable(allActiveContracts);
    const standardContractsTable = loading ? <p><em>No Standard Contracts Available.</em></p> : renderContractsTable(standardContracts);
    const businessContractsTable = loading ? <p><em>No Business Contracts Available.</em></p> : renderContractsTable(businessContracts);
    const premiumContractsTable = loading ? <p><em>No Premium Contracts Available.</em></p> : renderContractsTable(premiumContracts);
    const businessPromoContractsTable = loading ? <p><em>No Business Promo Contracts Available.</em></p> : renderContractsTable(businessPromoContracts);
    const premiumPromoContractsTable = loading ? <p><em>No Premium Promo Contracts Available.</em></p> : renderContractsTable(premiumPromoContracts);

    return (
        <>
            <EmployeeDashboardNav />
            <div className="cm-wrapper">
                <h1 className="contract-heading">Contract Maintenance</h1>
                <select className="select-contract" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                    <option value="allContracts">All Contracts</option>
                    <option value="activeContracts">Active Contracts</option>
                    <option value="standardContracts">Standard Contracts</option>
                    <option value="businessContracts">Business Contracts</option>
                    <option value="premiumContracts">Premium Contracts</option>
                    <option value="businessPromoContracts">Business Promo Contracts</option>
                    <option value="premiumPromoContracts">Premium Promo Contracts</option>
                </select>
                {selectedOption === "allContracts" ? allServiceContracts : null}
                {selectedOption === "activeContracts" ? activeContracts : null}
                {selectedOption === "standardContracts" ? standardContractsTable : null}
                {selectedOption === "businessContracts" ? businessContractsTable : null}
                {selectedOption === "premiumContracts" ? premiumContractsTable : null}
                {selectedOption === "businessPromoContracts" ? businessPromoContractsTable : null}
                {selectedOption === "premiumPromoContracts" ? premiumPromoContractsTable : null}
            </div>
        </>
    );
}