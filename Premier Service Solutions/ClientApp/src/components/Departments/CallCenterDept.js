import React, { useEffect, useState } from 'react';
import { CustomerList } from './CustomerList.js';
import { Link } from 'react-router-dom';
import EmployeeDashboardNav from '../Navigation/EmployeeNav/EmployeeDashboardNav.js';
import './Dept Styles/CallCenter.css'
export function CallCenterDept() {
    let [clients, setClients] = useState([]);
    let [search, setSearch] = useState('');
    let [isActiveCall, setIsActiveCall] = useState(false);
    let [callDuration, setCallDuration] = useState(0);

    useEffect(() => {
        if (isActiveCall) {
            setTimeout(() => {
                setCallDuration(callDuration + 1);
            }, 1000);
        } else {
            setCallDuration(0);
        }
    }, [isActiveCall, callDuration]);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch('api/clients');
            const data = await res.json();
            setClients(data);
        }

        fetchData();
    }, []);

    function searchChange() {
        setSearch(document.getElementById('searchClient').value);
    }

    function callClick() {
        const btn = document.getElementById('answerCall');

        if (!btn.classList.contains('callCenterBtnClicked')) {
            btn.classList.add('callCenterBtnClicked');
            btn.innerHTML = "End Call";
            setIsActiveCall(true);
        } else {
            btn.classList.remove('callCenterBtnClicked');
            btn.innerHTML = "Answer call";
            setIsActiveCall(false);
            setCallDuration(0);
        }
    }

    return (
        <>
            <EmployeeDashboardNav/>
            
            <div className="container">
                <h2>Call Center Dashboard</h2>
                <hr />
            </div>
            <div className="container">
                <div className="row my-5">
                    <div className="col">
                        <button
                            id="answerCall"
                            className="callCenterBtn mb-5"
                            onClick={callClick}
                        >
                            Answer call
                        </button>
                        {callDuration > 0 ? (
                            <p>Call duration: {callDuration} seconds</p>
                        ) : (
                            <></>
                        )}

                        
                    </div>
                    
                </div>

                <input
                    id="searchClient"
                    onChange={searchChange}
                    className="searchBox mb-5"
                    placeholder="Search by Name or Cellphone"
                ></input>


                {
                    clients.length !== 0 ? (
                        search === '' ? (
                            <CustomerList data={clients} />
                        ) : (
                            <CustomerList
                                data={clients.filter((client) => {
                                    return (
                                        client.clientName.includes(search) ||
                                        client.contactNumber.includes(search)
                                    );
                                })}
                            />
                        )
                    ) : (
                        <></>
                    )
                    
                }
            </div>
        </>
    );
}
