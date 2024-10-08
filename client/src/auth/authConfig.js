import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
    auth: {
        clientId: "a564ad6f-c874-40c5-82c4-fbb412756468",
        authority: "https://login.microsoftonline.com/33d1ad6a-c8e7-4be9-bd3b-9942f85502bf",
        redirectUri: "quantumhr.azurewebsites.net" // Change this to your production URL later
    },
    cache: {
        cacheLocation: "localStorage", // This can also be 'sessionStorage'
        storeAuthStateInCookie: true, // Set this to true if you're having issues on IE11 or Edge
    },
    scopes: ["openid", "profile"] // Include this line
};

const msalInstance = new PublicClientApplication(msalConfig);

export default msalInstance;
