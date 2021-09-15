import React, {useEffect, useState} from 'react';
import { Text, View, StyleSheet, FlatList, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AvatarComponent from '@components/avatar/AvatarComponent';
import { colors } from 'src/theme/colors';

const ChatListScreen = (props) => {

    const [chatList, setChatList] = useState();

    useEffect(() => {
        (async () => {
            setChatList([
                {
                    id: 1,
                    name: 'GFELTP Forum',
                    members: [
                        {
                            id: 0,
                            firstname: '',
                            surname: ''
                        }
                    ],
                    latest_message: {
                        time: '10:47',
                        text: 'Hello all',
                        user: {
                            firstname: 'John',
                            id: 0
                        }
                    },
                }
            ])
        })();
    }, []);

    const navigateChatScreen = () => {
        props.navigation.navigate('ChatScreen');
    }

    const renderItem = ({item}) => {
        return (
            <Pressable style={styles.listContainer} onPress={navigateChatScreen}>
                <View>
                    <AvatarComponent avatarContainerStyle={styles.avatar}/>
                </View>
                <View style={styles.centerView}>
                    <View style={styles.centerHeader}>
                    <Text style={styles.chatName}>{item.name}</Text>
                    <Text style={styles.messageTime}>{item.latest_message.time}</Text>
                    </View>
                    <View style={styles.messageView}>
                    <Text style={styles.latestSender}>{item.latest_message.user.firstname}:</Text>
                    <Text> {item.latest_message.text}</Text>
                    </View>
                </View>
            </Pressable>
        )
    }

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.mainHeaderText}>Conversations</Text>
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
    }
});