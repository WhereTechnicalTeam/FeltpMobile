import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import { colors } from '@theme/colors';

const ChatFooterComponent = (props) => {
    const {currentMessageText, setCurrentMessageText, handleSend} = props;
    return (
        <View style={styles.chatFooterView}>
            <TextInput placeholder="Message" style={[styles.textInput, styles.shadow]} multiline value={currentMessageText} onChangeText={setCurrentMessageText}/>
            <IconButtonComponent icon="send" size={24} color={colors.white} iconButtonStyle={[styles.shadow, styles.sendIconButton]} onPress={handleSend} />
        </View>
    )
}

export default ChatFooterComponent;

const styles = StyleSheet.create({
    chatFooterView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10
    },
    textInput: {
        backgroundColor: colors.white,
        marginRight: 10,
        width: '80%',
        paddingHorizontal: 10,
    },
    sendIconButton: {
        backgroundColor: colors.lightPrimary,
        borderRadius: 25
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