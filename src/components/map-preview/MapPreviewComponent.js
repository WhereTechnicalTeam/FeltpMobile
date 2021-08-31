import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { colors } from '@theme/colors';

const MapPreviewComponent = (props) => {
    const {selected, mapImageUrl, onPress, invalid, mapPreviewStyle} = props;

    return (
        <View style={[styles.mapPreviewContainer, selected ? styles.selected : {}, invalid ? styles.invalid : {}, mapPreviewStyle]}>
            <Pressable onPress={onPress}>
                <Image style={styles.mapPreviewImage} source={require('@assets/map.png')}/>
            </Pressable>
        </View>
    );
}

export default MapPreviewComponent;

const styles = StyleSheet.create({
    mapPreviewContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: colors.secondaryBlack,
        justifyContent: 'center',
        alignItems: 'center'
    },
    selected: {
        borderColor: colors.primaryGreen,
        borderWidth: 2
    },
    mapPreviewImage: {
        width: 45,
        height: 45,
        borderRadius: 25
    }, 
    invalid: {
        borderColor: colors.red,
        borderWidth: 2
    }
})