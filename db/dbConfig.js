const sql = require('mssql');

// Database configuration using Azure App Service environment variables
const dbConfig = {
    user: process.env.SQLAZURECONNSTR_quantumvacations_User,
    password: process.env.SQLAZURECONNSTR_quantumvacations_Password,
    server: process.env.SQLAZURECONNSTR_quantumvacations_Server, 
    database: process.env.SQLAZURECONNSTR_quantumvacations_InitialCatalog,
    options: {
        encrypt: true, // Use encryption for Azure SQL
        trustServerCertificate: false // Use if required by the configuration
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
