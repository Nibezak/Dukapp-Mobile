import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RadioForm from 'react-native-simple-radio-button';

export function OnboardingScreen() {
  const [name, setName] = useState('');
  const [currencyValue, setCurrencyValue] = useState('RWF');
  const [paymentValue, setPaymentValue] = useState('cash');
  const navigation = useNavigation();

  var currencyOptions = [
    { label: "RWF", value: "RWF" },
    { label: "KES", value: "KES", },
    { label: "UGX", value: "UGX" },
  ]
  var paymentOptions = [
    { value: "cash", label: "Cash" },
    { value: "mobile_mtn_momo", label: "Momo" },
    { value: "mobile_airtel_money", label: "Airtel" },
    { value: "credit", label: "Credit" },
  ];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set up your profile</Text>
      <Text style={styles.subtitle}>Create a profile to manage your shop even faster</Text>
      <TextInput
        style={styles.input}
        placeholder="your name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="email"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Business name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Address (optional)"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="TIN (optional)"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <View style={styles.subview}>
        <Text style={styles.subheading2}>Default currency</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <RadioForm
          radio_props={currencyOptions}
          initial={"RWF"}
          onPress={(value) => setCurrencyValue(value)}
          buttonColor="black"
          labelColor='black'
          selectedButtonColor="#11E05B"
          selectedLabelColor="#11E05B"
          labelHorizontal={false}
          formHorizontal
        />
      </View>

      <View style={styles.subview}>
        <Text style={styles.subheading2}>Default payment method</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <RadioForm
          radio_props={paymentOptions}
          initial={"cash"}
          onPress={(value) => setPaymentValue(value)}
          buttonColor="black"
          labelColor='black'
          selectedButtonColor="#11E05B"
          selectedLabelColor="#11E05B"
          labelHorizontal={false}
          formHorizontal
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <TouchableOpacity style={styles.done}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
            Done !
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 50,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  subview: {
    flexDirection: "row",
    justifyContent: "center"
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 5,
    color: "#1E293B"
  },
  subheading2: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 30,
    color: "#64748B"
  },
  subheading: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 40,
    color: "#64748B"
  },
  subtitle: {
    paddingRight: 70,
    fontSize: 16,
    marginBottom: 40,
    color: "#64748B"
  },
  input: {
    height: 45,
    width: '100%',
    borderColor: '#CCCCCC',
    borderWidth: 0.7,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  done: {
    backgroundColor: "black",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 70,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,

  }
})