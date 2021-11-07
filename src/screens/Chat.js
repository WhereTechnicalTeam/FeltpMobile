import React, { useState, useEffect } from 'react'
import {View, Text, StyleSheet, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '@theme/colors';
import AvatarComponent from '@components/avatar/AvatarComponent';
import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import ToastComponent from '@components/toast/ToastComponent';
import MessageListComponent from '@components/message-list/MessageListComponent';
import { isEmpty, isDefined } from '@utils/validation';
import ChatFooterComponent from '@components/chat-footer/ChatFooterComponent';

const ChatScreen = (props) => {

    const [messages, setMessages] = useState([]);
    const [chatDetails, setChatDetails] = useState({
        name: "",
        avatar: ""
    });
    const [user, setUser] = useState();
    const [currentMessageText, setCurrentMessageText] = useState('');
    const [isMainForum, setIsMainForum] = useState(true);
    const mainForumRef = firestore().collection('threads').doc('PeA4CPvGKjzpUkzMSNGG');
    const directChatRef = firestore().collection('chats');

    useEffect(() => {
        try {
            (async() => {
                let {chatInfo} = props.route.params;
                const storedUser = await AsyncStorage.getItem('userDetails')
                setUser(JSON.parse(storedUser));
                setChatDetails(chatInfo);  
                if(chatInfo.name !== "GFELTP Forum") setIsMainForum(false) 
            })();
        } catch(err){
            console.warn("Error setting up chat:", err);
        }
    }, []);

    useEffect(() => {
        try {
            if(isDefined(user) && isDefined(chatDetails.id)) {
            if(isMainForum) {
                fetchForumMessages();
            } else getChatMessages(chatDetails.id, setMessages)
            }
        } catch(err) {
            console.warn("Error fetching forum messages:", err)
        }
    }, [user, isMainForum, chatDetails]);

  const navigateChatList = () => {
      props.navigation.navigate('ChatList');
  }

  const getChatMessages = (chatID, callback) => {
    let messages = [];
    directChatRef.doc(chatID).collection("messages").orderBy("createdAt", "desc")
    .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
            messages.push({
                id: doc.id,
                ...doc.data(),
                isRight: doc.data().user.id === user.id,
            });
            
        });
        callback(messages);
    },
    error => console.warn("Error fetching chat messages:", error)
    );
}

    const saveToFirebase = (message) => {
        const chatRef = isMainForum ? mainForumRef : directChatRef.doc(chatDetails.id);
        chatRef.collection('messages')
        .add(message)
        .then( doc => {
            setCurrentMessageText('');
            chatRef.set({lastMessage: message}, {merge: true}).then(doc => {

            }).catch(error => console.warn("Error updating last message:", error))
        })
        .catch(error => {
            console.warn("Failed to save message to firebase:", error);
            ToastComponent.show("Failed to send message!", {timeOut: 3000, level: 'failure'})
        });
    }

    const fetchForumMessages = () => {
            mainForumRef
            .collection('messages').orderBy('createdAt', 'desc')
            .onSnapshot( 
                querySnapshot => {
                    let newMessages = [];
                    querySnapshot.forEach(doc => {
                        newMessages.push({
                            ...doc.data(),
                            id: doc.id,
                            isRight: doc.data().user.id === user.id,
                            isSameUser: !isDefined(newMessages[newMessages.length - 1]) ? false : newMessages[newMessages.length - 1].user.id === user.id
                        });
                    });
                  setMessages(newMessages);
                },
                error => {
                    console.warn("Failed to fetch forum messages:", error);
                }
            );
       
    }

  const handleSend = () => {
        try {
            if(isEmpty(currentMessageText)) return;
            let message = {
                text: currentMessageText,
                createdAt: Date.now(),
                user: {
                  id: user.id,
                  name: user.main_user.firstname + " " + user.main_user.surname,
                  avatar: null
                },
              }
            console.log("current msg", message)
        saveToFirebase(message);
        } catch(err) {
            console.warn("Error sending message:", err)
        }
  }

  const ChatHeader = () => (
    <View style={styles.header}>
    <View style={styles.iconButtonView}>
        <Icon name="arrow-back-sharp" size={24} color={colors.white} onPress={navigateChatList}/>
    </View>
    <AvatarComponent src={chatDetails.avatar} avatarContainerStyle={styles.avatar}/>
    <View>
        <Text style={styles.chatName}>{chatDetails.name}</Text>
    </View>
    </View>
  );

    return (
        <View style={styles.container}>
            <ChatHeader />
            <View style={{flex: 1}}>
            <MessageListComponent messages={messages}/>
            </View>
            <ChatFooterComponent setCurrentMessageText={setCurrentMessageText} currentMessageText={currentMessageText} handleSend={handleSend}/>
        </View>
    )
}

export default ChatScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        height: 50,
        alignItems: 'center',
        backgroundColor: colors.lightPrimary,
        marginBottom: 10
    },
    iconButtonView: {
        marginRight: 20
    },
    avatar: {
        width: 40, 
        height: 40, 
        borderRadius: 25,
        marginRight: 30
    },
    chatName: {
        fontWeight: '600',
        fontSize: 15,
        color: colors.white,
        textAlign: 'center'
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