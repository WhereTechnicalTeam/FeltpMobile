import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors } from '@theme/colors';

const LogoComponent = (props) => {

    const {logoUrl, logoText, logoStyle } = props;

    return (
        <View style={[styles.logoView, logoStyle]}>
            <Image style={styles.logoImage} source={require("@assets/logo_1.jpg")}/>
            {logoText && <Text style={styles.logoText}>{logoText}</Text>}
        </View>
    );
}

export default LogoComponent;

const styles = StyleSheet.create({
    logoView: {
        height: 70,
        borderRadius: 20,
        alignItems: 'center',
    },
    logoImage: {
        width: '100%',
        maxWidth: 90,
        height: 70,
        resizeMode: 'cover',
    },
    logoText: {
        fontSize: 25,
        fontWeight: '900',
        textAlign: 'center'
    }
});
