import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import shopping from '../../assets/images/shopping.png';

const screenWidth = Dimensions.get('window').width;

const categories = [
  { id: '1', name: 'Electronics', icon: 'phone-portrait-outline' },
  { id: '2', name: 'Fashion', icon: 'shirt-outline' },
  { id: '3', name: 'Food', icon: 'fast-food-outline' },
  { id: '4', name: 'Furniture', icon: 'bed-outline' },
  { id: '5', name: 'Beauty', icon: 'heart-outline' },
  { id: '6', name: 'Tools', icon: 'hammer-outline' },
];

const installmentOffers = [
  { id: '1', title: 'Smart TV', image: 'https://via.placeholder.com/150' },
  { id: '2', title: 'Fridge', image: 'https://via.placeholder.com/150' },
];

const popularProducts = [
  { id: '1', title: 'Headphones', price: '$30' },
  { id: '2', title: 'Handbag', price: '$50' },
  { id: '3', title: 'Smartwatch', price: '$70' },
];

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.logo}>Eshop</Text>
        <View style={styles.iconGroup}>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 16 }}>
            <Ionicons name="cart-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 16 }}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Image source={shopping} style={styles.cardImage} />
          <View style={styles.cardTextBox}>
            <Text style={styles.cardTitle}>Discover the ultimate shopping experience!</Text>
            <Text style={styles.cardSubtitle}>Sale up to 50% off</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryCard}
                  onPress={() => router.push(`/category/${cat.name.toLowerCase()}`)}
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
          <Text style={styles.sectionTitle}>Installment Offers</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {installmentOffers.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.offerCard}
                onPress={() => router.push(`/product/${item.id}`)}
              >
                <Image source={{ uri: item.image }} style={styles.offerImage} />
                <Text style={styles.offerTitle}>{item.title}</Text>
                <Text style={styles.installmentTag}>Installments Available</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Products */}
        <View style={styles.section}>
          <View style={styles.popularHeader}>
            <Text style={styles.sectionTitle}>Popular Products</Text>
            <TouchableOpacity>
              <Text style={styles.sortBy}>Sort by</Text>
            </TouchableOpacity>
          </View>
          {popularProducts.map((item) => (
            <View key={item.id} style={styles.popularItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.recommendTitle}>{item.title}</Text>
                <Text style={styles.recommendPrice}>{item.price}</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="heart-outline" size={22} color="#000" />
              </TouchableOpacity>
            </View>
          ))}
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'green',
    top: 12,
  },

  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600' },

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
  },
  categoryText: { marginTop: 6, fontSize: 13 },

  offerCard: {
    width: screenWidth * 0.5,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginRight: 16,
    paddingBottom: 10,
  },
  offerImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  offerTitle: { padding: 8, fontSize: 15 },
  installmentTag: { paddingHorizontal: 8, color: 'green', fontSize: 13 },

  // Popular section
  popularHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sortBy: {
    fontSize: 14,
    color: 'blue',
  },
  popularItem: {
    backgroundColor: '#f6f6f6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendTitle: { fontSize: 16, fontWeight: '500' },
  recommendPrice: { fontSize: 14, color: '#444' },
});
