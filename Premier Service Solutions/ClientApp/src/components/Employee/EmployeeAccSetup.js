import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../DataContext';

export function EmployeeAccSetup() {
    const navigate = useNavigate();
    const { privateData, setPrivateData } = useData();
    const empData = privateData.data;

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

    useEffect(() => {
        try {
            if (empData) {
                localStorage.setItem('empData', JSON.stringify(empData));
            }
        } catch (error) {
            console.error('Error storing employeeData in local storage:', error);
        }
    }, [empData]);

    let storedEmployeeData = {};

    try {
        const storedData = localStorage.getItem('empData');
        if (storedData) {
            storedEmployeeData = JSON.parse(storedData);
        }
    } catch (error) {
        console.error('Error retrieving employeeData from local storage:', error);
    }

    console.log(storedEmployeeData.email);

    useEffect(() => {
        checkInfoCompleteness();
    }, [state.firstName, state.lastName, state.password, state.contactNumber, state.emgContact, state.skills]);

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const checkInfoCompleteness = () => {
        const { firstName, lastName, password, contactNumber, emgContact, skills } = state;
        const isInfoComplete = firstName && lastName && password && contactNumber && emgContact && skills;
        setState({ ...state, isInfoComplete });
    };

    const handleShowEmployeeDashboard = () => {
        const { firstName, lastName, password, contactNumber, emgContact, skills } = state;

        // Update privateData with the new information
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

                    <button onClick={handleShowEmployeeDashboard} disabled={!isInfoComplete}>
                        Save
                    </button>
                </div>
            )}
        </div>
    );
}
