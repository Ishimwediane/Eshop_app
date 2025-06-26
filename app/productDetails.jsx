import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { name, price, image, description, shop } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Product Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.productImage} />
          <TouchableOpacity style={styles.iconWishlist}>
            <Ionicons name="heart-outline" size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCart}>
            <Ionicons name="cart-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{name}</Text>
          <Text style={styles.productShop}>Sold by: {shop || 'Unknown Shop'}</Text>
          <Text style={styles.productPrice}>{price}</Text>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.productDesc}>{description || 'No description available.'}</Text>

        <TouchableOpacity style={styles.orderButton} onPress={()=>router.push('/order')}>
          <Text style={styles.orderButtonText}>Order Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    top:50,
    flex: 1, 
    backgroundColor: '#fff'
 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  productImage: {
    width: screenWidth - 32,
    height: 340,
    borderRadius: 14,
  },
  iconWishlist: {
    position: 'absolute',
    top: 12,
    right: 48,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
  },
  iconCart: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
  },
  infoContainer: {
    marginBottom: 20,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  productShop: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a84ff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  productDesc: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 30,
  },
  orderButton: {
    backgroundColor: '#7FE8C9',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
