import React, { useState } from 'react';
import { RequestForm } from './RequestForm';
import './Dept Styles/CallCenter.css'
import ServiceRequestsModal from './ServiceRequestModal';
export function CustomerList(props) {

    let [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

    function handleClick(client) {
        setShowModal(true);
        setSelectedItem(client);
        if (selectedItem != null) {
            document.getElementById('request-form').hidden = false;
            document.getElementById('details').focus();
        }
    }

    return (
        <>
            <div className="customer-list container">
                {props.data.map((client) => (
                    <div className="customer-list-item" key={client.clientId}>
                        <h6>{client.clientName}</h6>
                        <p>Email: {client.email}</p>
                        <p>Contact: {client.contactNumber}</p>
                        <button onClick={() => { handleClick(client) }} className="btn btn-outline-secondary listBtn">Capture details</button>
                    </div>
                ))}
            </div>
            {selectedItem != null ? (<RequestForm selectedItem={selectedItem}  />) : (<></>)}

            {showModal && (
                <ServiceRequestsModal
                    userId={selectedItem.clientId}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    )
}
