import React, { useState, useEffect, useRef } from 'react';
import './EmployeeDashboardNav.css';
import { useData } from '../../DataContext';
import { useNavigate } from 'react-router-dom';

export default function EmployeeDashboardNav() {
    const { privateData } = useData();
    const employeeData = privateData.data;
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            if (employeeData) {
                localStorage.setItem('employeeData', JSON.stringify(employeeData));
            }
        } catch (error) {
            console.error('Error storing employeeData in local storage:', error);
        }
    }, [employeeData]);

    let storedEmployeeData = {};

    try {
        const storedData = localStorage.getItem('employeeData');
        if (storedData) {
            storedEmployeeData = JSON.parse(storedData);
        }
    } catch (error) {
        console.error('Error retrieving employeeData from local storage:', error);
    }

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleDocumentClick = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    const handleLogout = () => {
        navigate('/', { replace: true });
        window.location.reload();
    };

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
                        <div className="burger-icon">
                            <div className="bar"></div>
                            <div className="bar"></div>
                            <div className="bar"></div>
                        </div>
                        <ul className="menu">
                            <li><a href="/service-department">Service Dept.</a></li>
                            <li><a href="/call-center">Call Center Dept.</a></li>
                            <li><a href="/contract-maintenance">Contract Maintenance Dept.</a></li>
                            <li><a href="/client-maintenance">Client Maintenance Dept.</a></li>
                            <li><a href="/" onClick={handleLogout}>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="header-center">
                <h1>Premier Service Solutions</h1>
            </div>
            <div className="header-right">
                <p>{storedEmployeeData.firstName} {storedEmployeeData.lastName}</p>
            </div>
        </header>
    );
}
