import React, { Component } from "react";
import "./Dept Styles/Service.css";
import DateFilter from "../DateFilter";

export class ServiceDeptJobList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        username: "John Doe",
        profilePicture: "/profile.jpg",
      },
      serviceRequests: [], // Service requests data
      selectedJob: null,
      isModalOpen: false,
      totalOpenRequests: 0,
      totalAssignedJobs: 0,
      techniciansAvailable: 0,
      filterName: "",
      selectedStartDate: null,
      selectedEndDate: null,
      selectedStatus: "In Progress",
    };
  }

  componentDidMount() {
    fetch("/api/service-requests")
      .then((response) => response.json())
      .then((data) => {
        this.originalServiceRequests = data;
        this.setState({ serviceRequests: data });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  handleViewDetails = (job) => {
    this.setState({ selectedJob: job, isModalOpen: true });
  };

  handleNameFilterChange = (e) => {
    this.setState({ filterName: e.target.value });
  };

handleStartDateChange = (date) => {
    this.setState({ selectedStartDate: date }, () => {
        this.filterServiceRequestsByDate();
    });
};

handleEndDateChange = (date) => {
    this.setState({ selectedEndDate: date }, () => {
        this.filterServiceRequestsByDate();
    });
};

handleStatusFilterChange = (e) => {
    this.setState({ selectedStatus: e.target.value });
};



filterServiceRequestsByDate = () => {
const extractDatePart = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const { selectedStartDate, selectedEndDate } = this.state;
  const { originalServiceRequests } = this;

  if (selectedStartDate && selectedEndDate) {
    const filteredRequests = originalServiceRequests.filter((request) => {
      const requestDate = new Date(request.requestDate);
      const requestDateOnly = extractDatePart(requestDate);
      const selectedStartDateOnly = extractDatePart(selectedStartDate);
      const selectedEndDateOnly = extractDatePart(selectedEndDate);

      return requestDateOnly >= selectedStartDateOnly && requestDateOnly <= selectedEndDateOnly;
    });
    this.setState({ serviceRequests: filteredRequests });
  } else {
    this.setState({ serviceRequests: originalServiceRequests });
  }
};

  
  



  render() {
    const {
      serviceRequests,
      filterName,
      selectedJob,
      isModalOpen,
      selectedEndDate,
      selectedStartDate,
      selectedStatus,
    } = this.state;


    const filteredServiceRequests = serviceRequests.filter((request) =>
    (selectedStatus === "" || request.status === selectedStatus) &&
    (filterName === "" || request.requestDetails.toLowerCase().includes(filterName.toLowerCase()))
    );


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
        <div className="filter-container">
          <input
            type="text"
            placeholder="Search"
            value={filterName}
            onChange={this.handleNameFilterChange}
          />
        </div>
        <div className="filter-container">
          <DateFilter
            selectedStartDate={selectedStartDate}
            selectedEndDate={selectedEndDate}
            onStartDateChange={this.handleStartDateChange}
            onEndDateChange={this.handleEndDateChange}
          />

        </div>
        <div className="filter-container">
          <select
            value={selectedStatus}
            onChange={this.handleStatusFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="In Progress">In-Progress</option>
            <option value="Completed">Completed</option>
            <option value="Delayed">Delayed</option>
          </select>
        </div>

        <div className="ticket-list">
          {filteredServiceRequests.map((request) => (
            <div key={request.requestId} className="ticket">
              <h5>
                #{request.requestId} | {request.requestDetails}
              </h5>
              <div className="ticket-content">
                <p>
                  {request.status}, request created on {request.requestDate}
                </p>
                <button
                  className="view-details"
                  onClick={() => this.handleViewDetails(request)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        {isModalOpen && <Modal job={selectedJob} onClose={this.closeModal} />}
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
          <h3>{job.requestDetails}</h3>
          <p>{job.status}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }
}
