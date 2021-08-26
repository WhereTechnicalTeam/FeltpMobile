import React from 'react';
import { Pressable, StyleSheet, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '@theme/colors';

const AvatarComponent = (props) => {
    const {icon, src, onPress, avatarContainerStyle } = props;

    return (
        <View style={[styles.avatarContainer, avatarContainerStyle]}>
            <Pressable onPress={onPress}>
                <Image source={src} style={styles.image}/>
                {
                    icon && <Icon name={icon} size={30} color={colors.white} style={styles.icon}/>
                }
            </Pressable>
        </View>
    )
}

export default AvatarComponent;

const styles = StyleSheet.create({
    avatarContainer: {
        width: 100
    },
    image: {
        width: '100%',
        height: 100,
        borderRadius: 50,
        resizeMode: 'cover',
        alignSelf: 'center'
    },
    icon: {
        alignSelf: 'flex-end',
        zIndex: 5,
        marginTop: -28
    }

});