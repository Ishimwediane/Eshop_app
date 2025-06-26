import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const initialCartItems = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 30,
    image: 'https://via.placeholder.com/100',
    quantity: 1,
  },
  {
    id: '2',
    name: 'Smart TV',
    price: 250,
    image: 'https://via.placeholder.com/100',
    quantity: 1,
  },
];

export default function CartCheckoutScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    alert(`Order placed successfully! Total: $${total.toFixed(2)}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ padding: 16 }}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.infoBox}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>${item.price}</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
                  <Ionicons name="remove-circle-outline" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.qty}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                  <Ionicons name="add-circle-outline" size={24} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.deliveryBox}>
          <Text style={styles.deliveryTitle}>Delivery Address</Text>
          <View style={styles.deliveryRow}>
            <Text style={styles.deliveryText}>KN 123 St, Kigali</Text>
            <TouchableOpacity>
              <Ionicons name="create-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Place Order</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
    top:50
 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  scrollContainer: { flex: 1 },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  infoBox: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600' },
  price: { fontSize: 14, color: '#444', marginVertical: 4 },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qty: { fontSize: 16, marginHorizontal: 10 },
  deliveryBox: {
    backgroundColor: '#7FE8C9',
    borderRadius: 10,
    padding: 12,
    marginVertical: 20,
  },
  deliveryTitle: { fontWeight: '600', fontSize: 16 },
  deliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  deliveryText: { fontSize: 15 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#0a84ff' },
  checkoutBtn: {
    backgroundColor: '#7FE8C9',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkoutText: { fontSize: 16, fontWeight: '600', color: '#000' },
});
