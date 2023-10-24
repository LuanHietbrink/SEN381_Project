import React, { Component } from 'react';
import ClientDashboardNav from '../Navigation/ClientNav/ClientDashboardNav';

export class ClientDashboard extends Component {
  render() {
    const { clientName } = this.props;

    return (
      <div>
        <ClientDashboardNav />
        <h1>Client Dashboard</h1>
        <h2>Welcome, {clientName}!</h2>
      </div>
    );
  }
}