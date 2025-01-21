import React, { useState, useEffect } from 'react';
import './RequestPortal.css';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const RequestPortal = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { type, employee_id } = location.state || {};
    const [formData, setFormData] = useState({
        type: type || '',
        start_date: '',
        end_date: '',
        explanation: '',
        is_exception: 0,
        employee_id: employee_id || '',
        name: '',
        leader_email: '',
        department: ''
    });

    const [responseMessage, setResponseMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch employee details based on employee_id
    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            if (!formData.employee_id) return;

            try {
                const response = await fetch(`/api/employee/${formData.employee_id}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch employee details: ${response.statusText}`);
                }

                const [employeeData] = await response.json(); // Assuming a single record is returned
                setFormData((prev) => ({
                    ...prev,
                    name: employeeData.name || '',
                    leader_email: employeeData.leader_email || '',
                    department: employeeData.department || ''
                }));
            } catch (err) {
                setError(err.message);
                console.error('Error fetching employee details:', err);
            }
        };

        fetchEmployeeDetails();
    }, [formData.employee_id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // Format the dates to yyyy-mm-dd
            const startDate = new Date(formData.start_date).toISOString().split('T')[0];
            const endDate = new Date(formData.end_date).toISOString().split('T')[0];

            console.log('Submitting request with data:', {
                ...formData,
                start_date: startDate,
                end_date: endDate
            });

            // Make the API call to upload the request
            const response = await fetch('/api/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    start_date: startDate,
                    end_date: endDate
                })
            });

            const responseData = await response.json(); // Capture the response
            console.log('Response:', responseData);

            if (!response.ok) {
                throw new Error('Failed to submit request: ' + response.statusText);
            }

            setResponseMessage('Request submitted successfully!');

            // Close the success message after 3 seconds
            setTimeout(() => {
                setResponseMessage('');
            }, 3000);

            setFormData({
                type: '',
                start_date: '',
                end_date: '',
                explanation: '',
                is_exception: 0,
                employee_id: '',
                name: '',
                leader_email: '',
                department: ''
            });

            // Redirect to employee portal after successful submission
            navigate('/employee-portal');
        } catch (err) {
            setError('Failed to submit request: ' + err.message);
        } finally {
            setIsSubmitting(false);
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
                    <label>Explanation (optional):</label>
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
