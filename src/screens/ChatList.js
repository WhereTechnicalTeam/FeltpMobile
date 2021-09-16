import React, {useEffect, useState} from 'react';
import { Text, View, StyleSheet, FlatList, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AvatarComponent from '@components/avatar/AvatarComponent';
import { colors } from 'src/theme/colors';
import { safeConvertToString } from 'src/utils/helperFunctions';

const ChatListScreen = (props) => {

    const [chatList, setChatList] = useState();
    const mainForumRef = firebase.firestore().collection('GFELTPforum');

    useEffect(() => {
        (async () => {
            setChatList([
                {
                    id: 1,
                    name: 'GFELTP Forum',
                    avatar: '',
                    latest_message: {
                        time: '10:47',
                        text: 'Hello all',
                        user: {
                            name: 'John K.',
                            id: 0
                        }
                    },
                }
            ]);
            fetchForumInfo();
        })();
    }, []);

    const fetchForumInfo = () => {
        mainForumRef.onSnapshot( querySnapshot => {
            let chatInfo = {};
            querySnapshot.forEach(doc => {
                chatInfo = {...doc.data(), id: doc.id};
            });
            setChatList([...chatList, chatInfo]);
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
                <View>
                    <AvatarComponent avatarContainerStyle={styles.avatar}/>
                </View>
                <View style={styles.centerView}>
                    <View style={styles.centerHeader}>
                    <Text style={styles.chatName}>{item.name}</Text>
                    <Text style={styles.messageTime}>{safeConvertToString(item.latest_message.time)}</Text>
                    </View>
                    {
                        item.latest_message &&
                        <View style={styles.messageView}>
                            <Text style={styles.latestSender}>{item.latest_message.user.firstname}:</Text>
                            <Text> {item.latest_message.text}</Text>
                        </View>
                    }
                </View>
            </Pressable>
        )
    }

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.mainHeaderText}>Conversations</Text>
            <View>
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
        paddingVertical: 30
    },
    listContainer: {
        flexDirection: 'row',
    },
    centerHeader: {
        flexDirection: 'row',
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
        marginRight: '50%'
    },
    messageTime: {
        alignSelf: 'center',
        fontSize: 11,
        color: colors.secondaryBlack
    },
    centerView: {
        justifyContent: 'space-evenly'
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
        marginBottom: 20
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
});