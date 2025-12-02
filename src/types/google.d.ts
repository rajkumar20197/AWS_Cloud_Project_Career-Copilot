// Google API type declarations

declare global {
  interface Window {
    gapi: {
      load: (apis: string, callback: () => void) => void;
      client: {
        init: (config: {
          apiKey: string;
          clientId: string;
          discoveryDocs: string[];
          scope: string;
        }) => Promise<void>;
        gmail: {
          users: {
            messages: {
              list: (params: any) => Promise<any>;
              get: (params: any) => Promise<any>;
              send: (params: any) => Promise<any>;
            };
          };
        };
        calendar: {
          events: {
            list: (params: any) => Promise<any>;
            insert: (params: any) => Promise<any>;
          };
          freebusy: {
            query: (params: any) => Promise<any>;
          };
        };
      };
      auth2: {
        getAuthInstance: () => {
          isSignedIn: {
            get: () => boolean;
            listen: (callback: (isSignedIn: boolean) => void) => void;
          };
          signIn: () => Promise<any>;
          signOut: () => Promise<void>;
          currentUser: {
            get: () => any;
          };
          grantOfflineAccess: (options: any) => Promise<any>;
        };
      };
    };
  }
}

export {};