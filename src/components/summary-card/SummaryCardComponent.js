import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '@theme/colors';

const SummaryCardComponent = (props) => {
    const {mainText, subText, summaryContainerStyle} = props;
    return (
        <View style={[styles.cardView, summaryContainerStyle]}>
            <Text style={styles.mainText}>{mainText}</Text>
            <Text style={styles.subText}>{subText}</Text>
        </View>
    );
}

export default SummaryCardComponent;

const styles = StyleSheet.create({
    cardView: {
        width: Dimensions.get("screen").width/3,
        height: 100,
        backgroundColor: colors.primary,
        borderRadius: 7,
        justifyContent: 'center'
    },
    mainText: {
        fontSize:  30,
        fontWeight: '900',
        color: colors.white,
        textAlign: 'center'
    },
    subText: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.white,
        textAlign: 'center'
    }
});