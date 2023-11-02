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
    });

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
        <div>
            {isDashboardVisible ? (
                navigate('/', { replace: true })
            ) : (
                <div>
                    <h2>Please finish setting up your account</h2>
                    <form>
                        <label>
                            First Name:
                            <input type="text" name="firstName" value={state.firstName} onChange={handleChange} required />
                        </label>
                        <br />
                        <label>
                            Last Name:
                            <input type="text" name="lastName" value={state.lastName} onChange={handleChange} required />
                        </label>
                        <br />
                        <label>
                            Password:
                            <input type="password" name="password" value={state.password} onChange={handleChange} required />
                        </label>
                        <br />
                        <label>
                            Contact Number:
                            <input type="text" name="contactNumber" value={state.contactNumber} onChange={handleChange} required />
                        </label>
                        <br />
                        <label>
                            Emergency Contact:
                            <input type="text" name="emgContact" value={state.emgContact} onChange={handleChange} required />
                        </label>
                        <br />
                        <label>
                            Skills:
                            <input type="text" name="skills" value={state.skills} onChange={handleChange} required />
                        </label>
                    </form>

                    <div className='error-div'>
                        {!validPassword && (
                            <p style={{ color: "red" }}>
                                Password must be at least 8 characters long, include uppercase and lowercase letters, numbers, special characters, and not contain sequential or repeated characters.
                            </p>
                        )}  
                    </div>

                    <button onClick={handleShowEmployeeDashboard} disabled={!isInfoComplete}>
                        Save
                    </button>
                </div>
            )}
        </div>
    );
}