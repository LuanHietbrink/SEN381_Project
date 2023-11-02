import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../DataContext';
import { useNavigate } from 'react-router-dom';
import "./ClientDashboardNav.css";

export default function ClientDashboardNav(props) {
    const navigate = useNavigate();
    const { privateData } = useData();
    const clientData = privateData.data;
    const menuRef = useRef(null);
    const theClientName = props.theClientName;
    const [isOpen, setIsOpen] = useState(false);
    const [hasServiceDetails, setHasServiceDetails] = useState(true);
    const [fetchedEndDate, setFetchedEndDate] = useState('');
    const [isAccountActive, setIsAccountActive] = useState(true);

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
    const fetchClientDetails = async () => {
        try {
            const clientResponse = await fetch(`api/clients/client-details/${storedClientData.email}`);
            if (clientResponse.ok) {
                const fetchedData = await clientResponse.json();
                if (Array.isArray(fetchedData) && fetchedData.length === 0) {
                    setHasServiceDetails(false);
                } else {
                    setHasServiceDetails(true);
                    const endDate = new Date(fetchedData[0].endDate);
                    const endDateOnly = endDate.toISOString().split('T')[0];
                    setFetchedEndDate(endDateOnly);
                }
            } else {
                console.error('Failed to fetch client details:', clientResponse.status);
            }
        } catch (error) {
            console.error('An error occurred while fetching client details:', error);
        }
    };

    // Use useEffect to fetch client details when storedClientData.email changes
    useEffect(() => {
        fetchClientDetails(storedClientData.email);
    }, [storedClientData.email]);

    // Function to check the account status based on the end date
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

    // Use useEffect to check the account status when fetchedEndDate changes
    useEffect(() => {
        checkAccountStatus();
    }, [fetchedEndDate]);

    return (
        <header className="client-header">
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
                        className={`client-burger-menu ${isOpen ? 'open' : ''}`}
                        onClick={toggleMenu}
                    >
                        <i class="fa-solid fa-arrow-left back-arrow" style={{fontSize: "30px"}}></i>
                        <ul className="menu">
                            {hasServiceDetails && isAccountActive && <li><a href="/maintenance-tab">Maintenance Tab</a></li>}
                            <li><a href="/services-offered">Services Offered</a></li>
                            <li className='client-account-settings'><a href="/client-account-settings"><i class="fa fa-gears"></i>  Account Settings</a></li>
                            <li className='client-logout-link'><a href="/" onClick={handleLogout}><i class="fa fa-sign-out"></i>  Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="header-center">
                <h1 className="heading"><a href="/client-dashboard">Premier Service Solutions</a></h1>
            </div>
            <div className="header-right">
                <p><a href="/client-account-settings">{theClientName || storedClientData.clientName}</a></p>
            </div>
        </header>
    );
}