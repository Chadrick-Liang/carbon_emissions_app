import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Image, ImageBackground, SafeAreaView, Text, SectionList, TouchableOpacity, ToastAndroid} from "react-native";
import MaskedView from '@react-native-masked-view/masked-view';
import { useFonts } from 'expo-font';
import NavBar from '../NavBar'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '../firebaseConfig2';

var DATA = [{ data: [{ footprint: "0.02", name: "Rode the bus for 20 minutes" }], title: { index: 1, time: "" } }]

const STORAGE_KEY_USERID = '@save_userid';

const getPercentage = (value) => {
    var percentage = (Math.round((value * 20+ Number.EPSILON) * 100) / 100) 
    if(percentage > 100){
        return 100
    }else{
        return percentage
    }
}
const getDay = () => {
    var daysInWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    var day = new Date().getDay() - 1
    if (day < 0) {
        day = 6
    }
    day = daysInWeek[day]
    var monthDay = new Date().getDate()
    var month = new Date().getMonth() + 1
    return `${day} ${monthDay}/${month}`
}
const renderThirdLayer = (percent) => {
    if (percent > 50) {
        /**
        * Third layer circle default is 45 degrees, so by default it occupies the right half semicircle.
        * Since first 50 percent is already taken care  by second layer circle, hence we subtract it
        * before passing to the propStyle function
        **/
        return <View style={[styles.secondProgressLayer, rotateZByDeg((percent - 50), 45)]}></View>
    } else {
        return <View style={styles.offsetLayer}></View>
    }
}

const rotateZByDeg = (percent, base_degrees) => {
    const rotateBy = base_degrees + (percent * 3.6);
    return {
        transform: [{ rotateZ: `${rotateBy}deg` }]
    };
}
const CircleProgress = ({ percentInput }) => {
    if (percentInput > 50) {
        var rotation = rotateZByDeg(50, -135)
    } else {
        var rotation = rotateZByDeg(percentInput, -135)
    }

    return (<View>
        <View style={[styles.firstprogressLayer, rotation]} />
        <View style={[styles.offsetLayer]} />
        <View style={[styles.progressCircle]}>
            <Text style={{ textAlignVertical: "center", flex: 1, fontFamily: "nunitoB", fontSize: 20 }}>{percentInput}%</Text>
        </View>
        {renderThirdLayer(percentInput)}
    </View>)
}


const Item = (props) => (
    <TouchableOpacity style={styles.item} activeOpacity={0.8}>
        <View style={styles.itemContainer}><Text style={[styles.title]}>{props.name}</Text></View>
        <View style={[styles.itemContainer, { flex: 1, alignItems: "flex-end" }]}><Text style={[styles.title, { width: 65, paddingLeft: 0 }]}>{props.footprint}</Text></View>
    </TouchableOpacity>
);

