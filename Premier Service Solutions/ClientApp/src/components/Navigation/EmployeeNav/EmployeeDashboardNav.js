import React, { useState, useEffect, useRef } from 'react';
import './EmployeeDashboardNav.css';
import { useData } from '../../DataContext';
import { useNavigate } from 'react-router-dom';

export default function EmployeeDashboardNav(props) {
    const { privateData } = useData();
    const employeeData = privateData.data;
    const theFirstName = props.theFirstName;
    const theLastName = props.theLastName;
    const [isOpen, setIsOpen] = useState(false);
    const [employeeType, setEmployeeType] = useState('');
    const menuRef = useRef(null);
    const navigate = useNavigate();

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

    // Function to toggle the menu visibility
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Function to handle clicks outside the menu to close it
    const handleDocumentClick = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    };

    // Use useEffect to add and remove event listeners for handling document clicks
    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    // Function to handle user logout
    const handleLogout = () => {
        navigate('/', { replace: true });
        window.location.reload();
    };

    // Function to fetch client details from the server
    const fetchEmployeeDetails = async () => {
        try {
            const employeeResponse = await fetch(`api/employees/employee-info/${storedEmployeeData.email}`);
            if (employeeResponse.ok) {
                const fetchedData = await employeeResponse.json();
                if (Array.isArray(fetchedData) && fetchedData.length !== 0) {
                    setEmployeeType(fetchedData[0].employeeType);
                }
            } else {
                console.error('Failed to fetch employee details:', employeeResponse.status);
            }
        } catch (error) {
            console.error('An error occurred while fetching employee details:', error);
        }
    };

    // Use useEffect to fetch client details when storedClientData.email changes
    useEffect(() => {
        fetchEmployeeDetails(storedEmployeeData.email);
    }, [storedEmployeeData.email]);

    return (
        <header className="header">
            <div className="header-left">
                <div ref={menuRef}>
                    <div
                        className={`menu-button ${isOpen ? 'hidden' : ''}`}
                        onClick={toggleMenu}
                    >
                        <div className="menu-burger-icon">
                            <div className="menu-bar"></div>
                            <div className="menu-bar"></div>
                            <div className="menu-bar"></div>
                        </div>
                    </div>
                    <div
                        className={`burger-menu ${isOpen ? 'open' : ''}`}
                        onClick={toggleMenu}
                    >
                        <i class="fa-solid fa-arrow-left back-arrow" style={{fontSize: "30px"}}></i>
                        <ul className="menu">
                            <li><a href="/service-department">Service Dept.</a></li>
                            <li><a href="/call-center">Call Center Dept.</a></li>
                            <li><a href="/contract-maintenance">Contract Maintenance Dept.</a></li>
                            <li><a href="/client-maintenance">Client Maintenance Dept.</a></li>
                            <li><a href="/technician-dashboard">My Jobs</a></li>
                            {employeeType === 'Manager' && (
                                <li><a href="/employee-management">Employee Management</a></li>
                            )}
                            <li className='emp-account-settings'><a href="/employee-account-settings"><i class="fa fa-gears"></i>  Account Settings</a></li>
                            <li className='emp-logout-link'><a href="/" onClick={handleLogout}><i class="fa fa-sign-out"></i>  Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="header-center">
                <h1 className="heading"><a href="/employee-dashboard">Premier Service Solutions</a></h1>
            </div>
            <div className="header-right">
                <p><a href="/employee-account-settings">{theFirstName || storedEmployeeData.firstName} {theLastName || storedEmployeeData.lastName}</a></p>
            </div>
        </header>

    );
}