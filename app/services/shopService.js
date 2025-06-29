const BASE_URL = 'https://makemake-e-commerce.onrender.com/shopowner';

export const createShopOwner = async (shopOwnerData) => {
  try {
    const response = await fetch(`${BASE_URL}/createShopOwner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shopOwnerData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create shop owner');
    return data;
  } catch (error) {
    console.error('Error creating shop owner:', error.message);
    throw error;
  }
};

export const getAllShopOwners = async () => {
  try {
    const response = await fetch(`${BASE_URL}/getAllShopOwners`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch shop owners');
    return data;
  } catch (error) {
    console.error('Error fetching shop owners:', error.message);
    throw error;
  }
};

export const getShopOwnerById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/getShopOwnerById/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch shop owner');
    return data;
  } catch (error) {
    console.error('Error fetching shop owner:', error.message);
    throw error;
  }
};

export const updateShopOwnerById = async (id, updateData) => {
  try {
    const response = await fetch(`${BASE_URL}/updateShopOwnerById/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update shop owner');
    return data;
  } catch (error) {
    console.error('Error updating shop owner:', error.message);
    throw error;
  }
};

export const deleteShopOwnerById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/deleteShopOwnerById/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete shop owner');
    return data;
  } catch (error) {
    console.error('Error deleting shop owner:', error.message);
    throw error;
  }
};

export const verifyShopOwner = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/verifyShopOwner/${id}`, {
      method: 'PUT',
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to verify shop owner');
    return data;
  } catch (error) {
    console.error('Error verifying shop owner:', error.message);
    throw error;
  }
};

export const getUnverifiedShopOwners = async () => {
  try {
    const response = await fetch(`${BASE_URL}/getUnverifiedShopOwners`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch unverified shop owners');
    return data;
  } catch (error) {
    console.error('Error fetching unverified shop owners:', error.message);
    throw error;
  }
};

export const getVerifiedShopOwners = async () => {
  try {
    const response = await fetch(`${BASE_URL}/getVerifiedShopOwners`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch verified shop owners');
    return data;
  } catch (error) {
    console.error('Error fetching verified shop owners:', error.message);
    throw error;
  }
};

export const getShopOwnerStats = async () => {
  try {
    const response = await fetch(`${BASE_URL}/getShopOwnerStats`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch shop owner stats');
    return data;
  } catch (error) {
    console.error('Error fetching shop owner stats:', error.message);
    throw error;
  }
};
