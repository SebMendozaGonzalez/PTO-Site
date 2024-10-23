import React from 'react';
import './RequestView.css';

function RequestView({ requestDetails, onClose }) {
    if (!requestDetails) return null;

    return (
        <div className='request-popup'>
            <button className='close-btn' onClick={onClose}>✕</button>
            <div className='paddings flexColCenter'>
                <div className='first paddings flexCenter'>
                    <div className='paddings flexStart requester-info'>
                        <div className='flexColCenter'>
                            <span className='fonts-primary'>{requestDetails.name}</span>
                            <span className='fonts-secondary'>{requestDetails.employee_id}</span>
                        </div>
                    </div>
                    <div className='paddings flexEnd dates-and-type'>
                        <div className='flexColCenter'>
                            <span className='fonts-primary'>{requestDetails.type}</span>
                            <span className='fonts-secondary'>
                                <strong>from: </strong>{new Date(requestDetails.start_date).toLocaleDateString('en-US')}
                            </span>
                            <span className='fonts-secondary'>
                                <strong>to: </strong>{new Date(requestDetails.end_date).toLocaleDateString('en-US')}
                            </span>
                        </div>
                    </div>
                </div>
                <div className='second paddings flexColStart'>
                    <span className='fonts-regular'>
                        <strong>Requested on </strong>{new Date(requestDetails.request_date).toLocaleDateString('en-US')}
                    </span>
                    {requestDetails.accepted && (
                        <span className='fonts-regular'>
                            <strong>Accepted on </strong>{new Date(requestDetails.decision_date).toLocaleDateString('en-US')}
                        </span>
                    )}
                    {requestDetails.taken && (
                        <span className='fonts-regular-italic'>This time off was already taken</span>
                    )}
                </div>
                <div className='third paddings flexCenter'>
                    <div className='flexColStart'>
                        <span className='fonts-primary'>Justification</span>
                        <p className='fonts-regular'>{requestDetails.explanation}</p>
                    </div>
                    <div className='flexColEnd'>
                        <span className='fonts-regular'>Docs</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RequestView;
