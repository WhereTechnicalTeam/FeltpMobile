import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Pressable } from 'react-native';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { findAllUsers } from '@api/userApi';
import MemberCardComponent from '@components/member-card/MemberCardComponent';
import ToastComponent from '@components/toast/ToastComponent';
import { colors } from '@theme/colors';
import SearchBarComponent from '@components/search-bar/SearchBarComponent';
import BadgeComponent from 'src/components/badge/BadgeComponent';
import PickerComponent from 'src/components/picker/PickerComponent';
import AvatarComponent from '@components/avatar/AvatarComponent';

const MemberListScreen = (props) => {
    const [memberList, setMemberList] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [levelFilter, setLevelFilter] = useState({
        frontline: false,
        intermediate: false,
        advanced: false
    });
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [memberSearchText, setMemberSearchText] = useState('');

    useEffect(() => {
        (async() => {
            setLoading(true);
            await fetchMembers();
            setLoading(false);        
        })();
    }, []);

    useEffect(() => {
        setFilteredMembers(memberList);
    }, [memberList])

    useEffect(() => {
        toggleLevelFilter();
    }, [levelFilter]);

    const toggleLevelFilter = () => {
        const {frontline, intermediate, advanced} = levelFilter;
        if([frontline, intermediate, advanced].some(val => val)) {
            let filtered = memberList.filter(m => {
                if(frontline) return m.main_user.is_trained_frontline == 'Yes'
                if (intermediate) return m.main_user.is_trained_intermediate == 'Yes'
                if(advanced) return m.main_user.is_trained_advanced == 'Yes'
            });
            setFilteredMembers(filtered);
        } else setFilteredMembers(memberList)
    }

    const fetchMembers = async() => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            let response = await findAllUsers(token);
            if(response.status == 200) {
                setMemberList(response.alldata.filter(data => data.main_user !== null));
                await AsyncStorage.setItem("memberList", JSON.stringify(response.alldata))
            } else {
                ToastComponent.show("Failed to fetch member list", {timeOut: 3500, level: 'failure'});
            }    
        } catch(err) {
            console.warn("Error fetching member list:", err);
        }                  
    }

    const SkeletonLoader = () => {
        return (
        <SkeletonPlaceholder>
            {
                [1, 2, 3].map(e => (
                    <SkeletonPlaceholder.Item key={e} marginVertical={20} flexDirection="row" justifyContent="space-around">
                    <SkeletonPlaceholder.Item width={120} height={120} borderRadius={5} />
                    <SkeletonPlaceholder.Item width={120} height={120} borderRadius={5} />
                    </SkeletonPlaceholder.Item>
                ))
            }
        </SkeletonPlaceholder>
        )
    }

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

    const navigateMemberProfile = (member) => {
        props.navigation.navigate('MemberProfile', {member});
    }

    const handleRefresh = async() => {
        setRefresh(true);
        await fetchMembers();
        setRefresh(false);
    }

    const handleUserSearch = (text) => {
        setMemberSearchText(text);
        setFilteredMembers(memberList.filter(m => m.email.includes(text) || m.main_user.firstname.includes(text) || m.main_user.surname.includes(text)))
        //TODO: Handle user not found
    }

    return (
            <View style={styles.membersContainer}>
            <View style={styles.headerView}>
                {/* <Text style={styles.screenTitle}>Members</Text> */}
                <View style={styles.searchBarView}>
                    <SearchBarComponent placeholder="Find a member..." handleChange={handleUserSearch} value={memberSearchText}/>
                </View>
                <AvatarComponent avatarContainerStyle={styles.userAvatar} onPress={navigateSettings}/>
            </View>
            <View style={styles.badgeView}>
            <View>
                <BadgeComponent text="Frontline" badgeContainerStyle={{backgroundColor: colors.lightPrimary}} selected={levelFilter.frontline} onPress={() => setLevelFilter({...levelFilter, frontline: !levelFilter.frontline})} />
            </View>
            <View>
                <BadgeComponent text="Intermediate" badgeContainerStyle={{backgroundColor: colors.warning}} selected={levelFilter.intermediate} onPress={() => setLevelFilter({...levelFilter, intermediate: !levelFilter.intermediate})}/>
            </View>
            <View>
                <BadgeComponent text="Advanced" badgeContainerStyle={{backgroundColor: colors.primaryGreen}} selected={levelFilter.advanced} onPress={() => setLevelFilter({...levelFilter, advanced: !levelFilter.advanced})}/>
            </View>
            </View>
            <View>
                {
                    loading ? <SkeletonLoader /> :
                    <FlatList showsVerticalScrollIndicator={false} 
                contentContainerStyle={{flexDirection: 'column'}}
                numColumns={2}
                data={filteredMembers}
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
        paddingBottom: 100,
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
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    memberListView: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 20
    },
    searchBarView: {
        borderWidth: 0.5, 
        borderRadius: 5, 
        borderColor: colors.secondaryBlack
    },
    badgeView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});