import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getUserProfileByUserId } from '../services/profileService';
import { getShopOwnerById, updateShopOwnerById } from '../services/shopService';

export default function TraderShopScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [shopData, setShopData] = useState(null);
  const [isLoadingShop, setIsLoadingShop] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState(null);

  // Modal inputs state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const categories = ['Fashion', 'Electronics', 'Food'];

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

  const openModal = () => {
    if (shopData) {
      setName(shopData.shopName || '');
      setDescription(shopData.productDescription || '');
      setAddress(shopData.shopAddress || '');
      setProductName(shopData.productName || '');
      setProductDescription(shopData.productDescription || '');
      setProductCategory(shopData.productCategory || '');
      setModalVisible(true);
    }
  };

  const handleSaveShop = async () => {
    if (!shopData?._id) {
      Alert.alert('Error', 'Shop ID not found');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Error', 'Shop name is required');
      return;
    }
    setIsLoading(true);
    try {
      const updateData = {
        shopName: name.trim(),
        shopAddress: address.trim(),
        productName: productName.trim(),
        productDescription: description.trim(),
        productCategory: productCategory,
      };
      const response = await updateShopOwnerById(shopData._id, updateData);
      if (response.success) {
        Alert.alert('Success', 'Shop updated successfully!');
        setModalVisible(false);
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

  const selectCategory = (category) => {
    setProductCategory(category);
    setShowCategoryDropdown(false);
  };

  if (isLoadingShop) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Text>Loading shop data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fefefe' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={{ flex: 1, paddingTop: Platform.OS === 'android' ? 24 : 0 }}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Text style={styles.title}>Shop Details</Text>
          <View style={styles.topRight}>
            <TouchableOpacity style={{ marginRight: 16 }}>
              <Ionicons name="notifications-outline" size={24} color="#000" />
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

        <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 90 }]}> {/* Add enough bottom padding for tab bar */}
          {/* Shop Info */}
          <View style={styles.shopInfo}>
            <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.shopAvatar} />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.shopName}>{shopData?.shopName || 'Shop Name'}</Text>
              <Text style={styles.shopDescription}>{shopData?.productDescription || 'Shop Description'}</Text>
              <Text style={styles.shopStatus}>
                Status:{' '}
                <Text style={{ color: shopData?.verified ? 'green' : 'orange' }}>
                  {shopData?.verified ? 'Verified' : 'Pending Verification'}
                </Text>
              </Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={openModal}>
              <Ionicons name="create-outline" size={20} color="#7FE8C9" />
              <Text style={styles.editBtnText}>Edit Shop</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
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
              <Text style={styles.statNumber}>RWF 500,000</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
          </View>

          {/* Contact / Address */}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Contact & Address</Text>
            <Text style={styles.contactText}>📍 {shopData?.shopAddress || 'Shop Address'}</Text>
            <Text style={styles.contactText}>📧 {shopData?.email || 'contact@shop.com'}</Text>
            <Text style={styles.contactText}>📞 +250 788 123 456</Text>
          </View>

          {/* Product Details */}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Product Details</Text>
            <Text style={styles.contactText}>🛍️ {shopData?.productName || 'Product Name'}</Text>
            <Text style={styles.contactText}>📝 {shopData?.productDescription || 'Product Description'}</Text>
            <Text style={styles.contactText}>🏷️ {shopData?.productCategory || 'Product Category'}</Text>
          </View>
        </ScrollView>

        {/* Edit Shop Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <SafeAreaView style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.modalWrapper}
            >
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Edit Shop</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Shop Name"
                  value={name}
                  onChangeText={setName}
                  maxLength={50}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Shop Address"
                  value={address}
                  onChangeText={setAddress}
                  maxLength={100}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Product Name"
                  value={productName}
                  onChangeText={setProductName}
                  maxLength={50}
                />
                {/* Category Dropdown */}
                <TouchableOpacity 
                  style={styles.dropdownButton} 
                  onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                  <Text style={[styles.dropdownText, !productCategory && styles.placeholderText]}>
                    {productCategory || 'Select product category'}
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
                  style={[styles.input, styles.textArea]}
                  placeholder="Product Description"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  maxLength={200}
                />
                <View style={styles.buttonsRow}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={[styles.button, styles.cancelBtn, isLoading && styles.saveBtnDisabled]}
                    disabled={isLoading}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveShop}
                    style={[styles.button, styles.saveBtn, isLoading && styles.saveBtnDisabled]}
                    disabled={isLoading}
                  >
                    <Text style={styles.saveText}>{isLoading ? 'Saving...' : 'Save'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  topRight: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  container: { padding: 20 },
  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  shopAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#eee' },
  shopName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#000',
  },
  shopDescription: { fontSize: 14, color: '#555', marginBottom: 4 },
  shopStatus: { fontSize: 14, color: '#666' },
  editBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f7f3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editBtnText: {
    color: '#7FE8C9',
    fontWeight: '600',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  statCard: {
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: '30%',
    elevation: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#000',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  contactSection: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  contactTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    color: '#000',
  },
  contactText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#444',
  },
  /* Modal styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalWrapper: {
    width: '100%',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    color: '#999',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
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
    color: '#000',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#f1f1f1',
    marginRight: 10,
  },
  saveBtn: {
    backgroundColor: '#7FE8C9',
  },
  saveBtnDisabled: {
    backgroundColor: '#ddd',
  },
  cancelText: {
    color: '#444',
    fontWeight: '600',
  },
  saveText: {
    color: '#000',
    fontWeight: '600',
  },
});
