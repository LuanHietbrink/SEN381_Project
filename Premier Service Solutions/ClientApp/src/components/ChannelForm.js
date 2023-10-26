import React, { useState, useEffect } from 'react';
import { createChannel, getChannels, userJoinChannel, deleteChannel, sendMessageToTechnician, sendNotification, botJoinChannel, botMessage } from './SendBird'

const ChannelForm = () => {
    const [channelName, setChannelName] = useState('');
    const [channelUrl, setChannelUrl] = useState('');
    //const [distinct, setDistinct] = useState(true);
    //const [userIds, setUserIds] = useState([]);
    //const [operatorIds, setOperatorIds] = useState([]);

    useEffect(() => {
        // Function to be executed when the component loads
        getChannels();
        //userJoinChannel("Tech-notif", "1")
        //deleteChannel("Job-Notifications")
        //sendMessageToTechnician();
        //sendNotification();
        //botJoinChannel()
        //botMessage()



    }, []);
    const handleCreateChannel = async () => {
        // Call the createChannel function with the provided parameters
        try {
            await createChannel(
                channelName,
                channelUrl,

            );
            console.log('Channel created successfully');
        } catch (error) {
            console.error('Failed to create channel:', error);
        }
    };

    return (
        <div>
            <h2>Create Channel</h2>
            <div>
                <label>Channel Name:</label>
                <input
                    type="text"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                />
            </div>
            <div>
                <label>Channel URL:</label>
                <input
                    type="text"
                    value={channelUrl}
                    onChange={(e) => setChannelUrl(e.target.value)}
                />
            </div>
            {/* Add input fields and controls for other parameters (distinct, userIds, operatorIds) here */}
            <button onClick={handleCreateChannel}>Create Channel</button>
        </div>
    );
};

export default ChannelForm;
