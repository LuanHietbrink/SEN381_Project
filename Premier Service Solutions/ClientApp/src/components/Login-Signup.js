import React, { useState } from 'react';
import { useData } from './DataContext';
import { useNavigate } from 'react-router-dom';
import './Login-Signup.css'

export function LoginSignup() {
    const navigate = useNavigate();

    // Initialize the component's state using the useState hook
    const [state, setState] = useState({
        email: '',
        password: '',
        clientName: '',
        clientType: '',
        address: '',
        contactNumber: '',
        userType: 'login', // User type (login or signup)
        error: null,
        isErrorModalOpen: false,
        isSuccessModalOpen: false,
        successMessage: 'You have successfully signed up!',
        clientData: null,
        employeeData: null,
    });

    const { error, isErrorModalOpen, isSuccessModalOpen, successMessage } = state;

    // Event handler for input changes
    const handleInputChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    }    

    // Event handler for selecting client type
    const handleClientTypeChange = (e) => {
        setState({ ...state, clientType: e.target.value });
    }

    // Event handler for switching between login and signup modes
    const handleModeChange = () => {
        setState({
            userType: state.userType === 'login' ? 'signup' : 'login',
            email: '',
            password: '',
            clientName: '',
            address: '',
            contactNumber: '',
            error: null,
        });
    }

    // Function to handle modal closing
    const closeErrorModal = () => {
        setState({ ...state, isErrorModalOpen: false });
    };
    const closeSuccessModal = () => {
        setState({ ...state, isSuccessModalOpen: false });
    };

    // Event handler for user login or signup
    const handleLogin = async () => {

        try {
            if (state.userType === 'login') {
                const { email, password } = state;

                // Attempt to fetch employee data by email
                const employeeResponse = await fetch(`api/employees/employee-info/${email}`);
                const employeeData = await employeeResponse.json();
        
                // Attempt to fetch client data by email
                const clientResponse = await fetch(`api/clients/client-info/${email}`);
                const clientData = await clientResponse.json();

                if (employeeData.length === 1) {
                    // Handle employee login
                    if (((employeeData[0].email !== null) && (employeeData[0].password !== null)) && ((email !== null) && (!password))) {
                        setState({ ...state, error: 'Password is required.', isErrorModalOpen: true });
                        return;
                    } else if (((employeeData[0].email !== null) && (employeeData[0].password == null)) && ((email !== null) && (!password))) {
                        const response = await fetch(`api/employees/new-employee-login/${email}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        });

                        if (response.status === 200) {
                            setState({ userType: 'employee', employeeData: employeeData[0], error: null });
                        }
                    } else if (((employeeData[0].email !== null) && (employeeData[0].password !== null)) && ((email !== null) && (password !== ""))) {
                        const response = await fetch(`api/employees/employee-login/${email}/${password}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        });

                        if (response.status === 200) {
                            setState({ userType: 'employee', employeeData: employeeData[0], error: null });
                        } else if (response.status === 400) {
                            setState({ ...state, error: 'Invalid details.', isErrorModalOpen: true });
                        }
                    }
                } else if (!email || !password) {
                    setState({ ...state, error: 'Email and password are required.', isErrorModalOpen: true });
                    return;
                } else if (clientData.length === 1) {
                    // Handle client login
                    const response = await fetch(`api/clients/client-login/${email}/${password}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    if (response.status === 200) {
                        setState({ userType: 'client', clientData: clientData[0], error: null });
                    } else if (response.status === 400) {
                        setState({ ...state, error: 'Invalid details.', isErrorModalOpen: true });
                    }
                } else {
                    setState({ ...state, error: 'No matching user found.', isErrorModalOpen: true });
                }
            } else if (state.userType === 'signup') {
                const { clientName, email, password, clientType, address, contactNumber } = state;

                if (!clientName || !email || !password || !clientType || !address || !contactNumber) {
                    setState({ ...state, error: 'All information is required.', isErrorModalOpen: true });
                    return; 
                }
        
                // Attempt to fetch client data by email
                const clientResponse = await fetch(`api/clients/client-info/${email}`);
                const clientData = await clientResponse.json();

                // Password length validation (8 characters)
                const isLengthValid = password.length >= 8;

                // Password complexity validation (uppercase, lowercase, numbers, special characters)
                const isComplexityValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password);
            
                // Check for sequential or repeated characters
                const hasSequentialOrRepeated = /(.)\1\1/.test(password);
            
                const isValid = isLengthValid && isComplexityValid && !hasSequentialOrRepeated;
            
                if (!isValid) {
                    setState({ ...state, error: 'Password must be at least 8 characters long, include uppercase and lowercase letters, numbers, and special characters, and not contain repeated characters.', isErrorModalOpen: true });
                    return;
                }

                // Email validation
                const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                // Validate email format
                if (!emailFormat.test(email)) {
                    setState({ ...state, error: 'Invalid email format.', isErrorModalOpen: true });
                    return;
                }

                // Check for common syntax errors
                if (email.includes('..') || email.includes('.@') || email.includes('@.') || email.includes(' ')) {
                    setState({ ...state, error: 'Invalid email format.', isErrorModalOpen: true });
                    return;
                }

                if (clientData.length !== 0) {
                    setState({ ...state, error: 'This email already exists.', isErrorModalOpen: true });
                    return;
                }

                // Contact number validation
                const isContactNumberValid = (contactNumber) => {
                    // Check if it starts with "+27" and is 12 characters long
                    const startsWithPlus27 = contactNumber.startsWith('+27') && contactNumber.length === 12;
                    // Check if it starts with "0" and is 10 characters long
                    const startsWithZero = contactNumber.startsWith('0') && contactNumber.length === 10;
            
                    return startsWithPlus27 || startsWithZero;
                }

                // Check if the contact number is valid
                const isNumberValid = isContactNumberValid(state.contactNumber);

                if (!isNumberValid) {
                    setState({ ...state, error: 'Contact number must start with "+27" and be 12 characters long or start with "0" and be 10 characters long.', isErrorModalOpen: true });
                    return;
                }

                const signUpData = {
                    clientName,
                    clientType,
                    email,
                    password,
                    address,
                    contactNumber,
                };

                const response = await fetch(`api/clients/client-signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(signUpData),
                });

                if (response.status === 201) {
                    setState({ userType: 'login', error: null, successMessage: 'Sign-up successful!', isSuccessModalOpen: true });
                } else {
                    setState({ ...state, error: 'Error signing up.', isErrorModalOpen: true });
                }
            }
        } catch (error) {
            setState({ ...state, error: 'Error fetching user data.', isErrorModalOpen: true });
        }
    }

    const { userType, clientData, employeeData } = state;

    // Modal to log errors
    const errorModal = (
        <div className={`popup-modal ${isErrorModalOpen ? 'show' : ''} modal-overlay`} tabIndex="-1" role="dialog" style={{ display: isErrorModalOpen ? 'flex' : 'none' }}>
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
                                <div className='signup-popup-heading'>
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

    // Destructure the state variables and data management functions
    const { setPrivateData } = useData();

    if (userType === 'client' && clientData) {
        // Handle client login success
        setPrivateData({ type: 'client', data: clientData });
        navigate("/client-dashboard", { replace: true });
        window.location.reload();
    } else if (userType === 'employee' && employeeData) {
        // Handle employee login success
        if (((employeeData.email !== null) || (employeeData.email !== "")) && (employeeData.password !== null)) {
            setPrivateData({ type: 'employee', data: employeeData });
            navigate("/employee-dashboard", { replace: true });
            window.location.reload();
        } else {
            const { email } = employeeData;
            const employeePrivateData = { email };

            setPrivateData({ type: 'employee', data: employeePrivateData });
            navigate("/account-setup", { replace: true });
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center return-body" style={{ height: '100vh' }}>
            <div className="text-center wrapper">
                <h1>Premier Service Solutions</h1>
                <h5><em>One call away from making your day</em></h5>

                {state.userType === 'login' && (
                    <>
                        <div className='input-group'>
                            <div className='form-group, email-input'>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={state.email}
                                    onChange={handleInputChange}
                                    required
                                />
                                <small id="emailHelp" class="form-text text-muted"><em>We'll never share your email with anyone else.</em></small>
                            </div>
                            <div className='form-group'>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={state.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </>
                )}
                {state.userType === 'signup' && (
                    <>
                        <div className='input-group'>
                            <div className='form-group'>
                                <input
                                    type="text"
                                    name="clientName"
                                    placeholder="Full Name"
                                    value={state.clientName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className='form-group'>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={state.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className='form-group'>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={state.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className='form-group'>
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Address"
                                    value={state.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className='form-group'>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    placeholder="Contact Number"
                                    value={state.contactNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div> 
                            <div className='form-group acc-type-select'>
                                <select
                                    name="clientType"
                                    id="clientType"
                                    value={state.clientType}
                                    onChange={handleClientTypeChange}
                                    required
                                >
                                    <option selected value="" disabled> Select Account Type</option>
                                    <option value="Individual">Individual</option>
                                    <option value="Business">Business</option>
                                </select>
                            </div>                    
                        </div>
                    </>
                )}

                <button onClick={handleLogin} className='btn-login-signup'>
                    {state.userType === 'login' ? 'Login' : 'Sign Up'}
                </button>
                <p>
                    {state.userType === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <span style={{ color: 'blue', cursor: 'pointer' }} onClick={handleModeChange}>
                        {state.userType === 'login' ? 'Sign up here' : 'Login here'}
                    </span>
                </p>
            </div>
                <div
                    style={{
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '65%',
                        height: '100%',
                        backgroundColor: '#2d2c54',
                        clipPath: 'circle(50% at 120% 50%)',
                    }}
                ></div>

            {isErrorModalOpen && errorModal}
            {isSuccessModalOpen && successModal}
        </div>
    );
}