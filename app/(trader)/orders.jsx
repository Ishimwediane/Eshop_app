import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const initialOrders = [
  {
    id: '1',
    product: 'Wireless Headphones',
    customer: 'Alice M.',
    quantity: 2,
    status: 'Pending',
    time: '2025-06-25 15:00',
    address: '123 Main St, Kigali',
    phone: '+250 789 000 111',
    notes: 'Deliver before 5pm',
  },
  {
    id: '2',
    product: 'Smart Watch',
    customer: 'John D.',
    quantity: 1,
    status: 'Shipped',
    time: '2025-06-24 10:40',
    address: '45 Rose Ave, Kigali',
    phone: '+250 790 123 456',
    notes: '',
  },
  {
    id: '3',
    product: 'Gaming Mouse',
    customer: 'Eve K.',
    quantity: 3,
    status: 'Delivered',
    time: '2025-06-23 09:10',
    address: '77 King St, Kigali',
    phone: '+250 700 456 789',
    notes: 'Leave at reception',
  },
];

const statuses = ['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'];

export default function TraderOrdersScreen() {
  const [orders, setOrders] = useState(initialOrders);
  const [filterStatus, setFilterStatus] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = useMemo(() => {
    if (filterStatus === 'All') return orders;
    return orders.filter(order => order.status === filterStatus);
  }, [filterStatus, orders]);

  const updateStatus = (id, newStatus) => {
    Alert.alert(
      'Confirm',
      `Mark order as ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            setOrders(prev =>
              prev.map(o => (o.id === id ? { ...o, status: newStatus } : o))
            );
          },
        },
      ]
    );
  };

  const openDetails = order => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const convertOrdersToCSV = ordersToExport => {
    const header = ['ID', 'Product', 'Customer', 'Quantity', 'Status', 'Time', 'Address', 'Phone', 'Notes'];
    const rows = ordersToExport.map(o => [
      o.id,
      o.product,
      o.customer,
      o.quantity,
      o.status,
      o.time,
      o.address || '',
      o.phone || '',
      o.notes || '',
    ]);
    return [header, ...rows]
      .map(row => row.map(item => `"${String(item).replace(/"/g, '""')}"`).join(','))
      .join('\n');
  };

  // New: Show CSV text in alert for now
  const exportToCSV = () => {
    if (filteredOrders.length === 0) {
      Alert.alert('No orders', 'There are no orders to export.');
      return;
    }
    const csv = convertOrdersToCSV(filteredOrders);
    Alert.alert('CSV Export', csv, [{ text: 'OK' }], { cancelable: true });
  };

  const renderOrder = ({ item }) => (
    <TouchableOpacity onPress={() => openDetails(item)} activeOpacity={0.7}>
      <View style={styles.card}>
        <View style={styles.rowSpace}>
          <Text style={styles.product}>{item.product}</Text>
          <Text style={[styles.status, getStatusStyle(item.status)]}>{item.status}</Text>
        </View>
        <Text style={styles.details}>Customer: {item.customer}</Text>
        <Text style={styles.details}>Quantity: {item.quantity}</Text>
        <Text style={styles.details}>Ordered At: {item.time}</Text>

        <View style={styles.actions}>
          {item.status === 'Pending' && (
            <>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => updateStatus(item.id, 'Shipped')}
              >
                <Text style={styles.btnText}>Mark as Shipped</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                onPress={() => updateStatus(item.id, 'Cancelled')}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
          {item.status === 'Shipped' && (
            <TouchableOpacity
              style={styles.btn}
              onPress={() => updateStatus(item.id, 'Delivered')}
            >
              <Text style={styles.btnText}>Mark as Delivered</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
        <Ionicons name="person-circle" size={30} color="#333" />
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statuses.map(status => (
            <TouchableOpacity
              key={status}
              onPress={() => setFilterStatus(status)}
              style={[
                styles.filterBtn,
                filterStatus === status && styles.filterBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filterStatus === status && styles.filterTextActive,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={item => item.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#666' }}>
            No orders found.
          </Text>
        }
      />

      <TouchableOpacity style={styles.exportBtn} onPress={exportToCSV}>
        <Ionicons name="download-outline" size={22} color="#fff" />
        <Text style={styles.exportText}>Export CSV</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Order Details</Text>
            {selectedOrder && (
              <>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Product: </Text>
                  {selectedOrder.product}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Customer: </Text>
                  {selectedOrder.customer}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Quantity: </Text>
                  {selectedOrder.quantity}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Status: </Text>
                  {selectedOrder.status}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Ordered At: </Text>
                  {selectedOrder.time}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Address: </Text>
                  {selectedOrder.address || '-'}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Phone: </Text>
                  {selectedOrder.phone || '-'}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Notes: </Text>
                  {selectedOrder.notes || '-'}
                </Text>
              </>
            )}
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const getStatusStyle = status => {
  switch (status) {
    case 'Pending':
      return { color: 'orange' };
    case 'Shipped':
      return { color: '#3399ff' };
    case 'Delivered':
      return { color: 'green' };
    case 'Cancelled':
      return { color: 'red' };
    default:
      return {};
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  header: {
    backgroundColor: '#7FE8C9',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  filterContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#ddd',
    marginRight: 10,
  },
  filterBtnActive: {
    backgroundColor: '#7FE8C9',
  },
  filterText: {
    color: '#444',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  list: {
    padding: 12,
  },
  card: {
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  rowSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  product: {
    fontSize: 18,
    fontWeight: '600',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
  actions: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  btn: {
    backgroundColor: '#7FE8C9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
    marginTop: 4,
  },
  cancelBtn: {
    backgroundColor: '#ff7675',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  exportBtn: {
    backgroundColor: '#3399ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    margin: 12,
    borderRadius: 10,
  },
  exportText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 14,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginVertical: 4,
  },
  bold: {
    fontWeight: '700',
  },
  modalCloseBtn: {
    marginTop: 20,
    backgroundColor: '#7FE8C9',
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 16,
  },
});
