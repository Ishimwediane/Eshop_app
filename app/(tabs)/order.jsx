import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const orders = [
  {
    id: '1',
    product: 'Smart TV',
    image: 'https://via.placeholder.com/100',
    status: 'Completed',
    price: '$500',
    date: 'June 20, 2025',
  },
  {
    id: '2',
    product: 'Headphones',
    image: 'https://via.placeholder.com/100',
    status: 'Pending',
    price: '$30',
    date: 'June 23, 2025',
  },
  {
    id: '3',
    product: 'Smartwatch',
    image: 'https://via.placeholder.com/100',
    status: 'Cancelled',
    price: '$70',
    date: 'June 24, 2025',
  },
  {
    id: '4',
    product: 'Handbag',
    image: 'https://via.placeholder.com/100',
    status: 'Completed',
    price: '$50',
    date: 'June 18, 2025',
  },
];

const tabs = ['All', 'Pending', 'Completed', 'Cancelled'];

export default function OrdersScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('All');

  const filteredOrders =
    selectedTab === 'All'
      ? orders
      : orders.filter((order) => order.status === selectedTab);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 24 }} /> {/* for spacing */}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              selectedTab === tab && styles.tabActive,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Order List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.details}>
              <Text style={styles.product}>{item.product}</Text>
              <Text style={styles.price}>{item.price}</Text>
              <Text style={styles.status}>Status: {item.status}</Text>
              <Text style={styles.date}>Ordered on: {item.date}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No orders found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 40, flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  tab: { paddingVertical: 6, paddingHorizontal: 12 },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabText: { fontSize: 14, color: '#666' },
  tabTextActive: { color: '#000', fontWeight: '600' },
  orderCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  image: { width: 80, height: 80, borderRadius: 8 },
  details: { marginLeft: 12, flex: 1 },
  product: { fontSize: 16, fontWeight: '600' },
  price: { fontSize: 15, color: '#444', marginVertical: 2 },
  status: { fontSize: 14, color: '#007bff' },
  date: { fontSize: 13, color: '#888' },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#aaa',
  },
});
