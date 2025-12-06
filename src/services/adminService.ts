interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  revenue: number;
  securityAlerts: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

interface LoginResult {
  success: boolean;
  requiresMFA: boolean;
  token?: string;
}

class AdminService {
  private baseUrl = '/api/admin';
  private token: string | null = null;

  async login(email: string, password: string): Promise<LoginResult> {
    try {
      const response = await fetch(`http://localhost:5000${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid credentials');
      }

      const result = await response.json();
      
      if (result.token) {
        this.token = result.token;
        localStorage.setItem('adminToken', result.token);
      } else if (result.tempToken) {
        // Store temporary token for MFA
        this.token = result.tempToken;
        localStorage.setItem('adminTempToken', result.tempToken);
      }

      return result;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  }

  async verifyMFA(code: string): Promise<void> {
    try {
      const tempToken = localStorage.getItem('adminTempToken') || this.token;
      
      const response = await fetch(`http://localhost:5000${this.baseUrl}/verify-mfa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`,
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid MFA code');
      }

      const result = await response.json();
      if (result.token) {
        this.token = result.token;
        localStorage.setItem('adminToken', result.token);
        localStorage.removeItem('adminTempToken'); // Clean up temp token
      }
    } catch (error) {
      console.error('MFA verification error:', error);
      throw error;
    }
  }

  async getDashboardStats(): Promise<AdminStats> {
    try {
      const response = await fetch(`http://localhost:5000${this.baseUrl}/stats`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Dashboard stats error:', error);
      throw error;
    }
  }

  async getUsers(page = 1, limit = 50) {
    try {
      const response = await fetch(`${this.baseUrl}/users?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return await response.json();
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  async updateUserStatus(userId: string, status: 'active' | 'suspended' | 'banned') {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      return await response.json();
    } catch (error) {
      console.error('Update user status error:', error);
      throw error;
    }
  }

  async getSecurityLogs(page = 1, limit = 100) {
    try {
      const response = await fetch(`${this.baseUrl}/security/logs?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch security logs');
      }

      return await response.json();
    } catch (error) {
      console.error('Get security logs error:', error);
      throw error;
    }
  }

  async runSecurityAudit() {
    try {
      const response = await fetch(`${this.baseUrl}/security/audit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to run security audit');
      }

      return await response.json();
    } catch (error) {
      console.error('Security audit error:', error);
      throw error;
    }
  }

  async getPaymentTransactions(page = 1, limit = 50) {
    try {
      const response = await fetch(`${this.baseUrl}/payments/transactions?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      return await response.json();
    } catch (error) {
      console.error('Get transactions error:', error);
      throw error;
    }
  }

  async processRefund(transactionId: string, amount?: number) {
    try {
      const response = await fetch(`${this.baseUrl}/payments/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({ transactionId, amount }),
      });

      if (!response.ok) {
        throw new Error('Failed to process refund');
      }

      return await response.json();
    } catch (error) {
      console.error('Process refund error:', error);
      throw error;
    }
  }

  async getSystemHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/system/health`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch system health');
      }

      return await response.json();
    } catch (error) {
      console.error('Get system health error:', error);
      throw error;
    }
  }

  async updateSystemConfig(config: Record<string, any>) {
    try {
      const response = await fetch(`${this.baseUrl}/system/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Failed to update system config');
      }

      return await response.json();
    } catch (error) {
      console.error('Update system config error:', error);
      throw error;
    }
  }

  getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('adminToken');
    }
    if (!this.token) {
      throw new Error('No admin token available');
    }
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('adminToken');
  }
}

export const adminService = new AdminService();