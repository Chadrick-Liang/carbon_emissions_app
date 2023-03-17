import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Progress from './Screens/progress'
import Setting from './Screens/settings'
import Leaderboard from './Screens/leaderboard'
import Login from './Screens/login'
import Locator from './Screens/locator'
import Tracker from './Screens/tracker'
import TrackerAdd from './Screens/trackerAdd'
import Signup from './Screens/signup'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Log In' >
        <Stack.Screen name = "Log In" component={Login} options={{headerShown: false}}/>
        <Stack.Screen name = "Tracker" component={Tracker} options={{headerShown: false}}/>
        <Stack.Screen name = "Locator" component={Locator} options={{headerShown: false}}/>
        <Stack.Screen name = "Leaderboard" component={Leaderboard} options={{headerShown: false}}/>
        <Stack.Screen name = "Setting" component = {Setting} options={{headerShown: false}}/>
        <Stack.Screen name = "Progress" component = {Progress} options={{headerShown: false}}/>
        <Stack.Screen name = "TrackerAdd" component={TrackerAdd} options={{headerShown: false}}/>
        <Stack.Screen name = "Signup" component={Signup} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
