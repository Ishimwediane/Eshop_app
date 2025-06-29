import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import shopping from '../../assets/images/shopping.png';
import { fetchAllProducts } from '../services/productService';

const screenWidth = Dimensions.get('window').width;

const categories = [
  { id: '1', name: 'Electronics', icon: 'phone-portrait-outline' },
  { id: '2', name: 'Fashion', icon: 'shirt-outline' },
  { id: '3', name: 'Food', icon: 'fast-food-outline' },
  { id: '4', name: 'Furniture', icon: 'bed-outline' },
  { id: '5', name: 'Beauty', icon: 'heart-outline' },
  { id: '6', name: 'Tools', icon: 'hammer-outline' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [installmentProducts, setInstallmentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const loadProducts = async () => {
    try {
      const allProducts = await fetchAllProducts();
      // Filter or use products as needed
      const installments = allProducts.filter(p => p.paidInInstallments);
      setInstallmentProducts(installments);
    } catch (error) {
      console.error('Product fetch error:', error.message);
    }
  };

  loadProducts();
}, []);

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.logo}>Eshop</Text>
        <View style={styles.iconGroup}>
          <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
            <Ionicons name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 16 }} onPress={() => router.push('/cart')}>
            <Ionicons name="cart-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 16 }} onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {showSearch && (
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#555" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={() => {
              console.log('Searching for:', searchQuery);
            }}
          />
          <TouchableOpacity onPress={() => setShowSearch(false)}>
            <Ionicons name="close" size={20} color="#555" />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Image source={shopping} style={styles.cardImage} />
          <View style={styles.cardTextBox}>
            <Text style={styles.cardTitle}>Discover the ultimate shopping experience!</Text>
            <Text style={styles.cardSubtitle}>Sale up to 50% off</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryCard}
                  onPress={() => router.push({ pathname: '/category/[category]', params: { category: cat.name } })}

                >
                  <Ionicons name={cat.icon} size={28} color="#333" />
                  <Text style={styles.categoryText}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Installment Offers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Installment Offers</Text>
            <TouchableOpacity onPress={() => router.push('/offers')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {installmentProducts.length === 0 ? (
              <Text style={{ paddingHorizontal: 16, color: '#999' }}>No installment offers available.</Text>
            ) : (
              installmentProducts.map((item) => (
                <TouchableOpacity
                  key={item._id}
                  style={styles.offerCard}
                  onPress={() => router.push(`/product/${item._id}`)}
                >
                  <Image source={{ uri: item.images[0] }} style={styles.offerImage} />
                  <Text style={styles.offerTitle}>{item.productName}</Text>
                  <Text style={styles.installmentTag}>Installments: {item.installmentPeriod}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', top: 50 },
  topBar: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fefefe',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  logo: { fontSize: 22, fontWeight: 'bold' },
  iconGroup: { flexDirection: 'row', alignItems: 'center' },

  card: {
    flexDirection: 'row',
    backgroundColor: '#7FE8C9',
    borderRadius: 12,
    padding: 12,
    margin: 16,
    alignItems: 'center',
  },
  cardImage: { width: 120, height: 150, top: 12 },
  cardTextBox: { flex: 1, marginLeft: 20 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#333' },
  cardSubtitle: { fontSize: 14, color: 'green', top: 12 },

  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600' },
  viewAll: { fontSize: 14, color: 'blue' },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  categoryText: { marginTop: 6, fontSize: 13 },

  offerCard: {
    width: screenWidth * 0.5,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginRight: 16,
    paddingBottom: 10,
    overflow: 'hidden',
  },
  offerImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  offerTitle: { paddingHorizontal: 8, paddingTop: 8, fontSize: 15, fontWeight: '500' },
  installmentTag: { paddingHorizontal: 8, fontSize: 13, color: 'green' },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
});
