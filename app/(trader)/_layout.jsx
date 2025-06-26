import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TraderTabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            home: 'home-outline',
            chat: 'chatbubble-ellipses-outline',
            shop: 'storefront-outline',
            products: 'cube-outline',
            orders: 'receipt-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e0e0e0',
          height: 70,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="products" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="shop" />
      <Tabs.Screen name="chat" />
    </Tabs>
  );
}
