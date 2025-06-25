import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import ShopIllustration from '../assets/images/onboarding.png';

export default function Onboarding() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={ShopIllustration} style={styles.image} resizeMode="contain" />

      <Text style={styles.paragraph}>
        Welcome to Makemake Shop — a platform where you can create your shop or explore amazing products from local sellers.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondary]} onPress={() => router.push('/addshop')}>
        <Text style={styles.secondaryText}>Open Shop</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7FE8C9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 30,
    color: '#333',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 16,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondary: {
    backgroundColor: '#333',
  },
  secondaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
