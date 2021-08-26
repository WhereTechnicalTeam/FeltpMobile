import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@theme/colors';

const LinkTextComponent = (props) => {
    const {preText, actionText, onPress, actionTextStyle, disabled} = props;

    return (
        <View style={styles.linkTextView}>
            <Text style={styles.preText}>{preText}</Text>
            <View style={styles.actionTextView}>
                <Pressable onPress={onPress} disabled={disabled}>
                    <Text style={[styles.actionText, actionTextStyle]}>{actionText}</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default LinkTextComponent;

const styles = StyleSheet.create({
    linkTextView: {
        textAlign: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    actionTextView: {
        paddingHorizontal: 5
    },
    preText: {
        color: colors.primaryBlack
    },
    actionText: {
        color: colors.primary
    }
});