const App = (props) => {
    const [UID, setUID] = useState('')
    const [stats, setStats] = useState([]);
    const [emissions, setEmissions] = useState(0)

    useEffect(() => {
        var arrayData = []
        const getStats = async () => {
            const querySnapshot = await getDocs(collection(db, "/activities"));
            querySnapshot.forEach((doc) => {
                if (doc.data().name == UID) {
                    arrayData.unshift({ name: doc.data().activityDone, footprint: doc.data().footprint })
                }
            });
            var emissionsTotal = 0
            for (var footprints of arrayData){
                emissionsTotal += footprints.footprint
            }
            if (arrayData.length == 0){
                arrayData.push({name: 'No entries yet', footprint: ' '})
            }
            setStats([{ title: { time: '', index: 1 }, data: arrayData }])
            setEmissions(emissionsTotal)
        }
        getStats();
    }, [UID])



    props.navigation.addListener('focus', async () => {
        // console.log(stats)
        const saveData = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY_USERID, firebase.auth().currentUser.uid);
                            
            } catch (e) {
                alert('Failed to save the userid to the storage')
            }
        };
        saveData();

        const readData = async () => {
            try {
                const testid = await AsyncStorage.getItem(STORAGE_KEY_USERID)
                if (testid !== null) {

                    setUID(testid)
                }
            } catch (e) {
                ToastAndroid.show('Failed to fetch data', ToastAndroid.SHORT);
            }
        }
        readData();

        const getStats2 = setTimeout(async () => {
            if (UID){
                var arrayData2 = []
                const querySnapshot2 = await getDocs(collection(db, "/activities"));
                querySnapshot2.forEach((doc) => {
                    if (doc.data().name == UID) {
                        arrayData2.unshift({ name: doc.data().activityDone, footprint: doc.data().footprint })
                    }
                });
                var emissionsTotal2 = 0
                for (var footprints of arrayData2){
                    emissionsTotal2 += footprints.footprint
                }
                if (arrayData2.length == 0){
                    arrayData2.push({name: 'No entries yet', footprint: ''})
                }
                setStats([{ title: { time: '', index: 1 }, data: arrayData2 }])
                setEmissions(emissionsTotal2)
            }
        }, 1000)
    })

    const [fontsLoaded] = useFonts({
        "nunitoB": require("../assets/fonts/Nunito-Bold.ttf"),
        "nunitoEB": require("../assets/fonts/Nunito-ExtraBold.ttf"),
        "nunitoS": require("../assets/fonts/Nunito-SemiBold.ttf"),
        "nunito": require("../assets/fonts/Nunito-Regular.ttf"),
    })

    if (!fontsLoaded) {
        return undefined
    }
    //console.log(`I AM THE CURRENT USER ${JSON.stringify(firebase.auth().currentUser.uid)}`);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.navBarContainer}>

            </View>
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
                <ImageBackground source={require('../Images/backgroundImage2.png')} style={styles.image}>
                    <Text style={{ marginTop: 50, fontSize: 21, fontFamily: 'nunitoB' }}>Tracker</Text>
                    <View style={styles.TrackerContainer}>
                        <CircleProgress percentInput={getPercentage(emissions)}></CircleProgress>
                        <View style={{ marginLeft: 50, width: 160 }}>
                            <Text style={{ textAlign: "center", fontSize: 25, fontFamily: "nunitoB" }}>{Math.round((5 - emissions + Number.EPSILON) * 1000) / 1000}</Text>
                            <Text style={{ fontSize: 18, fontFamily: 'nunitoEB' }}>Tonnes of Carbon emissions left to conserve this month!</Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 50 }}>
                        <Text style={[styles.header, styles.date]}>{getDay()}</Text>
                        <View style={{width: 350, height: 500, top: 100, position: 'absolute', backgroundColor: 'white'}}></View>
                        <SectionList
                            overScrollMode="never"
                            style={styles.sectionListHeight}
                            sections={stats}
                            keyExtractor={(item, index) => item + index}
                            renderItem={({ item }) => {
                                return <Item name={item.name} footprint={item.footprint} />
                            }
                            }
                            renderSectionHeader={({ section: { title } }) => {
                                if (title.index == 0) {
                                    return (<View style={[styles.header, { backgroundColor: "transparent" }]}></View>)
                                } else {
                                    return (
                                        <TouchableOpacity style={[styles.header, { flexDirection: "row", alignItems: "center" }]} activeOpacity={0.8} onPress={() => props.navigation.navigate('TrackerAdd')}>
                                            <Text style={{ flex: 1, fontFamily: 'nunitoEB' }}>    {title.time}
                                            </Text>
                                            <Text style={{ fontFamily: "nunitoB", flex: 1, textAlign: "center", }}>ADD EVENT
                                            </Text>
                                            <View style={{ flex: 1, alignItems: "flex-end" }}><View style={{ paddingRight: 20 }}><Image source={require('../Images/leaf.png')} style={{ width: 20, height: 20 }} /></View></View>
                                        </TouchableOpacity>)
                                }
                            }}
                        />
                    </View>

                </ImageBackground>
            </MaskedView>
            <NavBar parsedProps={props} screenName={"Tracker"}></NavBar>
            <TouchableOpacity style={styles.ProgressButton} onPress={() => { props.navigation.navigate('Progress') }}><Image source={require('../Images/ProgressButton.png')}></Image></TouchableOpacity>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        width: 350,
        height: 50,
        backgroundColor: "#EDFFF4",
        borderColor: "#000000",
        borderBottomWidth: 0,
        borderTopWidth: 0.5
    },
    itemContainer: {
        textAlignVertical: "center",
    },
    TrackerContainer: {
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        width: 350,
        height: 210,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 20
    },
    progressCircle: {
        borderRadius: 40,
        backgroundColor: '#D9D9D9',
        width: 80,
        height: 80,
        marginLeft: 15,
        alignItems: 'center'
    },
    firstprogressLayer: {
        borderWidth: 15,
        borderRadius: 55,
        width: 110,
        height: 110,
        borderBottomColor: 'rgba(0, 0, 0, .01)',
        borderRightColor: "#65E730",
        borderTopColor: "#65E730",
        borderLeftColor: "rgba(0, 0, 0, .01)",
        position: "absolute",
        bottom: -15,
        transform: [{ rotateZ: '45deg' }]
    },
    secondProgressLayer: {
        width: 110,
        height: 110,
        position: 'absolute',
        bottom: -15,
        borderWidth: 15,
        borderRadius: 55,
        borderLeftColor: 'rgba(0, 0, 0, .01)',
        borderBottomColor: 'rgba(0, 0, 0, .01)',
        borderRightColor: '#65E730',
        borderTopColor: '#65E730',
        transform: [{ rotateZ: '45deg' }]
    },
    offsetLayer: {
        borderWidth: 15,
        borderRadius: 55,
        width: 110,
        height: 110,
        borderBottomColor: 'rgba(0, 0, 0, .01)',
        borderRightColor: "#FFFFFF",
        borderTopColor: "#FFFFFF",
        borderLeftColor: 'rgba(0, 0, 0, .01)',
        position: "absolute",
        bottom: -15,
        transform: [{ rotateZ: '-135deg' }],
    },
    image: {
        flex: 1,
        paddingLeft: 20
    },
    title: {
        fontFamily: 'nunitoB',
        fontSize: 16,
        textAlignVertical: "center",
        flex: 1,
        textAlign: "left",
        paddingLeft: 15
    },
    header: {
        backgroundColor: "#CBFFDF",
        width: 350,
        height: 50,
        borderWidth: 0.6,
        borderColor: "white",
        textAlign: "center",
        textAlignVertical: 'center',
        borderTopWidth: 0.5
    },
    date: {
        backgroundColor: "#FFFFFF",
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        height: 60,
        fontFamily: "nunitoB",
        fontSize: 20
    },
    sectionListHeight: {
        height: 397,
        width: 350
    },
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
        alignSelf: 'center',
    },
    ProgressButton: {
        position: 'absolute',
        top: 725,
        alignSelf: 'center'
    }
});

export default App;

