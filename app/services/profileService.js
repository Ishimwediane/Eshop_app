// services/profileService.js

import { getToken } from './tokenService';

const BASE_URL = 'https://makemake-e-commerce.onrender.com/userProfile';



export const createUserProfile = async (profileData) => {
  try {
    const token = await getToken();
    if (!token) throw new Error('No token found');

    const response = await fetch(`${BASE_URL}/createuserProfile`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create profile');
    return data;
  } catch (error) {
    console.error('Error creating profile:', error.message);
    throw error;
  }
};

export const updateUserProfile = async (id, updatedData) => {
  try {
    const token = await getToken();
    if (!token) throw new Error('No token found');

    const response = await fetch(`${BASE_URL}/updateuserProfileById/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update profile');
    return data;
  } catch (error) {
    console.error('Error updating profile:', error.message);
    throw error;
  }
};
export const getUserProfileByUserId = async (userId) => {
  try {
    const token = await getToken();
    if (!token) throw new Error('No token found');

    // Fetch all profiles first
    const response = await fetch(`${BASE_URL}/getAlluserProfile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await response.json();
    if (!response.ok) throw new Error(json.message || 'Failed to fetch profiles');

    // Find the profile that belongs to the current user
    const matchedProfile = json.userProfiles.find(
      (profile) => profile.userId === userId
    );

    if (!matchedProfile) {
      throw new Error('Profile not found for this user.');
    }

    return matchedProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    throw error;
  }
};
