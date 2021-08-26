import React, {useState} from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { colors } from '@theme/colors';

const DatePickerComponent = (props) => {
    const {value, invalid, disabled, label, showPicker, onDateChange} = props;
    const [show, setShow] = useState(false);

    const handleChange = (event, newDate) => {
        setShow(false);
        onDateChange(newDate ? formatDate(newDate) : value ? value : newDate);
    }

    const formatDate = (date) => {
        let month = date.getMonth() + 1;
        let day = date.getDate()
        return [date.getFullYear(), month > 9 ? month : '0' + month, day > 9 ? day : '0'+day].join("-")
    }

    return (
        <View style={[styles.datePickerContainer, disabled ? styles.disabled: {}]}>
            <Text style={[styles.label, disabled ? styles.disabled : {}]}>{label}</Text>
            <Pressable onPress={() => setShow(true)} style={[styles.presssable, invalid ? styles.invalid : {}]} disabled={disabled}>
                <Text style={styles.pickerText}>
                    {value ? new Date(value).toDateString() : ''}
                </Text>
                <Icon style={[styles.pickerIcon, disabled ? styles.disabled: {} ]} color={colors.secondaryBlack} size={13} name="caret-down" onPress={() => setShow(true)}/>
                {show && <DateTimePicker
                    isVisible={showPicker}
                    mode="date"
                    display="calendar"
                    value={value ? new Date(value) : new Date()}
                    onChange={handleChange}
                />}
            </Pressable>
        </View>
    );
}

export default DatePickerComponent;

const styles = StyleSheet.create({
    datePickerContainer: {
        height: 65,
        width: '100%',
        marginBottom: 10
    },
    presssable: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        borderColor: colors.secondaryBlack,
        borderWidth: 0.8,
        borderRadius: 5,
        alignItems: 'center',
        // paddingHorizontal: 5,
        width: '100%'
    },
    pickerText: {
        width: '70%',
        height: '100%',
        paddingHorizontal: 8,
        fontSize: 17,
        textAlignVertical: 'center'
    },
    label: {
        fontSize: 15,
        color: colors.black,
        marginBottom: 5,
    },
    pickerIcon: {
        marginRight: 15
    },
    disabled: {
        opacity: 0.35
    },
    invalid: {
        borderColor: colors.red
    }
});