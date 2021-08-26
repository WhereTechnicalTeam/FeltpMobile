/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import LinkTextComponent from '@components/link-text/LinkTextComponent';
import ListItemComponent from '@components/list-item/ListItemComponent';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';

const App = () => {

  return (
    <SafeAreaView style={styles.container}>
      <ListItemComponent rightIcon="arrow-back-sharp" text="Hello" leftIcon="pencil"/>
      <LinkTextComponent preText="Name" actionText="World"/>
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
