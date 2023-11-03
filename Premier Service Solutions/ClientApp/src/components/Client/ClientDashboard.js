import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../DataContext';
import ClientDashboardNav from '../Navigation/ClientNav/ClientDashboardNav';

export function ClientDashboard() {
    // Use the useNavigate hook to handle navigation
    const navigate = useNavigate();
    const { privateData, setPrivateData } = useData();
    const cltData = privateData.data;

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

  return (
    <>
        {storedClientData.clientName !== null ? (
            <>
                <ClientDashboardNav />
                <div className='client-dash-wrapper'>

                </div>
            </>
        ) : (
            navigate('/client-account-setup', { replace: true })
        )}
    </>
  );
}