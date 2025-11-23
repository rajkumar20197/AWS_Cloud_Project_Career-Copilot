// Error handling utilities for Career Copilot

import type { NavigationPage } from '../types';

export class ErrorHandler {
  private static setCurrentPage: ((page: NavigationPage) => void) | null = null;

  // Initialize with the navigation function from App.tsx
  static init(setCurrentPageFn: (page: NavigationPage) => void) {
    this.setCurrentPage = setCurrentPageFn;
  }

  // Handle different types of errors
  static handleError(error: any) {
    console.error('Error occurred:', error);

    if (!this.setCurrentPage) {
      console.warn('ErrorHandler not initialized');
      return;
    }

    // Check error type and navigate to appropriate error page
    if (error.status === 401 || error.message?.includes('unauthorized')) {
      this.setCurrentPage('unauthorized');
    } else if (error.status === 429 || error.message?.includes('rate limit')) {
      this.setCurrentPage('rate-limit');
    } else if (error.status >= 500 || error.message?.includes('server error')) {
      this.setCurrentPage('server-error');
    } else if (error.message?.includes('offline') || !navigator.onLine) {
      this.setCurrentPage('offline');
    } else {
      // Generic error - show server error page
      this.setCurrentPage('server-error');
    }
  }

  // Specific error handlers
  static handleUnauthorized() {
    this.setCurrentPage?.('unauthorized');
  }

  static handleServerError() {
    this.setCurrentPage?.('server-error');
  }

  static handleRateLimit() {
    this.setCurrentPage?.('rate-limit');
  }

  static handleMaintenance() {
    this.setCurrentPage?.('maintenance');
  }

  static handleOffline() {
    this.setCurrentPage?.('offline');
  }

  static handleComingSoon() {
    this.setCurrentPage?.('coming-soon');
  }

  static handleNotFound() {
    this.setCurrentPage?.('not-found');
  }
}

// Network status monitoring
export class NetworkMonitor {
  private static setCurrentPage: ((page: NavigationPage) => void) | null = null;
  private static wasOffline = false;

  static init(setCurrentPageFn: (page: NavigationPage) => void) {
    this.setCurrentPage = setCurrentPageFn;
    this.setupListeners();
  }

  private static setupListeners() {
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }

  private static handleOnline() {
    if (this.wasOffline) {
      console.log('Back online!');
      this.wasOffline = false;
      // Optionally refresh the page or show a success message
    }
  }

  private static handleOffline() {
    console.log('Gone offline!');
    this.wasOffline = true;
    this.setCurrentPage?.('offline');
  }

  static isOnline(): boolean {
    return navigator.onLine;
  }
}

// API error interceptor
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  // Handle specific API errors
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.message;
    
    switch (status) {
      case 401:
        ErrorHandler.handleUnauthorized();
        break;
      case 429:
        ErrorHandler.handleRateLimit();
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        ErrorHandler.handleServerError();
        break;
      default:
        ErrorHandler.handleError({ status, message });
    }
  } else if (error.request) {
    // Network error
    if (!navigator.onLine) {
      ErrorHandler.handleOffline();
    } else {
      ErrorHandler.handleServerError();
    }
  } else {
    // Other error
    ErrorHandler.handleError(error);
  }
};