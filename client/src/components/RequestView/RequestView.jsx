import React from 'react';
import './RequestView.css';

function RequestView({ requestDetails, onClose }) {
  if (!requestDetails) return null;

  return (
    <div className='request-popup'>
      <div className='popup-content'>
        <button className='close-btn' onClick={onClose}>✕</button>
        <h2>Request Details</h2>
        <p><strong>Name:</strong> {requestDetails.name}</p>
        <p><strong>Employee ID:</strong> {requestDetails.employee_id}</p>
        <p><strong>Start Date:</strong> {requestDetails.start_date}</p>
        <p><strong>End Date:</strong> {requestDetails.end_date}</p>
        <p><strong>Type:</strong> {requestDetails.type}</p>
        <p><strong>Accepted:</strong> {requestDetails.accepted ? 'Yes' : 'No'}</p>
        <p><strong>Taken:</strong> {requestDetails.taken ? 'Yes' : 'No'}</p>
        <p><strong>Explanation:</strong> {requestDetails.explanation}</p>
      </div>
    </div>
  );
}

export default RequestView;
