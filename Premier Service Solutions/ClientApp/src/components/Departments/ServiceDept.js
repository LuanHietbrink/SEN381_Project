import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EmployeeDashboardNav from '../Navigation/EmployeeNav/EmployeeDashboardNav';
import './Dept Styles/Service.css';

export function ServiceDept() {
    const [isEscalateJobsModalOpen, setEscalateJobsModalOpen] = useState(false);
    const [statistics, setStatistics] = useState({
        totalServiceRequests: 0,
        totalOpenServiceRequests: 0,
        totalAssignedJobs: 0,
        techniciansAvailable: 0,
    });

    // Function to open the "Escalate Jobs" modal
    const openEscalateJobsModal = () => {
        setEscalateJobsModalOpen(true);
    };

    // Function to close the "Escalate Jobs" modal
    const closeEscalateJobsModal = () => {
        setEscalateJobsModalOpen(false);
    };

    useEffect(() => {
        // Fetch data from the API
        fetch('api/service-requests')
            .then((response) => response.json())
            .then((data) => {
                // Calculate statistics
                const totalServiceRequests = data.length;
                const totalOpenServiceRequests = data.filter(request => request.status === "In Progress").length;
                const totalAssignedJobs = data.filter(request => request.empId !== null).length;
                const techniciansAvailable = data.filter(request => request.status === "Completed").length;

                // Update the statistics state
                setStatistics({
                    totalServiceRequests,
                    totalOpenServiceRequests,
                    totalAssignedJobs,
                    techniciansAvailable,
                });
            })
            .catch((error) => {
                console.error('Error fetching data from the API', error);
            });
    }, []);

    return (
        <>
            <EmployeeDashboardNav />
            <div className='service-wrapper'>
                <div className="center-head">
                    <h1><b>Service Dashboard</b></h1>
                </div>
                <div className="button-container">
                    <Link to="/jobs-list">
                        <button className="servcie-button">View Jobs</button>
                    </Link>
                    <button className="servcie-button" onClick={openEscalateJobsModal}>
                        Escalate Job
                    </button>
                </div>
                <h1 className="center-head">Job Statistics</h1>
                <div className="display">
                    <div className="stat-container">
                        <p className="titles">Total Service Requests:</p>
                        <input type="text" id="jobId" name="jobId" readOnly value={statistics.totalServiceRequests} />
                    </div>
                    <div className="stat-container">
                        <p className="titles">Open Service Requests:</p>
                        <input type="text" id="jobId" name="jobId" readOnly value={statistics.totalOpenServiceRequests} />
                    </div>
                    <div className="stat-container">
                        <p className="titles">Total Assigned Jobs:</p>
                        <input type="text" id="jobId" name="jobId" readOnly value={statistics.totalAssignedJobs} />
                    </div>
                    <div className="stat-container">
                        <p className="titles">Technicians Available:</p>
                        <input type="text" id="jobId" name="jobId" readOnly value={statistics.techniciansAvailable} />
                    </div>
                </div>

                {isEscalateJobsModalOpen && (
                    <div className="tj-modal">
                        <div className="tj-modal-content">
                            <p className="assign-">Escalate Jobs</p>
                            <button className="back-button-" onClick={closeEscalateJobsModal}>
                                Close
                            </button>
                            <div className="label-and-select">
                                <label
                                    htmlFor="jobDropdown"
                                    style={{ fontSize: '25px', fontWeight: 'bold' }}
                                >
                                    Priority:
                                </label>
                                <select className="jobDropdown" name="jobDropdown">
                                    <option value="job1">Low</option>
                                    <option value="job2">Medium</option>
                                    <option value="job3">High</option>
                                </select>
                            </div>
                            <div className="buttons">
                                <button className="select-button-" onClick={closeEscalateJobsModal}>
                                    Select
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}