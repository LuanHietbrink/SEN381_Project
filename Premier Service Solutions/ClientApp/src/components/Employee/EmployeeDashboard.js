import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeDashboardNav from '../Navigation/EmployeeNav/EmployeeDashboardNav';
import { useData } from '../DataContext';
import "./Employee Styles/EmployeeDashboard.css"

export function EmployeeDashboard() {
    // Access privateData and navigate functions from the DataContext
    const { privateData } = useData();
    const employeeData = privateData.data;
    const navigate = useNavigate();

    // State variables for email and modal visibility
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
    const [filteredServiceRequests, setFilteredServiceRequests] = useState([]);

    // Use useEffect to store employee data in local storage when it changes
    useEffect(() => {
        try {
            if (employeeData) {
                localStorage.setItem('employeeData', JSON.stringify(employeeData));
            }
        } catch (error) {
            console.error('Error storing employeeData in local storage:', error);
        }
    }, [employeeData]);

    // Initialize an object to store employee data retrieved from local storage
    let storedEmployeeData = {};

    // Try to retrieve employee data from local storage
    try {
        const storedData = localStorage.getItem('employeeData');
        if (storedData) {
            storedEmployeeData = JSON.parse(storedData);
        }
    } catch (error) {
        console.error('Error retrieving employeeData from local storage:', error);
    }

    // Function to report an issue
    const reportIssue = async () => {
        setIsIssueModalOpen(true);
    };

    // Function to fetch employee details and filter service requests
    const fetchEmployeeDetails = async (email) => {
        try {
            const empInfoResponse = await fetch(`/api/employees/employee-info/${email}`);
            if (empInfoResponse.ok) {
                const empInfoData = await empInfoResponse.json();
                const empId = empInfoData[0].empId;

                const serviceRequestsResponse = await fetch('/api/service-requests');

                if (serviceRequestsResponse.ok) {
                    const serviceRequestsData = await serviceRequestsResponse.json();
                    const filteredRequests = serviceRequestsData.filter(
                        (request) => request.empId === empId
                    );

                    setFilteredServiceRequests(filteredRequests);
                }
            }
        } catch (error) {
            console.error('Error fetching employee details:', error);
        }
    };

    useEffect(() => {
        if (storedEmployeeData.email) {
            fetchEmployeeDetails(storedEmployeeData.email);
        }
    }, [storedEmployeeData.email]);

    const formatDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Date(date).toLocaleDateString(undefined, options);
        return formattedDate;
    };

    const reportIssueModal = (
        <div className={`modal ${isIssueModalOpen ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: isIssueModalOpen ? 'block' : 'none' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className='modal-heading'>
                            <h5 className="modal-title">Report Issue</h5>
                        </div>
                        <div>
                            <button type="button" className="close-modal-button fa-solid fa-xmark" data-dismiss="modal" onClick={() => setIsIssueModalOpen(false)}></button>
                        </div>
                    </div>
                        <div className="modal-form">                    
                            <input
                                type="text"
                                name="issueTitle"
                                // value={formData.name}
                                readOnly
                                placeholder="Issue Title"
                            />

                            <textarea
                                name="issueDescription"
                                // value={formData.description}
                                readOnly
                                placeholder="Issue Description"
                            />
                        </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-add" onClick={reportIssue}>Report</button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <EmployeeDashboardNav />
            <div className='emp-dash-wrapper'>
                {storedEmployeeData.firstName !== null ? (
                    <>
                        <div className='emp-dash-heading'>
                            <h1>Employee Dashboard</h1>
                        </div>

                        <div style={{display: "flex", justifyContent: "center"}}><hr style={{width: "50%"}}></hr></div>

                        <div className='assigned-job-wrapper'>
                            <div>
                                <h2>
                                    Assigned Jobs
                                </h2>
                            </div>
                            <div className="assigned-job-list">
                            {filteredServiceRequests.length > 0 ? (
                                filteredServiceRequests.map((request) => (
                                    <div key={request.requestId} className="assigned-job" onClick={() => setIsIssueModalOpen(true)}>
                                        <h5>
                                            #{request.requestId} | {request.requestDetails}
                                        </h5>
                                        <div className="assigned-job-content" title='View Details'>
                                            <p>
                                                Request for client <b>#{request.clientId}</b> requested on <b>{formatDate(request.requestDate)}</b> is <b>{request.status}.</b>
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                    <p><em>You have no assigned jobs.</em></p>
                                )
                            }
                            </div>   
                        </div>   

                        {reportIssueModal}
                    </>
                ) : (
                    navigate('/account-setup', { replace: true })
                )}
            </div>
        </>
    );
}