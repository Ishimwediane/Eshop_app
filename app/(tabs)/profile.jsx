import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const handlePress = (action) => {
    console.log('Tapped:', action);
    // Add navigation here
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Diane Ishimwe</Text>
        <Text style={styles.email}>diane@email.com</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Menu List */}
      <View style={styles.menu}>
        <ProfileItem icon="cart-outline" label="My Orders" onPress={() => handlePress('orders')} />
        <ProfileItem icon="chatbox-ellipses-outline" label="My Chats" onPress={() => handlePress('chats')} />
        <ProfileItem icon="heart-outline" label="Wishlist" onPress={() => handlePress('wishlist')} />
        <ProfileItem icon="card-outline" label="Installments" onPress={() => handlePress('installments')} />
        <ProfileItem icon="settings-outline" label="Settings" onPress={() => handlePress('settings')} />
        <ProfileItem icon="log-out-outline" label="Logout" onPress={() => handlePress('logout')} />
      </View>
    </ScrollView>
  );
}

const ProfileItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#333" />
    <Text style={styles.itemText}>{label}</Text>
    <Ionicons name="chevron-forward" size={20} color="#ccc" style={styles.chevron} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#f7f7f7',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  editBtn: {
    backgroundColor: '#0a84ff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editText: {
    color: '#fff',
    fontWeight: '500',
  },

  menu: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  chevron: {
    marginLeft: 'auto',
  },
});
