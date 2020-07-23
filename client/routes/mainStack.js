import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from '../screens/auth/login';
import TabStack from './tabStack';
import Header from '../shared/header';
import ConfirmEvent from '../screens/postHandling/confirmEvent';
import { animationConfig } from '../shared/routeAnimationConfig';

const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        transitionSpec:{
          open: animationConfig,
          close: animationConfig
        },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
      }}
      headerMode='screen'
    >
      <Stack.Screen 
        name="Home" 
        options={{headerShown: false}}
        component={TabStack} />
      <Stack.Screen
        name='Confirm Event'
        options={({ navigation, route }) => ({
          headerTitle: () => <Header navigation={navigation} type='confirmEvent' title='Confirm Event'/>,
          headerTitleContainerStyle: {
            left: 40,
          },
        })}
      component={ConfirmEvent}
    />
    </Stack.Navigator>
  );
};

export default MainStack;
