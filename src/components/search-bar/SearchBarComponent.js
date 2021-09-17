import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '@theme/colors';

const SearchBarComponent = (props) => {
    const {placeholder, handleChange, value, searchContainerStyle, onIconPress, iconName} = props;

    return (
        <View style={[styles.searchBarContainer, searchContainerStyle]}>
            <TextInput placeholder={placeholder} onChangeText={handleChange} value={value} style={styles.textInput}/>
            <Icon size={25} color={colors.secondaryBlack} name={iconName || "search"} onPress={onIconPress}/>
        </View>
    )
}

export default SearchBarComponent;

const styles = StyleSheet.create({
    searchBarContainer: {
        backgroundColor: colors.white,
        borderRadius: 5,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 280,
    },
    textInput: {
        fontSize: 17,
        marginRight: 5,
        width: '90%',
        height: '100%',
    }
});