import React, { useEffect, useState } from 'react';
import SendBird from 'sendbird';

const appId = 'B52AC039-499A-47A3-8718-634BE259475F';
const userId = 'sendbird_desk_agent_id_53012606-707e-4133-83bd-14efda3ed107'; // Replace with the actual user ID
const sessionToken = '71f6dd0e9405fcfd83e3513b57449e4ed5846bc4'
const Messaging = () => {
    const [sb, setSb] = useState(null);

    useEffect(() => {
        const sb = new SendBird({ 'appId': appId });

        sb.connect(userId, sessionToken ,(user, error) => {
            if (error) {
                console.error('Sendbird connection error', error);
            } else {
                console.log('Sendbird connected as', user);
                setSb(sb);
            }
        });

        return () => {
            sb.disconnect(() => {
                console.log('Disconnected from Sendbird');
            });
        };
    }, []);

    const sendNotification = () => {
        if (sb) {
            const params = new sb.UserMessageParams();
            params.message = 'You have been assigned a job. Please check the details.';
            params.targetLanguages = ['en']; // Language code (e.g., 'en' for English)

            sb.sendUserMessage(params, (message, error) => {
                if (error) {
                    console.error('Sendbird message sending error', error);
                } else {
                    console.log('Notification message sent:', message);
                }
            });
        }
    };

    return (
        <div className="messaging-container">
            <h1>Messaging Interface</h1>
            <button onClick={sendNotification}>Send Notification</button>
        </div>
    );
};

export default Messaging;
