import React, { useState } from 'react';
import { createTechnicianUser, createChannel, botJoinChannel, botMessage, checkUserExists } from './SendBird';
import "./JobForm.css"
import EmployeeDashboardNav from './Navigation/EmployeeNav/EmployeeDashboardNav';
const JobForm = () => {
    const [technicianId, setTechnicianId] = useState('');
    const [technicianName, setTechnicianName] = useState('');
    const [jobAssigned, setJobAssigned] = useState(false);
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [address, setAddress] = useState('');

    const handleCreateUser = () => {
        createTechnicianUser(technicianId, technicianName);
    };

    const handleAssignJob = async () => {
        const userExists = await checkUserExists(technicianId);
        const message = `Hi, ${technicianName}! You have been assigned a job: \n Job Title: ${jobTitle}. \n Job details: ${jobDescription}. \n Address: ${address}`;

        if (!userExists) {
            const userCreated = await createTechnicianUser(technicianId, technicianName);
            if (userCreated) {
                const channelUrl = await createChannel(["Notification-Bot", technicianId]);
                botMessage(channelUrl, technicianId, technicianName, message);
                setJobAssigned(true);
            }
        } else {
            const channelUrl = await createChannel(["Notification-Bot", technicianId]);
            botMessage(channelUrl, technicianId, technicianName, message);
            setJobAssigned(true);
        }
    };
    
    
    return (
       
        <div>
            <div>
                <EmployeeDashboardNav />
            </div>
            
            
            <form>
                <h2>Assign a Job Test</h2>

                <div>
                    <label for="technicianId">Technician ID:</label>
                    <input
                        type="text"
                        id="technicianId"
                        value={technicianId}
                        onChange={(e) => setTechnicianId(e.target.value)}
                    />
                </div>

                <div>
                    <label for="technicianName">Technician Name:</label>
                    <input
                        type="text"
                        id="technicianName"
                        value={technicianName}
                        onChange={(e) => setTechnicianName(e.target.value)}
                    />
                </div>

                <div>
                    <label for="address">Address:</label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>

                <div>
                    <label for="jobTitle">Job Title:</label>
                    <input
                        type="text"
                        id="jobTitle"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                    />
                </div>

                <div>
                    <label for="jobDescription">Job Description:</label>
                    <input
                        type="text"
                        id="jobDescription"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                </div>

                <button type="button" onClick={handleCreateUser} disabled={!technicianId || !technicianName}>Create Technician User</button>

                {jobAssigned ? (
                    <p>Job has been assigned. Check your messages.</p>
                ) : (
                    <button type="button" onClick={handleAssignJob} disabled={!technicianId || !technicianName || !jobTitle || !jobDescription || !address}>Assign Job</button>
                )}
            </form>

        </div>
    );
};

export default JobForm;
