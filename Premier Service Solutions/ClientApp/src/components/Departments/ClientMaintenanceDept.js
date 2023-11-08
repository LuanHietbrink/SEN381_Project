import React, { useState, useEffect } from "react";
import "./Dept Styles/ClientMaintenanceDept.css"
import EmployeeDashboardNav from "../Navigation/EmployeeNav/EmployeeDashboardNav";

export function ClientMaintenanceDept() {
    const [selectedOption, setSelectedOption] = useState("allClients");
    const [allClients, setAllClients] = useState([]);
    const [businessClients, setBusinessClients] = useState([]);
    const [individualClients, setIndividualClients] = useState([]);
    const [clientSearch, setClientSearch] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showClientFound, setShowClientFound] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // State variables to manage employee information
    const [state, setState] = useState({
        searchClientEmail: '',

        addClientName: '',
        addClientType: '',
        addEmail: '',
        addAddress: '',
        addContactNumber: '',

        deleteClientEmail: '',

        error: null,
        isErrorModalOpen: false,
        isSuccessModalOpen: false,
        successMessage: null,
    });

    const { isErrorModalOpen, isSuccessModalOpen, error, successMessage } = state;

    // useEffect hook to fetch data based on the selected option
    useEffect(() => {
        // Function to fetch all clients
        const getAllClients = async () => {
            try {
                const response = await fetch('api/clients');
                const allClients = await response.json();

                if (allClients.length !== 0) {
                    setAllClients(allClients);
                    setLoading(false);
                    setShowClientFound(false);
                } else {
                    setLoading(true);
                }
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        // Function to fetch business clients
        const getBusinessClients = async () => {
            try {
                const response = await fetch('api/clients');
                const allClients = await response.json();
        
                // Filter contracts with clientType 'Business'
                const businessClients = allClients.filter(client => client.clientType === 'Business');
        
                if (businessClients.length !== 0) {
                    setBusinessClients(businessClients);
                    setLoading(false);
                    setShowClientFound(false);
                } else {
                    setLoading(true);
                }
            } catch (error) {
                console.error('Error fetching business clients:', error);
            }
        };
        
        // Function to fetch individual clients
        const getIndividualClients = async () => {
            try {
                const response = await fetch('api/clients');
                const allClients = await response.json();
        
                // Filter contracts with clientType 'Individual'
                const individualClients = allClients.filter(client => client.clientType === 'Individual');

                if (individualClients.length !== 0) {
                    setIndividualClients(individualClients);
                    setLoading(false);
                    setShowClientFound(false);
                } else {
                    setLoading(true);
                }
            } catch (error) {
                console.error('Error fetching individual clients:', error);
            }
        }; 

        // Conditionally call the appropriate data-fetching function based on the selected option
        if (selectedOption === "allClients") {
            getAllClients();
        } else if (selectedOption === "businessClients") {
            getBusinessClients();
        } else if (selectedOption === "individualClients") {
            getIndividualClients();
        }
    }, [selectedOption]);

    // Function to fetch client information
    const fetchClientInfo = async () => {
        const { searchClientEmail } = state;

        try {
            const clientResponse = await fetch(`api/clients/client-info/${searchClientEmail}`);
            if (clientResponse.ok) {
                const fetchedData = await clientResponse.json();

                if (fetchedData.length !== 0) {
                    setClientSearch(fetchedData);
                    setLoading(false);
                    setShowClientFound(true);
                } else {
                    setLoading(true);
                    setShowClientFound(false);
                }
            } else {
                console.error('Failed to fetch client information:', clientResponse.status);
            }
        } catch (error) {
            console.error('An error occurred while fetching client information:', error);
        }
    };

    // Function to handle search icon click
    const handleSearchIconClick = () => {
        fetchClientInfo();
        setSelectedOption("blank");
        state.searchClientEmail = '';
    };

    // Function to render a table of clients
    const renderClientsTable = (clients) => {
        // Render the clients table
        return (
            <div className='clients-table-wrapper'>
                <table className="table clients-table" aria-labelledby="tableLabel">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Client Name</th> 
                            <th>Client Type</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Contact No.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                            <tr key={client.contractId}>
                                <td>{client.clientId}</td>
                                <td>{client.clientName}</td>
                                <td>{client.clientType}</td>
                                <td>{client.email}</td>
                                <td>{client.address}</td>
                                <td>{client.contactNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    // Conditional rendering of clients tables based on the selected option
    const allAvailableClients = loading ? <p><em>No Information Available.</em></p> : renderClientsTable(allClients);
    const allBusinessClients = loading ? <p><em>No Information Available.</em></p> : renderClientsTable(businessClients);
    const allIndividualClients = loading ? <p><em>No Information Available.</em></p> : renderClientsTable(individualClients);
    const clientFound = loading ? <p><em>No Information Available.</em></p> : renderClientsTable(clientSearch);

    // Client details editing and modals
    // ---------------------------------
    // Function to handle input changes
    const handleInputChange = (e) => {
        if (e.target.name === "clientType") {
            // If the input being changed is the clientType select, set it directly
            setState({
                ...state,
                addClientType: e.target.value,
            });
        } else if (e.target.name === "deleteClientEmail") {
            // Handle the deleteClientEmail input separately
            setState({
                ...state,
                deleteClientEmail: e.target.value,
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
            searchClientEmail: e.target.value,
        });
    };

    // Function to add a client
    const addClient = async () => {
        const { addClientName, addClientType, addEmail, addAddress, addContactNumber } = state;
        
        const clientData = {
            clientName: addClientName,
            clientType: addClientType,
            email: addEmail,
            address: addAddress,
            contactNumber: addContactNumber
        };

        try {
            const response = await fetch('/api/clients/client-signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clientData),
            });

            if (response.ok) {
                setIsAddModalOpen(false);
                setState({ ...state, successMessage: 'Client added successfully!', isSuccessModalOpen: true });
                window.location.reload();
            } else {
                setState({ ...state, error: 'Failed to add client.', isErrorModalOpen: true });
            }
        } catch (error) {
            console.error('Error adding client:', error);
        }
    };

    // Function to delete a client
    const deleteClient = async () => {
        const { deleteClientEmail } = state;

        try {
            const response = await fetch(`/api/clients/delete-client/${deleteClientEmail}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                setIsDeleteModalOpen(false);
                setState({ ...state, successMessage: 'Client deleted successfully!', isSuccessModalOpen: true });
                window.location.reload();
            } else {
                setState({ ...state, error: 'Failed to delete client.', isErrorModalOpen: true });
            }
        } catch (error) {
            console.error('Error deleting client:', error);
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

    // Function to handle modals
    const closeErrorModal = () => {
        setState({ ...state, isErrorModalOpen: false });
    };
    const closeSuccessModal = () => {
        setState({ ...state, isSuccessModalOpen: false });
    };

    const addModalContent = (
        <div className={`modal ${isAddModalOpen ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: isAddModalOpen ? 'block' : 'none' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="add-modal-heading">
                            <h5 className="modal-title" id="addClientModalLabel">Add Client</h5>
                        </div>
                        <div>
                            <button type="button" className="close-modal-button fa-solid fa-xmark" data-bs-dismiss="modal" aria-label="Close" onClick={closeAddModal}></button>
                        </div>                     
                    </div>
                    <div className="modal-body">
                        <div className='input-group'>
                            <div className='form-group'>
                                <input
                                    type="text"
                                    name="addClientName"
                                    placeholder="Client Name"
                                    value={state.addClientName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className='form-group acc-type-select'>
                                <select
                                    name="clientType"
                                    id="clientType"
                                    value={state.addClientType}
                                    onChange={handleInputChange}
                                >
                                    <option selected value="" disabled>Select Account Type</option>
                                    <option value="Individual">Individual</option>
                                    <option value="Business">Business</option>
                                </select>
                            </div>
                            <div className='form-group'>
                                <input
                                    type="email"
                                    name="addEmail"
                                    placeholder="Email"
                                    value={state.addEmail}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className='form-group'>
                                <input
                                    type="text"
                                    name="addAddress"
                                    placeholder="Address"
                                    value={state.addAddress}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className='form-group'>
                                <input
                                    type="number"
                                    name="addContactNumber"
                                    placeholder="Contact Number"
                                    value={state.addContactNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-add" onClick={addClient}>Add Client</button>
                    </div>
                </div>
            </div>
        </div>
    );

    const deleteModalContent = (
        <div className={`modal ${isDeleteModalOpen ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: isDeleteModalOpen ? 'block' : 'none' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="delete-modal-heading">
                            <h5 className="modal-title" id="addClientModalLabel">Delete Client</h5>
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
                                    name="deleteClientEmail"
                                    placeholder="Delete by email"
                                    value={state.deleteClientEmail}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-delete" onClick={deleteClient}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );

    const errorModal = (
        <div className={`popup-modal ${isErrorModalOpen ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: isErrorModalOpen ? 'flex' : 'none' }}>
            <div className="popup-modal-dialog">
                <div className="popup-modal-content">
                    <div className="popup-modal-body">
                        <div className='popup-content'>
                            <div className='popup-modal-icon'>
                                <i class="fa-solid fa-triangle-exclamation"></i>
                            </div>
                            <div>
                                <div className='popup-heading'>
                                    <p>Error!</p>
                                </div>
                                <div className='popup-message'>
                                    <p style={{ color: "red", textAlign: "center" }}>{error}</p>
                                </div>
                            </div>
                            <div className='popup-btn-div'>
                                <button type="button" className="btn btn-popup" onClick={closeErrorModal}>Ok</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const successModal = (
        <div className={`popup-modal ${isSuccessModalOpen ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: isSuccessModalOpen ? 'flex' : 'none' }}>
            <div className="popup-modal-dialog">
                <div className="popup-modal-content">
                    <div className="popup-modal-body">
                        <div className='popup-content'>
                            <div className='popup-modal-icon'>
                                <i class="fa-solid fa-circle-check"></i>
                            </div>
                            <div className='popup-details'>
                                <div className='popup-heading'>
                                    <p>{successMessage}</p>
                                </div>
                            </div>
                            <div className='popup-btn-div'>
                                <button type="button" className="btn btn-popup" onClick={closeSuccessModal}>Ok</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return(
        <>
            <EmployeeDashboardNav />
            <div className="client-main-wrapper">
                <div className="client-main-heading">
                    <h1>Client Maintenance</h1>
                </div>

                <div className="client-wrapper">
                    <div className="add-client" onClick={openAddModal}>
                        <div className="add-client-icon">
                            <i class="fa-solid fa-user-plus"></i>
                        </div>
                        <div className="add-client-text">
                            <p>Add Client</p>
                        </div>
                    </div>
                    <div className="delete-client" onClick={openDeleteModal}>
                        <div className="delete-client-icon">
                            <i class="fa-solid fa-user-minus"></i>
                        </div>
                        <div className="delete-client-text">
                            <p>Delete Client</p>
                        </div>
                    </div>
                </div>

                <div className="cm-table-wrapper" >
                    <div className="table-inputs">
                        <div>
                            <select className="select-client" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                                <option value="blank" disabled></option>
                                <option value="allClients">All Clients</option>
                                <option value="businessClients">Business Clients</option>
                                <option value="individualClients">Individual Clients</option>
                            </select>
                        </div>

                        <div className="search">
                            <div>
                                <input
                                    className="email-search"
                                    type="email"
                                    name="searchClientEmail"
                                    placeholder="Search by email"
                                    value={state.searchClientEmail}
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
                        showClientFound ? (
                            clientFound
                        ) : (
                            !loading ? (
                                clientSearch.length === 0 ? (
                                    <p>No Information Available.</p>
                                ) : <p>No Information Available.</p>
                            ) : <p>No Information Available.</p>
                        )
                    ) : selectedOption === "allClients" ? (
                        showClientFound ? (
                            clientFound
                        ) : (
                            allAvailableClients
                        )
                    ) : selectedOption === "businessClients" ? (
                        showClientFound ? (
                            clientFound
                        ) : (
                            allBusinessClients
                        )
                    ) : selectedOption === "individualClients" ? (
                        showClientFound ? (
                            clientFound
                        ) : (
                            allIndividualClients
                        ) 
                    ) : <p>No Information Available.</p>}
                </div>

                {isAddModalOpen && addModalContent}
                {isDeleteModalOpen && deleteModalContent}
                {isErrorModalOpen && errorModal}
                {isSuccessModalOpen && successModal}
            </div>
        </>
    );
}