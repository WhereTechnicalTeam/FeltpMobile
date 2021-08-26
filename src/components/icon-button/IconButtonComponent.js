import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '@theme/colors';

const IconButtonComponent = (props) => {
    const {icon, size, color, iconButtonStyle, onPress } = props;

    return (
        <View style={[styles.iconButtonView, iconButtonStyle]}>
            <Pressable onPress={onPress}>
                <Icon name={icon} size={size} color={color} />
            </Pressable>
        </View>
    )
}

export default IconButtonComponent;

const styles = StyleSheet.create({
    iconButtonView: {
        backgroundColor: colors.primary,
        opacity: 0.8,
        borderRadius: 5,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    }
})