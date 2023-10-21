import React, { useState, useEffect } from 'react';

const JobAssignmentForm = () => {
    // State to store technician data and selected values
    const [technicians, setTechnicians] = useState([]);
    const [selectedTechnician, setSelectedTechnician] = useState('');
    const [jobDetails, setJobDetails] = useState('');

    // Fetch technicians from the API when the component mounts
    useEffect(() => {
        fetch('/api/employees')
            .then((response) => response.json())
            .then((data) => setTechnicians(data))
            .catch((error) => console.error('Error fetching technicians: ', error));
    }, []);

    // Handle form submission
    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Create a job assignment object
        const jobAssignmentData = {
            technicianId: selectedTechnician,
            jobDetails: jobDetails,
        };

        // Send the job assignment data to the backend
        fetch('/api/assign-job', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jobAssignmentData),
        })
            .then((response) => {
                if (response.ok) {
                    // Handle success, show a success message, or redirect as needed.
                } else {
                    // Handle errors or validation issues.
                }
            })
            .catch((error) => {
                console.error('Error submitting job assignment: ', error);
            });
    };

    return (
        <div>
            <h2>Job Assignment Form</h2>
            <form onSubmit={handleFormSubmit}>
                <div>
                    <label>Select a Technician:</label>
                    <select
                        value={selectedTechnician}
                        onChange={(e) => setSelectedTechnician(e.target.value)}
                    >
                        <option value="">Select Technician</option>
                        {technicians.map((technician) => (
                            <option key={technician.empId} value={technician.empId}>
                                {technician.firstName +' ' + technician.lastName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Job Details:</label>
                    <textarea
                        value={jobDetails}
                        onChange={(e) => setJobDetails(e.target.value)}
                    ></textarea>
                </div>
                <button type="submit">Assign Job</button>
            </form>
        </div>
    );
};

export default JobAssignmentForm;
