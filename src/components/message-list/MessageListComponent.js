import React from 'react';
import {View, FlatList, Text, StyleSheet} from 'react-native';
import ChatBubbleComponent from '@components/chat-bubble/ChatBubbleComponent';

const MessageListComponent = ({messages}) => {

    return (
        <View> 
            <FlatList 
                data={messages}
                renderItem={({item}) => <ChatBubbleComponent {...item} />}
                contentContainerStyle={{paddingHorizontal: 5, flexDirection: 'column-reverse'}}
            />
        </View>
    )
}

export default MessageListComponent;

const styles = StyleSheet.create({

})