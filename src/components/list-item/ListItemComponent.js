import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ListItemComponent = (props) => {

    const {leftIcon, rightIcon, text, onPress, iconColor} = props;
    
    return (
        <View>
            <Pressable style={styles.listItemView} onPress={onPress}>
            <View>
                <Icon name={leftIcon} size={24} color={iconColor}/>
            </View>
            <View>
                <Text style={styles.listText}>{text}</Text>
            </View>
            <View>
                <Icon name={rightIcon} size={26} color={iconColor}/>
            </View>
            </Pressable>
        </View>
    );
}

export default ListItemComponent;

const styles = StyleSheet.create({
    listItemView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10
    },
    listText: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});