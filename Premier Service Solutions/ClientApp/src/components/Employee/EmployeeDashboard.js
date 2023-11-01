import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeDashboardNav from '../Navigation/EmployeeNav/EmployeeDashboardNav';
import { useData } from '../DataContext';
import "./Employee Styles/EmployeeDashboard.css"

export function EmployeeDashboard() {
    // Access privateData and navigate functions from the DataContext
    const { privateData } = useData();
    const employeeData = privateData.data;
    const navigate = useNavigate();

    // State variables for email and modal visibility
    const [email, setEmail] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Use useEffect to store employee data in local storage when it changes
    useEffect(() => {
        try {
            if (employeeData) {
                localStorage.setItem('employeeData', JSON.stringify(employeeData));
            }
        } catch (error) {
            console.error('Error storing employeeData in local storage:', error);
        }
    }, [employeeData]);

    // Initialize an object to store employee data retrieved from local storage
    let storedEmployeeData = {};

    // Try to retrieve employee data from local storage
    try {
        const storedData = localStorage.getItem('employeeData');
        if (storedData) {
            storedEmployeeData = JSON.parse(storedData);
        }
    } catch (error) {
        console.error('Error retrieving employeeData from local storage:', error);
    }

    // Function to handle email input changes
    const handleInputChange = (e) => {
        setEmail(e.target.value);
    };

    // Function to add an employee
    const addEmployee = async () => {
        try {
            const response = await fetch('/api/employees/employee-signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setIsModalOpen(false);
                window.alert('Employee added successfully');
                setEmail('');
            } else {
                window.alert('Failed to add employee');
            }
        } catch (error) {
            console.error('Error adding employee:', error);
        }
    };

    const modalComponent = (
        <div className={`modal ${isModalOpen ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: isModalOpen ? 'block' : 'none' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className='modal-heading'>
                            <h5 className="modal-title">Add Employee</h5>
                        </div>
                        <div>
                            <button type="button" className="close-modal-button fa-solid fa-xmark" data-dismiss="modal" onClick={() => setIsModalOpen(false)}></button>
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className='input-group'>
                            <div className='form-group'>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-add" onClick={addEmployee}>Add Employee</button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <EmployeeDashboardNav />
            {storedEmployeeData.firstName !== null ? (
                <>
                    <h2>Employee Dashboard</h2>
                    <button onClick={() => setIsModalOpen(true)}>Add Employee</button>
                    {modalComponent}
                </>
            ) : (
                navigate('/account-setup', { replace: true })
            )}
        </div>
    );
}
