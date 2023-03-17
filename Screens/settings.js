import MaskedView from '@react-native-masked-view/masked-view';
import React, { useState, useEffect } from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, Image, SafeAreaView, ScrollView, ToastAndroid } from "react-native";
import { useFonts } from 'expo-font';
import Accordion from 'react-native-collapsible/Accordion';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import NavBar from '../NavBar'

import { getAuth, signOut } from "firebase/auth";
import { auth } from '../firebaseConfig';
import { doc, collection, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';
const STORAGE_KEY_USERID = '@save_userid';

var currentUserId;
const DATA = [
  {
    title: "ACCOUNT",
    data: [["Account settings", "Change account details such as email, payment method, username, password, etc"], ["Edit profile", "Change display name, profile picture, goals, etc"]],
    index: 0,
  },
  {
    title: "GENERAL SETTINGS",
    data: [["Appearance", "Change colour theme, font size, night mode"], ["Permissions", "Change permissions for location tracking, privacy of data, push notifications"]],
    index: 1,
  },
  {
    title: "HELP",
    data: [["FAQs", "Commonly asked questions"], ["Report", "Help us our by reporting any bugs our team has missed"]],
    index: 2,
  }
];

const App = (props) => {
  const [active, setActivity] = useState({
    activeSections: [0, 1],
  });
  const [name, setName] = useState('');

  useEffect(() => {
    const getdata = async () => {
      try {
        currentUserId = await AsyncStorage.getItem(STORAGE_KEY_USERID)
        if (currentUserId !== '') {
          //console.log(`I was retrieved from async storage from the settings page ${currentUserId}`);
          const docRef = doc(db, 'emissions', currentUserId);
          const docSnap = await getDoc(docRef);
          //console.log(`SETTINGS CALLED ME ${JSON.stringify(docSnap.data())}`);
          setName(docSnap.data().name);
        }
      } catch (e) {
        console.log(e);
        console.log('Failed to fetch the data')
      }
    }
    getdata();
  }, []);

  const [fontsLoaded] = useFonts({
    "nunitoB": require("../assets/fonts/Nunito-Bold.ttf"),
    "nunitoEB": require("../assets/fonts/Nunito-ExtraBold.ttf"),
    "nunitoS": require("../assets/fonts/Nunito-SemiBold.ttf"),
    "nunito": require("../assets/fonts/Nunito-Regular.ttf"),
  })

  if (!fontsLoaded) {
    return undefined;
  }


  const _renderHeader = section => {
    return (
      <View>
        <View>
          <View style={{ position: 'relative', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.sectionHeader}>{section.title}</Text>
            <Image style={styles.indicatorArrow} source={active.activeSections.includes(section.index)
              ? require('../Images/arrow_up.png')
              : require('../Images/arrow_down.png')}
            />
          </View>
        </View>
      </View>
    );
  };

  const _renderContent = section => {
    return section.data.map((item) => {
      return (
        <View style={styles.item}>
          <TouchableOpacity>
            <Text style={styles.itemHead}>{`${item[0]}\n`}</Text>
            <Text style={styles.itemBody}>{item[1]}</Text>
          </TouchableOpacity>
        </View>
      );
    });
  };

  const _updateSections = activeSections => {
    setActivity({ activeSections });
  }

  const onHandleSignout = async () => {
    try {
      await signOut(auth);
      ToastAndroid.show('Successfully Logged out', ToastAndroid.SHORT)
      props.navigation.navigate('Log In');
    } catch (error) {
      console.log(error.message)
    }
  };

  return (
    <View style={{ flex: 1 }}>
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
        <SafeAreaView style={styles.container}>

          <ImageBackground style={styles.background} resizeMode='cover' source={require('../Images/background2.png')}>

            <View style={styles.profileBox}>
              <TouchableOpacity style={styles.profile}>
                <Image source={require('../Images/profile.png')} />
              </TouchableOpacity>

              <Text style={styles.profileName}>{name}</Text>
            </View>

            <View style={styles.settingsContainer}>
              <View style={styles.settingsBox}>
                <Pressable onPress={() => props.navigation.goBack()}>
                  <View>
                    <Image style={styles.settingsImg} source={require('../Images/arrow_left.png')} />
                  </View>
                </Pressable>
                <Text style={styles.settingsText}>Settings</Text>
              </View>

              <SafeAreaView style={{
                flex: 1,
                marginTop: 20,
                marginHorizontal: 16
              }}>
                <ScrollView>
                  <Accordion
                    style={{ paddingBottom: 1 }}
                    sections={DATA}
                    activeSections={active.activeSections}
                    renderHeader={_renderHeader}
                    renderContent={_renderContent}
                    onChange={_updateSections}
                    expandMultiple={true}
                    keyExtractor={item => item.index}
                  />
                  <TouchableOpacity style={styles.logout}
                    onPress={onHandleSignout}>
                    <Text style={styles.logoutBody}>Log out</Text>
                  </TouchableOpacity>
                  <Text></Text>
                  <Text></Text>
                  <Text></Text>
                </ScrollView>
              </SafeAreaView>
            </View>
          </ImageBackground>
        </SafeAreaView>
      </MaskedView>
      <NavBar parsedProps={props} screenName={"Setting"}></NavBar>
      <TouchableOpacity style={styles.ProgressButton} onPress={() => { props.navigation.navigate('Progress') }}><Image source={require('../Images/ProgressButton.png')}></Image></TouchableOpacity>


    </View >
  )
}

const styles = StyleSheet.create({
  navBarContainer: {
    position: 'absolute',
    top: '92%',
    width: "100%",
    height: 60,
    paddingTop: 10,
    flexDirection: 'row',
    backgroundColor: 'white'
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
  },
  container: {
    flex: 1,
  },
  profileBox: {
    display: "flex",
    flexDirection: "row",
    height: 100,
  },
  profile: {
    width: 66,
    margin: 30,
  },
  background: {
    flex: 1,
  },
  profileName: {
    color: "white",
    fontSize: 30,
    width: 232,
    fontFamily: 'nunitoEB',
    flex: 2,
    marginTop: 30,
    marginLeft: 0,
    textAlign: "left",
    alignSelf: "center",
  },
  settingsContainer: {
    backgroundColor: "white",
    color: "white",
    height: "85%",
    position: "relative",
    marginHorizontal: 15,
    marginVertical: 20,
    borderRadius: 20,
    overflow: "scroll",
  },
  settingsBox: {
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
    marginLeft: 20,
    paddingTop: 10,
  },
  settingsImg: {
    marginTop: 3,
    width: 25,
  },
  settingsText: {
    color: "black",
    fontSize: 22,
    fontFamily: 'nunitoEB',
    marginLeft: 20,
    alignSelf: "flex-start",
  },
  item: {
    backgroundColor: "white",
    color: "black",
    borderColor: "grey",
    borderWidth: 0.19,
    height: 75,
    padding: 10,
  },
  itemHead: {
    fontSize: 17,
    fontFamily: 'nunitoB',
    backgroundColor: "white",
    color: "black",
    marginLeft: 10,
    height: 20,

  },
  itemBody: {
    fontSize: 13,
    fontFamily: 'nunito',
    backgroundColor: "white",
    color: "grey",
    marginLeft: 10,
    height: 40,
    paddingTop: 5,

  },
  sectionHeader: {
    fontSize: 17,
    fontFamily: 'nunitoB',
    backgroundColor: "#EDFFF4",
    color: "#0F0F0F",
    padding: 20,
    width: 330,
  },
  indicatorArrow: {
    position: 'relative',
    backgroundColor: '#EDFFF4',
    top: 25,
    right: 40,
  },
  logout: {
    backgroundColor: "white",
    color: "black",
    borderColor: "grey",
    borderWidth: 0.19,
    height: 70,
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  logoutBody: {
    fontSize: 17,
    fontFamily: 'nunitoB',
    backgroundColor: "white",
    color: "black",
    marginLeft: 10,
    marginTop: 15,
    height: 20,

  },
})

export default App;

