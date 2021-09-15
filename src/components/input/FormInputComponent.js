import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { colors } from '@theme/colors';

const FormInputComponent = (props) => {
    const {label, placeholder, value, 
        disabled, onChangeText, textInputStyle, 
        inputContainerStyle, hidden, errors, invalid, onPressIn, ...restProps } = props; 

    return (
        <View style={[styles.inputContainer, inputContainerStyle]}>
            <Text style={[styles.label, disabled ? styles.disabled : {}]}>{label}</Text>
            <View style={[styles.textInputView, disabled ? styles.disabled : {}, invalid ? styles.invalid : {}]} >
                <TextInput 
                    placeholder={placeholder}
                    value={value}
                    placeholderTextColor={colors.grey}
                    onChangeText={onChangeText}
                     style={[styles.textInput, textInputStyle]}
                    editable={!disabled}
                    secureTextEntry={hidden}
                    {...restProps}
                />
            </View>
        </View>
    );
}

export default FormInputComponent;

const styles = StyleSheet.create({
    formInputContainer: {
        width: '100%',
        height: 65,
    },
    textInputView: {
        borderColor: colors.secondaryBlack,
        borderWidth: 0.8,
        height: 50,
        borderRadius: 5
    },
    label: {
        color: colors.black,
        marginBottom: 5,
        fontSize: 15
    },
    textInput: {
        height: '100%',
        paddingHorizontal: 8,
        fontSize: 17,
        color: colors.primaryBlack
    },
    disabled: {
        opacity: 0.35
    },
    errorText: {
        color: 'red',
        fontSize: 11
    },
    invalid: {
        borderColor: colors.red
    }
});