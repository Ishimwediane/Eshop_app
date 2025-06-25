import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const allProducts = [
  { id: '1', name: 'iPhone 14', price: '$799', description: 'Latest Apple smartphone.', image: 'https://via.placeholder.com/150' },
  { id: '2', name: 'T-shirt', price: '$20', description: 'Cotton T-shirt for men.', image: 'https://via.placeholder.com/150' },
  { id: '3', name: 'Smart TV', price: '$250', description: '4K Ultra HD TV', image: 'https://via.placeholder.com/150' },
];

export default function ProductScreen() {
  const { id } = useLocalSearchParams();
  const product = allProducts.find((item) => item.id === id);

  if (!product) return <Text>Product not found</Text>;

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>

      <TouchableOpacity style={styles.orderBtn}>
        <Text style={styles.orderText}>Order Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 16 },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  price: { fontSize: 18, color: '#444', marginBottom: 12 },
  description: { fontSize: 16, marginBottom: 20 },
  orderBtn: {
    backgroundColor: '#0a84ff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  orderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
