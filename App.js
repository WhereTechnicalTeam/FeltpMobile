/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import ToastComponent from '@components/toast/ToastComponent';
import ButtonComponent from '@components/button/ButtonComponent';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import MapViewScreen from '@screens/MapView';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  })

  return (
    <NavigationContainer>
    <SafeAreaView style={styles.container}>
      <ToastComponent />
      <MapViewScreen />
    </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
});

export default App;
