import React, { useState, useEffect } from 'react';
import './RequestView.css';

function RequestView({ requestDetails, onClose, onSubmitDecision }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [decision, setDecision] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [failureMessage, setFailureMessage] = useState(''); // Added state for failure message

    useEffect(() => {
        // Reset state when requestDetails changes (new popup is opened)
        setShowConfirm(false);
        setDecision(null);
        setRejectionReason('');
        setError('');
        setSuccessMessage(''); // Reset success message
        setFailureMessage(''); // Reset failure message
    }, [requestDetails]);

    if (!requestDetails) return null;

    const handleDecision = (decisionType) => {
        setDecision(decisionType);
        setShowConfirm(true);
    };

    const handleConfirm = async () => {
        if (decision === 'reject' && !rejectionReason) {
            setError('Rejection reason is required.');
            return;
        }

        setShowConfirm(false);

        try {
            // Convert decision to 1 or 0 for the "accepted" column
            const acceptedValue = String(decision === 'accept');

            await onSubmitDecision(requestDetails.request_id, acceptedValue, rejectionReason);
            setSuccessMessage(`${requestDetails.type} request ${decision === 'accept' ? 'accepted' : 'rejected'} successfully!`);
            setFailureMessage(''); // Clear any previous failure message
        } catch (err) {
            setFailureMessage(`Failed to ${decision === 'accept' ? 'accept' : 'reject'} the request. Please try again.`);
            setSuccessMessage(''); // Clear any previous success message
        }
    };


    return (
        <div className='request-popup'>
            <div className='popup-content'>
                <button className='close-btn' onClick={onClose}>✕</button>

                <div className="dots-container">
                    <div className={`dot ${requestDetails.decided ? (requestDetails.accepted ? 'green' : 'red') : 'grey'}`}></div>
                    <div className={`dot ${requestDetails.taken ? 'green' : (requestDetails.cancelled ? 'red' : 'grey')}`}></div>
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

                    {/* Separator */}
                    <div className='innerWidth padding'>
                        <div className="separator"></div>
                    </div>

                    {/* Second Section */}
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

                    {/* Separator */}
                    <div className='innerWidth padding'>
                        <div className="separator"></div>
                    </div>

                    {/* Third Section */}
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

                    {/* Separator */}
                    <div className='innerWidth padding'>
                        <div className="separator"></div>
                    </div>

                    {/* Fourth Section */}
                    {!requestDetails.decided && (
                        <div className='fourth padding flexCenter innerWidth'>
                            <div className='left'>
                                <button className='decision-button' onClick={() => handleDecision('accept')}>Accept</button>
                            </div>
                            <div className='right'>
                                <button className='decision-button' onClick={() => handleDecision('reject')}>Reject</button>
                            </div>
                        </div>
                    )}

                    {/* Display Success Message */}
                    {successMessage && (
                        <div className='success-message paddings' style={{ color: 'green', fontWeight: '600' }}>
                            {successMessage}
                        </div>
                    )}

                    {/* Display Failure Message */}
                    {failureMessage && (
                        <div className='failure-message paddings' style={{ color: 'red', fontWeight: '600' }}>
                            {failureMessage}
                        </div>
                    )}

                    {/* Confirmation Modal */}
                    {showConfirm && (
                        <div className='confirm-modal padding'>
                            <span className='f3 paddings flexColStart'>
                                Are you sure you want to {decision === 'accept' ? 'accept' : 'reject'} this request?
                            </span>
                            {decision === 'reject' && (
                                <div>
                                    <label className='paddings '>
                                        <span className='f1' style={{ paddingRight: '1em' }}>
                                            Rejection reason:
                                        </span>
                                        <input
                                            className='rejection-reason f3'
                                            type='text'
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                        />
                                    </label>
                                    {error && <span className='error'>{error}</span>}
                                </div>
                            )}

                            <button className='confirm-button paddings'
                                style={{ transform: 'scale(0.8)' }}
                                onClick={handleConfirm}>Confirm</button>

                            <button className='cancel-button paddings'
                                style={{ transform: 'scale(0.8)' }}
                                onClick={() => setShowConfirm(false)}>Cancel</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RequestView;
