import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { findAllUsers } from '@api/userApi';
import MemberCardComponent from '@components/member-card/MemberCardComponent';
import ToastComponent from '@components/toast/ToastComponent';
import { colors } from '@theme/colors';

const MemberListScreen = (props) => {
    const [memberList, setMemberList] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const [selectedFilter, setSelectedFilter] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        (async() => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            let response = await findAllUsers(token);
            if(response.status == 200) {
                setMemberList(response.alldata.filter(data => data.main_user !== null));
            } else {
                ToastComponent.show("Failed to fetch member list", {timeOut: 3500, level: 'failure'});
            }            
        } catch(err) {
            console.warn("Error fetching member list:", err);
        }
        })();
        setLoading(false);
    }, []);

    const getFinalLevel = (member) => {
        let finalLevel = {};
        if(member.is_trained_advanced == "Yes") {
            finalLevel.level = 'advanced';
            finalLevel.yearCompleted = member.yr_completed_advanced;
        } else if(member.is_trained_intermediate == "Yes") {
            finalLevel.level = 'intermediate',
            finalLevel.yearCompleted = member.yr_completed_intermediate
        } else {
            finalLevel.level = 'frontline';
            finalLevel.yearCompleted = member.yr_completed_frontline;
        }
        return finalLevel;
    }

    const navigateSettings = () => {
        props.navigation.navigate('ManageUser');
    }

    const renderMemberCard = ({item}) => {
        const memberFinalLevel = getFinalLevel(item);
    return (
    <View style={{width:'40%', marginVertical: 20, marginHorizontal: '5%'}}>
        <MemberCardComponent name={`${item.main_user.firstname} ${item.main_user.surname}`} level={memberFinalLevel.level} yearComp={memberFinalLevel.yearCompleted} onPress={() => navigateMemberProfile(item)}/>
    </View>)
    }

    const getFilteredMemberList = () => {
        if(selectedFilter.length == 0)
        return memberList;
    }

    const navigateMemberProfile = (member) => {
        props.navigation.navigate('MemberProfile', {member});
    }

    return (
            <View style={styles.membersContainer}>
            <View style={styles.headerView}>
                <Text style={styles.screenTitle}>Member List</Text>
                <Pressable style={styles.avatarView} onPress={navigateSettings}>
                    <Image style={styles.userAvatar} source={require('@assets/man.jpg')}/>
                </Pressable>
            </View>
            <View>
            {
                loading ?
                <ActivityIndicator color={colors.primary} size="large" />
                : 
                <FlatList showsVerticalScrollIndicator={false} 
                contentContainerStyle={{flexDirection: 'column'}}
                numColumns={2}
                data={getFilteredMemberList()}
                renderItem={renderMemberCard}
                keyExtractor={(item) => item.id.toString()}
            />
            }
            </View>
        </View>
    );
}

export default MemberListScreen;

const styles = StyleSheet.create({
    membersContainer: {
        flex: 1,
        paddingHorizontal: 25,
        paddingTop: 30,
        backgroundColor: colors.white,
        paddingBottom: 70,
        position: 'relative'
    },
    headerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30
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
    memberListView: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 20
    },
});