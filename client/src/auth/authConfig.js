import { PublicClientApplication } from '@azure/msal-browser';
import { LogLevel } from '@azure/msal-browser';

export const msalConfig = {
  auth: {
    clientId: "a564ad6f-c874-40c5-82c4-fbb412756468",
    authority: "https://login.microsoftonline.com/33d1ad6a-c8e7-4be9-bd3b-9942f85502bf",
    redirectUri: "https://quantumhr.azurewebsites.net/auth/callback"
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
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      }
    }
  }
};

export const loginRequest = {
  scopes: ["User.Read"]
};

// Initialize the msalInstance and export it
export const msalInstance = new PublicClientApplication(msalConfig);
