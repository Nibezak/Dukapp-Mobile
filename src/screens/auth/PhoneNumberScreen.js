import React, { useState, useRef, useContext } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaskInput from 'react-native-mask-input';
import { AuthContext } from '../../context/AuthProvider';
import { sendOTP } from '../../api/VerifyPhone';
import { ThemeContext } from '../../../App';

export default function RegisterScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext);

  const handleSignUp = async () => {
    setLoading(true);
    await sendOTP(phoneNumber).then(() => {
      navigation.navigate('Otp', { phoneNumber });
      setLoading(false);
    });
  };

  return (
    <KeyboardAvoidingView keyboardVerticalOffset={80} style={{ flex: 1 }} behavior="padding">
      {loading && (
        <View style={[StyleSheet.absoluteFill, styles.loading]}>
          <ActivityIndicator size="large" color="#1063FD" />
          <Text style={{ fontSize: 18, padding: 10 }}>Sending code...</Text>
        </View>
      )}

      <View style={styles.container}>
        <Text style={styles.description}>
          Dukapp will need to verify your account. Carrier charges may apply.
        </Text>

        <View style={styles.list}>
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>Rwanda</Text>
            <Ionicons name="chevron-forward" size={20} color="#6E6E73" />
          </View>
          <View style={styles.separator} />

          <MaskInput
            value={phoneNumber}
            keyboardType="numeric"
            autoFocus
            placeholder="+250 your phone number"
            onChangeText={(masked) => setPhoneNumber(masked)}
            style={styles.input}
          />
        </View>

        <Text style={styles.legal}>
          You must be{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://dukapp.com')}>
            at least 16 years old
          </Text>{' '}
          to register. Learn how Dukapp works with the{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('https://dukapp.com')}>
            Dukapp website
          </Text>
          .
        </Text>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={[styles.button, phoneNumber !== '' ? styles.enabled : null, { marginBottom: 20 }]}
          onPress={handleSignUp}
          disabled={!phoneNumber}
        >
          <Text style={[styles.buttonText, phoneNumber !== '' ? styles.enabledText : null]}>Next</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#EFEEF6',
    gap: 20,
  },
  description: {
    fontSize: 14,
    color: '#6E6E73',
  },
  legal: {
    fontSize: 12,
    textAlign: 'center',
    color: '#000',
  },
  link: {
    color: '#1063FD',
  },
  button: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#DCDCE2',
    padding: 10,
    borderRadius: 10,
  },
  enabled: {
    backgroundColor: '#1063FD',
  },
  buttonText: {
    color: '#6E6E73',
    fontSize: 22,
    fontWeight: '500',
  },
  enabledText: {
    color: '#FFFFFF',
  },
  list: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 10,
    padding: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 6,
    marginBottom: 10,
  },
  listItemText: {
    fontSize: 18,
    color: '#1063FD',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#6E6E73',
    opacity: 0.2,
  },
  input: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    fontSize: 16,
    padding: 6,
    marginTop: 10,
  },
  loading: {
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
