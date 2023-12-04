import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from '../Screens/MainScreen';
import SettingsScreen from '../Screens/SettingsScreen';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainScreen">
        <Stack.Screen
        name="MainScreen"
        options={{ headerShown: false }} // This hides the header label
        component={MainScreen} />
        <Stack.Screen
        name="SettingsScreen"
        options={{ headerShown: false }} // This hides the header label
        component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;