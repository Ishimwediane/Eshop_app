import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TraderHomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fefefe' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Trader Dashboard</Text>
          <TouchableOpacity>
            <Image
              source={{ uri: 'https://i.pravatar.cc/100' }}
              style={styles.headerAvatar}
            />
          </TouchableOpacity>
        </View>

        {/* Welcome & Shop Info */}
        <View style={styles.greetingBox}>
          <Text style={styles.welcome}>Hello, Diane 👋</Text>
          <Text style={styles.shopName}>Makemake Shop</Text>
          <Text style={styles.shopStatus}>
            Status: <Text style={{ color: 'green' }}>Active</Text>
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="cube-outline" size={24} color="#7FE8C9" />
            <Text style={styles.statNumber}>23</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="receipt-outline" size={24} color="#7FE8C9" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cash-outline" size={24} color="#7FE8C9" />
            <Text style={styles.statNumber}>500k</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>
        </View>

        {/* Shortcuts */}
        <View style={styles.shortcutContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.shortcutRow}>
            <TouchableOpacity style={styles.shortcutButton}>
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
              <Text style={styles.shortcutText}>Add Product</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shortcutButton}>
              <Ionicons name="receipt-outline" size={24} color="#fff" />
              <Text style={styles.shortcutText}>View Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shortcutButton}>
              <Ionicons name="create-outline" size={24} color="#fff" />
              <Text style={styles.shortcutText}>Edit Shop</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greetingBox: {
    marginBottom: 20,
  },
  welcome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  shopName: {
    fontSize: 16,
    color: '#7FE8C9',
  },
  shopStatus: {
    fontSize: 14,
    color: 'gray',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    alignItems: 'center',
    padding: 12,
    width: '30%',
    elevation: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'gray',
  },
  shortcutContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  shortcutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shortcutButton: {
    backgroundColor: '#7FE8C9',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    width: '31%',
  },
  shortcutText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});
