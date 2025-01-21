import React, { useState, useEffect } from 'react';
import './LiquidationRequestPortal.css';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const LiquidationRequestPortal = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { employee_id } = location.state || {};
    const [formData, setFormData] = useState({
        employee_id: employee_id || '',
        name: '',
        leader_email: '',
        days: '',
        explanation: '',
        department: '',
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
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            console.log('Submitting liquidation request with data:', formData);

            // Make the API call to upload the request
            const response = await fetch('/api/liquidation-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const responseData = await response.json(); // Capture the response
            console.log('Response:', responseData);

            if (!response.ok) {
                throw new Error('Failed to submit request: ' + response.statusText);
            }

            setResponseMessage('Liquidation request submitted successfully!');

            // Close the success message after 3 seconds
            setTimeout(() => {
                setResponseMessage('');
            }, 3000);

            setFormData({
                employee_id: '',
                name: '',
                leader_email: '',
                days: '',
                explanation: '',
                department: '',
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
                <h2>Liquidation Request Form</h2>
            </div>

            {responseMessage && <p className="success-message">{responseMessage}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className='paddings innerWidth form'>
                <div className='flexCenter'>
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
                    <div className='flexColStart pack'>
                        <label>Department:</label>
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            readOnly
                            className="blocked-input"
                        />
                    </div>
                </div>

                <div className='flexCenter'>
                    <div className='flexColStart pack'>
                        <label>Days:</label>
                        <input
                            type="number"
                            name="days"
                            value={formData.days}
                            onChange={handleChange}
                            required
                        />
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

export default LiquidationRequestPortal;
