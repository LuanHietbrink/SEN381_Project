import SendbirdApp from '@sendbird/uikit-react/App';
import '@sendbird/uikit-react/dist/index.css';

const Messaging = () => {
    return (
        <div className="App">
            <SendbirdApp
                // Add the two lines below.
                appId="B52AC039-499A-47A3-8718-634BE259475F"   // Specify your Sendbird application ID.
                userId="Test2"       // Specify your user ID.
            />
        </div>
    );
};

export default Messaging;
