import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import online from '../assets/images/online-shopping.png';
import { createShopOwner } from './services/shopService';

export default function AddShop() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // optional
  const [shopName, setShopName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !shopName || !location || !description || !productName || !productDescription || !productCategory) {
      Alert.alert('Please fill in all required fields');
      return;
    }

    const data = {
      email,
      password: password || '@12ShopOwner',
      shopName,
      shopAddress: location,
      shopDescription: description,
      productName,
      productDescription,
      productCategory,
    };

    console.log('Sending data:', data);

    setLoading(true);
    try {
      const res = await createShopOwner(data);
      setLoading(false);
      Alert.alert('Success', 'Shop owner created successfully!');
      // Optionally, reset form fields
      setEmail('');
      setPassword('');
      setShopName('');
      setLocation('');
      setDescription('');
      setProductName('');
      setProductDescription('');
      setProductCategory('');
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message || 'Failed to create shop owner');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Eshop</Text>
          <Text style={styles.subtitle}>Shop Preference</Text>
          <Text style={styles.text}>Let's get started! Tell us about you and your shop.</Text>

          <Image source={online} style={styles.image} />

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password (optional)"
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            value={shopName}
            onChangeText={setShopName}
            placeholder="Name of your shop"
          />

          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Shop location"
          />

          <TextInput
            style={[styles.input, { height: 80 }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Shop description"
            multiline
          />

          <TextInput
            style={styles.input}
            value={productName}
            onChangeText={setProductName}
            placeholder="Product Name"
          />

          <TextInput
            style={[styles.input, { height: 80 }]}
            value={productDescription}
            onChangeText={setProductDescription}
            placeholder="Product Description"
            multiline
          />

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={productCategory}
              onValueChange={(itemValue) => setProductCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Category" value="" />
              <Picker.Item label="Fashion" value="Fashion" />
              <Picker.Item label="Electronics" value="Electronics" />
              <Picker.Item label="Food" value="Food" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 60, // ensures button is not covered
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 5,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
    alignSelf: 'center',
  },
});
