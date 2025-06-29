import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {
    createUserProfile,
    getUserProfileByUserId,
    updateUserProfile,
} from './services/profileService';

const GENDER_OPTIONS = [
  { label: 'Select Gender', value: '' },
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];
const AGE_RANGE_OPTIONS = [
  { label: 'Select Age Range', value: '' },
  { label: '10-15', value: '10-15' },
  { label: '16-18', value: '16-18' },
  { label: '18-25', value: '18-25' },
  { label: '25-35', value: '25-35' },
  { label: '35+', value: '35+' },
];

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    gender: '',
    ageRange: '',
    address: '',
    occupation: '',
    salary: '',
    telephone: '',
    images: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [pickedImage, setPickedImage] = useState(null); // for local image file
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const router = useRouter();

  // Always fetch profile by userId on mount (and after logout/login)
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedEmail = await AsyncStorage.getItem('userEmail');
        if (!storedUserId) throw new Error('No userId found');
        setUserId(storedUserId);
        setUserEmail(storedEmail || '');
        // Fetch profile by userId
        const profileData = await getUserProfileByUserId(storedUserId);
        if (profileData && profileData._id) {
          setProfile(profileData);
          setForm({
            fullName: profileData.fullName || '',
            gender: profileData.gender || '',
            ageRange: profileData.ageRange || '',
            address: profileData.address || '',
            occupation: profileData.occupation || '',
            salary: profileData.salary ? String(profileData.salary) : '',
            telephone: profileData.telephone || '',
            images: profileData.images && profileData.images.length > 0 ? profileData.images[0] : '',
          });
        } else {
          setProfile(null);
          setForm({
            fullName: '',
            gender: '',
            ageRange: '',
            address: '',
            occupation: '',
            salary: '',
            telephone: '',
            images: '',
          });
          setIsEditing(false);
        }
        const storedName = await AsyncStorage.getItem('userName');
        setUserName(storedName || '');
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Image picker handler using expo-image-picker
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access gallery is required!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setPickedImage(asset);
      setForm((prev) => ({ ...prev, images: asset.uri }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      let dataToSend;
      let isNewImage = !!pickedImage;
      if (isNewImage) {
        // Use FormData for file upload
        dataToSend = new FormData();
        dataToSend.append('fullName', form.fullName);
        dataToSend.append('gender', form.gender);
        dataToSend.append('ageRange', form.ageRange);
        dataToSend.append('address', form.address);
        dataToSend.append('occupation', form.occupation);
        dataToSend.append('salary', form.salary);
        dataToSend.append('telephone', form.telephone);
        dataToSend.append('userId', userId);
        dataToSend.append('images', {
          uri: pickedImage.uri,
          type: pickedImage.mimeType || 'image/jpeg',
          name: pickedImage.fileName || `profile_${Date.now()}.jpg`,
        });
      } else {
        // Use JSON for update if no new image
        dataToSend = {
          fullName: form.fullName,
          gender: form.gender,
          ageRange: form.ageRange,
          address: form.address,
          occupation: form.occupation,
          salary: Number(form.salary),
          telephone: form.telephone,
          images: form.images ? [form.images] : [],
          userId,
        };
      }

      if (profile && profile._id) {
        // Update: if new image, must use FormData and custom fetch
        if (isNewImage) {
          const response = await fetch(
            `https://makemake-e-commerce.onrender.com/userProfile/updateuserProfileById/${profile._id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              body: dataToSend,
            }
          );
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || 'Failed to update profile');
        } else {
          await updateUserProfile(profile._id, dataToSend);
        }
        Alert.alert('Success', 'Profile updated!');
      } else {
        // Create: must use FormData if new image
        if (isNewImage) {
          const response = await fetch(
            'https://makemake-e-commerce.onrender.com/userProfile/createuserProfile',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              body: dataToSend,
            }
          );
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || 'Failed to create profile');
          await AsyncStorage.setItem('profileId', data.userProfile._id);
        } else {
          await createUserProfile(dataToSend);
        }
        Alert.alert('Success', 'Profile created!');
      }

      // Refetch updated profile
      const updatedProfile = await getUserProfileByUserId(userId);
      setProfile(updatedProfile);
      setForm({
        fullName: updatedProfile.fullName || '',
        gender: updatedProfile.gender || '',
        ageRange: updatedProfile.ageRange || '',
        address: updatedProfile.address || '',
        occupation: updatedProfile.occupation || '',
        salary: updatedProfile.salary ? String(updatedProfile.salary) : '',
        telephone: updatedProfile.telephone || '',
        images: updatedProfile.images && updatedProfile.images.length > 0 ? updatedProfile.images[0] : '',
      });
      setPickedImage(null);
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace('/login'); // redirect to login page
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7FE8C9" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
      {/* Top Header with Back Icon and Title */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>Profile Settings</Text>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        scrollEnabled={!isEditing}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {pickedImage ? (
              <Image source={{ uri: pickedImage.uri }} style={styles.avatarCard} />
            ) : form.images ? (
              <Image source={{ uri: form.images }} style={styles.avatarCard} />
            ) : (
              <View style={[styles.avatarCard, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={48} color="#7FE8C9" />
              </View>
            )}
            <View style={{ marginLeft: 16 }}>
              <Text style={styles.profileName}>{profile?.fullName || 'No Name Set'}</Text>
              <Text style={styles.profileEmail}>{userEmail}</Text>
            </View>
          </View>
        </View>

        {/* General Section */}
        <Text style={styles.sectionHeader}>General</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={() => setIsEditing(true)}>
            <Ionicons name="person-circle-outline" size={22} color="#7FE8C9" style={styles.rowIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Edit Profile</Text>
              <Text style={styles.rowDesc}>Change profile picture, number, E-mail</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#bbb" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={() => router.push('/changePassword')}>
            <Ionicons name="lock-closed-outline" size={22} color="#7FE8C9" style={styles.rowIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Change Password</Text>
              <Text style={styles.rowDesc}>Update and strengthen account security</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#bbb" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={() => router.push('/termsOfUse')}>
            <Ionicons name="document-text-outline" size={22} color="#7FE8C9" style={styles.rowIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Terms of Use</Text>
              <Text style={styles.rowDesc}>Protect your account now</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#bbb" />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <Text style={styles.sectionHeader}>Preferences</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="notifications-outline" size={22} color="#7FE8C9" style={styles.rowIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Notification</Text>
              <Text style={styles.rowDesc}>Customize your notification preferences</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              thumbColor={notificationsEnabled ? '#7FE8C9' : '#ccc'}
              trackColor={{ true: '#b2f2e5', false: '#eee' }}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#e57373" style={styles.rowIcon} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Edit Profile Modal (if editing) */}
        {isEditing && (
          <View style={styles.editModalOverlay}>
            <ScrollView
              style={styles.editModalContent}
              contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.editModalTitle}>Edit Profile</Text>
              {/* Avatar with camera icon overlay */}
              <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <View style={{ position: 'relative' }}>
                  {pickedImage ? (
                    <Image source={{ uri: pickedImage.uri }} style={styles.avatar} />
                  ) : form.images ? (
                    <Image source={{ uri: form.images }} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                      <Ionicons name="person" size={60} color="#7FE8C9" />
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.cameraIcon}
                    onPress={handlePickImage}
                  >
                    <Ionicons name="camera" size={28} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
              {/* ...form fields... */}
              <View style={styles.formGroup}><Text style={styles.label}>Full Name</Text><TextInput style={styles.input} value={form.fullName} onChangeText={text => handleChange('fullName', text)} placeholder="Enter full name" /></View>
              <View style={styles.formGroup}><Text style={styles.label}>Gender</Text><View style={styles.pickerWrapper}><Picker selectedValue={form.gender} onValueChange={value => handleChange('gender', value)} style={styles.picker}>{GENDER_OPTIONS.map(option => (<Picker.Item key={option.value} label={option.label} value={option.value} />))}</Picker></View></View>
              <View style={styles.formGroup}><Text style={styles.label}>Age Range</Text><View style={styles.pickerWrapper}><Picker selectedValue={form.ageRange} onValueChange={value => handleChange('ageRange', value)} style={styles.picker}>{AGE_RANGE_OPTIONS.map(option => (<Picker.Item key={option.value} label={option.label} value={option.value} />))}</Picker></View></View>
              <View style={styles.formGroup}><Text style={styles.label}>Address</Text><TextInput style={styles.input} value={form.address} onChangeText={text => handleChange('address', text)} placeholder="Enter address" /></View>
              <View style={styles.formGroup}><Text style={styles.label}>Occupation</Text><TextInput style={styles.input} value={form.occupation} onChangeText={text => handleChange('occupation', text)} placeholder="Enter occupation" /></View>
              <View style={styles.formGroup}><Text style={styles.label}>Salary</Text><TextInput style={styles.input} value={form.salary} onChangeText={text => handleChange('salary', text)} placeholder="Enter salary" keyboardType="numeric" /></View>
              <View style={styles.formGroup}><Text style={styles.label}>Telephone</Text><TextInput style={styles.input} value={form.telephone} onChangeText={text => handleChange('telephone', text)} placeholder="Enter telephone" keyboardType="phone-pad" /></View>
              <TouchableOpacity style={styles.button} onPress={handleSave}><Text style={styles.buttonText}>{profile ? 'Update Profile' : 'Create Profile'}</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => { setIsEditing(false); setPickedImage(null); }}><Text style={[styles.buttonText, { color: '#333' }]}>Cancel</Text></TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    elevation: 2,
    zIndex: 10,
  },
  backBtn: {
    marginRight: 10,
    padding: 4,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
  },
  topHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginRight: 30,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatarCard: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0f7f5',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  profileEmail: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
    marginLeft: 20,
    marginTop: 18,
    marginBottom: 6,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 2,
    paddingHorizontal: 0,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  rowIcon: {
    marginRight: 16,
  },
  rowTitle: {
    fontWeight: '600',
    fontSize: 15,
    color: '#222',
  },
  rowDesc: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 18,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 1,
  },
  logoutText: {
    color: '#e57373',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 16,
  },
  editModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '92%',
    maxHeight: '90%',
    alignSelf: 'center',
  },
  editModalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    backgroundColor: '#e0f7f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#7FE8C9',
    borderRadius: 20,
    padding: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  formGroup: { marginBottom: 15 },
  label: { fontWeight: '600', marginBottom: 6, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
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
    backgroundColor: '#7FE8C9',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancelButton: {
    backgroundColor: '#f1f1f1',
    marginTop: 10,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
