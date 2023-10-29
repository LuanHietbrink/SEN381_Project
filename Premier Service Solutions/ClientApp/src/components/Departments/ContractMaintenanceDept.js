import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useData } from '../DataContext';
import ClientDashboardNav from "../Navigation/ClientNav/ClientDashboardNav";
import StandardPackage from "./sla/Standard Package - Service Level Agreement.pdf";
import BusinessPackage from "./sla/Business Package - Service Level Agreement.pdf";
import PremiumPackage from "./sla/Premium Package - Service Level Agreement.pdf";
import BusinessPromoPackage from "./sla/Business Promo Package - Service Level Agreement.pdf";
import PremiumPromoPackage from "./sla/Premium Promo Package - Service Level Agreement.pdf";
import "./Dept Styles/ContractMaintenanceDept.css";

export function ContractMaintenanceDept() {
    // Access privateData from the DataContext
    const { privateData } = useData();
    const clientData = privateData.data;

    // State variables to disable apply buttons and store the client ID
    const [disableApplyButtons, setDisableApplyButtons] = useState(false);
    const [fetchedClientId, setFetchedClientId] = useState('');

    // Use useEffect to store client data in local storage when it changes
    useEffect(() => {
        try {
            if (clientData) {
                localStorage.setItem('clientData', JSON.stringify(clientData));
            }
        } catch (error) {
            console.error('Error storing clientData in local storage:', error);
        }
    }, [clientData]);

    // Initialize an object to store client data retrieved from local storage
    let storedClientData = {};

    // Try to retrieve client data from local storage
    try {
        const storedData = localStorage.getItem('clientData');
        if (storedData) {
            storedClientData = JSON.parse(storedData);
        }
    } catch (error) {
        console.error('Error retrieving clientData from local storage:', error);
    }

    // Function to calculate promo start and end dates based on the current year
    const calculatePromoDates = () => {
        const currentYear = new Date().getFullYear();
        return [
            { start: new Date(currentYear, 2, 1), end: new Date(currentYear, 3, 1) }, // March 1 to April 1
            { start: new Date(currentYear, 5, 1), end: new Date(currentYear, 6, 1) }, // June 1 to July 1
            { start: new Date(currentYear, 8, 1), end: new Date(currentYear, 9, 1) }, // September 1 to October 1
            { start: new Date(currentYear, 11, 1), end: new Date(currentYear + 1, 0, 1) }, // December 1 to January 1
        ];
    };

    // Determine if the current date falls within any of the promo periods
    const isPromoActive = calculatePromoDates().some(({ start, end }) => {
        const currentDate = new Date();
        return currentDate >= start && currentDate < end;
    });

    // Calculate time left for the active promo
    const calculateTimeLeft = () => {
        const currentDate = new Date();
        const activePeriod = calculatePromoDates().find(({ start, end }) => currentDate >= start && currentDate < end);
        
        if (activePeriod) {
            const timeRemaining = activePeriod.end - currentDate;
            return {
                days: Math.floor(timeRemaining / (1000 * 60 * 60 * 24)),
                hours: currentDate.getHours(),
                minutes: currentDate.getMinutes(),
                seconds: currentDate.getSeconds(),
            };
        }
        
        return null;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    // Update the time left every second
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    // Function to fetch client details
    const fetchClientDetails = async () => {
        try {
            const clientResponse = await fetch(`api/clients/client-details/${storedClientData.email}`);
            if (clientResponse.ok) {
                const fetchedData = await clientResponse.json();
                if (Array.isArray(fetchedData) && fetchedData.length === 0) {
                } else {
                    const endDate = new Date(fetchedData[0].endDate);

                    // Check if the fetched end date is after today's date and disable Apply buttons
                    const currentDate = new Date();
                    if (endDate > currentDate) {
                        setDisableApplyButtons(true);
                    }
                }
            } else {
                console.error('Failed to fetch client details:', clientResponse.status);
            }
        } catch (error) {
            console.error('An error occurred while fetching client details:', error);
        }
    };

    // Use useEffect to fetch client details when the email changes
    useEffect(() => {
        fetchClientDetails(storedClientData.email);
    }, [storedClientData.email]);

    // Function to fetch client information
    const fetchClientInfo = async () => {
        try {
            const clientResponse = await fetch(`api/clients/client-info/${storedClientData.email}`);
            if (clientResponse.ok) {
                const fetchedData = await clientResponse.json();
                if (Array.isArray(fetchedData) && fetchedData.length === 0) {
                } else {
                    setFetchedClientId(fetchedData[0].clientId);
                }
            } else {
                console.error('Failed to fetch client details:', clientResponse.status);
                window.alert('Failed to fetch client details');
            }
        } catch (error) {
            console.error('An error occurred while fetching client details:', error);
            window.alert('An error occurred while fetching client details');
        }
    };

    // Use useEffect to fetch client information when the email changes
    useEffect(() => {
        fetchClientInfo(storedClientData.email);
    }, [storedClientData.email]);

    // Function to send an application for a service package
    const sendApplication = async (packageId, contractType, serviceLevel) => {
        const currentDate = new Date();
        const endDate = new Date(currentDate);
        endDate.setFullYear(currentDate.getFullYear() + 1);

        const applicationData = {
            clientId: fetchedClientId,
            packageId: packageId,
            startDate: currentDate.toISOString(),
            endDate: endDate.toISOString(),
            contractType: contractType,
            serviceLevel: serviceLevel,
        };

        try {
            const response = await fetch("api/service-contracts/contract-application", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(applicationData),
            });

            if (response.ok) {
                window.alert("Application Successful!")
                window.location.reload();
            } else {               
                console.error("Failed to apply for the package:", response.status);
                window.alert("Failed to apply for the package");
            }
        } catch (error) {            
            console.error("An error occurred while applying for the package:", error);
            window.alert("An error occurred while applying for the package:", error);
        }
    };
    
    // Function to handle Apply button click
    const handleApplyButtonClick = (packageId, contractType, serviceLevel) => {
        const confirmApply = window.confirm("Are you sure you want to apply for this contract?");
        
        if (confirmApply) {
            sendApplication(packageId, contractType, serviceLevel);
        }
    };

    return(
        <div className="wrapper">
            <ClientDashboardNav />
            <div className="heading">
                <h3>Our Service Packages</h3>
            </div>
            <div className="packages">
                <div className="package">
                    <div>
                        <h4>Standard</h4>
                    </div>
                    <div className="package-price">
                        <p>R3377 p/m</p>
                    </div>
                    <div className="package-info">
                        <p>🛠 <b>Routine Maintenance:</b> <br></br> Keep your equipment in prime condition with regular check-ups, ensuring uninterrupted operations.</p>
                        <p>⚙ <b>Breakdown Support:</b> <br></br> When challenges arise, our swift response and resolution ensure minimal downtime.</p>
                        <p>🌐 <b>Software Updates:</b> <br></br> Stay up to date with the latest software configurations for optimal efficiency.</p>
                        <p>🕒 <b>Business Hours Support:</b> <br></br> Your business hours are our hours. Count on us during standard business hours.</p>
                    </div>
                    <div className="btn-wrap-1">
                        <div>
                            <button 
                                className="btn btn-apply" 
                                disabled={disableApplyButtons} 
                                onClick={() => handleApplyButtonClick(1, "Standard", "Basic-Level")}
                            >
                                    Apply
                            </button>
                        </div>
                        <div>
                            <Link to={StandardPackage} target="_blank" rel="noreferrer">View Details</Link>
                        </div>
                    </div>
                </div>
                <div className="divide">
                    <div className="divider"></div>
                </div>
                <div className="package">
                    <div>
                        <h4>Business</h4>
                    </div>
                    <div className="package-price">
                        <p>R6901 p/m</p>
                    </div>
                    <div className="package-info">
                        <p>🚀 <b>Enhanced Maintenance:</b> <br></br> Elevate your equipment's performance with comprehensive and proactive maintenance solutions.</p>
                        <p>🌟 <b>Priority Response:</b> <br></br> Enjoy priority access to our expert technicians for faster issue resolution.</p>
                        <p>🔒 <b>Security Assurance:</b> <br></br> Our Business Package includes advanced security measures to protect your valuable data.</p>
                        <p>💼 <b>Dedicated Account Manager:</b> <br></br> Benefit from a dedicated account manager, providing personalized support and expertise.</p>
                        <p>🌐 <b>Extended Service Hours:</b> <br></br> We're at your service beyond standard business hours to meet your unique needs.</p>
                    </div>
                    <div className="btn-wrap-2">
                        <div>
                            <button 
                                className="btn btn-apply" 
                                disabled={disableApplyButtons} 
                                onClick={() => handleApplyButtonClick(2, "Business", "High-End")}
                            >
                                    Apply
                            </button>
                        </div>
                        <div>
                            <Link to={BusinessPackage} target="_blank" rel="noreferrer">View Details</Link>
                        </div>
                    </div>
                </div>
                <div className="divide">
                    <div className="divider"></div>
                </div>
                <div className="package">
                    <div>
                        <h4>Premium</h4>
                    </div>
                    <div className="package-price">
                        <p>R6582 p/m</p>
                    </div>
                    <div className="package-info">
                        <p>🛠 <b>Routine Maintenance:</b> <br></br> Enjoy regular equipment check-ups to keep your operations running smoothly.</p>
                        <p>🚀 <b>Enhanced Maintenance:</b> <br></br> Elevate your equipment's performance with comprehensive and proactive solutions.</p>
                        <p>⚙ <b>Breakdown Support:</b> <br></br> Swift issue resolution to minimize downtime.</p>
                        <p>🌟 <b>Priority Response:</b> <br></br> Priority access to our expert technicians for faster solutions.</p>
                        <p>🌐 <b>Extended Service Hours:</b> <br></br> Access support beyond standard business hours for your convenience.</p>
                    </div>
                    <div className="btn-wrap-3">
                        <div>
                            <button 
                                className="btn btn-apply" 
                                disabled={disableApplyButtons} 
                                onClick={() => handleApplyButtonClick(3, "Premium", "Mid-High-End")}
                            >
                                    Apply
                            </button>
                        </div>
                        <div>
                            <Link to={PremiumPackage} target="_blank" rel="noreferrer">View Details</Link>
                        </div>
                    </div>
                </div>
            </div>

            {isPromoActive && (
                <>
                    <div style={{display: "flex", justifyContent: "center", width: "100%"}}><hr style={{width: "50%"}}></hr></div>

                    <div className="promos">
                        <div className="heading">
                            <h3>Our Promo Packages</h3>
                        </div>
                        <div className="promo-timer">
                            {timeLeft ? (
                                    <p>
                                        Promo Time left: <br></br>{timeLeft.days} days, {timeLeft.hours} hours, {timeLeft.minutes} minutes, {timeLeft.seconds} seconds
                                    </p>
                                ) : (
                                    <p>Promo has ended</p>
                            )}
                        </div>
                        <div className="promo-packages">
                            <div className="promo-package">
                                <div>
                                    <h4>Business Promo</h4>
                                </div>
                                <div className="package-price">
                                    <p>R6210 p/m</p>
                                </div>
                                <div className="promo-package-info">
                                    <p>🚀 <b>Enhanced Maintenance:</b> <br></br> Elevate your equipment's performance with comprehensive, proactive maintenance.</p>
                                    <p>⚙ <b>Priority Response:</b> <br></br> Enjoy priority access to our expert technicians for rapid issue resolution.</p>
                                    <p>🔒 <b>Advanced Security:</b> <br></br> Safeguard your valuable data with advanced security measures.</p>
                                    <p>💼 <b>Dedicated Account Manager:</b> <br></br> Get personalized support from a dedicated account manager.</p>
                                    <p>🌐 <b>Extended Service Hours:</b> <br></br> We're at your service beyond standard business hours.</p>
                                    <p>🌟 <b>Cost-Efficiency:</b> <br></br> All these exceptional benefits at a remarkable price point.</p>
                                    <p>🤝 <b>Tailored Solutions:</b> <br></br> Customized to meet your unique business needs.</p>
                                    <p>💡 <b>Unmatched Value:</b> <br></br> Experience the best value for your maintenance and support investment.</p>
                                </div>
                                <div>
                                    <div>
                                        <button 
                                            className="btn btn-apply" 
                                            disabled={disableApplyButtons} 
                                            onClick={() => handleApplyButtonClick(4, "Business Promo", "High-End")}
                                        >
                                                Apply
                                        </button>
                                    </div>
                                    <div>
                                        <Link to={BusinessPromoPackage} target="_blank" rel="noreferrer">View Details</Link>
                                    </div>
                                </div>
                            </div>

                            <div className="divide">
                                <div className="divider"></div>
                            </div>

                            <div className="promo-package">
                                <div>
                                    <h4>Premium Promo</h4>
                                </div>
                                <div className="package-price">
                                    <p>R5595 p/m</p>
                                </div>
                                <div className="promo-package-info">
                                    <p>🛠 <b>Comprehensive Maintenance:</b> <br></br> Ensure peak equipment performance with thorough, routine maintenance.</p>
                                    <p>🚀 <b>Enhanced Support:</b> <br></br> Priority access to expert technicians for swift issue resolution.</p>
                                    <p>🔒 <b>Fortified Security:</b> <br></br> Advanced security measures to protect your vital data.</p>
                                    <p>🌟 <b>Dedicated Account Manager:</b> <br></br> A personalized touch with a dedicated account manager.</p>
                                    <p>🌐 <b>Extended Support Hours:</b> <br></br> Benefit from support beyond standard business hours.</p>
                                    <p>💼 <b>Cost-Saving:</b> <br></br> All these premium services at an unbeatable price point.</p>
                                    <p>🤝 <b>Tailored to You:</b> <br></br> Solutions designed to match your unique business needs.</p>
                                    <p>💡 <b>Maximum Value:</b> <br></br> The ultimate value for your maintenance and support investment.</p>
                                </div>
                                <div>
                                    <div>
                                        <button 
                                            className="btn btn-apply" 
                                            disabled={disableApplyButtons} 
                                            onClick={() => handleApplyButtonClick(5, "Premium Promo", "Mid-High-End")}
                                        >
                                                Apply
                                        </button>
                                    </div>
                                    <div>
                                        <Link to={PremiumPromoPackage} target="_blank" rel="noreferrer">View Details</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}