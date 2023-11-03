import React, { useState, useEffect } from 'react';
import EmployeeDashboardNav from '../Navigation/EmployeeNav/EmployeeDashboardNav';
import "./Employee Styles/EmployeeManagement.css"

export function EmployeeManagement() {
    const [selectedOption, setSelectedOption] = useState("allEmployees");
    const [allEmployees, setAllEmployees] = useState([]);
    const [managers, setManagers] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [employeeSearch, setEmployeeSearch] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEmployeeFound, setShowEmployeeFound] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // State variables to manage employee information
    const [state, setState] = useState({
        searchEmployeeEmail: '',

        addEmployeeType: '',
        addEmployeeEmail: '',

        deleteEmployeeEmail: '',
    });

    // useEffect hook to fetch data based on the selected option
    useEffect(() => {
        // Function to fetch all employees
        const getAllEmployees = async () => {
            try {
                const response = await fetch('api/employees');
                const allEmployees = await response.json();

                if (allEmployees.length !== 0) {
                    setAllEmployees(allEmployees);
                    setLoading(false);
                    setShowEmployeeFound(false);
                } else {
                    setLoading(true);
                }
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        // Function to fetch managers
        const getManagers = async () => {
            try {
                const response = await fetch('api/employees');
                const managers = await response.json();
        
                // Filter contracts with employeeType 'Manager'
                const allManagers = managers.filter(employee => employee.employeeType === 'Manager');
        
                if (allManagers.length !== 0) {
                    setManagers(allManagers);
                    setLoading(false);
                    setShowEmployeeFound(false);
                } else {
                    setLoading(true);
                }
            } catch (error) {
                console.error('Error fetching managers:', error);
            }
        };
        
        // Function to fetch technicians
        const getTechnicians = async () => {
            try {
                const response = await fetch('api/employees');
                const technicians = await response.json();
        
                // Filter contracts with employeeType 'Technician'
                const allTechnicians = technicians.filter(employee => employee.employeeType === 'Technician');

                if (allTechnicians.length !== 0) {
                    setTechnicians(allTechnicians);
                    setLoading(false);
                    setShowEmployeeFound(false);
                } else {
                    setLoading(true);
                }
            } catch (error) {
                console.error('Error fetching technicians:', error);
            }
        }; 

        // Conditionally call the appropriate data-fetching function based on the selected option
        if (selectedOption === "allEmployees") {
            getAllEmployees();
        } else if (selectedOption === "Managers") {
            getManagers();
        } else if (selectedOption === "Technicians") {
            getTechnicians();
        }
    }, [selectedOption]);    

    // Function to fetch employee information
    const fetchEmployeeInfo = async () => {
        const { searchEmployeeEmail } = state;

        try {
            const employeeResponse = await fetch(`api/employees/employee-info/${searchEmployeeEmail}`);
            if (employeeResponse.ok) {
                const fetchedData = await employeeResponse.json();

                if (fetchedData.length !== 0) {
                    setEmployeeSearch(fetchedData);
                    setLoading(false);
                    setShowEmployeeFound(true);
                } else {
                    setLoading(true);
                    setShowEmployeeFound(false);
                }
            } else {
                console.error('Failed to fetch employee information:', employeeResponse.status);
            }
        } catch (error) {
            console.error('An error occurred while fetching employee information:', error);
        }
    };

    // Function to handle search icon click
    const handleSearchIconClick = () => {
        fetchEmployeeInfo();
        setSelectedOption("blank");
        state.searchEmployeeEmail = '';
    };

    // Function to render a table of employees
    const renderEmployeeTable = (employees) => {
        // Render the employee table
        return (
            <div className='employee-table-wrapper'>
                <table className="table employee-table" aria-labelledby="tableLabel">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Employee Type</th>
                            <th>First Name</th> 
                            <th>Last Name</th> 
                            <th>Email</th>
                            <th>Contact No.</th>
                            <th>Emg Contact</th>
                            <th>Skills</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(employee => (
                            <tr key={employee.empId}>
                                <td>{employee.empId}</td>
                                <td>{employee.employeeType}</td>
                                <td>{employee.firstName}</td>
                                <td>{employee.lastName}</td>
                                <td>{employee.email}</td>
                                <td>{employee.contactNumber}</td>
                                <td>{employee.emgContact}</td>
                                <td>{employee.skills}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    // Conditional rendering of employee tables based on the selected option
    const showAllEmployees = loading ? <p><em>No Information Available.</em></p> : renderEmployeeTable(allEmployees);
    const showAllManagers = loading ? <p><em>No Information Available.</em></p> : renderEmployeeTable(managers);
    const showAllTechnicians = loading ? <p><em>No Information Available.</em></p> : renderEmployeeTable(technicians);
    const employeeFound = loading ? <p><em>No Information Available.</em></p> : renderEmployeeTable(employeeSearch);

    // Client details editing and modals
    // ---------------------------------
    // Function to handle input changes
    const handleInputChange = (e) => {
        if (e.target.name === "employeeType") {
            // If the input being changed is the employeeType select, set it directly
            setState({
                ...state,
                addEmployeeType: e.target.value,
            });
        } else if (e.target.name === "deleteEmployeeEmail") {
            // Handle the deleteEmployeeEmail input separately
            setState({
                ...state,
                deleteEmployeeEmail: e.target.value,
            });
        } else {
            // For other inputs, update them dynamically
            setState({
                ...state,
                [e.target.name]: e.target.value,
            });
        }
    };

    // Function to handle input changes
    const handleSearchChange = (e) => {
        setState({
            ...state,
            searchEmployeeEmail: e.target.value,
        });
    };

    // Function to add an employee
    const addEmployee = async () => {
        const { addEmployeeType, addEmployeeEmail } = state;
        
        const employeeData = {
            employeeType: addEmployeeType,
            email: addEmployeeEmail
        };

        try {
            const response = await fetch('/api/employees/employee-signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employeeData),
            });

            if (response.ok) {
                setIsAddModalOpen(false);
                window.alert('Employee added successfully');
                window.location.reload();
            } else {
                window.alert('Failed to add employee');
            }
        } catch (error) {
            console.error('Error adding employee:', error);
        }
    };

    // Function to delete a client
    const deleteEmployee = async () => {
        const { deleteEmployeeEmail } = state;

        try {
            const response = await fetch(`/api/employees/delete-employee/${deleteEmployeeEmail}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                setIsDeleteModalOpen(false);
                window.alert('Employee deleted successfully');
                window.location.reload();
            } else {
                window.alert('Failed to delete employee');
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    // Function to handle modal opening
    const openAddModal = () => {
        setIsAddModalOpen(true);
    };    
    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    }; 

    // Function to handle modal closing
    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    // Define the modal as a separate JSX element
    const addEmployeeModal = (
        <div className={`modal ${isAddModalOpen ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: isAddModalOpen ? 'block' : 'none' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className='add-modal-heading'>
                            <h5 className="modal-title">Add Employee</h5>
                        </div>
                        <div>
                            <button type="button" className="close-modal-button fa-solid fa-xmark" data-dismiss="modal" onClick={closeAddModal}></button>
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className='input-group'>
                            <div className='form-group acc-type-select'>
                                <select
                                    name="employeeType"
                                    id="employeeType"
                                    value={state.addEmployeeType}
                                    onChange={handleInputChange}
                                >
                                    <option selected value="" disabled>Select Employee Type</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Technician">Technician</option>
                                </select>
                            </div>
                            <div className='form-group'>
                                <input
                                    type="email"
                                    name="addEmployeeEmail"
                                    placeholder="Email"
                                    value={state.addEmployeeEmail}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-add" onClick={addEmployee}>Add</button>
                    </div>
                </div>
            </div>
        </div>
    );

    const deleteEmployeeModal = (
        <div className={`modal ${isDeleteModalOpen ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: isDeleteModalOpen ? 'block' : 'none' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="delete-modal-heading">
                            <h5 className="modal-title" id="addEmployeeModalLabel">Delete Employee</h5>
                        </div>
                        <div>
                            <button type="button" className="close-modal-button fa-solid fa-xmark" data-bs-dismiss="modal" aria-label="Close" onClick={closeDeleteModal}></button>
                        </div> 
                    </div>
                    <div className="modal-body">
                        <div className='input-group'>
                            <div className='form-group'>
                                <input
                                    type="email"
                                    name="deleteEmployeeEmail"
                                    placeholder="Delete by email"
                                    value={state.deleteEmployeeEmail}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-delete" onClick={deleteEmployee}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <EmployeeDashboardNav />
            <div className='emp-management-wrapper'>                      
                <div className="employee-main-heading">
                    <h1>Employee Management</h1>
                </div>

                <div className="employee-wrapper">
                    <div className="add-employee" onClick={openAddModal}>
                        <div className="add-employee-icon">
                            <i class="fa-solid fa-user-plus"></i>
                        </div>
                        <div className="add-employee-text">
                            <p>Add</p>
                        </div>
                    </div>
                    <div className="delete-employee" onClick={openDeleteModal}>
                        <div className="delete-employee-icon">
                            <i class="fa-solid fa-user-minus"></i>
                        </div>
                        <div className="delete-employee-text">
                            <p>Delete</p>
                        </div>
                    </div>
                </div>

                <div className="cm-table-wrapper" >
                    <div className="table-inputs">
                        <div>
                            <select className="select-employee" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                                <option value="blank" disabled></option>
                                <option value="allEmployees">All Employees</option>
                                <option value="Managers">Managers</option>
                                <option value="Technicians">Technicians</option>
                            </select>
                        </div>

                        <div className="search">
                            <div>
                                <input
                                    className="email-search"
                                    type="email"
                                    name="searchEmployeeEmail"
                                    placeholder="Search by email"
                                    value={state.searchEmployeeEmail}
                                    onChange={handleSearchChange}
                                    required
                                    disabled={isDeleteModalOpen}
                                />
                            </div>
                            <div className="search-icon" onClick={handleSearchIconClick}>
                                <i class="fa-solid fa-magnifying-glass"></i>
                            </div>
                        </div>
                    </div>

                    {selectedOption === "blank" ? (
                        showEmployeeFound ? (
                            employeeFound
                        ) : (
                            !loading ? (
                                employeeSearch.length === 0 ? (
                                    <p>No Information Available.</p>
                                ) : <p>No Information Available.</p>
                            ) : <p>No Information Available.</p>
                        )
                    ) : selectedOption === "allEmployees" ? (
                        showEmployeeFound ? (
                            employeeFound
                        ) : (
                            showAllEmployees
                        )
                    ) : selectedOption === "Managers" ? (
                        showEmployeeFound ? (
                            employeeFound
                        ) : (
                            showAllManagers
                        )
                    ) : selectedOption === "Technicians" ? (
                        showEmployeeFound ? (
                            employeeFound
                        ) : (
                            showAllTechnicians
                        ) 
                    ) : <p>No Information Available.</p>}
                </div>

                {isAddModalOpen && addEmployeeModal}
                {isDeleteModalOpen && deleteEmployeeModal}
            </div>
        </>
    );
}