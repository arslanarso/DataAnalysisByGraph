import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import LineGraph from './src/screens/LineGraph';
import OnboardingScreen from './src/screens/OnboardingScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerStyle: {backgroundColor: '#c53042'},
          headerTitleStyle: {color: 'white'},
          headerTintColor: 'white', // Back button color
        }}>
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="LineGraph"
          component={LineGraph}
          options={{
            title: 'Selected Date',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
