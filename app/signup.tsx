import { ApolloClient, ApolloProvider, gql, InMemoryCache, useMutation } from "@apollo/client"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from "expo-router"
import { useState } from "react"
import { Alert, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native"

const { height } = Dimensions.get('window')

const client = new ApolloClient({
  uri: "http://192.168.1.201:4000/graphql", // Replace with your machine's IP
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
});

const SIGNUP = gql`
  mutation Signup($email: String!, $password: String!) {
    signup(input: { email: $email, password: $password }) {
      token
      user {
        id
        email
      }
    }
  }
`

function SignupForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const [signup, { loading, error }] = useMutation(SIGNUP)

  const handleSignup = async () => {
    try {
      const { data } = await signup({ variables: { email, password } });
      await AsyncStorage.setItem('userToken', data.signup.token);
      router.replace("/home")
    } catch (e: any) {
      console.error("Signup error:", e)
      Alert.alert("Error", `Failed to sign up: ${e.message}`);
    }
  }

  return (
    <LinearGradient
      colors={['#008080', '#20B2AA', '#40E0D0']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 40,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Decorative circles */}
          <View style={{
            position: 'absolute',
            top: height * 0.05,
            right: -50,
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }} />
          
          <View style={{
            position: 'absolute',
            bottom: height * 0.1,
            left: -60,
            width: 140,
            height: 140,
            borderRadius: 70,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          }} />

          {/* Main content container */}
          <View style={{
            width: '100%',
            maxWidth: 360,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 20,
            padding: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 10,
          }}>

        <Text style={{
          fontSize: 26,
          fontWeight: '800',
          color: '#008080',
          textAlign: 'center',
          marginBottom: 6,
          letterSpacing: -0.5,
        }}>
          Create Account
        </Text>
        
        <Text style={{
          fontSize: 14,
          color: '#666',
          textAlign: 'center',
          marginBottom: 24,
          fontWeight: '400',
        }}>
          Join us and start your journey today
        </Text>

        {error && (
          <View style={{
            backgroundColor: '#FFE5E5',
            padding: 10,
            borderRadius: 10,
            borderLeftWidth: 3,
            borderLeftColor: '#FF4444',
            marginBottom: 16,
          }}>
            <Text style={{
              fontSize: 13,
              color: '#CC0000',
              fontWeight: '500',
            }}>
              {error.message}
            </Text>
          </View>
        )}

        {/* Email Input */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{
            fontSize: 13,
            fontWeight: '600',
            color: '#008080',
            marginBottom: 6,
            marginLeft: 2,
          }}>
            Email Address
          </Text>
          <TextInput
            style={{
              width: '100%',
              padding: 14,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: '#E0F2F1',
              backgroundColor: '#F8FFFE',
              fontSize: 15,
              color: '#333',
              fontWeight: '500',
            }}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* Password Input */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{
            fontSize: 13,
            fontWeight: '600',
            color: '#008080',
            marginBottom: 6,
            marginLeft: 2,
          }}>
            Password
          </Text>
          <TextInput
            style={{
              width: '100%',
              padding: 14,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: '#E0F2F1',
              backgroundColor: '#F8FFFE',
              fontSize: 15,
              color: '#333',
              fontWeight: '500',
            }}
            placeholder="Create a password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          style={{
            width: '100%',
            padding: 16,
            borderRadius: 12,
            backgroundColor: loading ? '#B2DFDB' : '#008080',
            alignItems: 'center',
            marginBottom: 14,
            shadowColor: '#008080',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
          }}
          onPress={handleSignup}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={{
            fontSize: 16,
            fontWeight: '700',
            color: '#FFF',
            letterSpacing: 0.3,
          }}>
            {loading ? "Creating Account..." : "Create Account"}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 16,
        }}>
          <View style={{
            flex: 1,
            height: 1,
            backgroundColor: '#E0E0E0',
          }} />
          <Text style={{
            marginHorizontal: 12,
            color: '#999',
            fontSize: 13,
            fontWeight: '500',
          }}>
            or
          </Text>
          <View style={{
            flex: 1,
            height: 1,
            backgroundColor: '#E0E0E0',
          }} />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={{
            width: '100%',
            padding: 16,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: '#008080',
            backgroundColor: 'transparent',
            alignItems: 'center',
          }}
          onPress={() => router.push("/login")}
          activeOpacity={0.8}
        >
          <Text style={{
            fontSize: 15,
            fontWeight: '600',
            color: '#008080',
            letterSpacing: 0.2,
          }}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

export default function Signup() {
  return (
    <ApolloProvider client={client}>
      <SignupForm />
    </ApolloProvider>
  )
}