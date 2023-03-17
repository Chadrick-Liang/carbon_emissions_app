import React from "react";
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Pressable, ToastAndroid, Keyboard } from "react-native";
import { useFonts } from 'expo-font';
import { Checkbox } from 'react-native-paper';

import { getAuth, signOut } from "firebase/auth";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useState, useEffect } from 'react';

const image = require('../Images/backgroundImage.jpeg');

const App = (props) => {
  const [checked, setChecked] = React.useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const [fontsLoaded] = useFonts({
    "nunitoB": require("../assets/fonts/Nunito-Bold.ttf"),
    "nunitoEB": require("../assets/fonts/Nunito-ExtraBold.ttf"),
    "nunitoS": require("../assets/fonts/Nunito-SemiBold.ttf"),
    "nunito": require("../assets/fonts/Nunito-Regular.ttf"),
  })

  if (!fontsLoaded) {
    return undefined
  }


  const onHandleSignIn = async () => {
    Keyboard.dismiss()
    try {
      if (email !== '' && password !== '') {
        let userCredentials = await signInWithEmailAndPassword(auth, email, password);
        if (userCredentials.user) {
          props.navigation.navigate('Tracker');
          if (!checked) {
            setEmail('');
            setPassword('');
          }
        }else{
          const showToast = () => {
            ToastAndroid.show('A pikachu appeared nearby !', ToastAndroid.SHORT);
          };
          showToast()
        }
      }

    } catch (error) {
      const showToast = () => {
        ToastAndroid.show('Invalid Email or password', ToastAndroid.SHORT);
      };
      showToast()
    }

  };

  return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.image}>
        <View style={{}}>
          <Text style={styles.header}>Log In</Text>
        </View>
        <View style={{ marginTop: 50 }}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input}
            placeholder='Enter email'
            autoCapitalize='none'
            keyboardType='email-address'
            textContentType='emailAddress'
            value={email}
            onChangeText={text => setEmail(text)} />
        </View>
        <View>
          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.input}
            placeholder='Enter password'
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={true}
            textContentType='password'
            value={password}
            onChangeText={text => setPassword(text)} />
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontFamily: 'nunitoS', paddingLeft: 10, marginTop: 2 }}>Remember Me</Text>
          <Text style={{ marginLeft: 55, fontFamily: 'nunitoS', marginTop: 2 }}>Forgot Password?</Text>
        </View>
        <View style={{ position: "absolute", top: 370, left: 39 }}><Checkbox status={checked ? 'checked' : 'unchecked'} onPress={() => {
          setChecked(!checked);
        }} /></View>
        <TouchableOpacity style={[styles.button, { marginTop: 25 }]}
          onPress={onHandleSignIn}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Log in</Text>
        </TouchableOpacity>
        <Pressable onPress={() => props.navigation.navigate('Signup')}><Text style={{ marginTop: 15, fontFamily: 'nunitoS' }}>Don't have an account? <Text style={{ fontFamily: 'nunitoB' }}>Sign Up</Text></Text></Pressable>
        <Text style={{ marginTop: 60, fontFamily: 'nunitoS' }}>Or log in with:</Text>
        <Image
          style={{ marginTop: 30 }}
          source={require('../Images/SignInBar.png')}
        />
      </ImageBackground>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    alignItems: "center"
  },
  header: {
    color: "#056E00",
    fontSize: 44,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 100
  },
  input: {
    width: 300,
    height: 40,
    alignSelf: "center",
    backgroundColor: "white",
    marginBottom: 20,
  },
  inputError: {
    width: 300,
    height: 40,
    alignSelf: "center",
    backgroundColor: "white",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'red',
  },
  label: {
    marginBottom: 5,
    fontFamily: 'nunitoB'
  },
  button: {
    alignItems: "center",
    backgroundColor: "#099D02",
    padding: 15,
    width: 300,
    borderRadius: 5
  }
});

export default App;
