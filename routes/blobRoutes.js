import express from 'express';
import blobServiceClient from '../storage/storageConfig'; // Update with the correct path

const router = express.Router();

// Route to get the URL of the employee's photo
router.get('/photo/:employee_id', async (req, res) => {
    const { employee_id } = req.params;
    const blobName = `${employee_id}.jpeg`; // Construct the blob name

    try {
        const containerClient = blobServiceClient.getContainerClient('quantumhr-photos');
        const blobClient = containerClient.getBlobClient(blobName);

        // Check if the blob exists
        const exists = await blobClient.exists();
        if (!exists) {
            // If the photo does not exist, use the default photo
            const defaultBlobClient = containerClient.getBlobClient('0.jpeg');
            const defaultUrl = defaultBlobClient.url;
            return res.status(200).json({ photoUrl: defaultUrl });
        }

        // Generate the URL for the blob
        const url = blobClient.url;

        res.status(200).json({ photoUrl: url });
    } catch (error) {
        console.error('Error fetching photo URL:', error);
        res.status(500).json({ error: 'Failed to fetch photo URL' });
    }
});

export default router;

