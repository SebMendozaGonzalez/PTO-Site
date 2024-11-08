import React, { useState } from 'react';
import { Dialog, DialogContent, Box, Typography, TextField, Button } from '@mui/material';
import './EmployeeDeleteCard.css';


function EmployeeDeleteCard({ onClose, onDelete }) {
    const [step, setStep] = useState(1);  // Step 1: Confirmation, Step 2: Termination Reason
    const [terminationReason, setTerminationReason] = useState('');

    // Proceed to step 2 on confirmation
    const handleConfirmDelete = () => {
        setStep(2);
    };

    // Handle termination reason input change
    const handleReasonChange = (e) => {
        setTerminationReason(e.target.value);
    };

    // Handle delete action with the termination reason
    const handleDelete = () => {
        if (terminationReason.trim()) {
            onDelete(terminationReason);  // Call the onDelete prop with the reason
            onClose();  // Close the dialog after deletion
        } else {
            alert("Please provide a termination reason.");
        }
    };


    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
                    {step === 1 ? (
                        <>
                            <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700 }}>
                                Confirm Deletion
                            </Typography>
                            <Typography>
                                Are you sure you want to delete this employee? This action cannot be undone.
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Button variant="contained" color="primary" onClick={handleConfirmDelete}>
                                    Yes, Delete
                                </Button>
                                <Button variant="outlined" onClick={onClose}>
                                    Cancel
                                </Button>
                            </Box>
                        </>
                    ) : (
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
