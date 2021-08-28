import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, Alert, Pressable } from 'react-native';
import SummaryCardComponent from '@components/summary-card/SummaryCardComponent';
import NewsPreviewComponent from '@components/news-preview/NewsPreviewComponent';
import { colors } from '@theme/colors';
import { useEffect, useState } from 'react/cjs/react.development';
import { findAllNews } from '@api/newsApi';
import {fetchUserStats} from '@api/userApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToastComponent from '@components/toast/ToastComponent';

const DashboardScreen = (props) => {

    const [newsItems, setNewsItems] = useState([
        // {
        //     id: 0,
        //     title: "Monthly cohort meetings!",
        //     content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        // }
    ]);
    const [memberStats, setMemberStats] = useState({
        numFrontline: 0,
        numIntermediate: 0,
        numAdvanced: 0,
        numAlumni: 0
    });
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        try{
        (async() => {
            const token = await AsyncStorage.getItem("authToken");
            await getNews(token);
            await getMemberStats(token);
            const user = await AsyncStorage.getItem('userDetails');
            if(user == null) ToastComponent.show("User not found", {timeOut: 3500, level: 'warning'});
            setUserDetails(JSON.parse(user));
        })();
    } catch(error) {
        console.error("Error loading dashboard items:", error);
        // ToastComponent.show("Oops! Something went wrong", {timeOut: 3500, level: 'failure'});
    }
    }, []);

    const navigateNewsDisplay = (news) => {
        props.navigation.navigate('NewsDisplay', {
            news
        });
    }

    const getMemberStats = async(token) => {
        try {
            let response = await fetchUserStats(token);
            if(response.status == 200) {
                setMemberStats({
                    numAlumni: response.stats.alumni,
                    numFrontline: response.stats.frontline,
                    numIntermediate: response.stats.intermediate,
                    numAdvanced: response.stats.advanced
                });
            } else {
                ToastComponent.show("Failed to fetch member statistics", {timeOut: 3500, level: 'failure'});
            }
        } catch(err) {
            console.warn("Error fetching member stats:", err);
        }
    }

    const getNews = async(token) => {
        try {
            let response = await findAllNews(token);

            if(response.status == 200) {
                setNewsItems(response.news);
            } else {
                ToastComponent.show("Failed to fetch news", {timeOut: 3500, level: 'failure'});
            }
        } catch(err) {
            console.warn("Error fetching news list:", err);
        }
    }

    const navigateSettings = () => {
        props.navigation.navigate('ManageUser');
    }
    
    const renderNewsItem = ({item}) => <NewsPreviewComponent containerStyle={{marginBottom: 20}} title={item.title} summary={item.content} onPress={() => navigateNewsDisplay(item)}/>

    return (
        <View style={styles.dashboardContainer}>
            <View style={styles.headerView}>
                <Text style={styles.screenTitle}>Dashboard</Text>
                <Pressable style={styles.avatarView} onPress={navigateSettings}>
                    <Image style={styles.userAvatar} source={require('@assets/man.jpg')}/>
                </Pressable>
            </View>
            <View style={styles.subtitleView}>
                <Text style={styles.subtitle}>Overview</Text>
            </View>
            <View style={styles.summaryView}>
                <SummaryCardComponent mainText={memberStats.numAlumni} subText="total members" summaryContainerStyle={{backgroundColor: colors.accents[0]}}/>
                <SummaryCardComponent mainText={memberStats.numAdvanced} subText="advanced" summaryContainerStyle={{backgroundColor: colors.accents[1]}}/>
            </View>
            <View style={styles.summaryView}>
                <SummaryCardComponent mainText={memberStats.numIntermediate} subText="intermediate" summaryContainerStyle={{backgroundColor: colors.accents[2]}}/>
                <SummaryCardComponent mainText={memberStats.numFrontline} subText="frontline" summaryContainerStyle={{backgroundColor: colors.accents[3]}}/>
            </View>
            <View style={styles.subtitleView}>
                <Text style={styles.subtitle}>News Feed</Text>
            </View>
            <FlatList contentContainerStyle={styles.newsView} showsVerticalScrollIndicator={false} data={newsItems} keyExtractor={(item) => item.id.toString()} renderItem={renderNewsItem}/>
        </View>
    );
}

export default DashboardScreen;

const styles = StyleSheet.create({
    dashboardContainer: {
        flex: 1,
        paddingHorizontal: 25,
        paddingTop: 30,
        backgroundColor: colors.white,
        position: 'relative'
    },
    headerView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    screenTitle: {
        fontWeight: 'bold',
        fontSize: 20
    },
    avatarView: {
        width: 40,
        height: 40
    },
    userAvatar: {
        width: '100%',
        height: 40,
        borderRadius: 25
    },
    subtitle: {
        fontSize: 20,
        marginBottom: 10
        // fontWeight: '700'
    },
    summaryView: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 20
    },
    newsView: {
        justifyContent: 'space-between'
    }
});