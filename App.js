/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import MemberCardComponent from '@components/member-card/MemberCardComponent';
import NewsPreviewComponent from '@components/news-preview/NewsPreviewComponent';
import SummaryCardComponent from '@components/summary-card/SummaryCardComponent';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';

const App = () => {

  return (
    <SafeAreaView style={styles.container}>
      <NewsPreviewComponent title="Hello" summary="pencil"/>
      <SummaryCardComponent mainText="Hello" subText="pencil"/>
      <MemberCardComponent {...{route: {params: {member: {}}}}}/>
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
