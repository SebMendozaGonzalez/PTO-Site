const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Define the base directory where the photos are mounted
const photosDir = '/employee-photos';

router.get('/:employee_id.jpeg', (req, res) => {
  const photoPath = path.join(photosDir, `${req.params.employee_id}.jpeg`);
  const defaultPhoto = path.join(photosDir, '0.jpeg');

  // Check if the requested photo exists
  fs.access(photoPath, fs.constants.F_OK, (err) => {
    if (err) {
      // If photo doesn't exist, send the default photo
      console.log(`Photo not found for employee: ${req.params.employee_id}. Serving default photo.`);
      res.sendFile(defaultPhoto);
    } else {
      // If photo exists, send the requested photo
      res.sendFile(photoPath);
    }
  });
});

module.exports = router;
