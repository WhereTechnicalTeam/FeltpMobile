import React from 'react';
import { View, Text, Pressable , StyleSheet} from 'react-native';
import { colors } from '@theme/colors';

const ButtonComponent = (props) => {
    const {title, disabled, onPress, buttonStyle, buttonContainerStyle} = props;
    return (
        <View style={[styles.buttonView, buttonContainerStyle, disabled ? styles.disabled : {}]}>
            <Pressable 
                onPress={onPress}
                disabled={disabled}
                style={[styles.buttonPressable, buttonStyle]}
            >
                <Text style={styles.buttonText}>{title}</Text>
            </Pressable>
        </View>
    )
}

export default ButtonComponent;

const styles = StyleSheet.create({
    buttonView: {
        width: '100%',
        height: 50,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 300,
        borderRadius: 5
    },
    buttonPressable: {
        width: '100%',
        height: '100%',
        justifyContent: 'center'
    },
    buttonText: {
        color: colors.white,
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    disabled: {
        opacity: 0.5
    }
})