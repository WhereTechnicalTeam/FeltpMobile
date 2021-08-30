import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '@theme/colors';

const SummaryCardComponent = (props) => {
    const {mainText, subText, summaryContainerStyle} = props;
    return (
        <View style={[styles.cardView, summaryContainerStyle, styles.shadow]}>
            <Text style={styles.mainText}>{mainText}</Text>
            <Text style={styles.subText}>{subText}</Text>
        </View>
    );
}

export default SummaryCardComponent;

const styles = StyleSheet.create({
    cardView: {
        width: 120,
        height: 90,
        backgroundColor: colors.primary,
        borderRadius: 7,
        justifyContent: 'center'
    },
    mainText: {
        fontSize:  25,
        fontWeight: '900',
        color: colors.white,
        textAlign: 'center'
    },
    subText: {
        fontSize: 15,
        fontWeight: '800',
        color: colors.white,
        textAlign: 'center'
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,        
        elevation: 5,
    }
});