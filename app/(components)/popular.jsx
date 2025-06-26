import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const popularProducts = [
  { id: '1', title: 'Headphones', price: '$30', image: 'https://via.placeholder.com/150' },
  { id: '2', title: 'Handbag', price: '$50', image: 'https://via.placeholder.com/150' },
  { id: '3', title: 'Smartwatch', price: '$70', image: 'https://via.placeholder.com/150' },
];

export default function PopularProductsPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popular Products</Text>
      <FlatList
        data={popularProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.detail}>
              <Text style={styles.name}>{item.title}</Text>
              <View style={styles.row}>
                <Text style={styles.price}>{item.price}</Text>
                <TouchableOpacity>
                  <Ionicons name="heart-outline" size={20} color="#333" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  card: { marginBottom: 20, backgroundColor: '#f9f9f9', borderRadius: 10, overflow: 'hidden' },
  image: { width: '100%', height: 150 },
  detail: { padding: 10 },
  name: { fontSize: 16, fontWeight: '600' },
  price: { fontSize: 15, color: '#444' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
});
