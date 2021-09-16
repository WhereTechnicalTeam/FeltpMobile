import React, { useState, useCallback, useEffect } from 'react'
import {View, Text, StyleSheet} from 'react-native';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat'
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '@theme/colors';
import AvatarComponent from 'src/components/avatar/AvatarComponent';
import { firebase } from 'src/firebase/config';

const ChatScreen = (props) => {

    const [messages, setMessages] = useState([]);
    const [chatInfo, setChatInfo] = useState();
    const mainForumRef = firebase.firestore().collection('GFELTPforum');

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, []);

  const navigateChatList = () => {
      props.navigation.navigate('ChatList');
  }

  const saveToFirebase = (messages) => {
      console.log(messages);
      mainForumRef.collection('messages')
      .add(messages)
      .then( doc => {
          console.log(doc);
      })
      .catch(error => {
          console.warn("Failed to save message to firebase:", error);
      })
  }

  const fetchForumMessages = () => {
      mainForumRef.collection('messages').orderBy('createdAt', 'desc')
      .onSnapshot( 
          querySnapshot => {
              let newMessages = [];
              querySnapshot.forEach(doc => {
                  newMessages.push[{...doc.data(), _id: doc.id}]
              });
              setMessages(newMessages);
          },
          error => {
              console.warn("Failed to fetch forum messages:", error);
          }
      );
  }

  const handleSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    saveToFirebase(messages);
  }, []);

  const renderSend = (props) => {
      return (
          <Send {...props}>
              <Icon name="send" color={colors.lightPrimary} size={24} style={{marginBottom: 10, marginRight: 10}}/>
          </Send>
      );
  }

  const renderBubble = (props) => {
      return (
            <Bubble {...props}
                wrapperStyle={{
                    left: {backgroundColor: colors.white},
                    right: {backgroundColor: colors.lightPrimary}
                }}        
            />
      )
  }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.iconButtonView}>
                    <Icon name="arrow-back-sharp" size={24} color={colors.white} onPress={navigateChatList}/>
                </View>
                <AvatarComponent src={require('@assets/logo_1.jpg')} avatarContainerStyle={styles.avatar}/>
                <View>
                    <Text style={styles.chatName}>GFELTP Forum</Text>
                </View>
            </View>
            <GiftedChat
            messages={messages}
            renderUsernameOnMessage 
            alwaysShowSend
            scrollToBottom
            renderSend={renderSend}
            renderBubble={renderBubble}
            onSend={handleSend}
            user={{
                _id: 1,
            }}
            />
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
        backgroundColor: colors.lightPrimary
    },
    iconButtonView: {
        marginRight: 20
    },
    avatar: {
        width: 50, 
        height: 50, 
        borderRadius: 25,
        marginRight: 30
    },
    chatName: {
        fontWeight: '600',
        fontSize: 15,
        color: colors.white,
        textAlign: 'center'
    }
});