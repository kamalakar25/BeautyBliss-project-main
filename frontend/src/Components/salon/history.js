// PaymentHistory.js
import React from "react";

const paymentData = [
  {
    id: 1,
    customer: "Alice Johnson",
    service: "Haircut",
    amount: "$30",
    date: "2025-04-01",
 
  },
  {
    id: 2,
    customer: "Bob Smith",
    service: "Facial",
    amount: "$50",
    date: "2025-04-03",
    
  },
  {
    id: 3,
    customer: "Clara Adams",
    service: "Manicure",
    amount: "$25",
    date: "2025-04-05",
    
  },
];

const PaymentHistory = () => {
  return (
    <div className="container">
      <h2 className="title">Payment History</h2>
      <div className="table-wrapper">
        <table className="payment-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Date</th>
             
            </tr>
          </thead>
          <tbody>
            {paymentData.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.customer}</td>
                <td>{payment.service}</td>
                <td>{payment.amount}</td>
                <td>{payment.date}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 40px auto;
          padding: 20px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .title {
          text-align: center;
          font-size: 28px;
          margin-bottom: 20px;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .payment-table {
          width: 100%;
          border-collapse: collapse;
        }

        .payment-table th,
        .payment-table td {
          padding: 12px;
          border: 1px solid #eee;
          text-align: center;
        }

        .payment-table th {
          background-color: #f8f8f8;
          font-weight: 600;
        }

        .completed {
          color: green;
          font-weight: 600;
        }

        .pending {
          color: orange;
          font-weight: 600;
        }

        @media (max-width: 600px) {
          .payment-table th,
          .payment-table td {
            font-size: 14px;
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentHistory;
