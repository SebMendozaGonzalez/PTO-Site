const sql = require('mssql');

// Extracting the necessary environment variables
const server = process.env.AZURE_SQL_SERVER;
const database = process.env.AZURE_SQL_DATABASE;
const port = parseInt(process.env.AZURE_SQL_PORT);
const authenticationType = process.env.AZURE_SQL_AUTHENTICATIONTYPE; // You can use this if needed

// Database configuration using Azure App Service environment variables
const dbConfig = {
    server, 
    port,
    database,
    authentication: {
        type: authenticationType
    },
    options: {
        encrypt: true,
        trustServerCertificate: false
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
