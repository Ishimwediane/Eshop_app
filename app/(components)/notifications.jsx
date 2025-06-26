import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Back arrow */}
        <View style={styles.topBar}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.topTitle}>Notifications</Text>
              <TouchableOpacity>
                <Ionicons name="cart-outline" size={24} color="#000" />
              </TouchableOpacity>
            </View>
      <Text style={styles.message}>You have no notifications yet.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    flex: 1, 
    top:50,
    backgroundColor: '#fff' 
},
  backIcon: {
     marginBottom: 20 
    },
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
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 10 
},
  message: { 
    fontSize: 16, 
    color: '#777' 
},
});
