import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Image, ImageBackground, SafeAreaView, Text, SectionList, TouchableOpacity, TextInput, FlatList, ToastAndroid } from "react-native";
import MaskedView from '@react-native-masked-view/masked-view';
import { useFonts } from 'expo-font';
import carbonFootprint from '../carbonFootprint'
import DropDownPicker from 'react-native-dropdown-picker';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import 'firebase/firestore';
import {firebase} from '../firebaseConfig2'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

const STORAGE_KEY_USERID = '@save_userid';


function getDescription(activityName) {
    for (var activities of carbonFootprint) {
        if (activities.name == activityName) {
            return activities['description']
        }
    }
}

function calculateSaved(activityName, duration) {
    if (duration) {
        for (var activities of carbonFootprint) {
            if (activities.name == activityName) {
                if (activities.measuringValue == 'Minute') {
                    return Math.round((duration * activities.footprintPerMinute + Number.EPSILON) * 1000) / 1000
                } else {
                    return Math.round((duration * activities.footprintPerQuantity + Number.EPSILON) * 1000) / 1000
                }
            }
        }
    }
    return ''
}

function getSavingMethod(activityName) {
    for (var activities of carbonFootprint) {
        if (activities.name == activityName) {
            if (activities.measuringValue == 'Minute') {
                return 'Set duration:'
            } else {
                return 'Quantity:    '
            }
        }
    }
}

