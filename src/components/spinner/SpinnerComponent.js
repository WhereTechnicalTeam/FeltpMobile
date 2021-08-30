import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { colors } from '@theme/colors';

const SpinnerComponent = () => {

    return (
        <View style={styles.container}>
            <ActivityIndicator color={colors.primary} size="large"/>
        </View>
    );
}

export default SpinnerComponent;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        opacity: 0.8,
        borderRadius: 5,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    }
})