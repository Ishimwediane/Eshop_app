import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createProduct } from '../services/productService';
import { getUserProfileByUserId } from '../services/profileService';
import { getShopOwnerById, updateShopOwnerById } from '../services/shopService';

export default function TraderHomeScreen() {
  const router = useRouter();
  const [addProductModal, setAddProductModal] = useState(false);
  const [editShopModal, setEditShopModal] = useState(false);
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDiscount, setProductDiscount] = useState('');
  const [installmentPeriod, setInstallmentPeriod] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showInstallmentDropdown, setShowInstallmentDropdown] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shopData, setShopData] = useState(null);
  const [isLoadingShop, setIsLoadingShop] = useState(true);
  const [profileImageUri, setProfileImageUri] = useState(null);

  // Edit shop state
  const [editShopName, setEditShopName] = useState('');
  const [editShopAddress, setEditShopAddress] = useState('');
  const [editProductName, setEditProductName] = useState('');
  const [editProductDescription, setEditProductDescription] = useState('');
  const [editProductCategory, setEditProductCategory] = useState('');
  const [showEditCategoryDropdown, setShowEditCategoryDropdown] = useState(false);

  const categories = ['Fashion', 'Electronics', 'Food'];
  const installmentOptions = ['Weekly', 'Monthly', 'Quarterly'];

  useEffect(() => {
    fetchShopData();
    const fetchProfileImage = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const profile = await getUserProfileByUserId(userId);
          if (profile && profile.images && profile.images.length > 0) {
            setProfileImageUri(profile.images[0]);
          }
        }
      } catch (e) {
        setProfileImageUri(null);
      }
    };
    fetchProfileImage();
  }, []);

  const fetchShopData = async () => {
    try {
      setIsLoadingShop(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please login again.');
        return;
      }

      const response = await getShopOwnerById(userId);
      if (response.success && response.shopOwner) {
        setShopData(response.shopOwner);
      } else {
        Alert.alert('Error', 'Failed to fetch shop data');
      }
    } catch (error) {
      console.error('Error fetching shop data:', error);
      Alert.alert('Error', 'Failed to fetch shop data. Please try again.');
    } finally {
      setIsLoadingShop(false);
    }
  };

  const openEditShopModal = () => {
    if (shopData) {
      setEditShopName(shopData.shopName || '');
      setEditShopAddress(shopData.shopAddress || '');
      setEditProductName(shopData.productName || '');
      setEditProductDescription(shopData.productDescription || '');
      setEditProductCategory(shopData.productCategory || '');
      setEditShopModal(true);
    }
  };

  const handleUpdateShop = async () => {
    if (!shopData?._id) {
      Alert.alert('Error', 'Shop ID not found');
      return;
    }

    if (!editShopName.trim()) {
      Alert.alert('Error', 'Shop name is required');
      return;
    }

    setIsLoading(true);
    try {
      const updateData = {
        shopName: editShopName.trim(),
        shopAddress: editShopAddress.trim(),
        productName: editProductName.trim(),
        productDescription: editProductDescription.trim(),
        productCategory: editProductCategory,
      };

      const response = await updateShopOwnerById(shopData._id, updateData);
      if (response.success) {
        Alert.alert('Success', 'Shop updated successfully!');
        setEditShopModal(false);
        fetchShopData(); // Refresh shop data
      } else {
        Alert.alert('Error', 'Failed to update shop');
      }
    } catch (error) {
      console.error('Error updating shop:', error);
      Alert.alert('Error', error.message || 'Failed to update shop. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectEditCategory = (category) => {
    setEditProductCategory(category);
    setShowEditCategoryDropdown(false);
  };

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to select images.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => ({
          uri: asset.uri,
          id: Date.now() + Math.random(), // Simple unique ID
        }));
        setProductImages([...productImages, ...newImages]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removeImage = (imageId) => {
    setProductImages(productImages.filter(img => img.id !== imageId));
  };

  const handleAddProduct = async () => {
    // Validate required fields
    if (!productName.trim()) {
      Alert.alert('Error', 'Product name is required');
      return;
    }
    if (!productCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (!productDescription.trim()) {
      Alert.alert('Error', 'Product description is required');
      return;
    }
    if (!productPrice.trim()) {
      Alert.alert('Error', 'Product price is required');
      return;
    }
    if (productImages.length === 0) {
      Alert.alert('Error', 'At least one product image is required');
      return;
    }

    setIsLoading(true);
    try {
      const productData = {
        productName: productName.trim(),
        productCategory,
        productDescription: productDescription.trim(),
        productPrice: parseFloat(productPrice),
        productDiscount: productDiscount ? parseFloat(productDiscount) : 0,
        paidInInstallments: !!installmentPeriod,
        installmentPeriod: installmentPeriod || null,
      };

      // Prepare image assets for the service
      const imageAssets = productImages.map(img => ({
        uri: img.uri,
        type: 'image/jpeg',
        fileName: `product_${Date.now()}_${Math.random()}.jpg`,
      }));

      const result = await createProduct(productData, imageAssets);
      
      Alert.alert('Success', 'Product created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setAddProductModal(false);
            // Reset form
            setProductName('');
            setProductCategory('');
            setProductDescription('');
            setProductPrice('');
            setProductDiscount('');
            setInstallmentPeriod('');
            setProductImages([]);
          }
        }
      ]);
      
      console.log('Product created:', result);
    } catch (error) {
      console.error('Error creating product:', error);
      Alert.alert('Error', error.message || 'Failed to create product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectCategory = (category) => {
    setProductCategory(category);
    setShowCategoryDropdown(false);
  };

  const selectInstallment = (installment) => {
    setInstallmentPeriod(installment);
    setShowInstallmentDropdown(false);
  };

  if (isLoadingShop) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fefefe', justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Text>Loading shop data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fefefe' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={{ flex: 1, paddingTop: Platform.OS === 'android' ? 24 : 0 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Home</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={{ marginRight: 10 }}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/shopOwnerProfile')}>
              {profileImageUri ? (
                <Image source={{ uri: profileImageUri }} style={{ width: 30, height: 30, borderRadius: 15 }} />
              ) : (
                <Ionicons name="person-circle" size={30} color="#333" />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 90 }]}>
          <View style={styles.greetingBox}>
            <Text style={styles.welcome}>Welcome to {shopData?.shopName || 'Your Shop'}</Text>
            <Text style={styles.shopName}>{shopData?.shopName || 'Shop Name'}</Text>
            <Text style={styles.shopAddress}>{shopData?.shopAddress || 'Shop Address'}</Text>
            <Text style={styles.shopStatus}>
              Status: <Text style={{ color: shopData?.verified ? 'green' : 'orange' }}>
                {shopData?.verified ? 'Verified' : 'Pending Verification'}
              </Text>
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="cube-outline" size={24} color="#7FE8C9" />
              <Text style={styles.statNumber}>23</Text>
              <Text style={styles.statLabel}>Products</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="receipt-outline" size={24} color="#7FE8C9" />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="cash-outline" size={24} color="#7FE8C9" />
              <Text style={styles.statNumber}>500k</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
          </View>

          <View style={styles.shortcutContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.shortcutRow}>
              <TouchableOpacity style={styles.shortcutButton} onPress={() => setAddProductModal(true)}>
                <Ionicons name="add-circle-outline" size={24} color="#fff" />
                <Text style={styles.shortcutText}>Add Product</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shortcutButton} onPress={openEditShopModal}>
                <Ionicons name="create-outline" size={24} color="#fff" />
                <Text style={styles.shortcutText}>Edit Shop</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shortcutButton}>
                <Ionicons name="receipt-outline" size={24} color="#fff" />
                <Text style={styles.shortcutText}>View Orders</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Add Product Modal */}
        <Modal
          visible={addProductModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setAddProductModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Product</Text>
                <TouchableOpacity onPress={() => setAddProductModal(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalBody}>
                {/* Product Images Section */}
                <View style={styles.imageSection}>
                  <Text style={styles.sectionLabel}>Product Images</Text>
                  <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                    <Ionicons name="camera-outline" size={24} color="#7FE8C9" />
                    <Text style={styles.addImageText}>Add Images</Text>
                  </TouchableOpacity>
                  
                  {productImages.length > 0 && (
                    <ScrollView horizontal style={styles.imagePreviewContainer}>
                      {productImages.map((image) => (
                        <View key={image.id} style={styles.imagePreviewWrapper}>
                          <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                          <TouchableOpacity 
                            style={styles.removeImageButton}
                            onPress={() => removeImage(image.id)}
                          >
                            <Ionicons name="close-circle" size={20} color="#ff4444" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  )}
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Product name"
                  value={productName}
                  onChangeText={setProductName}
                />
                
                {/* Category Dropdown */}
                <TouchableOpacity 
                  style={styles.dropdownButton} 
                  onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                  <Text style={[styles.dropdownText, !productCategory && styles.placeholderText]}>
                    {productCategory || 'Select category'}
                  </Text>
                  <Ionicons name={showCategoryDropdown ? "chevron-up" : "chevron-down"} size={20} color="#666" />
                </TouchableOpacity>
                
                {showCategoryDropdown && (
                  <View style={styles.dropdownList}>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={styles.dropdownItem}
                        onPress={() => selectCategory(category)}
                      >
                        <Text style={styles.dropdownItemText}>{category}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                
                <TextInput
                  style={styles.input}
                  placeholder="Product description"
                  value={productDescription}
                  onChangeText={setProductDescription}
                  multiline
                  numberOfLines={3}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Product price"
                  value={productPrice}
                  onChangeText={setProductPrice}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Product discount (%)"
                  value={productDiscount}
                  onChangeText={setProductDiscount}
                  keyboardType="numeric"
                />
                
                {/* Installment Dropdown */}
                <TouchableOpacity 
                  style={styles.dropdownButton} 
                  onPress={() => setShowInstallmentDropdown(!showInstallmentDropdown)}
                >
                  <Text style={[styles.dropdownText, !installmentPeriod && styles.placeholderText]}>
                    {installmentPeriod || 'Select installment period'}
                  </Text>
                  <Ionicons name={showInstallmentDropdown ? "chevron-up" : "chevron-down"} size={20} color="#666" />
                </TouchableOpacity>
                
                {showInstallmentDropdown && (
                  <View style={styles.dropdownList}>
                    {installmentOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.dropdownItem}
                        onPress={() => selectInstallment(option)}
                      >
                        <Text style={styles.dropdownItemText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                
                <TouchableOpacity 
                  style={[styles.addButton, isLoading && styles.addButtonDisabled]} 
                  onPress={handleAddProduct}
                  disabled={isLoading}
                >
                  <Text style={styles.addButtonText}>
                    {isLoading ? 'Creating Product...' : 'Add Product'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Edit Shop Modal */}
        <Modal
          visible={editShopModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setEditShopModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Shop Details</Text>
                <TouchableOpacity onPress={() => setEditShopModal(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalBody}>
                <TextInput
                  style={styles.input}
                  placeholder="Shop Name"
                  value={editShopName}
                  onChangeText={setEditShopName}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Shop Address"
                  value={editShopAddress}
                  onChangeText={setEditShopAddress}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Product Name"
                  value={editProductName}
                  onChangeText={setEditProductName}
                />
                
                {/* Category Dropdown for Edit */}
                <TouchableOpacity 
                  style={styles.dropdownButton} 
                  onPress={() => setShowEditCategoryDropdown(!showEditCategoryDropdown)}
                >
                  <Text style={[styles.dropdownText, !editProductCategory && styles.placeholderText]}>
                    {editProductCategory || 'Select product category'}
                  </Text>
                  <Ionicons name={showEditCategoryDropdown ? "chevron-up" : "chevron-down"} size={20} color="#666" />
                </TouchableOpacity>
                
                {showEditCategoryDropdown && (
                  <View style={styles.dropdownList}>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={styles.dropdownItem}
                        onPress={() => selectEditCategory(category)}
                      >
                        <Text style={styles.dropdownItemText}>{category}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                
                <TextInput
                  style={styles.input}
                  placeholder="Product Description"
                  value={editProductDescription}
                  onChangeText={setEditProductDescription}
                  multiline
                  numberOfLines={3}
                />
                
                <TouchableOpacity 
                  style={[styles.addButton, isLoading && styles.addButtonDisabled]} 
                  onPress={handleUpdateShop}
                  disabled={isLoading}
                >
                  <Text style={styles.addButtonText}>
                    {isLoading ? 'Updating Shop...' : 'Update Shop'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  container: {
    padding: 16,
    paddingBottom: 40, // for bottom bar
  },
  greetingBox: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
  },
  welcome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  shopName: {
    fontSize: 16,
    color: '#7FE8C9',
    fontWeight: '600',
    marginBottom: 2,
  },
  shopAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  shopStatus: {
    fontSize: 14,
    color: 'gray',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    alignItems: 'center',
    padding: 12,
    width: '30%',
    elevation: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: 'gray',
  },
  shortcutContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  shortcutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shortcutButton: {
    backgroundColor: '#7FE8C9',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    width: '31%',
    elevation: 1,
  },
  shortcutText: {
    color: '#fff',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 16,
  },
  imageSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  addImageButton: {
    borderWidth: 2,
    borderColor: '#7FE8C9',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
  },
  addImageText: {
    color: '#7FE8C9',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  imagePreviewWrapper: {
    marginRight: 12,
    position: 'relative',
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#7FE8C9',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButtonDisabled: {
    backgroundColor: '#ddd',
  },
});
