import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

const offers = [
  {
    id: '1',
    name: 'Smart TV',
    shop: 'ElectroMart',
    price: '$500',
    image: 'https://via.placeholder.com/150',
    description: 'A 50-inch Smart TV with 4K resolution and streaming apps.',
  },
  {
    id: '2',
    name: 'Fridge',
    shop: 'HomeAppliances',
    price: '$700',
    image: 'https://via.placeholder.com/150',
    description: 'Double door fridge with inverter technology.',
  },
  {
    id: '3',
    name: 'Laptop',
    shop: 'TechStore',
    price: '$900',
    image: 'https://via.placeholder.com/150',
    description: 'Sleek design with powerful performance for work or study.',
  },
];

export default function InstallmentOffersPage() {
  const router = useRouter();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/productDetails',
          params: item,
        })
      }
      style={styles.cardWrapper}
    >
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.note}>Installments Available</Text>
      <Text style={styles.price}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Installment Offers</Text>
        <View style={styles.iconGroup}>
          <TouchableOpacity onPress={() => router.push('/cart')}>
            <Ionicons name="cart-outline" size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={{ marginLeft: 14 }}>
            <Ionicons name="notifications-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Products Grid */}
      <FlatList
        data={offers}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        contentContainerStyle={{ padding: 16 }}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardWrapper: {
    width: screenWidth * 0.45,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
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
  note: {
    fontSize: 13,
    color: 'green',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
