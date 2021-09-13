import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@theme/colors';

const BadgeComponent = (props) => {
    const {text, badgeContainerStyle, onPress, selected} = props;

    return (
        <Pressable onPress={onPress} style={[styles.badgeView, badgeContainerStyle, selected ? {borderWidth: 3, borderColor: colors.primary} : {}]}>
            <Text style={styles.badgeText}>{text}</Text>
        </Pressable>
    );
}

export default BadgeComponent;

const styles = StyleSheet.create({
    badgeView: {
        backgroundColor: colors.primary,
        borderRadius: 20,
        paddingHorizontal: 7,
        paddingVertical: 2,
        justifyContent: 'center'
    },
    badgeText: {
        textAlign: 'center',
        fontSize: 15,
        color: colors.white
    },
});