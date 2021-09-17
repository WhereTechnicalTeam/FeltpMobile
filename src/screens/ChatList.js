import React, {useEffect, useState} from 'react';
import { Text, View, StyleSheet, FlatList, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AvatarComponent from '@components/avatar/AvatarComponent';
import { colors } from '@theme/colors';
import { safeConvertToString } from '@utils/helperFunctions';
import firestore from '@react-native-firebase/firestore';
import dayjs from 'dayjs';

const ChatListScreen = (props) => {

    const [chatList, setChatList] = useState();
    const mainForumRef = firestore().collection('threads');

    useEffect(() => {
        const subscriber = fetchForumInfo();
        return () => subscriber();
    }, []);

    const fetchForumInfo = () => {
        return mainForumRef.onSnapshot( querySnapshot => {
            let chatInfo = {};
            querySnapshot.forEach(doc => {
                chatInfo = {...doc.data(), id: doc.id};
            });
            setChatList([chatInfo]);
        }, 
        error => {
            console.warn("Error fetching forum details:", error)
        })
    }

    const navigateChatScreen = (chatInfo) => {
        props.navigation.navigate('ChatScreen', {
            chatInfo
        });
    }

    const navigateSettings = () => {
        props.navigation.navigate('ManageUser');
    }

    const renderItem = ({item}) => {
        return (
            <Pressable style={styles.listContainer} onPress={() => navigateChatScreen(item)}>
                <View style={{width: 70}}>
                    <AvatarComponent avatarContainerStyle={styles.avatar}/>
                </View>
                <View style={styles.centerView}>
                    <View style={styles.centerHeader}>
                    <Text style={styles.chatName}>{item.name}</Text>
                    {item.lastMessage && <Text style={styles.messageTime}>{dayjs(item.lastMessage.createdAt).format("h:mm a")}</Text> }
                    </View>
                    {
                        item.lastMessage &&
                        <View style={styles.messageView}>
                            <Text style={styles.latestSender}>{item.lastMessage.user.name}:</Text>
                            <Text numberOfLines={1} > {item.lastMessage.text}</Text>
                        </View>
                    }
                </View>
            </Pressable>
        )
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.userAvatarView}>
                <Text style={styles.mainHeaderText}>Conversations</Text>
                <AvatarComponent avatarContainerStyle={styles.userAvatar} onPress={navigateSettings}/>
            </View>
            <FlatList renderItem={renderItem} keyExtractor={(item) => item.id.toString()} data={chatList}/>
        </View>
    );
}

export default ChatListScreen;

const styles = StyleSheet.create({
    mainContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    listContainer: {
        flexDirection: 'row',
    },
    centerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 40,
        marginRight: 20
    },
    chatName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary
    },
    messageTime: {
        alignSelf: 'center',
        fontSize: 11,
        color: colors.secondaryBlack,
        textAlign: 'right'
    },
    centerView: {
        justifyContent: 'space-evenly',
        width: '80%',
    },
    messageView: {
        flexDirection: 'row'
    },
    latestSender: {
        color: colors.primary,
        fontSize: 13
    },
    mainHeaderText: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    userAvatarView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    }
});