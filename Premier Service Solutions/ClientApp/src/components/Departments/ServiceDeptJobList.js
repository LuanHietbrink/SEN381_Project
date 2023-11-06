import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import DateFilter from "../DateFilter";
import EmployeeDashboardNav from "../Navigation/EmployeeNav/EmployeeDashboardNav";
import "./Dept Styles/Service.css";
import { SendEmail } from "../SendEmail";
import { createTechnicianUser, botMessage, checkUserExists, createChannel } from "../SendBird"

export function ServiceDeptJobList() {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("In Progress");
  const [filterId, setFilterId] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [originalServiceRequests, setOriginalServiceRequests] = useState([]);
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
      })
      .catch((error) => console.error("Error fetching technicians:", error));
  }, []);

  const handleViewDetails = (request) => {
    setSelectedJob(request);
    setIsModalOpen(true);
    setSelectedTechnician(null);
    console.log("ASSIGN BUTTON PRESSED");
  };

  function getStatusColor(status) {
    switch (status) {
      case "Completed":
        return "green";
      case "Delayed":
        return "red";
      case "Pending":
        return "yellow";
      case "In Progress":
        return "blue";
      default:
        return "black";
    }
  }

  const handleNameFilterChange = (e) => {
    setFilterName(e.target.value);
  };

  const handleIdilterChange = (e) => {
    setFilterId(e.target.value);
  };

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
    filterServiceRequestsByDate();
  };

  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
    filterServiceRequestsByDate();
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

  const filterServiceRequestsByDate = () => {
    const extractDatePart = (date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const { selectedStartDate, selectedEndDate, originalServiceRequests } =
      state;

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
      setState({ ...state, serviceRequests: filteredRequests });
    } else {
      setState({ ...state, serviceRequests: originalServiceRequests });
    }
  };

  const filteredServiceRequests = serviceRequests.filter(
    (request) =>
      (selectedStatus === "" || request.status === selectedStatus) &&
      (filterName === "" ||
        request.requestDetails
          .toLowerCase()
          .includes(filterName.toLowerCase())) &&
      (filterId === "" || request.requestId === filterId)
  );

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
    return "";
  };

  const assignTechnician = (requestId, empId) => {
    // Make a PUT request to update empId for the selected request
    axios
      .put(`/api/service-requests/edit-request/${requestId}`, {
        empId,
        status: "In Progress",
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setState({
            ...state,
            successMessage: "Technician assigned successfully!",
            isTechModalOpen: false,
            isMessageModalOpen: true,
          });
        } else {
          setState({
            ...state,
            errorMessage: "Technician assignment is unsuccessful.",
            isTechModalOpen: false,
            isMessageModalOpen: true,
          });
        }
      })
      .catch((error) => console.error("Error updating empId:", error));
  };

  const reassignTechnician = (requestId, empId) => {
    // Make a PUT request to update empId for the selected request
    axios
      .put(`/api/service-requests/edit-request/${requestId}`, { empId })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setState({
            ...state,
            successMessage: "Technician re-assigned successfully!",
            isTechModalOpen: false,
            isMessageModalOpen: true,
          });
        } else {
          setState({
            ...state,
            errorMessage: "Technician re-assignment is unsuccessful.",
            isTechModalOpen: false,
            isMessageModalOpen: true,
          });
        }
      })
      .catch((error) => console.error("Error updating empId:", error));
  };

  const handleTicketClick = (requestId, empId) => {
    setState({ ...state, isTechModalOpen: true });
    setSelectedRequestId(requestId);
    setSelectedEmpId(empId);
    setInputEmpId(empId);
  };

  const handleSave = async () => {
    try {
      if (selectedRequestId !== null) {
        if (selectedEmpId !== null) {
          // Reassign Job
          await reassignTechnician(selectedRequestId, inputEmpId);
          if (!checkUserExists(inputEmpId)) {
            await createTechnicianUser(inputEmpId, getEmployeeName(inputEmpId));
          }
        } else {
          // Assign Job
          await assignTechnician(selectedRequestId,inputEmpId)
          if (!checkUserExists(inputEmpId)) {
            await createTechnicianUser(inputEmpId, getEmployeeName(inputEmpId));
          }
        }
  
        const selectedJobDetails = serviceRequests.find((request) => request.requestId === selectedRequestId);
        const message = `You have been assigned a new job \n (JobID: #${selectedRequestId}): \n Details: ${selectedJobDetails.requestDetails} \n Request Created on: ${selectedJobDetails.requestDate} \n Priority: ${selectedJobDetails.priority} `;
        const channelUrl = await createChannel(["Notification-Bot", inputEmpId]);
        if(channelUrl){          
          await botMessage(channelUrl, inputEmpId, getEmployeeName(inputEmpId), message);
        }
      }
    } catch (err) {
      console.log('Error creating user or sending notification on SendBird', err);
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
          <h2>Service Department</h2>
          <div className="line"></div>
          <p className="assign">List of Jobs</p>
        </div>
        <div className="-container-">
          <div className="filter-container">
            <input
              type="text"
              placeholder="Search by Job"
              value={filterName}
              onChange={handleNameFilterChange}
            />
          </div>
          <div className="filter-container-data">
            <DateFilter
              selectedStartDate={selectedStartDate}
              selectedEndDate={selectedEndDate}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
            />
          </div>
          <div className="filter-container">
            <select
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
              <h5>
                #{request.requestId} | {request.requestDetails}
              </h5>
              <div className="ticket-content">
                <div>
                  Request for client <b>#{request.clientId}</b> requested on{" "}
                  <b>{formatDate(request.requestDate)}</b> is{" "}
                  <b className="status-text" style={{ backgroundColor: getStatusColor(request.status) }}>
                    {request.status}.
                  </b>
                </div>
                <div>
                  <div className="technician-text">
                    <p id="technician-title"><b>Assigned To: </b></p>
                    <p id="technician-name">{request.empId
                      ? `#${request.empId} | ${getEmployeeName(request.empId)}`
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
