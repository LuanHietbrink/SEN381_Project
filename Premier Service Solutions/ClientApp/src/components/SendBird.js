import SendbirdChat from '@sendbird/chat'
import { OpenChannelModule, SendbirdOpenChat } from '@sendbird/chat/openChannel';
import axios from 'axios';
import SendBird from 'sendbird';

export async function createTechnicianUser(technicianId, technicianName) {

    const url = 'https://api-B52AC039-499A-47A3-8718-634BE259475F.sendbird.com/v3/users'

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
      const response = await axios.post(url, params , { headers });
    console.log('Technician user created on sendbird successfully');
  } catch (err) {
      console.error('Failed to create technician user on sendbird', err);
      console.error('Error Response:', err.response.data);
    }

}

export async function createChannel(channelName, channelUrl, disctinct, userIds, operatorIds) {

    const url = 'https://api-B52AC039-499A-47A3-8718-634BE259475F.sendbird.com/v3/group_channels'


    const headers = {
        'Content-Type': 'application/json',
        'Api-Token': 'a5e50ec52416219b8fb261bc1a07d7560417cbdb',
    };

    const params = {

        name: channelName,
        channel_url: channelUrl,
        cover_url: "",
        custom_type: "Technician-Jobs",
        is_distinct: true,
        user_ids: ["1","2", "Test", "NotificationSender", "Test2"],
        is_public: false,
        operator_ids:["NotificationSender"]
    };



    try {
        const response = await axios.post(url, params, { headers });
        console.log('Channel created on sendbird successfully');
    } catch (err) {
        console.error('Failed to create channel on sendbird', err);
        console.error('Error Response:', err.response.data);
    }
}

export async function getChannels() {
    const url = 'https://api-B52AC039-499A-47A3-8718-634BE259475F.sendbird.com/v3/group_channels'


    const headers = {
        'Content-Type': 'application/json',
        'Api-Token': 'a5e50ec52416219b8fb261bc1a07d7560417cbdb',
    };

    try {
        const response = await axios.get(url, { headers });
        console.log("Success",response);
    } catch (err) {
        console.error('Failed to load channels', err);
        console.error('Error Response:', err.response.data);
    }
}
export async function userJoinChannel(channelUrl, userIds) {
    
    const url = `https://api-B52AC039-499A-47A3-8718-634BE259475F.sendbird.com/v3/group_channels/${channelUrl}/join`


    const headers = {
        'Content-Type': 'application/json',
        'Api-Token': 'a5e50ec52416219b8fb261bc1a07d7560417cbdb',
    };
    const params = {
        channel_url: channelUrl,
        user_id: userIds,

    };
    try {
        const response = await axios.put(url, params, { headers });
        console.log("Successfully added user to channel", response);
    } catch (err) {
        console.error('Failed to join channel');
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
        const response = await axios.delete(url,{ headers });
        console.log('Channel Deleted Successfuly');
    } catch (err) {
        console.error('Failed to delete channel on sendbird', err);
        console.error('Error Response:', err.response.data);
    }
}

export async function sendMessageToTechnician() {

    const url = `https://api-B52AC039-499A-47A3-8718-634BE259475F.sendbird.com/v3/group_channels/Job-Notifications/messages`



    const headers = {
        'Content-Type': 'application/json',
        'Api-Token': 'a5e50ec52416219b8fb261bc1a07d7560417cbdb',
    };
    const params = {

        message_type: "MESG",
        user_id: "NotificationSender",
        message: "You have been assigned a job",
        mentioned_user_ids: ["Test"],
        mention_type: "users"
        
    };

    try {
        const response = await axios.post(url, params, { headers });
        console.log('Message sent successfully');
    } catch (err) {
        console.error('Failed to send message', err);
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

export async function botMessage(channelUrl, message) {

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


//ADD ONE ON ONE CHANNEL CREATION WITH TECHNICIANS AND NOTIFICATIONSENDER FOR EACH.
