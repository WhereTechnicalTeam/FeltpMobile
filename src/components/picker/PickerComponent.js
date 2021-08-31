import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '@theme/colors';

const PickerComponent = (props) => {
    const {label, items=[], onValueChange, mode, disabled, selectedValue, invalid} = props;

    return (
        <View style={[disabled ? styles.disabled : {}]}>
            <Text style={styles.pickerText}>{label}</Text>
            <View style={[styles.pickerView, invalid ? styles.invalid : {}]}>
                <Picker mode={mode} onValueChange={onValueChange} selectedValue={selectedValue} enabled={!disabled} dropdownIconColor={colors.secondaryBlack}>
                    {
                        items.map(i => <Picker.Item key={i.id} value={i.id} label={i.name}/>)
                    }
                </Picker>
            </View>
        </View>
    );
}

export default PickerComponent;

const styles = StyleSheet.create({
    pickerView: {
        borderRadius: 5,
        borderColor: colors.secondaryBlack,
        borderWidth: 1,       
        height: 50,
        justifyContent: 'center' 
    },
    pickerText: {
        fontSize: 15,
        marginBottom: 5
    },
    disabled: {
        opacity: 0.3
    },
    invalid: {
        borderColor: colors.red
    }
})