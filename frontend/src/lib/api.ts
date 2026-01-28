import { API_BASE_URL } from '../config';

/**
 * Centralized API client for making HTTP requests to the backend
 * Handles error handling, response parsing, and provides type-safe methods
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Makes a GET request to the specified endpoint
   * @param endpoint - API endpoint (e.g., '/metrics/summary')
   * @param options - Optional fetch options
   * @returns Promise resolving to the response data
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorJson.message || errorMessage;
      } catch {
        // If response isn't JSON, use the text or default message
        if (errorText) errorMessage = errorText;
      }
      
      throw new Error(errorMessage);
    }

    const json = await response.json();
    
    // Handle different response formats:
    // { success: true, data: ... } - most endpoints
    if (json.success !== undefined && json.data !== undefined) {
      return json.data as T;
    }
    
    // { success: true, alerts: ... } or other top-level fields - some endpoints
    // Return the whole object and let the caller extract what they need
    return json as T;
  }

  /**
   * Makes a POST request with JSON body
   * @param endpoint - API endpoint
   * @param body - JSON-serializable object
   * @param options - Optional fetch options
   * @returns Promise resolving to the response data
   */
  async post<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorJson.message || errorMessage;
      } catch {
        if (errorText) errorMessage = errorText;
      }
      
      throw new Error(errorMessage);
    }

    const json = await response.json();
    
    // Handle different response formats
    if (json.success !== undefined && json.data !== undefined) {
      return json.data as T;
    }
    
    return json as T;
  }

  /**
   * Makes a POST request with FormData (for file uploads)
   * @param endpoint - API endpoint
   * @param formData - FormData object
   * @param options - Optional fetch options
   * @returns Promise resolving to the response data
   */
  async postFormData<T>(endpoint: string, formData: FormData, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      body: formData,
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorJson.message || errorMessage;
      } catch {
        if (errorText) errorMessage = errorText;
      }
      
      throw new Error(errorMessage);
    }

    const json = await response.json();
    
    if (json.success !== undefined && json.data !== undefined) {
      return json.data as T;
    }
    
    return json as T;
  }
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);
