import { useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

const products = [
  { id: '1', name: 'iPhone 14', price: '$799', category: 'electronics', image: 'https://via.placeholder.com/100' },
  { id: '2', name: 'T-shirt', price: '$20', category: 'fashion', image: 'https://via.placeholder.com/100' },
  { id: '3', name: 'Couch', price: '$350', category: 'furniture', image: 'https://via.placeholder.com/100' },
];

export default function CategoryScreen() {
  const { name } = useLocalSearchParams();
  const router = useRouter();
  const filtered = products.filter((item) => item.category === name);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products in {name}</Text>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/product/${item.id}`)}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  image: { width: 60, height: 60, borderRadius: 8 },
  name: { fontSize: 16, fontWeight: '500' },
  price: { fontSize: 14, color: '#444' },
});
