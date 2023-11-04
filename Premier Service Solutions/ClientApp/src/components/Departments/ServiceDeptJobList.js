import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "./Dept Styles/Service.css";
import DateFilter from "../DateFilter";
import ServiceNav from "../Navigation/ServiceDept/ServiceDeptNav";
import { Link } from "react-router-dom";

export class ServiceDeptJobList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        username: "John Doe",
        profilePicture: "/profile.jpg",
      },
      serviceRequests: [],
      selectedJob: null,
      isModalOpen: false,
      filterName: "",
      selectedStartDate: null,
      selectedEndDate: null,
      selectedStatus: "In Progress",
      filterId: "",
      selectedTechnician: "",
      technicians: [],
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

    fetch("/api/employees")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ technicians: data });
      })
      .catch((error) => console.error("Error fetching technicians:", error));
  }

  handleViewDetails = (request) => {
    this.setState({
      selectedJob: request,
      isModalOpen: true,
      selectedTechnician: null,
    });
    console.log("ASSIGN BUTTON PRESSED");
  };

  handleNameFilterChange = (e) => {
    this.setState({ filterName: e.target.value });
  };

  handleIdilterChange = (e) => {
    this.setState({ filterId: e.target.value });
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

  handleTechnicianSelect = (selectedTechnician) => {
    this.setState({ selectedTechnician });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  filterServiceRequestsByDate = () => {
    const extractDatePart = (date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const { selectedStartDate, selectedEndDate } = this.state;
    const { originalServiceRequests } = this;

    if (selectedStartDate && selectedEndDate) {
      const filteredRequests = originalServiceRequests.filter((request) => {
        const requestDate = new Date(request.requestDate);
        const requestDateOnly = extractDatePart(requestDate);
        const selectedStartDateOnly = extractDatePart(selectedStartDate);
        const selectedEndDateOnly = extractDatePart(selectedEndDate);

        return (
          requestDateOnly >= selectedStartDateOnly &&
          requestDateOnly <= selectedEndDateOnly
        );
      });
      this.setState({ serviceRequests: filteredRequests });
    } else {
      this.setState({ serviceRequests: originalServiceRequests });
    }
  };

  assignTechnician = () => {
    const { selectedJob, selectedTechnician } = this.state;

    if (selectedTechnician) {
      axios
        .post("/api/assign-technician", {
          requestId: selectedJob.requestId,
          technicianId: selectedTechnician,
        })
        .then(() => {
          this.closeModal();
        })
        .catch((error) => {
          console.error("Error assigning technician:", error);
        });
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
      filterId,
      selectedTechnician,
    } = this.state;

    const filteredServiceRequests = serviceRequests.filter(
      (request) =>
        (selectedStatus === "" || request.status === selectedStatus) &&
        (filterName === "" ||
          request.requestDetails
            .toLowerCase()
            .includes(filterName.toLowerCase())) &&
        (filterId === "" || request.requestId === filterId)
    );

    return (
      <div>
        <ServiceNav />
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
                  className="assign"
                  onClick={() => this.handleViewDetails(request)}
                >
                  Assign Technician
                </button>
              </div>
            </div>
          ))}
        </div>
        {isModalOpen && (
          <Modal
            //job={selectedJob}
            onClose={this.closeModal}
            technicians={this.state.technicians}
            selectedTechnician={selectedTechnician}
            onTechnicianSelect={this.handleTechnicianSelect}
            onAssignTechnician={this.assignTechnician}
          />
        )}
      </div>
    );
  }
}

class Modal extends Component {
  render() {
    const {
      job,
      onClose,
      technicians,
      selectedTechnician,
      onTechnicianSelect,
      onAssignTechnician,
    } = this.props;
    return (
      <div className="modal">
        <div className="modal-content">
          <h3>{job.requestDetails}</h3>
          <p>{job.status}</p>
          <div>
            <select
              value={selectedTechnician || ""}
              onChange={onTechnicianSelect}
            >
              <option value="">Select Technician</option>
              {technicians
                .filter(
                  (technician) => technician.employeeType === "Technician"
                )
                .map((technician) => (
                  <option key={technician.empId} value={technician.empId}>
                    {technician.firstName} {technician.lastName}
                  </option>
                ))}
            </select>
            <button onClick={onAssignTechnician}>Assign Technician</button>
          </div>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  job: PropTypes.shape({
    requestDetails: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
