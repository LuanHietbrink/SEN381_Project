import React, { useState, useEffect } from "react";
import { useData } from '../DataContext';
import ClientDashboardNav from "../Navigation/ClientNav/ClientDashboardNav";
import "./Client Styles/MaintenanceTab.css"

export function MaintenanceTab() {
    // Access privateData from the DataContext
    const { privateData } = useData();
    const clientData = privateData.data;

    // State variables to store fetched request data and track form modifications
    const [fetchedRequestData, setFetchedRequestData] = useState([]);
    const [isFormModified, setIsFormModified] = useState(false);

    // State variable to store input values
    const [state, setState] = useState({
        newRequestDetails: '',

        isErrorModalOpen: false,
        isSuccessModalOpen: false,
        error: null,
        successMessage: null,
    });

    const { isErrorModalOpen, isSuccessModalOpen, error, successMessage } = state;

    // Use useEffect to store client data in local storage when it changes
    useEffect(() => {
        try {
            if (clientData) {
                localStorage.setItem('clientData', JSON.stringify(clientData));
            }
        } catch (error) {
            console.error('Error storing clientData in local storage:', error);
            setState({ ...state, error: 'Error storing clientData in local storage.', isErrorModalOpen: true });
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
        setState({ ...state, error: 'Error retrieving clientData from local storage.', isErrorModalOpen: true });
    }

    // Handle input changes and update form modification status
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
        setIsFormModified(value.trim() !== '');
    };

    // Function to fetch client request details
    const fetchClientDetails = async () => {
        try {
            const clientResponse = await fetch(`api/clients/client-details/${storedClientData.email}`);
            if (clientResponse.ok) {
                const fetchedData = await clientResponse.json();
                if (Array.isArray(fetchedData) && fetchedData.length > 0) {
                    fetchedData.sort((a, b) => new Date(a.requestDate) - new Date(b.requestDate));
                    setFetchedRequestData(fetchedData);
                } else {
                    setFetchedRequestData([]);
                }
            } else {
                console.error('Failed to fetch client details:', clientResponse.status);
                setState({ ...state, error: 'Failed to fetch client details.', isErrorModalOpen: true });
            }
        } catch (error) {
            console.error('An error occurred while fetching client details:', error);
            setState({ ...state, error: 'An error occurred while fetching client details.', isErrorModalOpen: true });
        }
    };

    // Use useEffect to fetch client details when the email changes
    useEffect(() => {
        fetchClientDetails(storedClientData.email);
    }, [storedClientData.email]);

    // Function to handle modals
    const closeErrorModal = () => {
        setState({ ...state, isErrorModalOpen: false });
    };
    const closeSuccessModal = () => {
        setState({ ...state, isSuccessModalOpen: false });
    };

    // Function to log a new maintenance request
    const logRequest = async () => {
        // Check if the requestDetails is not empty
        if (state.newRequestDetails.trim() !== '') {
            try {
                const response = await fetch('api/service-requests/log-request', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        clientId: fetchedRequestData[0].clientId,
                        requestDetails: state.newRequestDetails,
                        status: "Pending"
                    }),
                });

                if (response.ok) {
                    console.log('Request successfully logged.');
                    setState({ ...state, successMessage: 'Request successfully logged!', isSuccessModalOpen: true });
                    fetchClientDetails(storedClientData.email);
                    state.newRequestDetails = '';
                } else {
                    console.error('Failed to log request:', response.status);
                    setState({ ...state, error: 'Failed to log request.', isErrorModalOpen: true });
                }
            } catch (error) {
                console.error('An error occurred while logging the request:', error);
                setState({ ...state, error: 'An error occurred while logging the request.', isErrorModalOpen: true });

            }
        } else {
            console.log('Request details cannot be empty.');
            setState({ ...state, error: 'Request details cannot be empty.', isErrorModalOpen: true });
        }
    };

    const errorModal = (
        <div className={`popup-modal ${isErrorModalOpen ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: isErrorModalOpen ? 'flex' : 'none' }}>
            <div className="popup-modal-dialog">
                <div className="popup-modal-content">
                    <div className="popup-modal-body">
                        <div className='popup-content'>
                            <div className='popup-modal-icon'>
                                <i class="fa-solid fa-triangle-exclamation"></i>
                            </div>
                            <div>
                                <div className='popup-heading'>
                                    <p>Error!</p>
                                </div>
                                <div className='popup-message'>
                                    <p style={{ color: "red", textAlign: "center" }}>{error}</p>
                                </div>
                            </div>
                            <div className='popup-btn-div'>
                                <button type="button" className="btn btn-popup" onClick={closeErrorModal}>Ok</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

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

    return(
        <>
            <ClientDashboardNav />
            <div className="maintenance-wrapper">
                <div className="request-wrapper">
                    <div className="request-heading">
                        <h2>Maintenance Request</h2>
                    </div>
                    <div className="input-group">
                        <div className='form-group request-details'>
                            <label htmlFor="newRequestDetails">Request Details:</label>
                            <textarea 
                                class="form-control" 
                                rows="5" 
                                cols="50"
                                type="text"
                                name="newRequestDetails"
                                placeholder="Please detail your request."
                                value={state.newRequestDetails}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                        <div>
                            <button className="btn btn-request" onClick={logRequest} disabled={!isFormModified}>Log Request</button>
                        </div>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", height: "100%", width: "1px", border: "1px solid gray"}}><hr style={{height: "200px"}}></hr></div>

                <div className="request-history">
                    <div className="request-heading">
                        <h2>Request History</h2>
                    </div>
                    <div className="request-history-details">
                        <table className="request-history-table">
                            <thead>
                                <tr>
                                    <th>Request ID</th>
                                    <th>Request Date</th>
                                    <th>Request Details</th>
                                    <th>Request Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fetchedRequestData.map((request, index) => (
                                    <tr key={index}>
                                        <td>{request.requestId || "n/a"}</td>
                                        <td>{request.requestDate ? new Date(request.requestDate).toLocaleDateString() : "n/a"}</td>
                                        <td>{request.requestDetails || "n/a"}</td>
                                        <td>{request.status || "n/a"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {isErrorModalOpen && errorModal}
                {isSuccessModalOpen && successModal}
            </div>
        </>
    );
}