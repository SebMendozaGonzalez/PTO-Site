const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Define the directory where the photos are stored
const photoDirectory = '/employee-photos'; // Mounted Azure Blob Storage path

// Route to serve employee photos
router.get('/:employee_id.jpeg', (req, res) => {
    const employeeId = req.params.employee_id;
    const photoPath = path.join(photoDirectory, `${employeeId}.jpeg`);

    // Check if the photo exists
    fs.access(photoPath, fs.constants.F_OK, (err) => {
        if (err) {
            // If the photo is not found, serve the default photo
            const defaultPhotoPath = path.join(photoDirectory, '0.jpeg');
            return res.sendFile(defaultPhotoPath);
        } else {
            // If found, serve the employee photo
            return res.sendFile(photoPath);
        }
    });
});

module.exports = router;
