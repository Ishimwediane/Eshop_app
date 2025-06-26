import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const initialItems = [
  {
    id: '1',
    name: 'Wireless Headphones',
    subtitle: 'Noise cancelling, Bluetooth',
    price: 30,
    image: 'https://via.placeholder.com/120',
    sizes: ['S', 'M', 'L'],
    selectedSize: 'M',
    quantity: 1,
  },
  {
    id: '2',
    name: 'Smart TV',
    subtitle: '42 inch LED, Full HD',
    price: 250,
    image: 'https://via.placeholder.com/120',
    sizes: ['32"', '42"', '55"'],
    selectedSize: '42"',
    quantity: 1,
  },
];

export default function CartScreen() {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);

  const increaseQty = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const selectSize = (id, size) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selectedSize: size } : item
      )
    );
  };

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sizeRow}>
          {item.sizes.map((size, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.sizeBox,
                item.selectedSize === size && styles.selectedSizeBox,
              ]}
              onPress={() => selectSize(item.id, size)}
            >
              <Text
                style={[
                  styles.sizeText,
                  item.selectedSize === size && styles.selectedSizeText,
                ]}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.qtyRow}>
          <TouchableOpacity onPress={() => decreaseQty(item.id)} style={styles.qtyBtn}>
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyNumber}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => increaseQty(item.id)} style={styles.qtyBtn}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.priceDelete}>
        <Text style={styles.price}>${item.price * item.quantity}</Text>
        <TouchableOpacity>
          <Ionicons name="trash-outline" size={22} color="#cc0000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>My Cart</Text>
        <TouchableOpacity onPress={()=>router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Delivery Info */}
      <View style={styles.deliveryCard}>
        <Text style={styles.deliveryText}>Delivery Point: Kigali, Rwanda</Text>
        <TouchableOpacity>
          <Ionicons name="pencil-outline" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Cart List */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 160 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      {/* Bottom Total */}
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${total}</Text>
        <TouchableOpacity style={styles.checkoutBtn} onPress={()=>router.push('/cartcheckout')}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    top:50,
    flex: 1, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  topTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  deliveryCard: {
    marginHorizontal: 16,
    backgroundColor: '#7FE8C9',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 14,
   
    borderColor: '#ccc',
   
    
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginVertical: 2,
  },
  sizeRow: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  sizeBox: {
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  selectedSizeBox: {
    backgroundColor: '#7FE8C9',
  },
  sizeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
  },
  selectedSizeText: {
    color: '#000',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  qtyBtn: {
    backgroundColor: '#7FE8C9',
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  qtyNumber: {
    fontSize: 14,
    marginHorizontal: 10,
    fontWeight: '600',
  },
  priceDelete: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
 
    backgroundColor: '#fff',
   bottom:80,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  checkoutBtn: {
    backgroundColor: '#7FE8C9',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
