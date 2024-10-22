import React from 'react';
import './RequestView.css';

function RequestView({ request, onClose }) {
  return (
    <div className="request-popup-overlay" onClick={onClose}>
      <div className="request-popup" onClick={(e) => e.stopPropagation()}> {/* Prevent close on content click */}
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Request Details</h2>
        <p><strong>Name:</strong> {request.name}</p>
        <p><strong>Employee ID:</strong> {request.employee_id}</p>
        <p><strong>Type:</strong> {request.type}</p>
        <p><strong>Department:</strong> {request.department}</p>
        <p><strong>Start Date:</strong> {new Date(request.start_date).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> {new Date(request.end_date).toLocaleDateString()}</p>
        <p><strong>Accepted:</strong> {request.accepted ? 'Yes' : 'No'}</p>
        <p><strong>Taken:</strong> {request.taken ? 'Yes' : 'No'}</p>
        <p><strong>Discounted:</strong> {request.discounted ? 'Yes' : 'No'}</p>
        <p><strong>Cancelled:</strong> {request.cancelled ? 'Yes' : 'No'}</p>
        <p><strong>Returned:</strong> {request.returned ? 'Yes' : 'No'}</p>
        <p><strong>Decision Date:</strong> {request.decision_date ? new Date(request.decision_date).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Leader ID:</strong> {request.leader_id}</p>
        <p><strong>Explanation:</strong> {request.explanation}</p>
        <p><strong>Rejection Reason:</strong> {request.rejection_reason || 'N/A'}</p>
        <p><strong>Exception:</strong> {request.is_exception ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}

export default RequestView;
