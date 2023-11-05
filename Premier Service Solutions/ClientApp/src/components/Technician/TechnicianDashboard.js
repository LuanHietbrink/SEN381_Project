import React, { Component } from 'react';
import TechnicianNav from '../Navigation/Technician/TechnicianNav';
import "./Technician.css";

export class TechDashboard extends Component {
    static displayName = TechDashboard.name;

    constructor(props) {
        super(props);

        this.state = {
            user: {
                username: 'John Doe',
                profilePicture: 'url_to_profile_picture.jpg',
            },
            jobs: [
                {
                    name: 'Job 1',
                    number: '001',
                    description: 'Description for Job 1',
                },
                {
                    name: 'Job 2',
                    number: '002',
                    description: 'Description for Job 2',
                },
                {
                    name: 'Job 3',
                    number: '003',
                    description: 'Description for Job 3',
                },
                // Add more jobs as needed
            ],
            isModalOpen: false,
            formData: {
                name: '',
                description: '',
            }
        };
    }



    closeModal = () => {
        this.setState({ isModalOpen: false });
    }

    selectTicket = (ticket) => {
        this.setState({
            selectedTicket: ticket,
            isModalOpen: true,
        });
    }

    render() {
        return (
            <div>
                <TechnicianNav />
                <div className="-align">
                    <h2 className = "-heading">Technician Dashboard</h2>
                    <div className="line"></div>
                    <p className="-name">Assigned Jobs</p>
                </div>
                <div className="ticket-list">
                    {this.state.jobs.map((job, index) => (
                        <div key={job.number} className="ticket">
                            <h3>{job.number} | {job.name}</h3>
                            <p></p>
                            <div className="discription-container">
                                <p>{job.description}</p>
                                <button className="view-details" onClick={() => this.selectTicket(job)}>View Details</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="report-issue">Report Issue</button>
                {this.state.isModalOpen && this.state.selectedTicket && (
                    <div className="modal">
                        <div className="modal-content">
                            <button onClick={this.closeModal} className="back-button">Back</button>
                            <div className="modal-form">
                                <p className="-name">Job Details</p>
                                <input
                                    type="text"
                                    name="ticketTitle"
                                    value={this.state.selectedTicket.name}
                                    readOnly
                                    placeholder="Ticket Title"
                                />
                                <textarea
                                    name="ticketDescription"
                                    value={this.state.selectedTicket.description}
                                    readOnly
                                    placeholder="Ticket Description"
                                />
                                <button className="report-issue">Complete Job</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}