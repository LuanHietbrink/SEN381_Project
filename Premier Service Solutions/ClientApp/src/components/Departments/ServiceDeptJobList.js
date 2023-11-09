import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import EmployeeDashboardNav from "../Navigation/EmployeeNav/EmployeeDashboardNav";
import "./Dept Styles/Service.css";
import {
  createTechnicianUser,
  botMessage,
  checkUserExists,
  createChannel,
} from "../SendBird";
import { sendEmail } from "../SendEmail";

export function ServiceDeptJobList() {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("In Progress");
  const [filterId, setFilterId] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [originalServiceRequests, setOriginalServiceRequests] = useState([]);
  const [searchInput, setSearchInput] = useState(""); // New state variable
  // =================
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [inputEmpId, setInputEmpId] = useState("");

  const [state, setState] = useState({
    isTechModalOpen: false,
    isMessageModalOpen: false,
    successMessage: null,
    errorMessage: null,
  });

  const { isTechModalOpen, isMessageModalOpen, successMessage, errorMessage } =
    state;
  // ======================

  useEffect(() => {
    axios
      .get("/api/service-requests")
      .then((response) => {
        setOriginalServiceRequests(response.data);
        setServiceRequests(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));

    axios
      .get("/api/employees")
      .then((response) => {
        const technicianList = response.data.filter(
          (tech) => tech.employeeType === "Technician"
        );
        setTechnicians(technicianList);
        console.log("Technicians:", technicianList);
      })
      .catch((error) => console.error("Error fetching technicians:", error));
  }, []);

  const handleViewDetails = (request) => {
    setSelectedJob(request);
    setIsModalOpen(true);
    setSelectedTechnician(null);
  };

  function getStatusColor(status) {
    switch (status) {
      case "Completed":
        return "green";
      case "Delayed":
        return "red";
      case "Pending":
        return "orange";
      case "In Progress":
        return "blue";
      default:
        return "black";
    }
  }
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };
  const handleStatusFilterChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleTechnicianSelect = (selectedTechnician) => {
    setSelectedTechnician(selectedTechnician);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const filteredServiceRequests = serviceRequests.filter((request) => {
    // Check if the request date falls within the selected date range
    const requestDate = new Date(request.requestDate);
    if (startDate && endDate) {
      const rangeStartDate = new Date(startDate);
      const rangeEndDate = new Date(endDate);
      if (requestDate < rangeStartDate || requestDate > rangeEndDate) {
        return false;
      }
    }

    // Split the search input into words
    const searchItems = searchInput.toLowerCase().split(" ");

    // Check if any word matches the ServiceRequestId or job name
    return (
      (selectedStatus === "" || request.status === selectedStatus) &&
      searchItems.every(
        (item) =>
          item === "" ||
          request.requestDetails.toLowerCase().includes(item) ||
          request.requestId === parseInt(item)
      )
    );
  });

  // =============================================================================================
  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = new Date(date).toLocaleDateString(undefined, options);
    return formattedDate;
  };

  const getEmployeeName = (empId) => {
    const assignedTechnician = technicians.find((tech) => tech.empId === empId);
    if (assignedTechnician) {
      return `${assignedTechnician.firstName} ${assignedTechnician.lastName}`;
    }
  };

  const getEmployeeEmail = (empId) => {
    const assignedTechnician = technicians.find((tech) => tech.empId === empId);
    if (assignedTechnician) {
      return `${assignedTechnician.email}`;
    }
    return "";
  };

  const handleSendEmail = (empEmail) => {
    const apiUrl = `/api/auto-email/send-email/${empEmail}`;

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const handleSendMessage = async (empId, requestId, assignStatus) => {
    const selectedJobDetails = serviceRequests.find(
      (request) => request.requestId === selectedRequestId
    );
    const techName = await getEmployeeName(parseInt(empId));

    const message = `Hey, ${techName}, you have been ${assignStatus} a job. \n\n (JobID: #${requestId}): \n Details: ${selectedJobDetails.requestDetails} \n Request Created on: ${selectedJobDetails.requestDate} \n Priority: ${selectedJobDetails.priority} `;

    const sendBirdUserExists = await checkUserExists(empId);

    if (sendBirdUserExists) {
      // If the user exists, create a channel with the technician
      const userCreated = await createTechnicianUser(empId, techName);
      console.log(techName);
      if (userCreated) {
        const channelUrl = await createChannel(["Notification-Bot", empId]);
        botMessage(channelUrl, message);
      }
    } else {
      // If the user doesn't exist, create a channel and send a message
      const channelUrl = await createChannel(["Notification-Bot", empId]);
      botMessage(channelUrl, message);
    }

    console.log("Message sent successfully!");
  };

  const assignTechnician = async (requestId, empId) => {
    const employeeEmail = getEmployeeEmail(parseInt(empId));

    try {
      const response = await axios.put(
        `/api/service-requests/edit-request/${requestId}`,
        {
          empId,
          status: "In Progress",
        }
      );
      console.log(response);

      if (response.status === 200) {
        setState({
          ...state,
          successMessage: "Technician assigned successfully!",
          isTechModalOpen: false,
          isMessageModalOpen: true,
        });

        handleSendMessage(empId, requestId, "assigned");
        handleSendEmail(employeeEmail);
      } else {
        setState({
          ...state,
          errorMessage: "Technician assignment is unsuccessful.",
          isTechModalOpen: false,
          isMessageModalOpen: true,
        });
      }
    } catch (error) {
      console.error("Error updating empId:", error);
    }
  };

  const reassignTechnician = async (requestId, empId) => {
    const employeeEmail = getEmployeeEmail(parseInt(empId));

    // Make a PUT request to update empId for the selected request
    try {
      const response = await axios.put(
        `/api/service-requests/edit-request/${requestId}`,
        { empId }
      );
      console.log(response);

      if (response.status === 200) {
        setState({
          ...state,
          successMessage: "Technician re-assigned successfully!",
          isTechModalOpen: false,
          isMessageModalOpen: true,
        });

        handleSendMessage(empId, requestId, "reassigned");
        handleSendEmail(employeeEmail);
      } else {
        setState({
          ...state,
          errorMessage: "Technician re-assignment is unsuccessful.",
          isTechModalOpen: false,
          isMessageModalOpen: true,
        });
      }
    } catch (error) {
      console.error("Error updating empId:", error);
    }
  };

  const handleTicketClick = (requestId, empId) => {
    setState({ ...state, isTechModalOpen: true });
    setSelectedRequestId(requestId);
    setSelectedEmpId(empId);
    setInputEmpId(empId);
  };

  const handleSave = async () => {
    try {
      const selectedJobDetails = serviceRequests.find(
        (request) => request.requestId === selectedRequestId
      );

      if (selectedRequestId !== null) {
        if (selectedEmpId !== null) {
          // Reassign Job
          await reassignTechnician(selectedRequestId, inputEmpId);
        } else {
          // Assign Job
          await assignTechnician(selectedRequestId, inputEmpId);
        }
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  const closeTechModal = () => {
    setState({ ...state, isTechModalOpen: false });
  };

  const closeMessageModal = () => {
    setState({ ...state, isMessageModalOpen: false });
    window.location.reload();
  };

  // Assign/Reassign Technician Modal
  const assignTechnicianModal = (
    <div
      className={`modal ${isTechModalOpen ? "show" : ""}`}
      tabIndex="-1"
      role="dialog"
      style={{ display: isTechModalOpen ? "block" : "none" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-heading">
              <h5 className="modal-title" id="technicianModalLabel">
                {selectedEmpId !== null ? "Re-assign Job" : "Assign Job"}
              </h5>
            </div>
            <div>
              <button
                type="button"
                className="close-modal-button fa-solid fa-xmark"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeTechModal}
              ></button>
            </div>
          </div>
          <div className="modal-body">
            <div className="input-group">
              <div className="form-group id-input-wrap"></div>
              <div className="id-input">
                <select
                  value={inputEmpId}
                  onChange={(e) => setInputEmpId(e.target.value)}
                >
                  <option value="">Select Technician</option>
                  {technicians.map((technician) => (
                    <option key={technician.empId} value={technician.empId}>
                      #{technician.empId} | {technician.firstName}{" "}
                      {technician.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-save-tech"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const messageModal = (
    <div
      className={`popup-modal ${isMessageModalOpen ? "show" : ""}`}
      tabIndex="-1"
      role="dialog"
      style={{ display: isMessageModalOpen ? "flex" : "none" }}
    >
      <div className="popup-modal-dialog">
        <div className="popup-modal-content">
          <div className="popup-modal-body">
            <div className="popup-content">
              <div className="popup-modal-icon">
                {successMessage ? (
                  <i className="fa-solid fa-circle-check"></i>
                ) : (
                  <i className="fa-solid fa-triangle-exclamation"></i>
                )}
                {/* <i class="fa-solid fa-circle-check"></i> */}
              </div>
              <div className="popup-details">
                <div className="popup-heading">
                  <p>{successMessage || errorMessage}</p>
                </div>
              </div>
              <div className="popup-btn-div">
                <button
                  type="button"
                  className="btn btn-popup"
                  onClick={closeMessageModal}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // =============================================================================================

  return (
    <>
      <EmployeeDashboardNav />
      <div className="job-list-wrapper">
        <div className="left-align">
          <h2 id="page-title">Service Department</h2>
          <div className="line"></div>
          <h4 className="assign">List of Jobs</h4>
        </div>
        <h4 id="filter-heading">Filtering Options:</h4>
        <div className="-container-">
          <div className="filter-container">
            <input
              className="filter-input"
              id="filter-searchbar"
              type="text"
              placeholder="Search by Job ID or Job Name"
              value={searchInput}
              onChange={handleSearchInputChange}
            />
          </div>
          <div className="filter-service-date-container">
            <input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
            />
            <input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </div>
          <div className="filter-container">
            <select
              className="filter-input"
              value={selectedStatus}
              onChange={handleStatusFilterChange}
              id="status"
            >
              <option value="">All Statuses</option>
              <option value="In Progress">In-Progress</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
        <div className="line"></div>
        <br />
        {/* ========== */}
        <div className="ticket-list">
          {filteredServiceRequests.map((request) => (
            <div
              key={request.requestId}
              className="ticket"
              onClick={() =>
                handleTicketClick(request.requestId, request.empId)
              }
              data-toggle="modal"
              data-target="#technicianModal"
            >
              <h5 id="ticket-heading">
                #{request.requestId} | {request.requestDetails}
              </h5>
              <div className="ticket-content">
                <div>
                  <ul className="ticket-info-list">
                    <li>
                      ClientID: <b>#{request.clientId}</b>
                    </li>
                    <li>
                      Requested on: <b>{formatDate(request.requestDate)}</b>
                    </li>
                    <li>
                      Status:{" "}
                      <b
                        className="status-text"
                        style={{
                          backgroundColor: getStatusColor(request.status),
                        }}
                      >
                        {request.status}
                      </b>
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="technician-text">
                    <p id="technician-title">
                      <b>Assigned To: </b>
                    </p>
                    <p id="technician-name">
                      {request.empId
                        ? `#${request.empId} | ${getEmployeeName(
                            request.empId
                          )}`
                        : "None"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ========== */}

        {isModalOpen && (
          <Modal
            job={selectedJob}
            onClose={closeModal}
            technicians={technicians}
            selectedTechnician={selectedTechnician}
            onTechnicianSelect={handleTechnicianSelect}
            onAssignTechnician={assignTechnician}
          />
        )}

        {isTechModalOpen && assignTechnicianModal}
        {isMessageModalOpen && messageModal}
      </div>
    </>
  );
}

function Modal(props) {
  const {
    job,
    onClose,
    technicians,
    selectedTechnician,
    onTechnicianSelect,
    onAssignTechnician,
  } = props;

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
              .filter((technician) => technician.employeeType === "Technician")
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

Modal.propTypes = {
  job: PropTypes.shape({
    requestDetails: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
};