const App = (props) => {
    const [UID, setUID] = useState('')



    useEffect(() =>{
        const readData = async () => {
            try {
                const testid = await AsyncStorage.getItem(STORAGE_KEY_USERID)
                if (testid !== null) {
                    // console.log(`I was retrieved from async storage in tracker ${testid}`)
                    setUID(testid)
                }
            } catch (e) {
                console.log(e)
                alert('Failed to fetch the data from storage')
            }
        }
        readData();
    })
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: '10min', value: 10 },
        { label: '20min', value: 20 },
        { label: '30min', value: 30 },
        { label: '40min', value: 40 },
        { label: '50min', value: 50 },
        { label: '1h', value: 60 },
        { label: '2h', value: 120 },
        { label: '3h', value: 180 },
        { label: '4h', value: 240 },
        { label: '5h', value: 300 },
        { label: '6h', value: 360 },
        { label: '7h', value: 420 },
        { label: '8h', value: 480 },
    ])
    const [activityDone, setActivity] = useState('Rode a bus')
    const [fontsLoaded] = useFonts({
        "nunitoB": require("../assets/fonts/Nunito-Bold.ttf"),
        "nunitoEB": require("../assets/fonts/Nunito-ExtraBold.ttf"),
        "nunitoS": require("../assets/fonts/Nunito-SemiBold.ttf"),
        "nunito": require("../assets/fonts/Nunito-Regular.ttf"),
    })

    if (!fontsLoaded) {
        return undefined
    }

    const addActivity = firebase.firestore().collection('activities')
    function addActivityToDb(activityDone, footprint, name, time){
        if(activityDone && footprint && name && time){
            addActivity.add({activityDone: activityDone, footprint: footprint, name: name, time: time})
            ToastAndroid.show('Activity successfully added', ToastAndroid.SHORT)
            props.navigation.navigate('Tracker')
        }
    }

    const addShortCut = [
        { title: 'Recycled 20 paper', id: 1, quickAdd: () => addActivityToDb('Recycled paper', 0.004, UID, new Date())},
        { title: 'Rode the bus for 20 minutes', id: 2, quickAdd: () => addActivityToDb('Rode a bus', 0.02, UID, new Date()) },
        { title: 'Recycled 10 paper', id: 3, quickAdd: () => addActivityToDb('Recycled paper', 0.002, UID, new Date()) },
        { title: 'Used ceiling fans for 8h', id: 4, quickAdd: () => addActivityToDb('Use ceiling fan', 0.04, UID, new Date()) },
        { title: 'Rode the bus for 40 minutes', id: 5, quickAdd: () => addActivityToDb('Rode a bus', 0.04, UID, new Date()) },
        { title: 'Recycled 5 paper cup', id: 6, quickAdd: () => addActivityToDb('Recycled paper cup', 0.005, UID, new Date()) },
    ]



    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.navBarContainer}></View>
            <MaskedView style={{ flex: 1}}
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
                    <View>
                        <View style={{ position: 'absolute', top: 50, left: 20, width: 350 }}>
                            <AutocompleteDropdown
                                clearOnFocus={true}
                                closeOnBlur={true}
                                closeOnSubmit={false}
                                initialValue={{ id: '1' }}
                                onSelectItem={(text) => {
                                    if (text) {
                                        setActivity(text.title);
                                        setValue();
                                        for (var activities of carbonFootprint) {
                                            if (text.title == activities.name) {
                                                if (activities.measuringValue == "Minute") {
                                                    setItems(
                                                        [
                                                            { label: '10min', value: 10 },
                                                            { label: '20min', value: 20 },
                                                            { label: '30min', value: 30 },
                                                            { label: '40min', value: 40 },
                                                            { label: '50min', value: 50 },
                                                            { label: '1h', value: 60 },
                                                            { label: '2h', value: 120 },
                                                            { label: '3h', value: 180 },
                                                            { label: '4h', value: 240 },
                                                            { label: '5h', value: 300 },
                                                            { label: '6h', value: 360 },
                                                            { label: '7h', value: 420 },
                                                            { label: '8h', value: 480 }
                                                        ]
                                                    )
                                                } else {
                                                    setItems(
                                                        [
                                                            { label: '1', value: 1 },
                                                            { label: '2', value: 2 },
                                                            { label: '3', value: 3 },
                                                            { label: '4', value: 4 },
                                                            { label: '5', value: 5 },
                                                            { label: '6', value: 6 },
                                                            { label: '7', value: 7 },
                                                            { label: '8', value: 8 },
                                                            { label: '9', value: 9 },
                                                            { label: '10', value: 10 },
                                                            { label: '20', value: 20 },
                                                            { label: '30', value: 30 },
                                                            { label: '40', value: 40 },
                                                            { label: '50', value: 50 },
                                                            { label: '60', value: 60 },
                                                            { label: '70', value: 70 },
                                                            { label: '80', value: 80 },
                                                            { label: '90', value: 90 },
                                                            { label: '100', value: 100 }
                                                        ]
                                                    )
                                                }
                                            }
                                        }
                                    }
                                }}
                                dataSet={[
                                    { id: '1', title: 'Rode a bus' },
                                    { id: '2', title: 'Recycled paper cup' },
                                    { id: '3', title: 'Recycled paper' },
                                    { id: '4', title: 'Used ceiling fan' },
                                ]}
                            />
                        </View>
                        <Text style={{ marginLeft: 20, marginTop: 110, fontFamily: 'nunitoS', fontSize: 30, textDecorationLine: 'underline' }}>{activityDone}</Text>
                        <Text style={{ marginLeft: 20, fontFamily: 'nunitoS' }}>{getDescription(activityDone)}</Text>
                        <View style={{ height: 220, width: 350, marginLeft: 20, marginTop: 20, backgroundColor: '#099D02', borderRadius: 20 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: 'white', marginLeft: 10, marginTop: 20, marginRight: 45 }}>{getSavingMethod(activityDone)}</Text>
                                <DropDownPicker
                                    open={open}
                                    value={value}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setValue}
                                    setItems={setItems}
                                    style={{ height: 50, width: 150, marginLeft: 60, marginTop: 5 }}
                                />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: 'white', marginLeft: 10, marginTop: 25 }}>Carbon Emmission saved:</Text>
                                <View style={{ backgroundColor: 'white', width: 80, height: 40, marginTop: 15, marginLeft: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
                                    <Text style={{ fontSize: 20 }}>{calculateSaved(activityDone, value)}</Text>
                                </View>
                                <Text style={{ color: 'white', marginTop: 35, marginLeft: 10 }}>Tonnes</Text>
                            </View>
                            <TouchableOpacity style={{ width: 300, height: 45, backgroundColor: 'white', marginLeft: 25, marginTop: 30, backgroundColor: '#056E00', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }} onPress={()=>{
                                // console.log(`You ${activityDone} and saved ${calculateSaved(activityDone, value)} Tonnes of carbon footprint!`)
                                addActivityToDb(activityDone, calculateSaved(activityDone, value), UID, new Date())
                                }}>
                                <Text style={{ color: 'white', fontSize: 20, fontFamily: 'nunitoB' }}>ADD ENTRY</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ backgroundColor: 'white', height: 400, marginTop: 30, backgroundColor: '#EDFFF4', borderRadius: 30 }}>
                            <FlatList
                                data={addShortCut}
                                renderItem={(item) => {
                                    if (item.item.id == 1) {
                                        return (
                                            <Pressable onPress={() => item.item.quickAdd()}>
                                                <View style={{ flexDirection: 'row', flex: 1, height: 50, borderWidth: 1, alignItems: 'center', paddingLeft: 20, borderTopRightRadius: 30, borderTopLeftRadius: 30 }}>
                                                    <Text style={{ fontSize: 20 }}>{item.item.title}</Text>
                                                    <View style={{ alignItems: 'flex-end', flex: 1, paddingRight: 40 }}><Image source={require('../Images/AddIcon.png')}></Image></View>
                                                </View>
                                            </Pressable>)
                                    } else {
                                        return (
                                            <Pressable onPress={()=>item.item.quickAdd()}>
                                                <View style={{flexDirection: 'row', flex: 1, height: 50, borderWidth: 1, alignItems: 'center', paddingLeft: 20 }}>
                                                    <Text style={{ fontSize: 20 }}>{item.item.title}</Text>
                                                    <View style={{ alignItems: 'flex-end', flex: 1, paddingRight: 40 }}><Image source={require('../Images/AddIcon.png')}></Image></View>
                                                </View>
                                            </Pressable>
                                        )
                                    }
                                }}
                                keyExtractor={item => item.id}
                            />
                        </View>
                    </View>
                </ImageBackground>
            </MaskedView>
            <TouchableOpacity style={styles.ProgressButton} onPress={() => { props.navigation.navigate('Progress') }}><Image source={require('../Images/ProgressButton.png')}></Image></TouchableOpacity>
            <View style={[styles.navBarContainer, {backgroundColor: 'transparent'}]}>
                <TouchableOpacity style={styles.navBarIcons} onPress={() => { props.navigation.navigate('Tracker') }}><Image source={require('../Images/HomeButtonActive.png')} style={{}}></Image></TouchableOpacity>
                <TouchableOpacity style={styles.navBarIcons} onPress={() => { props.navigation.navigate('Locator') }}><Image source={require('../Images/LocatorButton.png')} style={{}}></Image></TouchableOpacity>
                <View style={styles.navBarIcons}></View>
                <TouchableOpacity style={styles.navBarIcons} onPress={() => { props.navigation.navigate('Leaderboard') }}><Image source={require('../Images/LeaderboardButton.png')} style={{}}></Image></TouchableOpacity>
                <TouchableOpacity style={styles.navBarIcons} onPress={() => { props.navigation.navigate('Setting') }}><Image source={require('../Images/SettingButton.png')} style={{}}></Image></TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    image: {
        flex: 1,
    },
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
    },
    searchBar: {
        height: 40,
        width: 350,
        backgroundColor: '#FFFFFF',
        borderColor: "#000000",
        borderRadius: 5,
        flexDirection: 'row',
        paddingTop: 10,
        paddingLeft: 10,
        position: 'absolute',
        marginTop: 50,
        marginLeft: 20,
    },
    inputField: {
        height: 25,
        width: 290,
        marginLeft: 20,
        fontSize: 20,
        paddingBottom: 3,
    },
    navBarContainer: {
        position: 'absolute',
        top: 745,
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
    }
});

export default App;
