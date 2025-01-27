import { PublicClientApplication } from '@azure/msal-browser';
import { LogLevel } from '@azure/msal-browser';

// Environment-based configuration

console.log("Node env: ", process.env.NODE_ENV);
console.log(process.env.NODE_ENV === "production");

export const msalConfig = {
  auth: {
    clientId: "a564ad6f-c874-40c5-82c4-fbb412756468",
    authority: "https://login.microsoftonline.com/33d1ad6a-c8e7-4be9-bd3b-9942f85502bf",
    redirectUri: "https://quantumhr-quantumh-testing.azurewebsites.net/auth/callback",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: true,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          default:
            return;
        }
      }
    }
  }
};

export const loginRequest = {
  scopes: ["openid", "profile", "User.Read"]
};

// Initialize the msalInstance and export it
export const msalInstance = new PublicClientApplication(msalConfig);
