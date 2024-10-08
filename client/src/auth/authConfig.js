// src/auth/authConfig.js
const msalConfig = {
    auth: {
      clientId: "a564ad6f-c874-40c5-82c4-fbb412756468",
      authority: "https://login.microsoftonline.com/33d1ad6a-c8e7-4be9-bd3b-9942f85502bf",
      redirectUri: "https://quantumhr.azurewebsites.net/.auth/login/aad/callback"
    },
    cache: {
      cacheLocation: "localStorage", // Store in localStorage to persist login
      storeAuthStateInCookie: true,
    },
    scopes: ["openid", "profile"] // Include the default scopes
  };
  
  export default msalConfig;
  