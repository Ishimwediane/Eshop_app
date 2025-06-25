import { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Image
} from 'react-native';
import online from '../assets/images/online-shopping.png'
export default function AddShop() {
  const [shopName, setShopName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = () => {
    if (!shopName.trim()) {
      Alert.alert('Please enter your shop name');
      return;
    }

    Alert.alert('Shop created!', `Name: ${shopName}\nDescription: ${description}\nLocation: ${location}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}> Eshop</Text>
      <Text style={styles.subtitle}>Shop Preference</Text>
      <Text style={styles.text}>Let's get started! Tell us about you and your shop.</Text>
<Image source={online} style={styles.image}/>
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

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: 
  { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff',
    top:60
    
},
  title: 
  { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 10 
},
  subtitle: {
     fontSize: 18, 
     marginBottom: 5 
    },
  text: { 
    fontSize: 14, 
    color: '#555', 
    marginBottom: 20
 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: 
  { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
},
    image: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },

});
