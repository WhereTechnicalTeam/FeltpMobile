/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import FormInputComponent from '@components/input/FormInputComponent';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';

const App = () => {

  return (
    <SafeAreaView style={styles.container}>
      <IconButtonComponent icon="arrow-back-sharp"/>
      <FormInputComponent label="Name"/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 30
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
});

export default App;
