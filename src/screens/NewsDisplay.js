import React from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from 'react-native';
import { useEffect, useState } from 'react/cjs/react.development';
import { findNewsById } from '@api/newsApi';
import IconButtonComponent from '@components/icon-button/IconButtonComponent';
import { colors } from '@theme/colors';

const NewsDisplayScreen = (props) => {
    const {title, content} = props;

    const [loading, setLoading] = useState(false);
    const [newsDetails, setNewsDetails] = useState({
        title,
        content
    });

    useEffect(() => {       
        setNewsDetails(props.route.params?.news);
    }, [props.route.params?.news]);

    const navigateBack = () => {
        props.navigation.goBack();
    }

    return (
        <View style={styles.newsContainer}>
                <View>
                    <IconButtonComponent icon="arrow-back-sharp" size={24} color={colors.black} iconButtonStyle={styles.iconButtonComponent} onPress={navigateBack}/>
                </View>
                <ScrollView>
                    <Text style={styles.newsTitle}>{newsDetails.title}</Text>
                    <Text style={styles.newsContent}>{newsDetails.content}</Text>
                </ScrollView>
        </View>
    );
}

export default NewsDisplayScreen;

const styles = StyleSheet.create({
    newsContainer: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: colors.white,
        paddingHorizontal: 20
    },
    iconButtonComponent: {
        backgroundColor: colors.white
    },
    newsTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10
    },
    newsContent: {
        fontSize: 15,
    }
});