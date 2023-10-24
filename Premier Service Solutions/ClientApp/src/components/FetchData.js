import React, { Component } from 'react';

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
    super(props);
    this.state = { clients: [], loading: true };
  }

  componentDidMount() {
    this.populateWeatherData();
  }

  static renderForecastsTable(clients) {
    return (
      <div className='table-wrapper'>
        <table className="table table-scroll table-striped" aria-labelledby="tableLabel">
          <thead>
              <tr>
                  <th>ID</th>
                  <th>Client Name</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Address</th>
                  <th>Contact</th>
              </tr>
          </thead>
          <tbody>
              {clients.map(clients =>
                <tr> {clients.clientId}
                    <td>{clients.clientName}</td>
                    <td>{clients.email}</td>
                    <td>{clients.password}</td>
                    <td>{clients.address}</td>
                    <td>{clients.contactNumber}</td>
                </tr> 
              )}
          </tbody>
        </table>
      </div>

    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : FetchData.renderForecastsTable(this.state.clients);

    return (
      <div>
        <h1 id="tableLabel">Client Data</h1>
        <p>This component demonstrates fetching data from the server.</p>
        {contents}
      </div>
    );
  }

  async populateWeatherData() {
    const response = await fetch('api/clients');
    const data = await response.json();
    this.setState({ clients: data, loading: false });
  }
}