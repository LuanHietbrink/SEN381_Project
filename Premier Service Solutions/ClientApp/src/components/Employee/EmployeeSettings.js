import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useData } from '../DataContext';
import EmployeeDashboardNav from "../Navigation/EmployeeNav/EmployeeDashboardNav";
import "./Employee Styles/EmployeeSettings.css"

export function EmployeeSettings() {
    // Initialize the necessary hooks and state variables
    const navigate = useNavigate();
    const { privateData, setPrivateData } = useData();
    const employeeData = privateData.data;

    // State variables to track form modifications
    const [isFormModified, setIsFormModified] = useState(false);

    // State variables to store fetched employee information
    const [fetchedFirstName, setFetchedFirstName] = useState('');
    const [fetchedLastName, setFetchedLastName] = useState('');
    const [fetchedEmail, setFetchedEmail] = useState('');
    const [fetchedContactNumber, setFetchedContactNumber] = useState('');
    const [fetchedEmgContact, setFetchedEmgContact] = useState('');
    const [fetchedSkills, setFetchedSkills] = useState('');

    // State variable to store form input values
    const [state, setState] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        contactNumber: '',
        emgContact: '',
        skills: '',
        isCertaintyModalOpen: false,
        confirmSave: false,
        confimationMessage: 'Are you sure you want to save these changes? Note: Changing your email will log you out.'
    });

    const { isCertaintyModalOpen, confirmSave, confimationMessage } = state;

    // Use useEffect to store client data in local storage when it changes
    useEffect(() => {
        try {
            if (employeeData) {
                localStorage.setItem('employeeData', JSON.stringify(employeeData));
            }
        } catch (error) {
            console.error('Error storing employeeData in local storage:', error);
        }
    }, [employeeData]);

    // Initialize an object to store client data retrieved from local storage
    let storedEmployeeData = {};

    // Try to retrieve client data from local storage
    try {
        const storedData = localStorage.getItem('employeeData');
        if (storedData) {
            storedEmployeeData = JSON.parse(storedData);
        }
    } catch (error) {
        console.error('Error retrieving employeeData from local storage:', error);
    }

    // Handle input changes and update form modification status
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
        setIsFormModified(value.trim() !== '');
    };

    // Function to fetch employee information
    const fetchEmployeeInfo = useCallback(async () => {
        try {
            const employeeResponse = await fetch(`api/employees/employee-info/${storedEmployeeData.email}`);
            if (employeeResponse.ok) {
                const fetchedData = await employeeResponse.json();
                setFetchedFirstName(fetchedData[0].firstName);
                setFetchedLastName(fetchedData[0].lastName);
                setFetchedEmail(fetchedData[0].email);
                setFetchedContactNumber(fetchedData[0].contactNumber);
                setFetchedEmgContact(fetchedData[0].emgContact);
                setFetchedSkills(fetchedData[0].skills);
                setPrivateData({ type: 'employee', data: fetchedData[0] });
            } else {
                console.error('Failed to fetch client information:', employeeResponse.status);
            }
        } catch (error) {
            console.error('An error occurred while fetching client information:', error);
        }
    }, [setFetchedFirstName, setFetchedLastName, setFetchedEmail, setFetchedContactNumber, setFetchedEmgContact, setFetchedSkills, setPrivateData, storedEmployeeData.email]);

    // Use useEffect with fetchEmployeeInfo
    useEffect(() => {
        fetchEmployeeInfo();
    }, [fetchEmployeeInfo]);

    // Function to handle modal closing
    const closeCertaintyModalNo = () => {
        setState({ ...state, isCertaintyModalOpen: false, confirmSave: false });
    };

    // Function to handle modal closing
    const closeCertaintyModalYes = () => {
        setState({ ...state, isCertaintyModalOpen: false, confirmSave: true });
    };

    const handleSaveChanges = () => {   
        setState({ ...state, isCertaintyModalOpen: true });

        if (!confirmSave) {
            // User canceled the save operation
            return;
        }

        // Create an object to store the data to be sent
        const updatedData = {};
    
        // Add non-empty and non-null fields to the updatedData object
        if (state.firstName.trim() !== '') {
            updatedData.firstName = state.firstName;
        }
        if (state.lastName.trim() !== '') {
            updatedData.lastName = state.lastName;
        }
        if (state.email.trim() !== '') {
            updatedData.email = state.email;
        }
        if (state.password.trim() !== '') {
            updatedData.password = state.password;
        }
        if (state.contactNumber.trim() !== '') {
            updatedData.contactNumber = state.contactNumber;
        }
        if (state.emgContact.trim() !== '') {
            updatedData.emgContact = state.emgContact;
        }
        if (state.skills.trim() !== '') {
            updatedData.skills = state.skills;
        }
    
        // Check if there are fields to update
        if (Object.keys(updatedData).length === 0) {
            // No fields to update, exit early
            setIsFormModified(false);
            return;
        }
    
        // Send the updated data to the server
        fetch(`api/employees/edit-employee/${storedEmployeeData.email}`, {
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
        state.firstName = "";
        state.lastName = "";
        state.email = "";
        state.password = "";
        state.contactNumber = "";
        state.emgContact = "";
        state.skills = "";

        window.location.reload();
    };

    const certaintyModal = (
        <div className={`popup-modal ${isCertaintyModalOpen ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: isCertaintyModalOpen ? 'flex' : 'none' }}>
            <div className="popup-modal-dialog">
                <div className="popup-modal-content">
                    <div className="popup-modal-body">
                        <div className='popup-content'>
                            <div className='popup-modal-icon'>
                                <i class="fa-solid fa-circle-question"></i>
                            </div>
                            <div className='popup-details'>
                                <div className='popup-message'>
                                    <p>{confimationMessage}</p>
                                </div>
                            </div>
                            <div className='popup-btn-wrap'>
                                <div className='btn-no'>
                                    <button type="button" className="btn btn-danger" onClick={closeCertaintyModalNo}>No</button>
                                </div>
                                <div>
                                    <button type="button" className="btn btn-success" onClick={closeCertaintyModalYes}>Yes</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return(
        <>
            <EmployeeDashboardNav theFirstName={fetchedFirstName} theLastName={fetchedLastName} />
            <div className="employee-settings-wrapper">
                <div className="emp-main-heading">
                    <h2>Account Settings</h2>
                </div>
                <div className="emp-section-div">
                    <h3>Personal Details -</h3>
                </div>
                <div className='input-group' style={{ width: 'fit-content', margin: '0 auto' }}>
                    <div className='form-group'>
                        <input
                            type="text"
                            name="firstName"
                            placeholder={fetchedFirstName}
                            value={state.firstName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='form-group'>
                        <input
                            type="text"
                            name="lastName"
                            placeholder={fetchedLastName}
                            value={state.lastName}
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
                            type="number"
                            name="contactNumber"
                            placeholder={fetchedContactNumber}
                            value={state.contactNumber}
                            onChange={handleInputChange}
                        />
                    </div> 
                    <div className='form-group'>
                        <input
                            type="text"
                            name="emgContact"
                            placeholder={fetchedEmgContact}
                            value={state.emgContact}
                            onChange={handleInputChange}
                        />
                    </div>                    
                    <div className='form-group'>
                        <input
                            type="text"
                            name="skills"
                            placeholder={fetchedSkills}
                            value={state.skills}
                            onChange={handleInputChange}
                        />
                    </div>  
                    <div>
                        <button onClick={handleSaveChanges} disabled={!isFormModified} className="btn emp-btn-save">Save Changes</button>
                    </div>                  
                </div>

                {isCertaintyModalOpen && certaintyModal}

            </div>

        </>
    );
}