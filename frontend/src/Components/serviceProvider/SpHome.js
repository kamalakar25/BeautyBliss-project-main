import React from 'react';
import ServicePage from '../serviceProvider/ServicePage';
import AdminPage from '../serviceProvider/ServiceProviderDashbord';
import SPpaymentDetails from '../serviceProvider/SPpaymentDetails';
import SpBookingDetails from '../serviceProvider/SPbookingDetails';

function SpHome() {
  return (
    <div className="container-fluid" style={{ marginTop: '80px', overflowX: 'hidden' }}>
      <h1 className="text-center mb-4">Service Provider Dash Board</h1>

      <div className="row">
        <div
          className="col-12 mb-4"
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            overflowX: 'hidden'
          }}
        >
          <SPpaymentDetails />
        </div>
      </div>

      <div className="row">
        <div
          className="col-12 mb-4"
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            overflowX: 'hidden'
          }}
        >
          <SpBookingDetails />
        </div>
      </div>

      <div className="row" style={{ display: 'flex', overflowX: 'hidden' }}>
        <div
          className="col-12 col-md-6 mb-4"
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            overflowX: 'hidden'
          }}
        >
          <ServicePage />
        </div>
        <div
          className="col-12 col-md-6 mb-4"
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            overflowX: 'hidden'
          }}
        >
          <AdminPage />
        </div>
      </div>
    </div>
  );
}

export default SpHome;
