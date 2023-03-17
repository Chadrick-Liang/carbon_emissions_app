import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, FlatList, Image, TextInput, SafeAreaView, ImageBackground, TouchableOpacity, Pressable, Modal, TouchableWithoutFeedback, ScrollView } from "react-native";
import React, { useState } from 'react'
import MaskedView from '@react-native-masked-view/masked-view';
import { useFonts } from 'expo-font';
import NavBar from '../NavBar'


const DATA = [
    {
        location: "Head southeast from efg road to hij drive", image: require('../Images/location1.png'), id: 4
    },
    {
        location: "Turn left into klm road", image: require('../Images/location2.png'), id: 3
    },
    {
        location: "Continue walking down the road", image: require('../Images/location3.png'), id: 2
    },
    {
        location: "5 ABC drive", image: require('../Images/location4.png'), id: 1
    },

]

const Item = (props) => (
    <TouchableOpacity style={{ flexDirection: 'row', marginTop: -5, height: 110 }} activeOpacity={0.7}>
        <Text style={styles.locationText}>{props.location}</Text>
        <View style={styles.locationImage}><Image source={props.image} /></View>
    </TouchableOpacity>
)

const App = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [text, onChangeText] = useState(null)
    const [fontsLoaded] = useFonts({
        "nunitoB": require("../assets/fonts/Nunito-Bold.ttf"),
        "nunitoEB": require("../assets/fonts/Nunito-ExtraBold.ttf"),
        "nunitoS": require("../assets/fonts/Nunito-SemiBold.ttf"),
        "nunito": require("../assets/fonts/Nunito-Regular.ttf"),
    })
    if (!fontsLoaded) {
        return null;
    }

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
                <View>
                    <MapView style={styles.map}
                        initialRegion={{
                            latitude: 1.30985,
                            longitude: 103.77770,
                            latitudeDelta: 0.001,
                            longitudeDelta: 0
                        }}
                    >
                        <Marker coordinate={{
                            latitude: 1.3101,
                            longitude: 103.7777,
                        }} onPress={() => setModalVisible(true)}/>
                        <Marker coordinate={{
                            latitude: 1.31001,
                            longitude: 103.77789,
                        }} onPress={() => setModalVisible(true)}><Image source={require('../Images/binIcon.png')} style={{ height: 35, width: 35 }} />
                        </Marker>
                        <Marker coordinate={{
                            latitude: 1.31001,
                            longitude: 103.777612,
                        }} onPress={() => setModalVisible(true)}><Image source={require('../Images/binIconActive.png')} style={{ height: 35, width: 35 }} />
                        </Marker>
                        <Marker coordinate={{
                            latitude: 1.30985,
                            longitude: 103.777612,
                        }} onPress={() => setModalVisible(true)}><Image source={require('../Images/binIcon.png')} style={{ height: 35, width: 35 }} />
                        </Marker>
                        <Marker coordinate={{
                            latitude: 1.31035,
                            longitude: 103.777612,
                        }} onPress={() => setModalVisible(true)}><Image source={require('../Images/binIcon.png')} style={{ height: 35, width: 35 }} />
                        </Marker>
                        <Marker coordinate={{
                            latitude: 1.31025,
                            longitude: 103.77752,
                        }} onPress={() => setModalVisible(true)}><Image source={require('../Images/binIcon.png')} style={{ height: 35, width: 35 }} />
                        </Marker>
                    </MapView>

                    <View style={{ position: 'absolute' }}>
                        <View style={styles.searchBar}>
                            <Image source={require("../Images/SearchIcon.png")} />
                            <TextInput style={styles.inputField} onChangeText={onChangeText} value={text} placeholder="Search" />
                        </View>
                        <View>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => {setModalVisible(false) }}
                            >
                                <TouchableOpacity
                                    style={styles.container}
                                    activeOpacity={1}
                                    onPressOut={() => {setModalVisible(false) }}
                                >

                                        <TouchableWithoutFeedback>
                                            <View style={styles.navigation}>
                                                <View style={styles.durationContainer}>
                                                    <Pressable onPress={() => setModalVisible(false)}><Image source={require('../Images/arrow-left.png')}></Image></Pressable>
                                                    <Text style={styles.duration}>3 min journey</Text>
                                                </View>
                                                <FlatList
                                                    scrollEnabled
                                                    overScrollMode='never'
                                                    style={{ height: 420 }}
                                                    data={DATA}
                                                    renderItem={({ item }) => {
                                                        return (<Item location={item.location} image={item.image} />)
                                                    }} />
                                            </View>
                                        </TouchableWithoutFeedback>

                                </TouchableOpacity>
                            </Modal>
                        </View>




                        {/* <Modal style={{ position: 'absolute' }}
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(!modalVisible);
                            }}>
                            <TouchableWithoutFeedback
                                        onPressOut={() => {setModalVisible(false)}}>
                                    
                                <View style={styles.navigation}>
                                    <View style={styles.durationContainer}>
                                        <Image source={require('../Images/arrow-left.png')}></Image>
                                        <Text style={styles.duration}>3 min journey</Text>
                                    </View>
                                    <FlatList
                                        scrollEnabled
                                        overScrollMode='never'
                                        style={{ height: 420 }}
                                        data={DATA}
                                        renderItem={({ item }) => {
                                            return (<Item location={item.location} image={item.image} />)
                                        }} />
                                </View>
                            </TouchableWithoutFeedback>
                        </Modal> */}
                        {/* <View style={styles.navigation}>
                            <View style={styles.durationContainer}>
                                <Image source={require('../Images/arrow-left.png')}></Image>
                                <Text style={styles.duration}>3 min journey</Text>
                            </View>
                            <FlatList
                                scrollEnabled
                                overScrollMode='never'
                                style={{ height: 420 }}
                                data={DATA}
                                renderItem={({ item }) => {
                                    return (<Item location={item.location} image={item.image} />)
                                }} />
                        </View> */}
                    </View>
                </View>
            </MaskedView>
            <NavBar parsedProps={props} screenName={"Locator"}></NavBar>
            <TouchableOpacity style={styles.ProgressButton} onPress={() => { props.navigation.navigate('Progress') }}><Image source={require('../Images/ProgressButton.png')}></Image></TouchableOpacity>

        </SafeAreaView>
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
    map: {
        width: "100%",
        height: "100%"
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
    navigation: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderColor: "#000000",
        backgroundColor: "#FFFFFF",
        marginLeft: 20,
        marginTop: 290,
        width: 350
    },
    durationContainer: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 30,
    },
    duration: {
        fontSize: 22,
        fontFamily: 'nunitoB',
        marginLeft: 20
    },
    locationText: {
        fontSize: 15,
        width: 160,
        marginLeft: 20,
        fontFamily: 'nunitoB',
        textAlignVertical: 'center'
    },
    locationImage: {
        flex: 1,
        alignItems: 'flex-end',
        marginRight: 30,
        marginTop: 20
    }
})

export default App;
