import { Annotation, User } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Storage keys
const TOKEN_KEY = 'token';
const USER_KEY = 'currentUser';

/**
 * Authentication API calls
 */
export const auth = {
  /**
   * Login user (creates account if doesn't exist)
   */
  async login(username: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error);
    }

    // Store token and user
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));

    return data;
  },

  /**
   * Verify if token is still valid
   */
  async verify() {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Token is invalid, clear storage
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        return null;
      }

      return data.user;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  },

  /**
   * Logout user
   */
  async logout() {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      try {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }

    // Clear storage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

/**
 * Image assignment API calls
 */
export const images = {
  /**
   * Get next unannotated image for current doctor
   */
  async getNextImage() {
    const token = localStorage.getItem(TOKEN_KEY);

    const response = await fetch(`${API_URL}/api/image`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error);
    }

    return data;
  },

  /**
   * Get full dataset information
   */
  async getDataset() {
    const token = localStorage.getItem(TOKEN_KEY);

    const response = await fetch(`${API_URL}/api/image/dataset`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error);
    }

    return data;
  },
};

/**
 * Annotation API calls
 */
export const annotations = {
  /**
   * Save new annotation
   */
  async save(annotationData: any) {
    const token = localStorage.getItem(TOKEN_KEY);

    const response = await fetch(`${API_URL}/api/annotation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(annotationData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error);
    }

    return data;
  },

  /**
   * Get all annotations for current doctor
   */
  async getAll() {
    const token = localStorage.getItem(TOKEN_KEY);

    const response = await fetch(`${API_URL}/api/annotation`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error);
    }

    return data.annotations;
  },

  /**
   * Get specific annotation by ID
   */
  async getById(id: string) {
    const token = localStorage.getItem(TOKEN_KEY);

    const response = await fetch(`${API_URL}/api/annotation/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error);
    }

    return data.annotation;
  },

  /**
   * Update annotation
   */
  async update(id: string, updates: Partial<Annotation>) {
    const token = localStorage.getItem(TOKEN_KEY);

    const response = await fetch(`${API_URL}/api/annotation/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error);
    }

    return data.annotation;
  },

  /**
   * Delete annotation
   */
  async delete(id: string) {
    const token = localStorage.getItem(TOKEN_KEY);

    const response = await fetch(`${API_URL}/api/annotation/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error);
    }

    return data;
  },
};

/**
 * Dataset API calls
 */
export const dataset = {
  /**
   * Get all annotations with statistics
   */
  async getAll() {
    const token = localStorage.getItem(TOKEN_KEY);

    const response = await fetch(`${API_URL}/api/dataset`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error);
    }

    return data.dataset;
  },

  /**
   * Export annotations as JSON
   */
  async exportJSON() {
    const token = localStorage.getItem(TOKEN_KEY);

    const response = await fetch(`${API_URL}/api/dataset/export/json`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export JSON');
    }

    return await response.json();
  },

  /**
   * Export annotations as CSV
   */
  async exportCSV() {
    const token = localStorage.getItem(TOKEN_KEY);

    const response = await fetch(`${API_URL}/api/dataset/export/csv`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export CSV');
    }

    return await response.text();
  },

  /**
   * Get statistics
   */
  async getStats() {
    const token = localStorage.getItem(TOKEN_KEY);

    const response = await fetch(`${API_URL}/api/dataset/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error);
    }

    return data.stats;
  },
};

/**
 * User management
 */
export const user = {
  /**
   * Get current logged-in user from storage
   */
  getCurrent() {
    if (typeof window === 'undefined') return null;
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get stored token
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
};
