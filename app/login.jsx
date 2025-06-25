import { SafeAreaView ,TouchableOpacity,View} from "react-native"
import { TextInput,Text,StyleSheet ,Image,Switch} from "react-native"
import logo from '../assets/images/logo (2).png'
import { useState } from "react"


import Icon from 'react-native-vector-icons/Ionicons'
import { useRouter } from "expo-router"
export default function login (){
    const [email,setEmail]= useState('');
    const [password,setPassword]=useState('')
    const [hidePassword,setHidePassword]=useState(true)
     const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    console.log(email, password, rememberMe);
    router.push('/home')
  };
  const router=useRouter();
    return(
        <SafeAreaView style={styles.container}>
            <Image source={logo} style={styles.logo}/>
        <Text style={styles.title}>Sign to your account</Text>
        <Text style={styles.subtitle}>log in to your account</Text>
      <View style={styles.inputContainer}>
  <Icon name="mail-outline" size={20} color="#888" style={styles.icon} />
  <TextInput
    style={styles.input}
    placeholder="Email"
    
    onChangeText={setEmail}
    value={email}
    keyboardType="email-address"
  />
</View>

<View style={styles.inputContainer}>
  <Icon name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
  <TextInput
    style={styles.input}
    placeholder="Password"
   
    secureTextEntry={hidePassword}
    onChangeText={setPassword}
    value={password}
  />
  <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
    <Icon
      name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
      size={20}
      color="#888"
      style={styles.icon}
    />
  </TouchableOpacity>
</View>

        <View style={styles.rememberForgot}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
  <Switch
    value={rememberMe}
    onValueChange={setRememberMe}
    trackColor={{ false: '#ccc', true: '#7FE8C9' }}
   
  />
  <Text style={{ marginLeft: 8 }}>Remember me</Text>
</View>


        <TouchableOpacity onPress={()=>router.push('/forgetPassword')}>
          <Text style={styles.linkText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={()=>router.push('/signup')} >
          <Text style={styles.linkText}> Sign Up</Text>
        </TouchableOpacity>
      </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 70,
  
  },
  logo: {
    width: 70,
    height: 50,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
 inputContainer: {
  flexDirection: "row",
  alignItems: "center",
  borderBottomWidth: 1,
  borderColor: "#ccc",
  marginBottom: 20,
  paddingHorizontal: 5,
  backgroundColor: "#fff",
},
input: {
  flex: 1,
  paddingVertical: 10,
  paddingHorizontal: 10, 
  fontSize: 16,
  color: "#333",
},
icon: {
  padding: 5,
},

  rememberForgot: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  remember: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  linkText: {
    color: "#7FE8C9",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#7FE8C9",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    fontSize: 14,
    color: "#555",
  },
});
