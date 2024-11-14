import React, { useState, useEffect } from 'react';
import './RequestView.css';

function RequestView({ requestDetails, onClose, managerPermissions, employeePermissions }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [decision, setDecision] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [error, setError] = useState('');
    const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });

    useEffect(() => {
        setShowConfirm(false);
        setDecision(null);
        setRejectionReason('');
        setError('');
        setStatusMessage({ message: '', type: '' });
    }, [requestDetails]);

    if (!requestDetails) return null;

    const handleDecision = (decisionType) => {
        setDecision(decisionType);
        setShowConfirm(true);
    };

    const handleRequestResponse = async (response) => {
        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(errorDetails.message || 'Failed to update the request.');
        }
        return response.json();
    };


    const cancelRequest = async () => {
        try {
            const response = await fetch('/cancel-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ request_id: requestDetails.request_id }),
            });
    
            const result = await response.json();
            if (response.ok) {
                setStatusMessage({ message: 'Request canceled successfully!', type: 'success' });
                onClose();
            } else {
                setStatusMessage({ message: 'Failed to cancel the request. Please try again.', type: 'failure' });
                console.error('Error in response:', result);
            }
        } catch (err) {
            console.error('Error canceling request:', err);
            setStatusMessage({ message: 'An error occurred. Please try again.', type: 'failure' });
        }
    };
    

    const submitDecision = async () => {
        if (decision === 'reject' && !rejectionReason) {
            setError('Rejection reason is required.');
            return;
        }

        setShowConfirm(false);

        try {
            const acceptedValue = String(decision === 'accept');
            const response = await fetch('/decide-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    request_id: requestDetails.request_id,
                    accepted: acceptedValue,
                    rejection_reason: rejectionReason,
                }),
            });

            const updatedRequest = await handleRequestResponse(response);
            console.log('Updated request:', updatedRequest);

            setStatusMessage({
                message: `${requestDetails.type} request ${decision === 'accept' ? 'accepted' : 'rejected'} successfully!`,
                type: 'success',
            });
            onClose();
        } catch (err) {
            console.error('Error submitting decision:', err);
            setStatusMessage({
                message: `Failed to ${decision === 'accept' ? 'accept' : 'reject'} the request. Please try again.`,
                type: 'failure',
            });
        }
    };

    const handleConfirm = () => {
        submitDecision();
    };

    // Conditional Elements for Cleaner Rendering
    const decisionButtons = managerPermissions && !requestDetails.decided && (
        <div className='fourth padding flexCenter innerWidth'>
            <div className='left'>
                <button className='decision-button' onClick={() => handleDecision('accept')}>Accept</button>
            </div>
            <div className='right'>
                <button className='decision-button' onClick={() => handleDecision('reject')}>Reject</button>
            </div>
        </div>
    );

    const cancellationButton = employeePermissions && ((requestDetails.decided && requestDetails.accepted && !requestDetails.taken) || !requestDetails.decided ) && !requestDetails.cancelled && (
        <div className='fourth padding flexCenter innerWidth'>
            <div className='left'>
                <button className='decision-button' onClick={cancelRequest}>Cancel Request</button>
            </div>
        </div>
    );

    const confirmationModal = managerPermissions && showConfirm && (
        <div className='confirm-modal padding'>
            <span className='f3 paddings flexColStart'>
                Are you sure you want to {decision === 'accept' ? 'accept' : 'reject'} this request?
            </span>
            {decision === 'reject' && (
                <div>
                    <label className='paddings'>
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
            <button className='confirm-button paddings' style={{ transform: 'scale(0.8)' }} onClick={handleConfirm}>Confirm</button>
            <button className='cancel-button paddings' style={{ transform: 'scale(0.8)' }} onClick={() => setShowConfirm(false)}>Cancel</button>
        </div>
    );

    const statusMessageDisplay = managerPermissions && statusMessage.message && (
        <div
            className={`status-message paddings ${statusMessage.type === 'success' ? 'success-message' : 'failure-message'}`}
            style={{ color: statusMessage.type === 'success' ? 'green' : 'red', fontWeight: '600' }}
        >
            {statusMessage.message}
        </div>
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { timeZone: 'UTC' });
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
                                <span className='f1 flexColCenter'>{requestDetails.type || requestDetails.type}</span>
                                <span className='f2'>
                                    <strong>from: </strong>{formatDate(requestDetails.start_date)}
                                </span>
                                <span className='f2'>
                                    <strong>to: </strong>{formatDate(requestDetails.end_date)}
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
                            <strong>Requested on:  </strong>{formatDate(requestDetails.request_date)}
                        </span>
                        {requestDetails.accepted && (
                            <span className='f3'>
                                <strong>Accepted on:  </strong>{formatDate(requestDetails.decision_date)}
                            </span>
                        )}
                        {requestDetails.decided && !requestDetails.accepted && (
                            <span className='f3'>
                                <strong>Rejected on:  </strong>{formatDate(requestDetails.decision_date)}
                            </span>
                        )}
                        {requestDetails.accepted && requestDetails.cancelled && (
                            <span className='f3'>
                                <strong>Cancelled on:  </strong>{formatDate(requestDetails.cancel_date)}
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

                    {decisionButtons}

                    {confirmationModal}

                    {statusMessageDisplay}

                    {cancellationButton}

                </div>
            </div>
        </div>
    );
}

export default RequestView;
