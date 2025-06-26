import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TraderShopScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [shopData, setShopData] = useState({
    name: 'Makemake Shop',
    description: 'Your go-to shop for electronics, beauty, and more!',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/100',
    totalProducts: 23,
    totalOrders: 12,
    earnings: 500000,
    address: '123 Kigali Street, Rwanda',
    contactEmail: 'contact@makemake.com',
    contactPhone: '+250 788 123 456',
  });

  // Modal inputs state
  const [name, setName] = useState(shopData.name);
  const [description, setDescription] = useState(shopData.description);

  const openModal = () => {
    setName(shopData.name);
    setDescription(shopData.description);
    setModalVisible(true);
  };

  const handleSaveShop = () => {
    setShopData((prev) => ({ ...prev, name, description }));
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.title}>Shop Details</Text>
        <View style={styles.topRight}>
          <TouchableOpacity style={{ marginRight: 16 }}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={{ uri: shopData.avatar }} style={styles.avatar} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Shop Info */}
        <View style={styles.shopInfo}>
          <Image source={{ uri: shopData.avatar }} style={styles.shopAvatar} />
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={styles.shopName}>{shopData.name}</Text>
            <Text style={styles.shopDescription}>{shopData.description}</Text>
            <Text style={styles.shopStatus}>
              Status:{' '}
              <Text style={{ color: shopData.status === 'Active' ? 'green' : 'red' }}>
                {shopData.status}
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
            <Text style={styles.statNumber}>{shopData.totalProducts}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="receipt-outline" size={24} color="#7FE8C9" />
            <Text style={styles.statNumber}>{shopData.totalOrders}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cash-outline" size={24} color="#7FE8C9" />
            <Text style={styles.statNumber}>RWF {shopData.earnings.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>
        </View>

        {/* Contact / Address */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Contact & Address</Text>
          <Text style={styles.contactText}>📍 {shopData.address}</Text>
          <Text style={styles.contactText}>📧 {shopData.contactEmail}</Text>
          <Text style={styles.contactText}>📞 {shopData.contactPhone}</Text>
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
                style={[styles.input, styles.textArea]}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                maxLength={200}
              />

              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={[styles.button, styles.cancelBtn]}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveShop}
                  style={[styles.button, styles.saveBtn]}
                >
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
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
  cancelText: {
    color: '#444',
    fontWeight: '600',
  },
  saveText: {
    color: '#000',
    fontWeight: '600',
  },
});
