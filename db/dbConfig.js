const sql = require('mssql');

// Database configuration using Azure App Service environment variables
const dbConfig = {
    server: process.env.AZURE_SQL_SERVER, 
    database: process.env.AZURE_SQL_DATABASE,
    port: parseInt(process.env.AZURE_SQL_PORT), // Ensure port is an integer
    authentication: {
        type: 'azure-active-directory-default' // Azure AD default authentication
    },
    options: {
        encrypt: true, // Use encryption for Azure SQL
        trustServerCertificate: false // Set to true only if needed
    }
};

// Function to connect to the SQL database
async function connectToDatabase() {
    try {
        const pool = await sql.connect(dbConfig);
        console.log('Connected to Azure SQL Database');
        return pool;
    } catch (error) {
        console.error('Database connection failed: ', error);
        throw error;
    }
}

// Export the connection function
module.exports = {
    connectToDatabase
};
