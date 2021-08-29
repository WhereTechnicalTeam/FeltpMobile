import React, {Component} from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '@theme/colors';

class ToastComponent extends Component {
    static __toastRef;

    constructor(props) {
        super(props);
        ToastComponent.__toastRef = this;
        this.state = {
            visible: false,
            text: '',
            level: ''
        }
    }
    
    __show = (text, {timeOut, level}) => {
        this.setState({visible: true, text, level});
        setTimeout(() => this.__hide(), timeOut);
    }

    __hide = () => {
        this.setState({visible: false});
    }

    static show = (text, {timeOut, level}) => {
        ToastComponent.__toastRef.__show(text, {timeOut, level});
    }

    static hide = () => {
        ToastComponent.__toastRef.__hide();
    }

    render() {
        const {visible, text, level} = this.state;
        return (
            visible ? (
                <View style={[styles.toastContainer, {backgroundColor: levelToColor(level)}, styles.shadow]}>
                    <View style={{width: '85%'}}>
                    <Text style={styles.text} numberOfLines={2}>{text}</Text>
                    </View>
                    <Icon onPress={() => this.setState({visible: false})} name="close" color={colors.white} size={24}/>
                </View>
            ) : null
        );
    }
}

const levelToColor = (level) => {
    switch(level) {
        case 'success': return colors.primaryGreen;
        case 'failure': return colors.red;
        case 'warning': return colors.warning; 
        case 'action': return colors.primary; 
    }
}

export default ToastComponent;

const styles = StyleSheet.create({
    toastContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        alignSelf: 'center',
        width: '90%',
        top: 30,
        zIndex: 99,
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        borderRadius: 5
    },
    text: {
        textAlign: 'center',
        color: colors.white,
        fontSize: 15
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
    },
    icon: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold'
    }
});