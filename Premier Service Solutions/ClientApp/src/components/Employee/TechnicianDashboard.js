import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeDashboardNav from '../Navigation/EmployeeNav/EmployeeDashboardNav';
import { useData } from '../DataContext';
import "./Employee Styles/TechnicianDashboard.css"
import Messaging from '../Messaging';
import axios from 'axios';
export function TechnicianDashboard() {
    // Access privateData and navigate functions from the DataContext
    const { privateData } = useData();
    const employeeData = privateData.data;
    const navigate = useNavigate();

    // State variables for email and modal visibility
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);

    const [filteredServiceRequests, setFilteredServiceRequests] = useState([]);

    const [selectedServiceRequest, setSelectedServiceRequest] = useState(null);
    const [newStatus, setNewStatus] = useState('');

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
    const reportIssue = async (request) => {
        setSelectedServiceRequest(request);
        setIsIssueModalOpen(true);
    };
    
    const updateStatus = async (selectedRequest, newStatus) => {
        try {
            const requestId = selectedRequest.requestId;

            let confirmationMessage = "Are you sure you want to do this action ? It cannot be undone !";
            const isConfirmed = window.confirm(confirmationMessage);

            if (isConfirmed) {
                const response = await axios.put(
                    `/api/service-requests/edit-request/${requestId}`,{Status:newStatus});
                    console.log(response)

                if(response.status==200){
                    window.alert("Successfully updated Job Status !")
                    setIsIssueModalOpen(false)
                    window.location.reload();
                }
                else{
                    window.alert("Error Updating Job Status")

                }
            }
        } catch (error) {
         console.log("An eror has occured, please try again",error)   
         window.alert("Error Updating Job Status")
        }
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
                        (request) => request.empId === empId && request.status !== 'Completed'
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
                        <h5 className="modal-title">Complete Job</h5>
                    </div>
                    <div>
                        <button type="button" className="close-modal-button fa-solid fa-xmark" data-dismiss="modal" onClick={() => setIsIssueModalOpen(false)}></button>
                    </div>
                </div>
                    <div className="modal-form">   
                        <div className="buttons-container">           
                            <button type="button" className="btn-completed" onClick={() => updateStatus(selectedServiceRequest, 'Completed')}>Complete Job</button>
                            <button type="button" className="btn-delay" onClick={() => updateStatus(selectedServiceRequest, 'Delayed')}>Delay Job</button>
                        </div>
                    </div>
                <div className="modal-footer">
                <button type="button" className="btn btn-add" onClick={() => {setIsIssueModalOpen(false); }}>Close</button>                </div>
            </div>
        </div>
    </div>
);

    const chatModal = (
        
        <div className={`modal ${isChatModalOpen ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: isChatModalOpen ? 'block' : 'none' }}>
    <div className={`modal-dialog ${isChatModalOpen ? 'modal-bigger' : ''}`} role="document">            
            <div className="modal-content" >
                <div className="modal-header">
                    <div className='modal-heading'>
                    </div>
                    <div>
                        <button type="button" className="close-modal-button fa-solid fa-xmark" data-dismiss="modal" onClick={() => setIsChatModalOpen(false)}></button>
                    </div>
                </div>
                    <div className="modal-form">                    
                    {isChatModalOpen && <Messaging userId={storedEmployeeData.empId} />}                    
                    </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-add" onClick={()=>setIsChatModalOpen(false)}>Close</button>
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
                            <h1>Technician Dashboard</h1>
                        </div>
                        
                        <div style={{display: "flex", justifyContent: "center"}}><hr style={{width: "50%"}}></hr></div>
                    
                        <div class="draggable-container">
                            <button class="message-button" onClick={() => setIsChatModalOpen(true)}>
                            </button>
                        </div>

                        <div className='assigned-job-wrapper'>
                            <div>
                                <h2>
                                    Assigned Jobs
                                </h2>
                            </div>
                            <div className="assigned-job-list">
                            {filteredServiceRequests.length > 0 ? (
                                filteredServiceRequests.map((request) => (
                                    <div key={request.requestId} className="assigned-job" onClick={() => reportIssue(request)}  title='View Details'>
                                        <h5>
                                            #{request.requestId} | {request.requestDetails}
                                        </h5>
                                        <div className="assigned-job-content">
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
                        {chatModal}
                    </>
                ) : (
                    navigate('/account-setup', { replace: true })
                )}
            </div>
        </>
    );
}


  

    
