import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import dayjs from 'dayjs';
import AvatarComponent from '@components/avatar/AvatarComponent'
import { colors } from 'src/theme/colors';

const ChatBubbleComponent = (props) => {
    const {text, createdAt, user: {avatar, name, id}, isSameUser, isRight} = props;
    return (
        <View style={[styles.chatBubbleView, isRight ? {justifyContent: 'flex-end'} : {justifyContent: 'flex-start'}, isSameUser ? {marginBottom: 2} : {marginBottom: 10}]}>
            {
                (!isRight && !isSameUser) &&
                <AvatarComponent avatarContainerStyle={[styles.avatar, styles.shadow, {borderRadius: 20}]} src={avatar}/>
            }
            <View style={[ styles.chatBubble, styles.shadow, isRight ? styles.rightBubble : styles.leftBubble]}>
                {!isRight && <Text style={styles.leftBubbleName}>{name}</Text>}
                <Text style={isRight ? {color: colors.white} : {}}>{text}</Text>
                <Text style={styles.messageTime}>{dayjs(createdAt).format("h:mm a")}</Text>
            </View>
        </View>
    )
}

const getRandomAccentColor = () => {
    return colors.accents[Math.floor(Math.random() * colors.accents.length)];
}

export default ChatBubbleComponent;

const styles = StyleSheet.create({
    chatBubbleView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chatBubble: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        maxWidth: '80%'
    },
    leftBubble: {
        backgroundColor: colors.white
    },
    rightBubble: {
        backgroundColor: colors.lightPrimary,
    },
    leftBubbleName: {
        color: getRandomAccentColor(),
        fontSize: 12,
    },
    messageTime: {
        fontSize: 10,
        color: colors.secondaryBlack,
        alignSelf: 'flex-end'
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        backgroundColor: colors.white
    },
});