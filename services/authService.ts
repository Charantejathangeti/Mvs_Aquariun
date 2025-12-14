
// Simulates a secure backend authentication service for a single user
const STORAGE_KEY_PASSWORD = 'mvs_admin_password_hash';
const STORAGE_KEY_SESSION = 'mvs_admin_session';

// Default password (in a real app, this should be set during deployment or in DB)
const DEFAULT_PASSWORD = 'admin';

export const AuthService = {
  login: (username: string, password: string): boolean => {
    // Hardcoded single username
    if (username.toLowerCase() !== 'admin') return false;

    // Check against stored password or default
    const storedPassword = localStorage.getItem(STORAGE_KEY_PASSWORD) || DEFAULT_PASSWORD;
    
    if (password === storedPassword) {
      localStorage.setItem(STORAGE_KEY_SESSION, 'true');
      return true;
    }
    return false;
  },

  logout: (): void => {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem(STORAGE_KEY_SESSION) === 'true';
  },

  changePassword: (newPassword: string): void => {
    localStorage.setItem(STORAGE_KEY_PASSWORD, newPassword);
  }
};
