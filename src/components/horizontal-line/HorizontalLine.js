import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@theme/colors';

const HorizontalLineComponent = ({hrWidth}) => {
    return (
        <View style={{alignSelf: 'center', width: hrWidth}}>
            <View style={styles.hr}/>
        </View>
    );
}

export default HorizontalLineComponent;

const styles = StyleSheet.create({
    hr: {
        borderBottomColor: colors.secondaryBlack,
        borderBottomWidth: 1,
        opacity: 0.3
    }
});