import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../DataContext';
import "./Client Styles/ClientAccSetup.css"

export function ClientAccSetup() {
    // Use the useNavigate hook to handle navigation
    const navigate = useNavigate();
    const { privateData, setPrivateData } = useData();
    const cltData = privateData.data;

    const [validPassword, setValidPassword] = useState(true);
    const [validContactNumber, setValidContactNumber] = useState(true);
    const [validEmgContactNumber, setValidEmgContactNumber] = useState(true);

    // State variables to manage employee information
    const [state, setState] = useState({
        clientName: '',
        clientType: '',
        password: '',
        address: '',
        contactNumber: '',
        isInfoComplete: false,
        isDashboardVisible: false,
    });

    // Use useEffect to store employee data in local storage when it changes
    useEffect(() => {
        try {
            if (cltData) {
                localStorage.setItem('clientData', JSON.stringify(cltData));
            }
        } catch (error) {
            console.error('Error storing clientData in local storage:', error);
        }
    }, [cltData]);

    // Initialize an object to store employee data retrieved from local storage
    let storedClientData = {};

    // Try to retrieve employee data from local storage
    try {
        const storedData = localStorage.getItem('clientData');
        if (storedData) {
            storedClientData = JSON.parse(storedData);
        }
    } catch (error) {
        console.error('Error retrieving clientData from local storage:', error);
    }

    // Function to handle input changes
    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    // Function to check if employee information is complete
    const checkInfoCompleteness = () => {
        const { clientName, clientType, password, address, contactNumber } = state;
        const isInfoComplete = clientName && clientType && password && address && contactNumber;
        setState({ ...state, isInfoComplete });
    };

    // Use useEffect to check if employee information is complete
    useEffect(() => {
        checkInfoCompleteness();
    }, [state.clientName, state.clientType, state.password, state.address, state.contactNumber]);

    // Function to show the employee dashboard
    const handleShowEmployeeDashboard = () => {
        const { clientName, clientType, password, address, contactNumber } = state;

        // Password length validation (8 characters)
        const isLengthValid = password.length >= 8;

        // Password complexity validation (uppercase, lowercase, numbers, special characters)
        const isComplexityValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password);
    
        // Check for sequential or repeated characters
        const hasSequentialOrRepeated = /(.)\1\1/.test(password);

        if (!isLengthValid || !isComplexityValid || hasSequentialOrRepeated) {
            // Display an error message for invalid passwords
            setValidPassword(false);
            return;
        } else {
            // Reset the validPassword state if the password is valid
            setValidPassword(true);
        }

        const isContactNumberValid = (contactNumber) => {
            // Check if it starts with "+27" and is 12 characters long
            const startsWithPlus27 = contactNumber.startsWith('+27') && contactNumber.length === 12;
            // Check if it starts with "0" and is 10 characters long
            const startsWithZero = contactNumber.startsWith('0') && contactNumber.length === 10;
    
            return startsWithPlus27 || startsWithZero;
        }

        const isEmgContactNumberValid = (emgNumber) => {
            // Check if it starts with "+27" and is 12 characters long
            const startsWithPlus27 = emgNumber.startsWith('+27') && emgNumber.length === 12;
            // Check if it starts with "0" and is 10 characters long
            const startsWithZero = emgNumber.startsWith('0') && emgNumber.length === 10;
    
            return startsWithPlus27 || startsWithZero;
        }

        // Check if the contact number is valid
        const isNumberValid = isContactNumberValid(state.contactNumber);
        const isEmgNumberValid = isEmgContactNumberValid(state.emgContact);

        if (!isNumberValid) {
            setValidContactNumber(false);
            return;
        } else {
            setValidContactNumber(true);
        }

        if (!isEmgNumberValid) {
            setValidEmgContactNumber(false);
            return;
        } else {
            setValidEmgContactNumber(true);
        }

        setPrivateData({
            ...privateData,
            newClientData: {
                newClientName: clientName,
                newClientType: clientType,
                newPassword: password,
                newAddress: address,
                newContactNumber: contactNumber,
            },
        });

        const clientData = {
            clientName,
            clientType,
            password,
            address,
            contactNumber,
        };

        // Function to update new employee details
        fetch(`/api/clients/edit-client/${storedClientData.email}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clientData),
        })
            .then((response) => {
                if (response.ok) {
                    window.alert('Your account setup is now complete!');
                    setState({ ...state, isDashboardVisible: true });
                } else {
                    console.error('Error updating employee details');
                }
            })
            .catch((error) => {
                console.error('Network error:', error);
            });
    };
    
    // Destructure state variables
    const { isInfoComplete, isDashboardVisible } = state;

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4">
                {isDashboardVisible ? (
                    navigate('/', { replace: true })
                ) : (
                    <div>
                        <h2>Please finish setting up your account</h2>
                        <form className='acc-setup-form'>
                            <div className="input-group">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={state.clientName}
                                        onChange={handleChange}
                                        placeholder="First Name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        type="password"
                                        name="password"
                                        value={state.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="address"
                                        value={state.address}
                                        onChange={handleChange}
                                        placeholder="Address"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="contactNumber"
                                        value={state.contactNumber}
                                        onChange={handleChange}
                                        placeholder="Contact Number"
                                        required
                                    />
                                </div>

                            </div>
                            <div className='btn-wrap'>
                                <button className='btn btn-save' onClick={handleShowEmployeeDashboard} disabled={!isInfoComplete}>
                                    Save
                                </button>
                            </div>
                        </form>                      

                        <div className='error-div'>
                            {!validPassword && (
                                <p style={{ color: "red" }}>
                                    Password must be at least 8 characters long, include uppercase and lowercase letters, <br />numbers, special characters, and not contain sequential or repeated characters.
                                </p>
                            )}  
                            {!validContactNumber && (
                                <p style={{ color: "red" }}>Contact number must start with "+27" and be 12 characters long or <br />start with "0" and be 10 characters long.</p>
                            )}
                            {!validEmgContactNumber && (
                                <p style={{ color: "red" }}>Emergency contact number must start with "+27" and be 12 characters long or <br />start with "0" and be 10 characters long.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}