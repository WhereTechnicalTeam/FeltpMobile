import React, {useEffect, useState} from 'react';
import { Text, View, StyleSheet, FlatList, Pressable } from 'react-native';
import AvatarComponent from '@components/avatar/AvatarComponent';
import { colors } from '@theme/colors';
import { safeConvertToString } from '@utils/helperFunctions';
import firestore from '@react-native-firebase/firestore';
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isDefined } from '@utils/validation';
import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import { getUserChats } from 'src/utils/chatroom';

const ChatListScreen = (props) => {

    const [chatList, setChatList] = useState([]);
    const [mainForum, setMainForum] = useState([]);
    const [user, setUser] = useState();
    const mainForumRef = firestore().collection('main_forum'); 
    const directChatRef = firestore().collection('chats');

    useEffect(() => {
        (async () => {
            try {
                let storedUser = await AsyncStorage.getItem('userDetails');
                storedUser = JSON.parse(storedUser);
                setUser(storedUser);
                fetchForumInfo();
                getUserChats(storedUser.id, setChatList);
            } catch (err) {
                console.warn("Error fetching user:", err)
            }
        })();
    }, []);

    const fetchForumInfo = () => {
        mainForumRef.get().then(querySnapshot => {
            let chatInfo = {};
            querySnapshot.forEach(doc => {
                chatInfo = {...doc.data(), id: doc.id, avatar: require('@assets/logo_1.jpg')};
            });
            setMainForum([chatInfo]);
        }).catch(error => {
            console.warn("Error fetching forum details:", error)
        });
    }

    const navigateChatScreen = (chatInfo) => {
        props.navigation.navigate('ChatScreen', {
            chatInfo
        });
    }

    const navigateSettings = () => {
        props.navigation.navigate('ManageUser');
    }

    const navigateSelectChat = () => {
        props.navigation.navigate("SelectChat")
    }

    const renderItem = ({item}) => {
        return (
            <Pressable style={styles.listContainer} onPress={() => navigateChatScreen(item)}>
                <View style={{width: 70}}>
                    <AvatarComponent avatarContainerStyle={styles.avatar} src={item.avatar}/>
                </View>
                <View style={styles.centerView}>
                    <View style={styles.centerHeader}>
                    <Text style={styles.chatName}>{item.name}</Text>
                    {item.lastMessage && <Text style={styles.messageTime}>{dayjs(item.lastMessage.createdAt).format("h:mm a")}</Text> }
                    </View>
                    {
                        item.lastMessage &&
                        <View style={styles.messageView}>
                            <Text style={styles.latestSender}>{item.lastMessage.user.id == user.id ? 'You' : item.lastMessage.user.name}:</Text>
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
                <AvatarComponent avatarContainerStyle={styles.userAvatar} onPress={navigateSettings} src={isDefined(user) ? user.main_user.photo : null}/>
            </View>
            <FlatList renderItem={renderItem} keyExtractor={(item) => safeConvertToString(item.id)} data={[...mainForum, ...chatList]}/>
            <IconButtonComponent icon="add" size={30} color={colors.primary} iconButtonStyle={{...styles.iconButton, ...styles.shadow}} onPress={navigateSelectChat}/>
        </View>
    );
}

export default ChatListScreen;

const styles = StyleSheet.create({
    mainContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        flex: 1
    },
    listContainer: {
        flexDirection: 'row',
        marginBottom: 15
    },
    centerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    avatar: {
        width: 45,
        height: 45,
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
    },
    iconButton: {
        borderRadius: 25,
        position: 'absolute',
        bottom: 20,
        right: 20
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