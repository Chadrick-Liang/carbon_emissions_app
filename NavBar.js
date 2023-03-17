import React from 'react'
import { StyleSheet, View, Image, ImageBackground, SafeAreaView, Text, SectionList, TouchableOpacity } from "react-native";

const App = (props) => (
    <View style={[styles.navBarContainer, { backgroundColor: 'transparent' }]}>
        {(props.screenName == "Tracker") ?
            (<TouchableOpacity style={styles.navBarIcons} onPress={() => { props.parsedProps.navigation.navigate('Tracker') }}><Image source={require('./Images/HomeButtonActive.png')} style={{}}></Image></TouchableOpacity>) :
            <TouchableOpacity style={styles.navBarIcons} onPress={() => { props.parsedProps.navigation.navigate('Tracker') }}><Image source={require('./Images/HomeButton.png')} style={{}}></Image></TouchableOpacity>}
        {(props.screenName == "Locator") ?
            (<TouchableOpacity style={styles.navBarIcons} onPress={() => { props.parsedProps.navigation.navigate('Locator') }}><Image source={require('./Images/LocatorButtonA.png')} style={{}}></Image></TouchableOpacity>) :
            <TouchableOpacity style={styles.navBarIcons} onPress={() => { props.parsedProps.navigation.navigate('Locator') }}><Image source={require('./Images/LocatorButton.png')} style={{}}></Image></TouchableOpacity>}
        <View style={styles.navBarIcons}></View>
        {(props.screenName == "Leaderboard") ?
            (<TouchableOpacity style={styles.navBarIcons} onPress={() => { props.parsedProps.navigation.navigate('Leaderboard') }}><Image source={require('./Images/LeaderboardButtonA.png')} style={{}}></Image></TouchableOpacity>) :
            <TouchableOpacity style={styles.navBarIcons} onPress={() => { props.parsedProps.navigation.navigate('Leaderboard') }}><Image source={require('./Images/LeaderboardButton.png')} style={{}}></Image></TouchableOpacity>}
        {(props.screenName == "Setting") ?
            (<TouchableOpacity style={styles.navBarIcons} onPress={() => { props.parsedProps.navigation.navigate('Setting') }}><Image source={require('./Images/SettingButtonA.png')} style={{}}></Image></TouchableOpacity>) :
            <TouchableOpacity style={styles.navBarIcons} onPress={() => { props.parsedProps.navigation.navigate('Setting') }}><Image source={require('./Images/SettingButton.png')} style={{}}></Image></TouchableOpacity>}
    </View>
)
const styles = StyleSheet.create({
    navBarContainer: {
        position: 'absolute',
        top: 745,
        width: "100%",
        height: 60,
        paddingTop: 10,
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },
    navBarIcons: {
        flex: 1,
        alignItems: 'center'
    },
});

export default App;