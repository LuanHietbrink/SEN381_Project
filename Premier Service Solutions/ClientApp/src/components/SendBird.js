import axios from 'axios';

export async function createTechnicianUser(technicianId, technicianName) {
    const url = `https://api-B52AC039-499A-47A3-8718-634BE259475F.sendbird.com/v3/users`;
    const headers = {
        'Content-Type': 'application/json',
        'Api-Token': 'a5e50ec52416219b8fb261bc1a07d7560417cbdb',
    };
    const params = {
        user_id: technicianId,
        nickname: technicianName,
        profile_url: "",
        issue_access_token: false
    };

    try {
        await axios.post(url, params, { headers });
        console.log('Technician user created on sendbird successfully');
        return true;
    } catch (err) {
        console.error('Failed to create technician user on Sendbird', err);
        if (err.response) {
            console.error('Error Response:', err.response.data);
        } else {
            console.error('No response received from Sendbird.');
        }
        return false;
    }
}

export async function checkUserExists(userId) {
    const url = `https://api-B52AC039-499A-47A3-8718-634BE259475F.sendbird.com/v3/users`;
    const headers = {
        'Content-Type': 'application/json',
        'Api-Token': 'a5e50ec52416219b8fb261bc1a07d7560417cbdb',
    };

    try {
        const response = await axios.get(url, { headers });
        const users = response.data.users;
        const userExists = users.some(user => user.user_id === userId);
        return userExists;
    } catch (err) {
        console.error('Failed to check if user exists on Sendbird', err);
        if (err.response) {
            console.error('Error Response:', err.response.data);
        } else {
            console.error('No response received from Sendbird.');
        }
        return false;
    }
}

export async function createChannel(userIds) {

    const url = 'https://api-B52AC039-499A-47A3-8718-634BE259475F.sendbird.com/v3/group_channels'


    const headers = {
        'Content-Type': 'application/json',
        'Api-Token': 'a5e50ec52416219b8fb261bc1a07d7560417cbdb',
    };

    const params = {

        name: "Notification Channel",
        cover_url: "",
        custom_type: "Technician-Jobs",
        is_distinct: true,
        user_ids: userIds,
        is_public: false,
        operator_ids: ["Admin"]
    };

    try {
        
        const response = await axios.post(url, params, { headers });
        console.log('Channel created on sendbird successfully');
        const channelUrl = response.data.channel.channel_url;
        return channelUrl;
    } catch (err) {
        console.error('Failed to create channel on sendbird', err);
        console.error('Error Response:', err.response.data);
    }
}

export async function getChannels(technicianId) {
    const url = 'https://api-B52AC039-499A-47A3-8718-634BE259475F.sendbird.com/v3/group_channels'



    const headers = {
        'Content-Type': 'application/json',
        'Api-Token': 'a5e50ec52416219b8fb261bc1a07d7560417cbdb',
    };

    try {
        const response = await axios.get(url, { headers });
        console.log("Success", response);
        
    } catch (err) {
        console.error('Failed to load channels', err);
        console.error('Error Response:', err.response.data);
    }
}

export async function deleteChannel(channelUrl) {

    const url = `https://api-B52AC039-499A-47A3-8718-634BE259475F.sendbird.com/v3/group_channels/${channelUrl}`

    const headers = {
        'Content-Type': 'application/json',
        'Api-Token': 'a5e50ec52416219b8fb261bc1a07d7560417cbdb',
    }

    try {
        const response = await axios.delete(url, { headers });
        console.log('Channel Deleted Successfuly');
    } catch (err) {
        console.error('Failed to delete channel on sendbird', err);
        console.error('Error Response:', err.response.data);
    }
}


export async function botJoinChannel(channelUrls) {

    const botUserId = 'Notification-Bot'
    const url = `https://api-B52AC039-499A-47A3-8718-634BE259475F.sendbird.com/v3/bots/${botUserId}/channels`




    const headers = {
        'Content-Type': 'application/json',
        'Api-Token': 'a5e50ec52416219b8fb261bc1a07d7560417cbdb',
    };
    const params = {

        channel_urls: [channelUrls]
    };

    try {
        const response = await axios.post(url, params, { headers });
        console.log(`${botUserId} joined channel successfully`);
    } catch (err) {
        console.error(`${botUserId} failed to join channel`, err);
        console.error('Error Response:', err.response.data);
    }
}

export async function botMessage(channelUrl, technicianId, technicianName, message) {

    const botUserId = 'Notification-Bot'
    const url = `https://api-B52AC039-499A-47A3-8718-634BE259475F.sendbird.com/v3/bots/${botUserId}/send`

    const headers = {
        'Content-Type': 'application/json',
        'Api-Token': 'a5e50ec52416219b8fb261bc1a07d7560417cbdb',
    };
    const params = {

        message: message,
        channel_url: channelUrl

    };

    try {
        const response = await axios.post(url, params, { headers });
        console.log('Bot message sent successfully');
    } catch (err) {
        console.error('Failed to send Bot message', err);
        console.error('Error Response:', err.response.data);
    }
}


