import React, { Component } from 'react';

export const sendEmail = (email) => {
  const apiUrl = `/api/auto-email/send-email/${email}`;

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
    .then(response => {
      if (response.status === 200) {
        alert('Email sent successfully!');
      } else if (response.status === 500 || response.status === 404) {
        alert('Error sending the email. Please try again.');
      } else {
        throw new Error('Unexpected error');
      }
    })
    .catch(error => {
      console.error('There was an error sending the email:', error);
      alert('Error sending the email. Please try again.');
    });
};

export class SendEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  handleButtonClick = () => {
    const { email } = this.state;
    const apiUrl = `/api/auto-email/send-email/${email}`;

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then(response => {
        if (response.status === 200) {
          alert('Email sent successfully!');
        } else if (response.status === 500 || response.status === 404) {
          alert('Error sending the email. Please try again.');
        } else {
          throw new Error('Unexpected error');
        }
      })
      .catch(error => {
        console.error('There was an error sending the email:', error);
        alert('Error sending the email. Please try again.');
      });
  };


  handleInputChange = (e) => {
    this.setState({ email: e.target.value });
  };

  render() {
    const { email } = this.state;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div><h1>Send Email Test</h1></div>
        <div>
          <input
            type="text"
            placeholder="Enter email"
            value={email}
            onChange={this.handleInputChange}
          />
          <button onClick={this.handleButtonClick}>Submit</button>
        </div>
      </div>
    );
  }
}