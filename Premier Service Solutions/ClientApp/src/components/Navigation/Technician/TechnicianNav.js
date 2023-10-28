import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../DataContext';
import './TechnicianNav.css';
import { useNavigate } from 'react-router-dom';

export default function TechnicianNav() {
    const { privateData } = useData();
    const clientData = privateData.data;
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            if (clientData) {
                localStorage.setItem('clientData', JSON.stringify(clientData));
            }
        } catch (error) {
            console.error('Error storing employeeData in local storage:', error);
        }
    }, [clientData]);

    let storedClientData = {};

    try {
        const storedData = localStorage.getItem('clientData');
        if (storedData) {
            storedClientData = JSON.parse(storedData);
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
                            <li><a href="/services-offered">Services Offered</a></li>
                            <li><a href="/" onClick={handleLogout}>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="header-center">
                <h1>Premier Service Solutions</h1>
            </div>
            <div className="header-right">
                <p>{storedClientData.clientName}</p>
            </div>
        </header>
    );
}
