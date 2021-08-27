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

const App = () => {
  
  return (
    <SafeAreaView style={styles.container}>
      <ToastComponent />
      <ButtonComponent title="Say Hello" onPress={() => ToastComponent.show("Hello there!!", {timeout: 5000, level: "success"})}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 30,
    position: 'relative'
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
});

export default App;
