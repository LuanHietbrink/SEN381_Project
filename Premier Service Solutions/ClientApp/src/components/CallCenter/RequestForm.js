import React, { useEffect } from 'react';
import './style.css';
export function RequestForm(props) {

    function closeForm() {
        document.getElementById('request-form').hidden = true;
    }

    useEffect(() => {
        document.getElementById('details').focus();
    }, [])

    async function createRequest() {
        const clientId = props.selectedItem.clientId;
        const empId = document.getElementById('empNumber').value * 1;
        const requestDate = new Date();
        const requestDetails = document.getElementById('details').value;

        const data = { clientId, empId, requestDate, requestDetails };

        const res = await fetch('api/service-requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const message = await res.json();
        console.log(message);
    }

    return (
        <div className="container" id="request-form">
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">
                        <h4 className="modal-title">Request Details</h4>
                    </div>

                    <div className="modal-body my-2">
                        <form>
                            <label className="form-label" htmlFor="name">Name:</label>
                            <input className="form-control mb-3" type="text" id="name" value={props.selectedItem.clientName} readOnly></input>
                            <label className="form-label" htmlFor="name">Employee Number:</label>
                            <input className="form-control mb-2" type="number" id="empNumber" min="1" defaultValue="1"></input>
                            <label className="form-label" htmlFor="details">Details:</label>
                            <textarea className="form-control" rows="5" id="details" name="text"></textarea>
                        </form>
                    </div>

                    <div className="modal-footer mb-5">
                        <button type="button" onClick={() => { createRequest() }} className="btn btn-primary mx-1">Submit</button>
                        <button type="button" onClick={() => { closeForm() }} className="btn btn-danger mx-1">Cancel</button>
                    </div>

                </div>
            </div>
        </div>
    )
}