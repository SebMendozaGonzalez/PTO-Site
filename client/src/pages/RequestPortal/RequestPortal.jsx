import React, { useState } from 'react';
import './RequestPortal.css';
import { useLocation } from 'react-router-dom'; 
import axios from 'axios'; // Make sure to import axios for API calls

const RequestPortal = () => {
    const location = useLocation();
    const { type, employee_id } = location.state || {};
    const [formData, setFormData] = useState({
        type_of_to: type || '',
        start_date: '',
        end_date: '',
        explanation: '',
        is_exception: false,
        employee_id: employee_id || ''
    });

    const [responseMessage, setResponseMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // New state for tracking submission

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Disable the submit button
        const { start_date, end_date, explanation, employee_id, is_exception, type_of_to } = formData;

        try {
            // Format dates to yyyy-mm-dd
            const formattedStartDate = new Date(start_date).toISOString().split('T')[0];
            const formattedEndDate = new Date(end_date).toISOString().split('T')[0];

            // Make an API call to submit the request
            await axios.post('/request', {
                type_of_to,
                start_date: formattedStartDate,
                end_date: formattedEndDate,
                explanation,
                is_exception,
                employee_id
            });

            // Display success message
            setResponseMessage('Request submitted successfully!');
            setFormData({
                type_of_to: '',
                start_date: '',
                end_date: '',
                explanation: '',
                employee_id: ''
            });
        } catch (err) {
            setError('Failed to submit request: ' + err.response?.data?.message);
        } finally {
            setIsSubmitting(false); // Re-enable the submit button
        }
    };

    return (
        <div className="request-portal paddings flexColStart" style={{ marginTop: "4rem", marginBottom: "4rem", maxHeight: "40rem" }}>
            <h2>Vacation Request Form</h2>
            {responseMessage && <p className="success-message">{responseMessage}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className='paddings innerWidth form'>
                <div className='flexCenter'>
                    <div className='flexColStart pack'>
                        <label>Type of Time Off:</label>
                        <input
                            type="text"
                            name="type_of_to"
                            value={formData.type_of_to}
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
                    <button type="submit" disabled={isSubmitting}>Submit</button> {/* Disable button while submitting */}
                </div>
            </form>
        </div>
    );
};

export default RequestPortal;
