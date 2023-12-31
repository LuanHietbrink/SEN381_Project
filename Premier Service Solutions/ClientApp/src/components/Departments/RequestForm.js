import React, { useEffect } from 'react';
import './Dept Styles/CallCenter.css'
export function RequestForm(props) {

    function closeForm() {
        document.getElementById('request-form').hidden = true;
    }

    useEffect(() => {
        document.getElementById('details').focus();
    }, [])

    async function createRequest() {
        const clientId = props.selectedItem.clientId;
        const empId = null;
        const requestDate = new Date();
        const requestDetails = document.getElementById('details').value;
        const status = "Pending"
        const data = { clientId, empId, requestDate, requestDetails, status };

        const res = await fetch('api/service-requests/log-request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.status === 201) {
            alert('Submission was successful!');
            closeForm();
        } else {
            alert('Submission failed. Please try again.');
            console.log(res.status);
        }
        const message = await res.json();
        console.log(message);
    }

    return (
        <div className="tj-modal" id="request-form">
            <div className="tj-modal-dialog">
                <div className="tj-modal-content">

                    <div className="modal-header">
                        <h4 className="tj-modal-title">Request Details</h4>
                    </div>

                    <div className="tj-modal-body my-2">
                        <form>
                            <label className="form-label" htmlFor="name">Name:</label>
                            <input className="form-control mb-3" type="text" id="name" value={props.selectedItem.clientName} readOnly></input>
                            <label className="form-label" htmlFor="details">Details:</label>
                            <textarea className="form-control" rows="5" id="details" name="text"></textarea>
                        </form>
                    </div>

                    <div className="modal-footer mt-3">
                        <button type="button" onClick={() => { createRequest() }} className="btn btn-primary mx-1">Submit</button>
                        <button type="button" onClick={() => { closeForm() }} className="btn btn-danger mx-1">Cancel</button>
                    </div>

                </div>
            </div>
        </div>
    )
}