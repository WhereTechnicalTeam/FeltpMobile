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
import { NavigationContainer } from '@react-navigation/native';
import AppContainer from '@navigators/app-container';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
    <SafeAreaView style={styles.container}>
      <ToastComponent />
      <AppContainer />
    </SafeAreaView>
    </NavigationContainer>
  );
};

//TODO: extract picker to component
//TODO update picker, textInput placeholder, dropdown to use white in dark mode

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
