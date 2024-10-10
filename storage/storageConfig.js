const { DefaultAzureCredential } = require('@azure/identity');
const { BlobServiceClient } = require('@azure/storage-blob');

const account_url = process.env.AZURE_STORAGEBLOB_RESOURCEENDPOINT;

const credential = new DefaultAzureCredential();

const blobServiceClient = new BlobServiceClient(account_url, credential);

// Export the blobServiceClient
module.exports = blobServiceClient;
