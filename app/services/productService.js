import axios from 'axios';

const BASE_URL = 'https://makemake-e-commerce.onrender.com/product';

export const fetchAllProducts = async () => {
  const response = await axios.get(`${BASE_URL}/getAllProduct`);
  if (!response.data || !response.data.products) {
    throw new Error('Invalid response format');
  }
  return response.data.products;
};

export const fetchInstallmentProducts = async () => {
  const all = await fetchAllProducts();
  return all.filter((p) => p.paidInInstallments);
};

export const fetchProductById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/getProductById/${id}`);
    return response.data.products; 
  }
  catch(error){
   throw new Error('Failed to fetch product details');
  }
};


export const createProduct = async (productData, imageAssets) => {
  try {
    const formData = new FormData();
    formData.append('productName', productData.productName);
    formData.append('productCategory', productData.productCategory);
    formData.append('productDescription', productData.productDescription);
    formData.append('productPrice', String(productData.productPrice));
    formData.append('productDiscount', String(productData.productDiscount || 0));
    formData.append('paidInInstallments', productData.paidInInstallments ? 'true' : 'false');
    if (productData.paidInInstallments && productData.installmentPeriod) {
      formData.append('installmentPeriod', productData.installmentPeriod);
    }
   
    if (Array.isArray(imageAssets)) {
      imageAssets.forEach((img, idx) => {
        formData.append('images', {
          uri: img.uri,
          type: img.type || 'image/jpeg',
          name: img.fileName || `product_${Date.now()}_${idx}.jpg`,
        });
      });
    }
    const response = await fetch(`${BASE_URL}/createProduct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create product');
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to create product');
  }
};