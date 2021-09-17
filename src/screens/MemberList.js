import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Pressable } from 'react-native';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { findAllUsers } from '@api/userApi';
import MemberCardComponent from '@components/member-card/MemberCardComponent';
import ToastComponent from '@components/toast/ToastComponent';
import { colors } from '@theme/colors';
import SearchBarComponent from '@components/search-bar/SearchBarComponent';
import BadgeComponent from '@components/badge/BadgeComponent';
import AvatarComponent from '@components/avatar/AvatarComponent';
import { includesIgnoreCase } from '@utils/helperFunctions';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import HorizontalLineComponent from '@components/horizontal-line/HorizontalLine';
import { getRegionById } from 'src/utils/helperFunctions';

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
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [advancedFilterOptions, setAdvancedFilterOptions] = useState("None");

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

    const levelAdvancedFilter = (option, text) => {
        const {frontline, intermediate, advanced} = levelFilter;
        console.log(option, text);
        let filtered = memberList.filter(m => {
            let isMatch = [];
            console.log(m.main_user[`${option}_frontline`])
            if(frontline) isMatch.push(includesIgnoreCase(m.main_user[`${option}_frontline`], text))
            if(intermediate) isMatch.push(includesIgnoreCase(m.main_user[`${option}_intermediate`], text))
            if(advanced) isMatch.push(includesIgnoreCase(m.main_user[`${option}_advanced`], text))
            console.log(isMatch)
            return isMatch.some(m => m);
        });
        setFilteredMembers(filtered);
    }

    const getCurrentJob = (member) => {
        return member.job_to_user.filter(j => j.is_current === "Yes")[0];
    }

    const handleAdvancedFilter = (text) => {
        const {frontline, intermediate, advanced} = levelFilter;
        const levelFilterEnabled = [frontline, intermediate, advanced].some(val => val)
        try {
            switch(advancedFilterOptions) {
                case "None": setFilteredMembers(memberList.filter(m => includesIgnoreCase(m.email, text) || includesIgnoreCase(m.main_user.firstname, text) || includesIgnoreCase(m.main_user.surname, text)))
                    break;
                // case "Region": setFilteredMembers(memberList.filter(m => m.job_to_user.length > 0).filter(m => includesIgnoreCase(getCurrentJob(m).region, text)))
                //     break;
                // case "District": setFilteredMembers(memberList.filter(m => m.job_to_user.length > 0).filter(m => includesIgnoreCase(getCurrentJob(m).district, text)))
                //     break;
                // case "LevelOfHealth": setFilteredMembers(memberList.filter(m => m.job_to_user.length > 0).filter(m => includesIgnoreCase(getCurrentJob(m).level_of_health_system, text)))
                //     break;
                // case "CohortNum": if(levelFilterEnabled) levelAdvancedFilter('cohort_number', text)
                // break;
                // case "YearCompleted": if(levelFilterEnabled) levelAdvancedFilter('cohort_number', text)
                // break;
            }
        } catch (err) {
            console.warn("Error handling advanced filter:", err)
        }        
        console.log("Advanced filter:", advancedFilterOptions)
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
        handleAdvancedFilter(text);
        //TODO: Handle user not found
    }

    const FilterModal = () => (
        <Modal isVisible={filterModalVisible} onBackdropPress={() => setFilterModalVisible(false)} style={[styles.modalView, styles.shadow]}>
            <Text style={styles.modalTitle}>Advanced Filter:</Text>
            <Pressable 
            android_ripple={{color: colors.ivory}} 
            style={styles.modalPressable} 
            onPress={() => {
                setAdvancedFilterOptions("Region");
                setFilterModalVisible(false);
                }}>
                <Text style={styles.modalPressableText}>Region</Text>
            </Pressable>
            <HorizontalLineComponent hrWidth='70%'/>
            <Pressable 
            style={styles.modalPressable}  
            android_ripple={{color: colors.ivory}}
            onPress={() => {
                setAdvancedFilterOptions("District");
                setFilterModalVisible(false);
                }}>
                    <Text style={styles.modalPressableText}>District</Text>
            </Pressable>
            <HorizontalLineComponent hrWidth='70%'/>
            <Pressable 
            style={styles.modalPressable}  
            android_ripple={{color: colors.ivory}}
            onPress={() => {
                setAdvancedFilterOptions("LevelOfHealth");
                setFilterModalVisible(false);
                }}>
                <Text style={styles.modalPressableText}>Level of Health</Text>
            </Pressable>
            <HorizontalLineComponent hrWidth='80%' hrStyle={{borderBottomColor: colors.primary, opacity: 1}}/>
            <Pressable 
            style={styles.modalPressable}  
            android_ripple={{color: colors.ivory}}
            onPress={() => {
                setAdvancedFilterOptions("CohortNum");
                setFilterModalVisible(false);
                }}>
                <Text style={styles.modalPressableText}>Cohort Number</Text>
            </Pressable>
            <HorizontalLineComponent hrWidth='70%'/>
            <Pressable 
            style={styles.modalPressable}  
            android_ripple={{color: colors.ivory}}
            onPress={() => {
                setAdvancedFilterOptions("YearCompleted");
                setFilterModalVisible(false);
                }}>
                <Text style={styles.modalPressableText}>Year Completed</Text>
            </Pressable>
            <HorizontalLineComponent hrWidth='70%'/>
            <Pressable 
            style={styles.modalPressable}  
            android_ripple={{color: colors.ivory}}
            onPress={() => {
                setAdvancedFilterOptions("None");
                setFilteredMembers(memberList);
                setFilterModalVisible(false);
                }}>
                <Text style={styles.modalPressableText}>None</Text>
            </Pressable>
        </Modal>
    )

    return (
            <View style={styles.membersContainer}>
            <View style={styles.headerView}>
                {/* <Text style={styles.screenTitle}>Members</Text> */}
                <View style={styles.searchBarView}>
                    <SearchBarComponent placeholder="Enter search text..." handleChange={handleUserSearch} value={memberSearchText} iconName="chevron-down-circle" onIconPress={() => setFilterModalVisible(true)}/>
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
            <FilterModal />
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
        justifyContent: 'space-between',
        marginBottom: 10
    },
    modalView: {
        width: 200,
        maxHeight: '60%',
        borderRadius: 8,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 99,
        paddingVertical: 10
    },
    modalTitle: {
        fontSize: 15,
        marginBottom: 5,
        fontWeight: '600',
        textTransform: 'uppercase',
        color: colors.primary
    },
    modalPressable: {
        width:'100%', 
        height: 50, 
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalPressableText: {
        fontSize: 18
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