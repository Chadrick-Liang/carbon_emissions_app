import MaskedView from '@react-native-masked-view/masked-view';
import React, { useState, useEffect, useRef } from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, Image, SafeAreaView, Button, Animated, Easing } from "react-native";
import { useFonts } from 'expo-font';
import Lottie from 'lottie-react-native';
import NavBar from '../NavBar'

import { doc, collection, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureRef } from 'react-native-view-shot';
const STORAGE_KEY_USERID = '@save_userid';

const Progress = (props) => {
  const imageRef = useRef();
  const [fontsLoaded] = useFonts({
    "nunitoB": require("../assets/fonts/Nunito-Bold.ttf"),
    "nunitoEB": require("../assets/fonts/Nunito-ExtraBold.ttf"),
    "nunitoS": require("../assets/fonts/Nunito-SemiBold.ttf"),
    "nunito": require("../assets/fonts/Nunito-Regular.ttf"),
  })
  const [progress, setProgress] = useState(new Animated.Value(0));
  const [currentUser, setUser] = useState({});
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    //progress.setValue(0);

    const getdata = async () => {
      var currentUserId = '';
      try {
        currentUserId = await AsyncStorage.getItem(STORAGE_KEY_USERID)
        if (currentUserId !== '') {
          //console.log(`I was retrieved from async storage from the progress page ${currentUserId}`);
          const docRef = doc(db, 'emissions', currentUserId);
          const docSnap = await getDoc(docRef);
          //console.log(`PROGRESS CALLED ME ${JSON.stringify(docSnap.data())}`);
          let tempUser = docSnap.data();
          tempUser.points = tempUser.footprint * 1000;
          setUser(tempUser);
          //console.log(`I am the current user${JSON.stringify(currentUser)}`);

          //console.log(`I am the current user points ${currentUser.points}`);
          let progressDuration;
          if (currentUser.points <= 1000) {
            setProgressValue(0.15);
            progressDuration = 2000;
          } else if (currentUser.points <= 2000) {
            setProgressValue(0.2);
            progressDuration = 3000;
          } else if (currentUser.points <= 3000) {
            setProgressValue(0.3);
            progressDuration = 4000;
          } else if (currentUser.points <= 4000) {
            setProgressValue(0.4);
            progressDuration = 4000;
          } else {
            setProgressValue(0.5);
            progressDuration = 6000;
          }
          //console.log(`I am the progress value${progressValue}`);

          Animated.timing(progress, {
            toValue: progressValue,
            duration: progressDuration,
            easing: Easing.linear,
            useNativeDriver: false
          }).start();

        }
      } catch (e) {
        console.log(e);
        console.log('Failed to fetch the data from storage')
      }
    };
    getdata();
  }, [progressValue]);

  if (!fontsLoaded) {
    return undefined;
  };

  const screenShot = async () => {
    try {
      const picture = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      })

    } catch (e) {
      console.log(e);
    }
  }

  //console.log(`I am the current user just before return ${JSON.stringify(currentUser)}`);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.navBarContainer}></View>
      <MaskedView style={{ flex: 1 }}
        maskElement={
          <View
            style={{
              backgroundColor: 'transparent',
              flex: 1,
            }}>
            <View style={styles.maskLayerRectangle}></View>
            <View style={styles.maskLayerCircle}></View>
          </View>
        }>
        <SafeAreaView style={styles.container} ref={imageRef} >

          <ImageBackground style={styles.background} resizeMode='cover' source={require('../Images/tree_background2.png')}>
            <Text style={styles.mainString}>
              <Text>You have saved </Text>
              <Text style={styles.subString}>{currentUser.footprint}</Text>
              <Text> tonnes of carbon emissions this month so far! That is the weight of </Text>
              <Text style={styles.subString}>{(currentUser.footprint / 3).toFixed(2)}</Text>
              <Text> trucks! Well done!</Text>
            </Text>
            <Lottie
              source={require('../assets/plant.json')}
              progress={progress}
              loop={false}
              style={{ height: 300 }}
            />
            <Text style={{ fontSize: 20, fontFamily: 'nunitoB', color: 'white', marginTop: 30, marginLeft: 130, }}>Share this achievement</Text>
            <View style={[styles.share]}>
              <TouchableOpacity><Image style={styles.icon} source={require('../Images/facebook.png')} /></TouchableOpacity>
              <TouchableOpacity><Image style={styles.icon} source={require('../Images/twitter.png')} /></TouchableOpacity>
              <TouchableOpacity><Image style={styles.icon} source={require('../Images/instagram.png')} /></TouchableOpacity>
            </View>
          </ImageBackground>
        </SafeAreaView>
      </MaskedView>
      <NavBar parsedProps={props} screenName={"Progress"}></NavBar>
      <TouchableOpacity style={styles.ProgressButton} onPress={() => { props.navigation.navigate('Progress') }}><Image source={require('../Images/ProgressButton.png')}></Image></TouchableOpacity>

    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  navBarContainer: {
    position: 'absolute',
    top: 745,
    width: "100%",
    height: 60,
    paddingTop: 10,
    flexDirection: 'row'
  },
  navBarIcons: {
    flex: 1,
    alignItems: 'center'
  },
  maskLayerRectangle: {
    height: 745,
    width: "100%",
    backgroundColor: "#000000"
  },
  maskLayerCircle: {
    height: 65,
    width: 65,
    backgroundColor: "#000000",
    borderRadius: 33,
    position: "absolute",
    top: 715,
    alignSelf: 'center'
  },
  ProgressButton: {
    position: 'absolute',
    top: 725,
    alignSelf: 'center'
  }
  ,
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  mainString: {
    fontSize: 22,
    fontFamily: 'nunitoB',
    color: "black",
    padding: 40,
    marginTop: 50
  },
  subString: {
    fontSize: 28,
    fontFamily: 'nunitoB',
  },
  share: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: 230,
    marginTop: 10,
    marginLeft: 150,
  },
  icon: {
    width: 45,
    height: 45,
  },
})

export default Progress;











