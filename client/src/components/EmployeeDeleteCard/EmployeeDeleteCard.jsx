import React, { useState } from 'react';
import { Dialog, DialogContent, Box, Typography, TextField, Button, Alert } from '@mui/material';
import './EmployeeDeleteCard.css';

function EmployeeDeleteCard({ onClose, onDelete, employee }) {
    const [step, setStep] = useState(1); // Step 1: Confirmation, Step 2: Termination Reason, Step 3: Termination Date
    const [terminationReason, setTerminationReason] = useState('');
    const [terminationDate, setTerminationDate] = useState(''); // State for termination date
    const [showSuccess, setShowSuccess] = useState(false); // State for showing the success alert

    // Proceed to the next step
    const handleNextStep = () => {
        setStep(step + 1);
    };

    // Handle termination reason input change
    const handleReasonChange = (e) => {
        setTerminationReason(e.target.value);
    };

    // Handle termination date input change
    const handleDateChange = (e) => {
        setTerminationDate(e.target.value);
    };

    // Handle delete action with the termination reason and date
    const handleDelete = async () => {
        if (terminationReason.trim()) {
            try {
                // Make an API call to remove the employee
                const response = await fetch(`/remove-employee/${employee.employee_id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ termination_reason: terminationReason, termination_date: terminationDate }),
                });

                if (!response.ok) {
                    throw new Error('Failed to deactivate the employee');
                }

                // Call the onDelete prop with the termination reason (Optional for parent component logic)
                onDelete(terminationReason);
                setShowSuccess(true); // Show success notification
                setTimeout(() => {
                    setShowSuccess(false); // Close the notification after 3 seconds
                    onClose(); // Close the dialog after successful deletion
                }, 3000);
            } catch (error) {
                alert('Error deleting employee: ' + error.message);
            }
        } else {
            alert('Please provide a termination reason.');
        }
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
                    {showSuccess && (
                        <Alert severity="success" sx={{ marginBottom: 2 }}>
                            Employee successfully deleted!
                        </Alert>
                    )}
                    {step === 1 && (
                        <>
                            <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700 }}>
                                Confirm Deletion
                            </Typography>
                            <Typography>
                                Are you sure you want to delete this employee? This action cannot be undone.
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Button variant="contained" color="primary" onClick={handleNextStep}>
                                    Yes, Delete
                                </Button>
                                <Button variant="outlined" onClick={onClose}>
                                    Cancel
                                </Button>
                            </Box>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700 }}>
                                Provide Termination Reason
                            </Typography>
                            <TextField
                                label="Termination Reason"
                                value={terminationReason}
                                onChange={handleReasonChange}
                                fullWidth
                                required
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: 2 }}>
                                <Button variant="contained" color="primary" onClick={handleNextStep}>
                                    Next
                                </Button>
                                <Button variant="outlined" onClick={onClose}>
                                    Cancel
                                </Button>
                            </Box>
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700 }}>
                                Select Termination Date
                            </Typography>
                            <TextField
                                type="date"
                                value={terminationDate}
                                onChange={handleDateChange}
                                fullWidth
                                required
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: 2 }}>
                                <Button variant="contained" color="primary" onClick={handleDelete}>
                                    Save
                                </Button>
                                <Button variant="outlined" onClick={onClose}>
                                    Cancel
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default EmployeeDeleteCard;

