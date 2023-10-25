import React, { useState } from 'react';
import { createTechnicianUser } from './SendBird'; // Import the function

const JobForm = () => {
    const [technicianId, setTechnicianId] = useState('1');
    const [technicianName, setTechnicianName] = useState('John Doe');

    const handleCreateUser = () => {
        createTechnicianUser(technicianId, technicianName);
    };

    return (
        <div>
            <h2>Create Technician User</h2>
            <div>
                <label>Technician ID:</label>
                <input
                    type="text"
                    value={technicianId}
                    onChange={(e) => setTechnicianId(e.target.value)}
                />
            </div>
            <div>
                <label>Technician Name:</label>
                <input
                    type="text"
                    value={technicianName}
                    onChange={(e) => setTechnicianName(e.target.value)}
                />
            </div>
            <button onClick={handleCreateUser}>Create Technician User</button>
        </div>
    );
};

export default JobForm;
