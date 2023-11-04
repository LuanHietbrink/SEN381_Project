import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../DataContext';
import "./Employee Styles/EmployeeAccSetup.css"

export function EmployeeAccSetup() {
    // Use the useNavigate hook to handle navigation
    const navigate = useNavigate();
    const { privateData, setPrivateData } = useData();
    const empData = privateData.data;
    const [validPassword, setValidPassword] = useState(true);
    const [validContactNumber, setValidContactNumber] = useState(true);
    const [validEmgContactNumber, setValidEmgContactNumber] = useState(true);

    // State variables to manage employee information
    const [state, setState] = useState({
        firstName: '',
        lastName: '',
        password: '',
        contactNumber: '',
        emgContact: '',
        skills: '',
        isInfoComplete: false,
        isDashboardVisible: false,
        isSuccessModalOpen: false,
        successMessage: null,
    });

    const { isSuccessModalOpen, successMessage } = state;

    // Use useEffect to store employee data in local storage when it changes
    useEffect(() => {
        try {
            if (empData) {
                localStorage.setItem('empData', JSON.stringify(empData));
            }
        } catch (error) {
            console.error('Error storing employeeData in local storage:', error);
        }
    }, [empData]);

    // Initialize an object to store employee data retrieved from local storage
    let storedEmployeeData = {};

    // Try to retrieve employee data from local storage
    try {
        const storedData = localStorage.getItem('empData');
        if (storedData) {
            storedEmployeeData = JSON.parse(storedData);
        }
    } catch (error) {
        console.error('Error retrieving employeeData from local storage:', error);
    }

    // Function to handle input changes
    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const closeSuccessModal = () => {
        setState({ ...state, isSuccessModalOpen: false });
    };

    // Function to check if employee information is complete
    const checkInfoCompleteness = () => {
        const { firstName, lastName, password, contactNumber, emgContact, skills } = state;
        const isInfoComplete = firstName && lastName && password && contactNumber && emgContact && skills;
        setState({ ...state, isInfoComplete });
    };

    // Use useEffect to check if employee information is complete
    useEffect(() => {
        checkInfoCompleteness();
    }, [state.firstName, state.lastName, state.password, state.contactNumber, state.emgContact, state.skills]);

    // Function to show the employee dashboard
    const handleShowEmployeeDashboard = () => {
        const { firstName, lastName, password, contactNumber, emgContact, skills } = state;

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
            newEmployeeData: {
                newFirstName: firstName,
                newLastName: lastName,
                newPassword: password,
                newContactNumber: contactNumber,
                newEmgContact: emgContact,
                newSkills: skills,
            },
        });

        const employeeData = {
            firstName,
            lastName,
            password,
            contactNumber,
            emgContact,
            skills,
        };

        // Function to update new employee details
        fetch(`/api/employees/edit-employee/${storedEmployeeData.email}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employeeData),
        })
            .then((response) => {
                if (response.ok) {
                    setState({ ...state, isDashboardVisible: true, successMessage: 'Your account setup is now complete!', isSuccessModalOpen: true });
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

    const successModal = (
        <div className={`popup-modal ${isSuccessModalOpen ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: isSuccessModalOpen ? 'flex' : 'none' }}>
            <div className="popup-modal-dialog">
                <div className="popup-modal-content">
                    <div className="popup-modal-body">
                        <div className='popup-content'>
                            <div className='popup-modal-icon'>
                                <i class="fa-solid fa-circle-check"></i>
                            </div>
                            <div className='popup-details'>
                                <div className='popup-heading'>
                                    <p>{successMessage}</p>
                                </div>
                            </div>
                            <div className='popup-btn-div'>
                                <button type="button" className="btn btn-popup" onClick={closeSuccessModal}>Ok</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

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
                                        value={state.firstName}
                                        onChange={handleChange}
                                        placeholder="First Name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={state.lastName}
                                        onChange={handleChange}
                                        placeholder="Last Name"
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
                                        name="contactNumber"
                                        value={state.contactNumber}
                                        onChange={handleChange}
                                        placeholder="Contact Number"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="emgContact"
                                        value={state.emgContact}
                                        onChange={handleChange}
                                        placeholder="Emergency Contact"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="skills"
                                        value={state.skills}
                                        onChange={handleChange}
                                        placeholder="Skills"
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
            {isSuccessModalOpen && successModal}
        </div>
    );
}
