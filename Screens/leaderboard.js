import MaskedView from '@react-native-masked-view/masked-view';
import React, { useState, useRef, useEffect } from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, Image, SafeAreaView, FlatList, Pressable } from "react-native";
import { useFonts } from 'expo-font';
import NavBar from '../NavBar'

import { doc, collection, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';
const STORAGE_KEY_USERID = '@save_userid';

var currentUser = {};
var currentUserId = '';

const App = (props) => {

    const flatListRef = useRef();
    const [list, setList] = useState([]);

    useEffect(() => {
        var arrData = [];
        const readAsyncData = async () => {
            try {
                currentUserId = await AsyncStorage.getItem(STORAGE_KEY_USERID)
                //console.log(`I was retrieved from async storage from the leaderboard page ${currentUserId}`)
            } catch (e) {
                console.log(e);
                console.log('Failed to fetch the data from storage')
            }
        }
        const getdata = async () => {
            const querySnapshot = await getDocs(collection(db, "emissions"));
            //console.log(querySnapshot);
            querySnapshot.forEach((doc) => {
                arrData.push(doc.data());
            });
            arrData.sort((a, b) => (b.footprint > a.footprint) ? 1 : ((a.footprint > b.footprint) ? -1 : 0))
            let count = 1;
            arrData.forEach((obj) => {
                obj.id = count;
                count++;
                if (obj.userid == currentUserId) {
                    currentUser = obj;
                }
            });
            //console.log(`I am the current USER on the progress page${JSON.stringify(currentUser)}`);
            setList(arrData);
        };
        readAsyncData();
        getdata();
    }, []);

    const [fontsLoaded] = useFonts({
        "nunitoB": require("../assets/fonts/Nunito-Bold.ttf"),
        "nunitoEB": require("../assets/fonts/Nunito-ExtraBold.ttf"),
        "nunitoS": require("../assets/fonts/Nunito-SemiBold.ttf"),
        "nunito": require("../assets/fonts/Nunito-Regular.ttf"),
    });

    if (!fontsLoaded) {
        return null;
    }


    const renderItem = ({ item }) => (
        <TouchableOpacity>
            <View style={item.id == currentUser.id ? styles.itemMain : styles.item}>
                <Text style={item.id == currentUser.id ? styles.itemTextMain : styles.itemText}>{item.id}. {item.id == currentUser.id ? 'You' : item.name}</Text>
                <Text style={{ display: 'flex', flexDirection: 'row', paddingRight: 10, paddingBottom: 16 }}>
                    <Text style={item.id == currentUser.id ? styles.itemTextMain : styles.itemText}>{item.footprint}</Text>
                    <Text style={item.id == currentUser.id ? styles.itemSubText : styles.champSubText}>Tonnes</Text>
                </Text>
            </View>
        </TouchableOpacity>
    );

    const scrollToTop = () => {
        flatListRef.current.scrollToIndex({ index: 0 });
    };

    //console.log(`before returning this is list ${list[0].name}`);
    //console.log(`before returning this is arrData ${JSON.stringify(arrData)}`);
    /*if (arrData) {
        return null;
    }*/
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
                    <ImageBackground style={styles.background} resizeMode='cover' source={require('../Images/background3.png')}>
                        <View style={styles.topNav}>
                            <Pressable onPress={() => props.navigation.goBack()}>
                                <Image style={styles.topNavImg} source={require('../Images/arrow_left.png')} />
                            </Pressable>
                            <Text style={styles.topNavText}>Leaderboard</Text>
                        </View>

                        <View style={styles.champBox}>
                            <Text style={styles.champNumber}>{list[0] == undefined ? null : list[0]['id']}.</Text>
                            <Image style={{ top: 0, marginLeft: 50, }} source={require('../Images/champCrown.png')} />
                            <Image style={{ top: 0, width: 80, height: 80, }} source={require('../Images/champPic.png')} />
                            <Text style={styles.champMainText}>{list[0] == undefined ? null : list[0]['name']}</Text>
                            <Text style={{ display: 'flex', flexDirection: 'row', marginLeft: 20, paddingTop: 10, }}>
                                <Text style={styles.champMainText}>{list[0] == undefined ? null : list[0]['footprint']}</Text>
                                <Text style={styles.champSubText}>Tonnes</Text>
                            </Text>
                        </View>

                        <TouchableHighlight style={{ position: 'absolute', bottom: 70, right: 10, backgroundColor: '#056E00', borderRadius: 100, height: 78, width: 78, zIndex: 1, justifyContent: 'center', alignItems: 'center', }}
                            onPress={scrollToTop}>
                            <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={require('../Images/arrow_up_fullA.png')} />
                                <Text style={{ fontFamily: 'nunito', fontSize: 13, color: 'white', }}>Back to top</Text>
                            </View>
                        </TouchableHighlight>

                        <View style={styles.leaderboardContainer}>

                            <SafeAreaView style={{
                                flex: 1,
                                marginTop: 20,
                                marginHorizontal: 16
                            }}>
                                <FlatList
                                    data={list}
                                    renderItem={renderItem}
                                    keyExtractor={item => item.name + item.footprint}
                                    style={styles.list}
                                    ref={flatListRef}
                                />
                            </SafeAreaView>
                        </View>

                    </ImageBackground>
                </SafeAreaView>
            </MaskedView>
            <NavBar parsedProps={props} screenName={"Leaderboard"}></NavBar>
            <TouchableOpacity style={styles.ProgressButton} onPress={() => { props.navigation.navigate('Progress') }}><Image source={require('../Images/ProgressButton.png')}></Image></TouchableOpacity>

        </View >
    )
}

