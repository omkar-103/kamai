const API_BASE = '';

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  console.log(`🌐 API Request: ${endpoint}`, {
    token: token ? 'Present' : 'Missing',
    method: options.method || 'GET'
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  console.log(`🔍 API Response: ${endpoint} - ${response.status}`);
  
  if (response.status === 401) {
    console.log('🚨 Unauthorized - clearing token');
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    return null;
  }

  return response;
};

// Convenience methods
export const api = {
  get: (endpoint) => apiRequest(endpoint),
  post: (endpoint, data) => apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  put: (endpoint, data) => apiRequest(endpoint, {
    method: 'PUT', 
    body: JSON.stringify(data)
  }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' })
};