/**
 * Google OAuth Authentication Service
 * Handles complete Google authentication flow for Gmail and Calendar
 */

import { config } from '../config/env';

interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  accessToken: string;
  refreshToken?: string;
}

class GoogleAuthService {
  private gapi: any = null;
  private authInstance: any = null;
  private isInitialized = false;

  // Initialize Google API
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.gapi) {
        reject(new Error('Google API not loaded. Make sure to include the Google API script.'));
        return;
      }

      window.gapi.load('auth2:client', async () => {
        try {
          await window.gapi.client.init({
            apiKey: config.google?.apiKey || process.env.VITE_GOOGLE_API_KEY,
            clientId: config.google?.clientId || process.env.VITE_GOOGLE_CLIENT_ID,
            discoveryDocs: [
              'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
              'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
            ],
            scope: [
              'https://www.googleapis.com/auth/gmail.readonly',
              'https://www.googleapis.com/auth/gmail.send',
              'https://www.googleapis.com/auth/gmail.modify',
              'https://www.googleapis.com/auth/calendar',
              'https://www.googleapis.com/auth/calendar.events'
            ].join(' ')
          });

          this.gapi = window.gapi;
          this.authInstance = this.gapi.auth2.getAuthInstance();
          this.isInitialized = true;
          
          console.log('✅ Google API initialized successfully');
          resolve();
        } catch (error) {
          console.error('❌ Google API initialization failed:', error);
          reject(error);
        }
      });
    });
  }

  // Sign in with Google
  async signIn(): Promise<GoogleUser> {
    await this.initialize();

    try {
      const googleUser = await this.authInstance.signIn();
      const profile = googleUser.getBasicProfile();
      const authResponse = googleUser.getAuthResponse();

      const user: GoogleUser = {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        picture: profile.getImageUrl(),
        accessToken: authResponse.access_token,
        refreshToken: authResponse.refresh_token
      };

      // Store tokens securely
      this.storeTokens(user);
      
      console.log('✅ Google sign-in successful:', user.email);
      return user;
    } catch (error) {
      console.error('❌ Google sign-in failed:', error);
      throw new Error('Failed to sign in with Google');
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    if (!this.authInstance) {
      throw new Error('Google Auth not initialized');
    }

    try {
      await this.authInstance.signOut();
      this.clearStoredTokens();
      console.log('✅ Google sign-out successful');
    } catch (error) {
      console.error('❌ Google sign-out failed:', error);
      throw error;
    }
  }

  // Check if user is signed in
  isSignedIn(): boolean {
    return this.authInstance?.isSignedIn.get() || false;
  }

  // Get current user
  getCurrentUser(): GoogleUser | null {
    if (!this.isSignedIn()) return null;

    const googleUser = this.authInstance.currentUser.get();
    const profile = googleUser.getBasicProfile();
    const authResponse = googleUser.getAuthResponse();

    return {
      id: profile.getId(),
      name: profile.getName(),
      email: profile.getEmail(),
      picture: profile.getImageUrl(),
      accessToken: authResponse.access_token,
      refreshToken: authResponse.refresh_token
    };
  }

  // Refresh access token
  async refreshAccessToken(): Promise<string> {
    if (!this.authInstance) {
      throw new Error('Google Auth not initialized');
    }

    try {
      const googleUser = this.authInstance.currentUser.get();
      const authResponse = await googleUser.reloadAuthResponse();
      
      // Update stored token
      const user = this.getCurrentUser();
      if (user) {
        user.accessToken = authResponse.access_token;
        this.storeTokens(user);
      }

      return authResponse.access_token;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      throw new Error('Failed to refresh access token');
    }
  }

  // Get valid access token (refresh if needed)
  async getValidAccessToken(): Promise<string> {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('User not signed in');
    }

    // Check if token is expired (simplified check)
    const tokenExpiry = this.getTokenExpiry();
    const now = Date.now();
    
    if (tokenExpiry && now >= tokenExpiry - 60000) { // Refresh 1 minute before expiry
      console.log('🔄 Refreshing access token...');
      return await this.refreshAccessToken();
    }

    return user.accessToken;
  }

  // Check permissions
  async checkPermissions(): Promise<string[]> {
    if (!this.isSignedIn()) {
      return [];
    }

    const googleUser = this.authInstance.currentUser.get();
    const grantedScopes = googleUser.getGrantedScopes();
    
    return grantedScopes.split(' ').filter((scope: string) => scope.trim());
  }

  // Request additional permissions
  async requestPermissions(additionalScopes: string[]): Promise<boolean> {
    try {
      const options = {
        scope: additionalScopes.join(' ')
      };
      
      await this.authInstance.grantOfflineAccess(options);
      return true;
    } catch (error) {
      console.error('❌ Permission request failed:', error);
      return false;
    }
  }

  // Store tokens securely
  private storeTokens(user: GoogleUser): void {
    const tokenData = {
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      email: user.email,
      expiresAt: Date.now() + (3600 * 1000) // 1 hour from now
    };

    localStorage.setItem('google_auth_tokens', JSON.stringify(tokenData));
  }

  // Get stored tokens
  private getStoredTokens(): any {
    const stored = localStorage.getItem('google_auth_tokens');
    return stored ? JSON.parse(stored) : null;
  }

  // Clear stored tokens
  private clearStoredTokens(): void {
    localStorage.removeItem('google_auth_tokens');
  }

  // Get token expiry time
  private getTokenExpiry(): number | null {
    const tokens = this.getStoredTokens();
    return tokens?.expiresAt || null;
  }

  // Listen for auth state changes
  onAuthStateChanged(callback: (isSignedIn: boolean, user: GoogleUser | null) => void): void {
    if (!this.authInstance) {
      console.warn('Google Auth not initialized');
      return;
    }

    this.authInstance.isSignedIn.listen((isSignedIn: boolean) => {
      const user = isSignedIn ? this.getCurrentUser() : null;
      callback(isSignedIn, user);
    });
  }

  // Handle API errors and token refresh
  async handleApiError(error: any): Promise<boolean> {
    if (error.status === 401 || error.message?.includes('Invalid Credentials')) {
      console.log('🔄 Token expired, attempting refresh...');
      try {
        await this.refreshAccessToken();
        return true; // Retry the request
      } catch (refreshError) {
        console.error('❌ Token refresh failed, signing out user');
        await this.signOut();
        return false;
      }
    }
    return false;
  }
}

export default new GoogleAuthService();