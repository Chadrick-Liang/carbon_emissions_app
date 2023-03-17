import React from "react";
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert, ToastAndroid, Keyboard } from "react-native";
import { useFonts } from 'expo-font';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { db } from '../firebaseConfig';
import { useState, useEffect } from 'react';
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";

import { firebase } from '../firebaseConfig2';

const image = require('../Images/backgroundImage.jpeg');

const App = (props) => {
  const [checked, setChecked] = React.useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');


  const [fontsLoaded] = useFonts({
    "nunitoB": require("../assets/fonts/Nunito-Bold.ttf"),
    "nunitoEB": require("../assets/fonts/Nunito-ExtraBold.ttf"),
    "nunitoS": require("../assets/fonts/Nunito-SemiBold.ttf"),
    "nunito": require("../assets/fonts/Nunito-Regular.ttf"),
  })

  if (!fontsLoaded) {
    return undefined
  }



  const onHandleSignUp = async () => {
    Keyboard.dismiss()
    try {
      if (email !== '' && password !== '' && (password == passwordConfirm) && password.length >= 6) {
        let userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        if (userCredentials.user) {
          const addToEmissions = firebase.firestore().collection('emissions');
          function addUserToDb(footprint, name, userid) {
            if (footprint == 0 && name && userid) {
              addToEmissions.doc(userid).set({ footprint: footprint, name: name, userid: userid });
              console.log('new user has been added to the database successfully.');
              props.navigation.navigate('Tracker')
            }
          };
          addUserToDb(0, 'Anonymous', firebase.auth().currentUser.uid);
          setEmail('');
          setPassword('');
          setPasswordConfirm('');
        }
      } else if (email == '' || password == '') {
        ToastAndroid.show('Please fill up all fields.', ToastAndroid.SHORT);
      } else if (password != passwordConfirm) {
        ToastAndroid.show('Please enter the same password both times.', ToastAndroid.SHORT)
      } else if (password.length < 6) {
        ToastAndroid.show('Please ensure that your password is at least 6 characters long.', ToastAndroid.SHORT)
      }

    } catch (error) {
      console.log(error.message)
    }

  };




  return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.image}>
        <View style={{}}>
          <Text style={styles.header}>Sign Up</Text>
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
        <View>
          <Text style={styles.label}>Confirm password</Text>
          <TextInput style={styles.input}
            placeholder='Confirm password'
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={true}
            textContentType='password'
            value={passwordConfirm}
            onChangeText={text => setPasswordConfirm(text)} />
        </View>
        <TouchableOpacity style={[styles.button, { marginTop: 25 }]}
          onPress={onHandleSignUp}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Sign up</Text>
        </TouchableOpacity>
        <Pressable onPress={() => props.navigation.navigate("Log In")}><Text style={{ marginTop: 15, fontFamily: 'nunitoS' }}>Already have an account? <Text style={{ fontFamily: 'nunitoB' }}>Log In</Text></Text></Pressable>
        <Text style={{ marginTop: 60, fontFamily: 'nunitoS' }}>Or sign up with:</Text>
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
