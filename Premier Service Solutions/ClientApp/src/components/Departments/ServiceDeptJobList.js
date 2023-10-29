import React, { Component } from 'react';
import "./Dept Styles/Service.css";

export class ServiceDeptJobList extends Component {
    static displayName = ServiceDeptJobList.name;
    constructor(props) {
        super(props);

        this.state = {
            user: {
                username: 'John Doe',
                profilePicture: '/profile.jpg'
            },
            jobs: [
                {
                    name: 'Job Name 1',
                    number: '001',
                    description: 'Todays VS Code tip: Emmet lorem Just type lorem in #html to generate a paragraph of dummy text.Control how much text is generated with a number suffix, such as lorem10 to generate 10 words of dummy text You can also combine lorem with other Emmet abbreviations.',
                },
                {
                    name: 'Job Name 2',
                    number: '002',
                    description: 'Todays VS Code tip: Emmet lorem Just type lorem in #html to generate a paragraph of dummy text.Control how much text is generated with a number suffix, such as lorem10 to generate 10 words of dummy text You can also combine lorem with other Emmet abbreviations.',
                },
                {
                    name: 'Job Name 3',
                    number: '003',
                    description: 'Todays VS Code tip: Emmet lorem Just type lorem in #html to generate a paragraph of dummy text.Control how much text is generated with a number suffix, such as lorem10 to generate 10 words of dummy text You can also combine lorem with other Emmet abbreviations.',
                },
                // Add more jobs as needed
            ],
            selectedJob: null,
            isModalOpen: false, // Add modal state
        }
    }

    handleViewDetails = (job) => {
        this.setState({ selectedJob: job, isModalOpen: true });
    }

    closeModal = () => {
        this.setState({ isModalOpen: false });
    }

    render() {
        const { selectedJob, isModalOpen } = this.state;
        return (
            <div>
                <h1 className="center-tech">Premier Service Solutions</h1>
                <div className="user-info">
                    <span>Hello, {this.state.user.username}</span>
                    <img
                        src={this.state.user.profilePicture}
                        alt="Profile"
                        className="profile-picture"
                    />
                </div>
                <div className="left-align">
                    <h2>Service Department</h2>
                    <div className="line"></div>
                    <p className="assign">List of Jobs</p>
                </div>
                <div className="ticket-list">
                    {this.state.jobs.map((job, index) => (
                        <div key={index} className="ticket">
                            <h5>#{job.number} | {job.name}</h5>
                            <div className="ticket-content">
                                <p>{job.description}</p>
                                <button className="view-details" onClick={() => this.handleViewDetails(job)}>Assign Technician</button>
                            </div>
                        </div>
                    ))}
                </div>
                {isModalOpen && (
                    <Modal
                        job={selectedJob}
                        onClose={this.closeModal}
                    />
                )}
            </div>
        );
    }
}

class Modal extends Component {
    render() {
        const { job, onClose } = this.props;
        return (
            <div className="modal">
                <div className="modal-content">
                    <h3>{job.name}</h3>
                    <p>{job.description}</p>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }
}