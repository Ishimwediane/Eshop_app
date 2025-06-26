import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const wishlistItems = [
  {
    id: '1',
    name: 'Floral Lace Elegance',
    description: 'Bloom with elegance.',
    price: '$16.00',
    rating: 5,
    image: 'https://via.placeholder.com/100',
    colors: ['#000', '#ccc', '#7f4f24'],
  },
  {
    id: '2',
    name: 'Sleek Satin Glamour',
    description: 'Satin, sleek, glamorous.',
    price: '$12.00',
    rating: 5,
    image: 'https://via.placeholder.com/100',
    colors: ['#ddd', '#aaa', '#111'],
  },
  {
    id: '3',
    name: 'Timeless Glam Look',
    description: 'Radiate timeless glam.',
    price: '$10.00',
    rating: 5,
    image: 'https://via.placeholder.com/100',
    colors: ['#334', '#225', '#112'],
  },
];

export default function WishlistScreen() {
  const renderStars = (count) =>
    Array(count)
      .fill(0)
      .map((_, i) => (
        <Ionicons key={i} name="star" size={16} color="#FFD700" style={{ marginRight: 2 }} />
      ));

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.desc}>{item.description}</Text>
        <View style={styles.rating}>{renderStars(item.rating)}</View>

        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.shopBtn}>
            <Ionicons name="bag-handle-outline" size={16} color="#fff" />
            <Text style={styles.shopText}>Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="heart" size={20} color="#F76D6D" />
          </TouchableOpacity>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.price}>{item.price}</Text>
          <View style={styles.colors}>
            {item.colors.map((color, index) => (
              <View key={index} style={[styles.colorDot, { backgroundColor: color }]} />
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Wishlist</Text>
        <View style={styles.icons}>
          <TouchableOpacity>
            <Ionicons name="cart-outline" size={22} color="#000" style={{ marginRight: 16 }} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={wishlistItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fefefe',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  icons: {
    flexDirection: 'row',
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#f1f1f1',
    borderRadius: 16,
    flexDirection: 'row',
    marginBottom: 20,
    padding: 12,
    elevation: 1,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 14,
    marginRight: 12,
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  desc: {
    fontSize: 13,
    color: '#666',
  },
  rating: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'space-between',
  },
  shopBtn: {
    flexDirection: 'row',
    backgroundColor: '#7FE8C9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
  },
  shopText: {
    color: '#000',
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    alignItems: 'center',
  },
  price: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000',
  },
  colors: {
    flexDirection: 'row',
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
