import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@theme/colors';

const NewsPreviewComponent = (props) => {
    const {summary, title, containerStyle, onPress} = props;
 
    return (
            <Pressable onPress={onPress} android_ripple={{color: colors.pearl}} style={[styles.newsPreviewContainer, containerStyle, styles.shadow, {borderLeftColor: getRandomAccentColor()}]}>
            <View>
                <Text style={styles.newsTitle}>{title}</Text>
            </View>
            <View>
                <Text style={styles.newsSummary} numberOfLines={1}>{summary}</Text>
            </View>
            </Pressable>
    );
}

const getRandomAccentColor = () => {
    return colors.accents[Math.floor(Math.random() * colors.accents.length)];
}

export default NewsPreviewComponent;

const styles = StyleSheet.create({
    newsPreviewContainer: {
        borderLeftWidth: 5,
        paddingLeft: 8
    },
    newsTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    newsSummary: {
        fontSize: 15,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,        
        elevation: 2,
        backgroundColor: colors.white
       }
});