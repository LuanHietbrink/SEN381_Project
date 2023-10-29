import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./Dept Styles/Service.css";

export class ServiceDept extends Component {
    static displayName = ServiceDept.name;
    constructor(props) {
        super(props);

        this.state = {
            user: {
                username: 'John Doe',
                profilePicture: '/profile.jpg'
            },
            isTrackJobsModalOpen: false, // Add a state variable for the modal
        }
    };

    // Function to open the "Track Jobs" modal
    openTrackJobsModal = () => {
        this.setState({ isTrackJobsModalOpen: true });
    }

    // Function to close the modal
    closeTrackJobsModal = () => {
        this.setState({ isTrackJobsModalOpen: false });
    }

    // Function to open the "Track Jobs" modal
    openEscalateJobsModal = () => {
        this.setState({ isEscalateJobsModalOpen: true });
    }

    // Function to close the modal
    closeEscalateJobsModal = () => {
        this.setState({ isEscalateJobsModalOpen: false });
    }

    render() {
        return (
            <div>
                <h1 className="center">Premier Service Solutions</h1>
                <div className="user-info">
                    <span>Hello, {this.state.user.username}</span>
                    <img
                        src={this.state.user.profilePicture}
                        alt="Profile"
                        className="profile-picture"
                    />
                </div>
                <div className="left-align">
                    <h2>Service Dashboard</h2>
                    <div className="line"></div>
                </div>
                <div className="button-container">
                    <Link to="/jobs-list">
                        <button className="servcie-button">View Jobs</button>
                    </Link>
                    <button className="servcie-button" onClick={this.openTrackJobsModal}>Track Jobs</button>
                    <button className="servcie-button" onClick={this.openEscalateJobsModal}>Escalate Job</button>
                </div>
                <h1 className="center-head">Job Statistics</h1>
                <div className="display">
                    <div className="stat-container">
                        <p className="titles">Total Open Service Requests:</p>
                        <input type="text" id="jobId" name="jobId" readOnly value="0000" />
                    </div>
                    <div className="stat-container">
                        <p className="titles">Total Assigned Jobs:</p>
                        <input type="text" id="jobId" name="jobId" readOnly value="0000" />
                    </div>
                    <div className="stat-container">
                        <p className="titles">Technicians Available:</p>
                        <input type="text" id="jobId" name="jobId" readOnly value="0000" />
                    </div>
                </div>

                {this.state.isTrackJobsModalOpen && (
                    <div className="tj-modal">
                        <div className="tj-modal-content">
                            <p className="assign-">Track Jobs</p>
                            <button className="back-button-" onClick={this.closeTrackJobsModal}>Close</button>
                            <div className="label-and-select">
                                <label htmlFor="jobDropdown" style={{ fontSize: '25px', fontWeight: 'bold' }}>Jobs:</label>
                                <select className="jobDropdown" name="jobDropdown">
                                    <option value="job1">Job 1</option>
                                    <option value="job2">Job 2</option>
                                    <option value="job3">Job 3</option>
                                </select>
                            </div>
                            <div className="buttons">
                                <button className="select-button-" onClick={this.closeTrackJobsModal}>Select</button>
                            </div>
                        </div>
                    </div>
                )}

                {this.state.isEscalateJobsModalOpen && (
                    <div className="tj-modal">
                        <div className="tj-modal-content">
                            <p className="assign-">Track Jobs</p>
                            <button className="back-button-" onClick={this.closeEscalateJobsModal}>Close</button>
                            <div className="label-and-select">
                                <label htmlFor="jobDropdown" style={{ fontSize: '25px', fontWeight: 'bold' }}>Jobs:</label>
                                <select className="jobDropdown" name="jobDropdown">
                                    <option value="job1">Job 1</option>
                                    <option value="job2">Job 2</option>
                                    <option value="job3">Job 3</option>
                                </select>
                            </div>
                            <div className="buttons">
                                <button className="select-button-" onClick={this.closeEscalateJobsModal}>Select</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}