const styles = StyleSheet.create({
    navBarContainer: {
        position: 'absolute',
        top: 745,
        width: "100%",
        height: 60,
        paddingTop: 10,
        flexDirection: 'row',
        backgroundColor: 'white',
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
        flexDirection: 'column',
    },
    background: {
        flex: 1,
        position: 'relative',
        zIndex: 2,
    },
    topNav: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 40,
    },
    topNavImg: {
        marginTop: 3,
        marginLeft: 20,
        width: 25,
    },
    topNavText: {
        color: "black",
        fontSize: 20,
        fontFamily: 'nunitoB',
        marginLeft: 20,
        alignSelf: "flex-start",
    },
    champBox: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        color: 'white',
        height: 190,
        width: 200,
        borderRadius: 20,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 5,
    },
    champNumber: {
        fontSize: 22,
        fontFamily: 'nunitoB',
        backgroundColor: "white",
        color: "black",
        marginRight: 100,
        padding: 0,
    },
    champMainText: {
        fontSize: 25,
        fontFamily: 'nunitoB',
        backgroundColor: "white",
        color: "black",
    },
    champSubText: {
        fontSize: 15,
        fontFamily: 'nunitoB',
        backgroundColor: "white",
        color: "black",
        padding: 50,
    },
    leaderboardContainer: {
        backgroundColor: "white",
        color: "white",
        height: 430,
        marginHorizontal: 15,
        marginTop: 30,
        borderRadius: 20,
        overflow: "scroll",
    },
    list: {
        marginBottom: 80,
    },
    itemMain: {
        fontFamily: 'nunitoB',
        backgroundColor: "#CBFFDF",
        color: "black",
        borderColor: "grey",
        borderTopWidth: 0.2,
        height: 72,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
    },
    item: {
        fontFamily: 'nunitoB',
        backgroundColor: "white",
        color: "black",
        borderColor: "grey",
        borderTopWidth: 0.2,
        height: 72,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
    },
    itemTextMain: {
        fontSize: 22,
        fontFamily: 'nunitoB',
        backgroundColor: "#CBFFDF",
        color: "black",
        marginLeft: 5,
        height: 50,
    },
    itemText: {
        fontSize: 22,
        fontFamily: 'nunitoB',
        backgroundColor: "white",
        color: "black",
        marginLeft: 5,
        height: 50,

    },
    itemSubText: {
        fontSize: 15,
        fontFamily: 'nunitoB',
        backgroundColor: "#CBFFDF",
        color: "black",
        padding: 50,
    },
})

export default App;