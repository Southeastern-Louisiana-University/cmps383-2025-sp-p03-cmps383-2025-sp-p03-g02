import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  View,
  Animated,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Text
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width, height } = Dimensions.get('window');

export default function Authentication() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const colorScheme = useColorScheme();
  const [slideAnim] = useState(new Animated.Value(0));

  
  const [topPadding, setTopPadding] = useState(Platform.OS === 'ios' ? 40 : 60);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTopPadding(Platform.OS === 'ios' ? 50 : 70);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleForm = () => {
    setError('');
    
    Animated.timing(slideAnim, {
      toValue: isSignIn ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    setIsSignIn(!isSignIn);
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      if (email === 'demo@example.com' && password === 'password') {
        router.replace('/(tabs)/movies');
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      router.replace('/(tabs)/movies');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={[styles.scrollContainer, { paddingTop: topPadding }]}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <View style={styles.logoPlaceholder}>
                <View style={styles.circle}>
                  <Text style={styles.logoText}>LDC</Text>
                </View>
              </View>
              
              <View style={styles.contentContainer}>
                <Text style={styles.pageTitle}>
                  {isSignIn ? 'Welcome Back' : 'Create Account'}
                </Text>
                <Text style={styles.subtitle}>
                  {isSignIn ? 'Sign in to continue' : 'Join Lion\'s Den Cinemas'}
                </Text>
                
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                
                <View style={styles.formContainer}>
                  {!isSignIn && (
                    <TextInput
                      style={styles.input}
                      placeholder="Full Name"
                      placeholderTextColor="#A4B5C5"
                      value={name}
                      onChangeText={setName}
                    />
                  )}
                  
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#A4B5C5"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#A4B5C5"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                  
                  {!isSignIn && (
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm Password"
                      placeholderTextColor="#A4B5C5"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                    />
                  )}

                  {isSignIn && (
                    <TouchableOpacity onPress={() => console.log('Forgot password')}>
                      <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                  )}
                </View>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={isSignIn ? handleSignIn : handleSignUp}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>
                    {isLoading 
                      ? (isSignIn ? 'Signing In...' : 'Creating Account...') 
                      : (isSignIn ? 'Sign In' : 'Create Account')}
                  </Text>
                </TouchableOpacity>
                
                <View style={styles.footerContainer}>
                  <Text style={styles.footerText}>
                    {isSignIn ? 'Don\'t have an account?' : 'Already have an account?'}
                  </Text>
                  <TouchableOpacity onPress={toggleForm}>
                    <Text style={styles.toggleLink}>
                      {isSignIn ? 'Sign Up' : 'Sign In'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#152F3E',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#152F3E',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#152F3E',
  },
  logoPlaceholder: {
    marginBottom: 30,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0C6184',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    includeFontPadding: false,
    textAlign: 'center',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#E8EEF2',
    textAlign: 'center',
    includeFontPadding: false,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: '#A4B5C5',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginBottom: 30,
    maxWidth: 340,
  },
  errorText: {
    color: '#E74C3C',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  input: {
    width: '100%',
    height: 55,
    borderRadius: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#F5F7FA',
    color: '#2D3748',
  },
  forgotPasswordText: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    fontSize: 14,
    color: '#0C6184',
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#0C6184',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
    maxWidth: 340,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 16,
    marginRight: 5,
    color: '#A4B5C5',
  },
  toggleLink: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0C6184',
  }
});