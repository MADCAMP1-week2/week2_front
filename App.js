import React, {useState, useEffect} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ActivityIndicator,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import authStorage from './src/services/authStorage';

import GreetingScreen from './src/screens/GreetingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// 탭 네비게이터
const Tab = createBottomTabNavigator();
function TabNavigator({onLogout}) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings">
        {() => <SettingsScreen onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// 스택 네비게이터
const Stack = createNativeStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'light';

  const [isLoading, setIsLoading] = useState(true); // 토큰 확인 중 상태
  const [userToken, setUserToken] = useState(null); // 토큰 저장

  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부

  useEffect(() => {
    // 로그인 상태를 asyncStorage에서 가져오기
    const checkToken = async () => {
      const {accessToken, refreshToken, id} = await authStorage.getToken();
      if (accessToken && refreshToken && id) setIsLoggedIn(true);
      setIsLoading(false);
    };
    checkToken();
  }, []);

  if (isLoading) {
    // 토큰 확인하는 동안 로딩 화면 표시
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Greeting" component={GreetingScreen} />
            <Stack.Screen name="Login">
              {() => <LoginScreen onLogin={() => setIsLoggedIn(true)} />}
            </Stack.Screen>
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <Stack.Screen name="Main">
            {() => <TabNavigator onLogout={() => setIsLoggedIn(false)} />}
          </Stack.Screen>
        )}
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

export default App;
