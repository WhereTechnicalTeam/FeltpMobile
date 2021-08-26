/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import HelperTextComponent from 'components/helper-text/HelperTextComponent';
import HorizontalLineComponent from 'components/horizontal-line/HorizontalLine';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';

const App = () => {

  return (
    <SafeAreaView style={styles.container}>
      <HelperTextComponent text="Hello world"/>
      <HorizontalLineComponent hrWidth={100}/>
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
