import React from 'react';
import { Pressable, StyleSheet, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '@theme/colors';
import { isDefined, isEmpty } from '@utils/validation';
import { BASE_URL } from "@utils/config";

const AvatarComponent = (props) => {
    const {icon, src, onPress, avatarContainerStyle, avatarImageStyle } = props;
    const imagePrefix = BASE_URL + '/media/'

    return (
        <View style={[styles.avatarContainer, avatarContainerStyle]}>
            <Pressable onPress={onPress}>
                <Image source={isDefined(src) && !isEmpty(src) ? imagePrefix + src : require('@assets/man.jpg')} style={[styles.image, avatarImageStyle]}/>
                {
                    icon && 
                    <View style={{backgroundColor: colors.primary, padding: 5, borderRadius: 50, ...styles.icon}}>
                    <Icon name={icon} size={25} color={colors.white} />
                    </View>
                }
            </Pressable>
        </View>
    )
}

export default AvatarComponent;

const styles = StyleSheet.create({
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    icon: {
        alignSelf: 'flex-end',
        zIndex: 5,
        marginTop: -28
    }

});