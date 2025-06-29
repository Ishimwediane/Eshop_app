import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchProductById } from '../services/productService';

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const getProduct = async () => {
      try {
        const res = await fetchProductById(id);
        if (res && res._id) {
          setProduct(res);
        } else {
          throw new Error('Invalid product data');
        }
      } catch (error) {
        console.error('Product fetch error:', error.message);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
  }

  if (!product) {
    return (
      <View style={{ marginTop: 100, alignItems: 'center' }}>
        <Text>Product not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Product Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <Image source={{ uri: product.images?.[0] }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name}>{product.productName}</Text>
        <Text style={styles.price}>RWF {product.productPrice.toLocaleString()}</Text>
        <Text style={styles.description}>{product.productDescription}</Text>
        {product.paidInInstallments && (
          <Text style={styles.installment}>
            Installment: {product.installmentPeriod}
          </Text>
        )}
        <TouchableOpacity style={styles.orderBtn}>
          <Text style={styles.orderText}>Order Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  image: { width: '100%', height: 250 },
  content: { padding: 16 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  price: { fontSize: 18, color: '#7FE8C9', marginBottom: 8 },
  description: { fontSize: 14, color: '#555', marginBottom: 10 },
  installment: { fontSize: 14, color: 'green', marginBottom: 10 },
  orderBtn: {
    backgroundColor: '#7FE8C9', padding: 12, borderRadius: 8,
    alignItems: 'center', marginTop: 20,
  },
  orderText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
