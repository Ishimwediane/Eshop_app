import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchAllProducts } from '../services/productService';

const screenWidth = Dimensions.get('window').width;

export default function CategoryScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const all = await fetchAllProducts();

        // Debug logging
        console.log('Selected Category:', category);
        all.forEach(p => console.log(`Found: [${p.productCategory}]`));

        const filtered = all.filter(
          (p) =>
            p.productCategory &&
            category &&
            p.productCategory.trim().toLowerCase() === category.trim().toLowerCase()
        );

        setProducts(filtered);
      } catch (err) {
        console.error('Failed to fetch category products:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/productDetails', params: { id: item._id } })}
      style={styles.cardWrapper}
    >
      <View style={styles.card}>
        <Image source={{ uri: item.images[0] }} style={styles.image} />
      </View>
      <Text style={styles.name}>{item.productName}</Text>
      <Text style={styles.price}>{item.productPrice} RWF</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{category || 'Category'}</Text>
        <View style={styles.iconGroup}>
          <TouchableOpacity onPress={() => router.push('/cart')}>
            <Ionicons name="cart-outline" size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={{ marginLeft: 14 }}>
            <Ionicons name="notifications-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#7FE8C9" style={{ marginTop: 40 }} />
      ) : products.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 40, color: '#999' }}>
          No products found in {category}.
        </Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          renderItem={renderItem}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    top: 50,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  grid: {
    padding: 16,
  },
  cardWrapper: {
    width: screenWidth * 0.45,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 150,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
