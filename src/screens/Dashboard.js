import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import SummaryCardComponent from '@components/summary-card/SummaryCardComponent';
import NewsPreviewComponent from '@components/news-preview/NewsPreviewComponent';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { colors } from '@theme/colors';
import { findAllNews } from '@api/newsApi';
import {fetchUserStats} from '@api/userApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToastComponent from '@components/toast/ToastComponent';
import AvatarComponent from '@components/avatar/AvatarComponent';
import { isDefined } from '@utils/validation';

const DashboardScreen = (props) => {

    const [newsItems, setNewsItems] = useState([]);
    const [memberStats, setMemberStats] = useState({
        numFrontline: 0,
        numIntermediate: 0,
        numAdvanced: 0,
        numAlumni: 0
    });
    const [userDetails, setUserDetails] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try{
        (async() => {
            setLoading(true);
            const token = await AsyncStorage.getItem("authToken");
            await getNews(token);
            await getMemberStats(token);
            setLoading(false);
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
                response.news.forEach(n => stripHTMLFromNews(n.content))
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
    
    const renderNewsItem = ({item}) => <NewsPreviewComponent containerStyle={{marginBottom: 20}} title={item.title} summary={stripHTMLFromNews(item.content)} onPress={() => navigateNewsDisplay(item)}/>

    const NewsSkeletonLoader = () => {
        return (
        <SkeletonPlaceholder>
            {
                [1, 2, 3, 3].map(e => (
                    <SkeletonPlaceholder.Item key={e} height={60} borderRadius={5} marginBottom={20}/>
                ))
            }
        </SkeletonPlaceholder>
        )
    }

    const stripHTMLFromNews = (news) => {
        const htmlRegex = /<.+>(.+)<\/.+>/g;
        return news.replace(htmlRegex, "$1");
    }

    return (
        <View style={styles.dashboardContainer}>
            <View style={styles.headerView}>
                {/* <Text style={styles.screenTitle}>Dashboard</Text> */}
                <AvatarComponent avatarContainerStyle={styles.userAvatar} onPress={navigateSettings} src={isDefined(userDetails) ? userDetails.main_user.photo : null} />
            </View>
            <View style={styles.subtitleView}>
                <Text style={styles.subtitle}>Registered Members</Text>
            </View>
            <View style={styles.summaryView}>
                <SummaryCardComponent mainText={memberStats.numAlumni} subText="total members" summaryContainerStyle={[styles.summaryCard, {backgroundColor: colors.accents[0]}]}/>
                <SummaryCardComponent mainText={memberStats.numAdvanced} subText="advanced" summaryContainerStyle={[styles.summaryCard, {backgroundColor: colors.accents[1]}]}/>
            {/* </View>
            <View style={styles.summaryView}> */}
                <SummaryCardComponent mainText={memberStats.numIntermediate} subText="intermediate" summaryContainerStyle={[styles.summaryCard, {backgroundColor: colors.accents[2]}]}/>
                <SummaryCardComponent mainText={memberStats.numFrontline} subText="frontline" summaryContainerStyle={[styles.summaryCard, {backgroundColor: colors.accents[3]}]}/>
            </View>
            <View style={styles.subtitleView}>
                <Text style={[styles.subtitle]}>News Feed</Text>
            </View>
            {
                loading ? 
                <NewsSkeletonLoader />
                : <FlatList contentContainerStyle={styles.newsView} showsVerticalScrollIndicator={false} data={newsItems} keyExtractor={(item) => item.id.toString()} renderItem={renderNewsItem}/>
            }
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
        position: 'relative',
    },
    headerView: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    screenTitle: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    subtitleView: {
        marginBottom: 20
    },
    subtitle: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: '600'
    },
    summaryView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        marginHorizontal: 20,
    },
    summaryCard: {
        width: '20%',
        height: '50%',
    },
    newsView: {
        justifyContent: 'space-between'
    }
});