import React from 'react';
import Dots from '../Dots/Dots';
import './LiquidationRequestView.css';

function LiquidationRequestView({ requestDetails, onClose }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { timeZone: 'UTC' });
  };

  return (
    <div className='request-popup'>
      <div className='popup-content'>
        <button className='close-btn' onClick={onClose}>✕</button>

        <div className="dots-container">
          <Dots requestDetails={requestDetails} />
        </div>

        <div className='paddings flexColCenter innerWidth'>
          {/* First Section */}
          <div className='first padding flexCenter innerWidth'>
            <div className='left requester-info'>
              <div className='flexColCenter'>
                <span className='f1'>{requestDetails.name}</span>
                <span className='f2'>{requestDetails.employee_id}</span>
              </div>
            </div>
            <div className='right dates-and-type'>
              <div className='flexColCenter'>
                <span className='f2'>
                  <strong>Requested on: </strong>{formatDate(requestDetails.request_date)}
                </span>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className='innerWidth padding'>
            <div className="separator"></div>
          </div>

          {/* Second Section */}
          <div className='second padding flexColStart innerWidth'>
            {requestDetails.accepted && (
              <span className='f3'>
                <strong>Accepted on: </strong>{formatDate(requestDetails.decision_date)}
              </span>
            )}
            {requestDetails.decided && !requestDetails.accepted && (
              <span className='f3'>
                <strong>Rejected on: </strong>{formatDate(requestDetails.decision_date)}
              </span>
            )}
            {requestDetails.decided && (
              <span className='f3'>
                <strong>Decided by: </strong>{requestDetails.decided_by}
              </span>
            )}
            {requestDetails.accepted && requestDetails.cancelled && (
              <span className='f3'>
                <strong>Cancelled on: </strong>{formatDate(requestDetails.cancel_date)}
              </span>
            )}
          </div>

          {/* Separator */}
          <div className='innerWidth padding'>
            <div className="separator"></div>
          </div>

          {/* Third Section */}
          <div className='third padding flexCenter innerWidth'>
            <div className='flexColStart left'>
              <span className='f1 padding'>Justification</span>
              <p className='f3'>{requestDetails.explanation || 'No justification provided'}</p>
              {requestDetails.decided && !requestDetails.accepted && (
                <div className='padding'>
                  <span className='f1 padding'>Rejection Reason</span>
                  <p className='f3'>{requestDetails.rejection_reason || 'No rejection reason provided'}</p>
                </div>
              )}
            </div>
            <div className='flexColCenter right'>
              <span className='f0'>Docs</span>
              <p className='f3'>No documentation available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiquidationRequestView;
