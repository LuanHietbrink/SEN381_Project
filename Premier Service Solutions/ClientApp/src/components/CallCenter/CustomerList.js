import React, { useState } from 'react';
import { RequestForm } from './RequestForm';
import './style.css';

export function CustomerList(props) {

    let [selectedItem, setSelectedItem] = useState(null);

    function handleClick(client) {
        setSelectedItem(client);
        if (selectedItem != null) {
            document.getElementById('request-form').hidden = false;
        }
    }

    return (
        <>
            <div className="customer-list container mb-5">
                {props.data.map((client) => (
                    <div className="customer-list-item" key={client.clientId}>
                        <h6>{client.clientName}</h6>
                        <p>Email: {client.email}</p>
                        <p>Contact: {client.contactNumber}</p>
                        <button onClick={() => { handleClick(client) }} className="btn btn-outline-secondary listBtn">Capture details</button>
                    </div>
                ))}
            </div>
            {selectedItem != null ? (<RequestForm selectedItem={selectedItem} />) : (<></>)}
        </>
    )
}