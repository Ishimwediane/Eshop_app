import { saveToken, getToken } from './tokenService'; 

const URL = 'https://makemake-e-commerce.onrender.com/user'; 

export const login = async (email, password) => {
  try {
    const response = await fetch(`${URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userEmail: email,
        userPassword: password,
      }),
    });

    const json = await response.json();
    console.log('Login response:', json); 

    if (response.ok) {
      const token = json.user?.tokens?.accessToken;
      if (!token) throw new Error('Token not found');
      await saveToken(token);
      return json;
    } else {
      throw new Error(json.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};


export const register = async (name, email, password) => {
  try {
    const response = await fetch(`${URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: name,
        userEmail: email,
        userPassword: password,
      }),
    });

   const json = await response.json();
    console.log('Register response:', json); // ✅ for debugging

    if (response.ok) {
      const token = json.user?.tokens?.accesssToken;

      if (!token) throw new Error('Token not found in response');
      await saveToken(token);

      return json;
    } else {
      throw new Error(json.message || 'Registration failed');
    }
  } catch (error) {
    throw error;
  }
};

export const fetchProfile = async () => {
  try {
    const token = await getToken();
    if (!token) throw new Error('No token found');

    const response = await fetch(`${URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await response.json();
    if (response.ok) {
      return json;
    } else {
      throw new Error(json.message || 'Failed to fetch profile');
    }
  } catch (error) {
    throw error;
  }
};
