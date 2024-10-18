import React, { useState } from 'react';
import './RequestPortal.css';
import { useLocation, Link } from 'react-router-dom';

const RequestPortal = () => {
    const location = useLocation();
    const { type, employee_id } = location.state || {};
    const [formData, setFormData] = useState({
        type: type || '',
        start_date: '',
        end_date: '',
        explanation: '',
        is_exception: false,
        employee_id: employee_id || ''
    });

    const [responseMessage, setResponseMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mapping of long form to short form
    const typeMapping = {
        'Paid Time Off': 'PTO',
        'Maternity License': 'ML',
        'Paternity License': 'PL',
        'Domestic Calamity License': 'DCL',
        'Bereavement License': 'BL',
        'Unpaid Time Off': 'UTO'
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return; // Prevent multiple submissions
        setIsSubmitting(true); // Set submitting state

        try {
            // Format the dates to yyyy-mm-dd
            const startDate = new Date(formData.start_date).toISOString().split('T')[0];
            const endDate = new Date(formData.end_date).toISOString().split('T')[0];

            // Make the API call to upload the request
            const response = await fetch('https://quantumhr.azurewebsites.net/request', { // Adjust the API endpoint as necessary
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type_of_to: typeMapping[formData.type] || formData.type, // Use the short form here
                    start_date: startDate,
                    end_date: endDate,
                    request_date: new Date().toISOString().split('T')[0],
                    explanation: formData.explanation,
                    employee_id: formData.employee_id,
                    is_exception: formData.is_exception
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit request: ' + response.statusText);
            }

            setResponseMessage('Request submitted successfully!');
            setFormData({
                type_of_to: '',
                start_date: '',
                end_date: '',
                explanation: '',
                employee_id: ''
            });
        } catch (err) {
            setError('Failed to submit request: ' + err.message);
        } finally {
            setIsSubmitting(false); // Reset submitting state
        }
    };

    return (
        <div className="request-portal paddings flexColStart"
            style={{ marginTop: "4rem", marginBottom: "4rem", maxHeight: "40rem" }}>
            <div className='flexStart'>
                <div className='paddings'>
                    <Link to="/employee-portal">
                        <button className='btn innerWidth'>
                            Go back
                        </button>
                    </Link>
                </div>
                <h2>Vacation Request Form</h2>
            </div>
            
            {responseMessage && <p className="success-message">{responseMessage}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className='paddings innerWidth form'>
                <div className='flexCenter'>
                    <div className='flexColStart pack'>
                        <label>Type of Time Off:</label>
                        <input
                            type="text"
                            name="type"
                            value={formData.type}
                            readOnly
                            className="blocked-input"
                            required
                        />
                    </div>
                    <div className='flexColStart pack'>
                        <label>Employee ID:</label>
                        <input
                            type="text"
                            name="employee_id"
                            value={formData.employee_id}
                            readOnly
                            className="blocked-input"
                            required
                        />
                    </div>
                </div>

                <div className='flexCenter'>
                    <div className='flexColStart pack'>
                        <label>Start Date:</label>
                        <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required />
                    </div>
                    <div className='flexColStart pack'>
                        <label>End Date:</label>
                        <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />
                    </div>
                </div>

                <div className='flexColStart explanation'>
                    <label>Explanation:</label>
                    <textarea name="explanation" value={formData.explanation} onChange={handleChange}></textarea>
                </div>

                <div>
                    <button type="submit" disabled={isSubmitting}>Submit</button>
                </div>
            </form>
        </div>
    );
};

export default RequestPortal;
