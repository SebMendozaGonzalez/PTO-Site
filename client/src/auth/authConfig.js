// src/auth/authConfig.js
import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
    auth: {
        clientId: "a564ad6f-c874-40c5-82c4-fbb412756468",
        authority: "https://login.microsoftonline.com/33d1ad6a-c8e7-4be9-bd3b-9942f85502bf",
        redirectUri: "https://quantumhr.azurewebsites.net/.auth/login/aad/callback"
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true,
    },
    scopes: ["openid", "profile"]
};

// Create an instance of PublicClientApplication
const msalInstance = new PublicClientApplication(msalConfig);

// Export the MSAL instance
export default msalInstance;
