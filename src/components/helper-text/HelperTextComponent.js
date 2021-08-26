import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@theme/colors';

const HelperTextComponent = (props) => {
    const {text, containerStyle, textStyle, invalid} = props;

    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={[styles.text, textStyle, invalid ? styles.invalid : {}]}>
                {text}
            </Text>
        </View>
    );
}

export default HelperTextComponent;
 
const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 5
    },
    text: {
        fontSize: 11,
        color: colors.secondaryBlack
    },
    invalid: {
        color: colors.red
    }
})