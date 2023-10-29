import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useData } from '../DataContext';
import ClientDashboardNav from "../Navigation/ClientNav/ClientDashboardNav";
import "./Client Styles/ClientSettings.css";

export function ClientSettings() {
    // Initialize the necessary hooks and state variables
    const navigate = useNavigate();
    const { privateData, setPrivateData } = useData();
    const clientData = privateData.data;

    // State variables to track form modifications
    const [isFormModified, setIsFormModified] = useState(false);

    // State variables to store fetched client information
    const [fetchedClientName, setFetchedClientName] = useState('');
    const [fetchedEmail, setFetchedEmail] = useState('');
    const [fetchedAddress, setFetchedAddress] = useState('');
    const [fetchedContactNumber, setFetchedContactNumber] = useState('');

    // State variables to store fetched service details
    const [fetchedContractType, setFetchedContractType] = useState('');
    const [fetchedServiceLevel, setFetchedServiceLevel] = useState('');
    const [fetchedStartDate, setFetchedStartDate] = useState('');
    const [fetchedEndDate, setFetchedEndDate] = useState('');

    // State variable to track the presence of service details
    const [hasServiceDetails, setHasServiceDetails] = useState(true);

    // State variable to track the account status
    const [isAccountActive, setIsAccountActive] = useState(true);

    // State variable to store form input values
    const [state, setState] = useState({
        email: '',
        password: '',
        clientName: '',
        address: '',
        contactNumber: '',
    });

    // Use useEffect to store client data in local storage when it changes
    useEffect(() => {
        try {
            if (clientData) {
                localStorage.setItem('clientData', JSON.stringify(clientData));
            }
        } catch (error) {
            console.error('Error storing clientData in local storage:', error);
        }
    }, [clientData]);

    // Initialize an object to store client data retrieved from local storage
    let storedClientData = {};

    // Try to retrieve client data from local storage
    try {
        const storedData = localStorage.getItem('clientData');
        if (storedData) {
            storedClientData = JSON.parse(storedData);
        }
    } catch (error) {
        console.error('Error retrieving clientData from local storage:', error);
    }

    // Handle input changes and update form modification status
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
        setIsFormModified(value.trim() !== '');
    };

    // Function to fetch client information
    const fetchClientInfo = async () => {
        try {
            const clientResponse = await fetch(`api/clients/client-info/${storedClientData.email}`);
            if (clientResponse.ok) {
                const fetchedData = await clientResponse.json();
                setFetchedClientName(fetchedData[0].clientName);
                setFetchedEmail(fetchedData[0].email);
                setFetchedAddress(fetchedData[0].address);
                setFetchedContactNumber(fetchedData[0].contactNumber);
                setPrivateData({ type: 'client', data: fetchedData[0] });
            } else {
                console.error('Failed to fetch client information:', clientResponse.status);
            }
        } catch (error) {
            console.error('An error occurred while fetching client information:', error);
        }
    };

    // Use useEffect to fetch client information when the email changes
    useEffect(() => {
        fetchClientInfo();
    }, [storedClientData.email]);

    const handleSaveChanges = () => {
        const confirmSave = window.confirm("Are you sure you want to save these changes? \n\nNote: Changing your email will log you out.");
    
        if (!confirmSave) {
            // User canceled the save operation
            return;
        }

        // Create an object to store the data to be sent
        const updatedData = {};
    
        // Add non-empty and non-null fields to the updatedData object
        if (state.clientName.trim() !== '') {
            updatedData.clientName = state.clientName;
        }
        if (state.email.trim() !== '') {
            updatedData.email = state.email;
        }
        if (state.password.trim() !== '') {
            updatedData.password = state.password;
        }
        if (state.address.trim() !== '') {
            updatedData.address = state.address;
        }
        if (state.contactNumber.trim() !== '') {
            updatedData.contactNumber = state.contactNumber;
        }
    
        // Check if there are fields to update
        if (Object.keys(updatedData).length === 0) {
            // No fields to update, exit early
            setIsFormModified(false);
            return;
        }
    
        // Send the updated data to the server
        fetch(`api/clients/edit-client/${storedClientData.email}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Data saved:', data);
        })
        .catch((error) => {
            console.error('Error saving data:', error);
        });
    
        setIsFormModified(false);

        // Check if fetchedClientInfo is available and email has changed
        if ((updatedData.email !== undefined) && (updatedData.email !== fetchedEmail)) {
            navigate('/', { replace: true });
        }

        // Clear form input values
        state.clientName = "";
        state.email = "";
        state.password = "";
        state.address = "";
        state.contactNumber = "";

        window.location.reload();
    };

    // Function to fetch client details
    const fetchClientDetails = async () => {
        try {
            const clientResponse = await fetch(`api/clients/client-details/${storedClientData.email}`);
            if (clientResponse.ok) {
                const fetchedData = await clientResponse.json();
                if (Array.isArray(fetchedData) && fetchedData.length === 0) {
                    setHasServiceDetails(false);
                } else {
                    setHasServiceDetails(true);
                    const startDate = new Date(fetchedData[0].startDate);
                    const endDate = new Date(fetchedData[0].endDate);
    
                    const startDateOnly = startDate.toISOString().split('T')[0];
                    const endDateOnly = endDate.toISOString().split('T')[0];
    
                    setFetchedContractType(fetchedData[0].contractType);
                    setFetchedServiceLevel(fetchedData[0].serviceLevel);
                    setFetchedStartDate(startDateOnly);
                    setFetchedEndDate(endDateOnly);
                }
            } else {
                console.error('Failed to fetch client details:', clientResponse.status);
            }
        } catch (error) {
            console.error('An error occurred while fetching client details:', error);
        }
    };

    // Use useEffect to fetch client details when the email changes
    useEffect(() => {
        fetchClientDetails(storedClientData.email);
    }, [storedClientData.email]);
    
    // Function to check the account status
    const checkAccountStatus = () => {
        const currentDate = new Date();
        const endDate = new Date(fetchedEndDate);
        endDate.setHours(0, 0, 0, 0); // Remove time to compare dates only

        if (endDate < currentDate) {
            // Account is inactive
            setIsAccountActive(false);
        } else if (endDate > currentDate) {
            // Account is active
            setIsAccountActive(true);
        } else {
            // Account is active but today's the end date
            setIsAccountActive(false);
        }
    };

    // Use useEffect to check the account status when the end date changes
    useEffect(() => {
        checkAccountStatus();
    }, [fetchedEndDate]);

    return(
        <>
            <ClientDashboardNav theClientName={fetchedClientName} />
            <div className="settings-wrapper">
                <div className="main-heading">
                    <h2>Account Settings</h2>
                </div>
                <div className="section-div">
                    <h3>Personal Details -</h3>
                </div>
                <div className='input-group'>
                    <div className='form-group'>
                        <input
                            type="text"
                            name="clientName"
                            placeholder={fetchedClientName}
                            value={state.clientName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='form-group'>
                        <input
                            type="email"
                            name="email"
                            placeholder={fetchedEmail}
                            value={state.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='form-group'>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={state.password}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='form-group'>
                        <input
                            type="text"
                            name="address"
                            placeholder={fetchedAddress}
                            value={state.address}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='form-group'>
                        <input
                            type="number"
                            name="contactNumber"
                            placeholder={fetchedContactNumber}
                            value={state.contactNumber}
                            onChange={handleInputChange}
                        />
                    </div>   
                    <div>
                        <button onClick={handleSaveChanges} disabled={!isFormModified} className="btn btn-save">Save Changes</button>
                    </div>                  
                </div>
                
                <div style={{display: "flex", justifyContent: "center"}}><hr style={{width: "50%"}}></hr></div>
                
                <div className="section-div service-div">
                    <h3>Service Details -</h3>

                    {hasServiceDetails ? (
                        <div className="service-details-wrapper">
                            <div className="service-details">
                                <div className="status-heading">
                                    <p style={{fontSize: "18px", textDecoration: "underline"}}>
                                        <b>Account Status:</b>{" "}
                                        <span style={{ color: isAccountActive ? "green" : "red" }}>
                                            {isAccountActive ? "Active" : "Inactive"}
                                        </span>
                                    </p>
                                </div>
                                <div className="service-info">
                                    <div><p><b>Contract Type:</b> {fetchedContractType}</p></div>
                                    <div><p><b>Service Level:</b> {fetchedServiceLevel}</p></div>
                                    <div><p><b>Start Date:</b> {fetchedStartDate}</p></div>
                                    <div><p><b>End Date:</b> {fetchedEndDate}</p></div>                                
                                </div>
                            </div>

                            {isAccountActive ? null : (
                                <div className="account-renewal">
                                    <p><em>Please renew your account <a href="/services-offered">here</a>.</em></p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="no-service-details">
                            <p>Please <a href="/services-offered">apply for a service package</a> to view service details.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}