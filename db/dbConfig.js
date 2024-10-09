const sql = require('mssql');

// Database configuration using Azure App Service environment variables
const dbConfig = {
    user: process.env.AZURE_SQL_SERVER_User, // Replace with actual service connector environment variables
    password: process.env.AZURE_SQL_SERVER_Password,
    server: process.env.AZURE_SQL_SERVER, 
    database: process.env.AZURE_SQL_DATABASE,
    options: {
        encrypt: true, // Use encryption for Azure SQL
        trustServerCertificate: false // Set to true if required by your configuration
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
