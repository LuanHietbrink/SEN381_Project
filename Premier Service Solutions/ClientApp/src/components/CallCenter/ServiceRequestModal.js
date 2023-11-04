import React, { useState, useEffect } from 'react';

const ServiceRequestsModal = ({ userId, onClose }) => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        // Fetch service requests for the user with the given userId
        async function fetchUserRequests() {
            const res = await fetch(`api/service-requests/client-requests/${userId}`);
            const data = await res.json();
            setRequests(data);
        }

        fetchUserRequests();
    }, [userId]);

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Service Requests for User {userId}</h2>
                <hr />
                {Array.isArray(requests) && requests.length > 0 ? (
                    requests.map((request) => (
                        <div key={request.id}>
                            <h4>Request ID: {request.requestId}</h4>
                            <p>Details: {request.requestDetails}</p>
                            <p>Status: {request.status}</p>
                        </div>
                    ))
                ) : (
                    <p>No service requests found for this user.</p>
                )}
            </div>
        </div>
    );
};

export default ServiceRequestsModal;
