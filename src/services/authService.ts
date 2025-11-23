import { 
  signIn, 
  signUp, 
  signOut, 
  confirmSignUp,
  resendSignUpCode,
  getCurrentUser,
  fetchAuthSession,
  resetPassword,
  confirmResetPassword,
  signInWithRedirect,
  type SignInInput,
  type SignUpInput,
} from 'aws-amplify/auth';

export interface SignUpParams {
  email: string;
  password: string;
  name: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface ConfirmSignUpParams {
  email: string;
  code: string;
}

export interface ResetPasswordParams {
  email: string;
}

export interface ConfirmResetPasswordParams {
  email: string;
  code: string;
  newPassword: string;
}

export class AuthService {
  // Sign up new user
  static async signUp({ email, password, name }: SignUpParams) {
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
          autoSignIn: true,
        },
      });

      return {
        success: true,
        isSignUpComplete,
        userId,
        nextStep,
      };
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Failed to sign up');
    }
  }

  // Confirm sign up with verification code
  static async confirmSignUp({ email, code }: ConfirmSignUpParams) {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      return {
        success: true,
        isSignUpComplete,
        nextStep,
      };
    } catch (error: any) {
      console.error('Confirm sign up error:', error);
      throw new Error(error.message || 'Failed to confirm sign up');
    }
  }

  // Resend verification code
  static async resendConfirmationCode(email: string) {
    try {
      await resendSignUpCode({ username: email });
      return { success: true };
    } catch (error: any) {
      console.error('Resend code error:', error);
      throw new Error(error.message || 'Failed to resend code');
    }
  }

  // Sign in user
  static async signIn({ email, password }: SignInParams) {
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password,
      });

      return {
        success: true,
        isSignedIn,
        nextStep,
      };
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  }

  // Sign out user
  static async signOut() {
    try {
      await signOut();
      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  }

  // Get current authenticated user
  static async getCurrentUser() {
    try {
      const user = await getCurrentUser();
      return {
        success: true,
        user,
      };
    } catch (error: any) {
      console.error('Get current user error:', error);
      return {
        success: false,
        user: null,
      };
    }
  }

  // Get current session (includes tokens)
  static async getCurrentSession() {
    try {
      const session = await fetchAuthSession();
      return {
        success: true,
        session,
        tokens: session.tokens,
      };
    } catch (error: any) {
      console.error('Get session error:', error);
      return {
        success: false,
        session: null,
        tokens: null,
      };
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    try {
      const { user } = await this.getCurrentUser();
      return !!user;
    } catch {
      return false;
    }
  }

  // Reset password (request code)
  static async resetPassword({ email }: ResetPasswordParams) {
    try {
      const output = await resetPassword({ username: email });
      return {
        success: true,
        nextStep: output.nextStep,
      };
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw new Error(error.message || 'Failed to reset password');
    }
  }

  // Confirm password reset with code
  static async confirmResetPassword({ email, code, newPassword }: ConfirmResetPasswordParams) {
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
      return { success: true };
    } catch (error: any) {
      console.error('Confirm reset password error:', error);
      throw new Error(error.message || 'Failed to confirm password reset');
    }
  }

  // Get user attributes
  static async getUserAttributes() {
    try {
      const { user } = await this.getCurrentUser();
      return {
        success: true,
        attributes: user,
      };
    } catch (error: any) {
      console.error('Get user attributes error:', error);
      return {
        success: false,
        attributes: null,
      };
    }
  }

  // Social Login Methods

  // Sign in with GitHub
  static async signInWithGitHub() {
    try {
      await signInWithRedirect({ provider: 'GitHub' });
    } catch (error: any) {
      console.error('GitHub sign in error:', error);
      throw new Error(error.message || 'Failed to sign in with GitHub');
    }
  }

  // Sign in with Google
  static async signInWithGoogle() {
    try {
      await signInWithRedirect({ provider: 'Google' });
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  }
}

export default AuthService;
