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
    profile_url: ""
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
        cover_url: "", // Or .coverImage to upload a cover image file
        custom_type: "Technician-Jobs",
        is_distinct: true,
        user_ids: ["1"],
        operator_ids: []

    };



    try {
        const response = await axios.post(url, params, { headers });
        console.log('Technician added to channel on sendbird successfully');
    } catch (err) {
        console.error('Failed to add technician to channel on sendbird', err);
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

async function setInvitePreference() {

    const url = "PUT https://api-{application_id}.sendbird.com/v3/users/{user_id}/channel_invitation_preference
    const url = `https://api-B52AC039-499A-47A3-8718-634BE259475F.sendbird.com/v3/group_channels/${channelUrl}/join`

    https://sendbird.com/docs/chat/platform-api/v3/channel/managing-a-channel/update-channel-invitation-preference
}
// Step 2: Assign the job
function assignJobToTechnician(technicianId, jobDetails) {
  // Update the technician's user profile or associate the job details with their user ID
  // ...
}

// Step 3: Send a notification
function sendNotificationToTechnician(technicianId, message) {
  // Send a notification to the technician using an open channel or a group channel
  // ...
}

//Usage


const jobDetails = {
  title: 'Fixing a leak',
  description: 'There is a leak in the kitchen sink that needs to be fixed.',
  location: 'Somewhere over the rainbow'
};

    //assignJobToTechnician(technicianId, jobDetails);

    const notificationMessage = 'You have been assigned a new job. Please check your dashboard for details.';

    //sendNotificationToTechnician(technicianId, notificationMessage);

