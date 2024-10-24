import React from 'react';
import './RequestView.css';

function RequestView({ requestDetails, onClose }) {
    if (!requestDetails) return null;

    return (
        <div className='request-popup'>
            <div className='popup-content'>
                <button className='close-btn' onClick={onClose}>✕</button>
                <div className='paddings flexColCenter innerWidth'>
                    <div className='first padding flexCenter innerWidth'>
                        <div className='left requester-info'>
                            <div className='flexColCenter'>
                                <span className='f1'>{requestDetails.name}</span>
                                <span className='f2'>{requestDetails.employee_id}</span>
                            </div>
                        </div>
                        <div className='right dates-and-type'>
                            <div className='flexColCenter'>
                                <span className='f1'>{requestDetails.type}</span>
                                <span className='f2'>
                                    <strong>from: </strong>{new Date(requestDetails.start_date).toLocaleDateString('en-US')}
                                </span>
                                <span className='f2'>
                                    <strong>to: </strong>{new Date(requestDetails.end_date).toLocaleDateString('en-US')}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='second padding flexColStart innerWidth'>
                        <span className='f3'>
                            <strong>Requested on:  </strong>{new Date(requestDetails.request_date).toLocaleDateString('en-US')}
                        </span>
                        {requestDetails.accepted && (
                            <span className='f3'>
                                <strong>Accepted on:  </strong>{new Date(requestDetails.decision_date).toLocaleDateString('en-US')}
                            </span>
                        )}
                        {requestDetails.decided && !requestDetails.accepted && (
                            <span className='f3'>
                                <strong>Rejected on:  </strong>{new Date(requestDetails.decision_date).toLocaleDateString('en-US')}
                            </span>
                        )}
                        {requestDetails.accepted && requestDetails.cancelled && (
                            <span className='f3'>
                            <strong>Cancelled on:  </strong>{new Date(requestDetails.cancel_date).toLocaleDateString('en-US')}
                        </span>
                        )}
                        {requestDetails.taken && (
                            <span className='f3-italic'>This time off was already taken</span>
                        )}
                    </div>
                    <div className='third padding flexCenter innerWidth'>
                        <div className='flexColStart left'>
                            <span className='f1 padding'>Justification</span>
                            <p className='f3'>{requestDetails.explanation}</p>
                            {requestDetails.decided && !requestDetails.accepted && (
                                <div className='padding'>
                                    <span className='f1 padding'>Rejection Reason</span>
                                    <p className='f3'>{requestDetails.rejection_reason}</p>
                                </div>
                            )}
                        </div>
                        <div className='flexColCenter right'>
                            <span className='f0'>Docs</span>
                        </div>
                    </div>
                    {!requestDetails.decided && (
                        <div className='fourth padding flexCenter innerWidth'>
                            <div className='left'>
                                <button className='decision-button'>Accept</button>
                            </div>
                            <div className='right'>
                                <button className='decision-button'>Reject</button>
                            </div>
                        </div>
                    )}

                </div>
            </div>

        </div>
    );
}

export default RequestView;
