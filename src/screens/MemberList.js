import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Pressable } from 'react-native';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { findAllUsers, findUsersFromNextURL } from '@api/userApi';
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
import { getRegionById, getDistrictById, getLevelofHSById, safeConvertToString } from '@utils/helperFunctions';
import { isDefined } from '@utils/validation';

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
    const [user, setUser] = useState();
    const [advancedFilteredMembers, setAdvancedFilteredMembers] = useState([]);
    const [nextFetchURL, setNextFetchURL] = useState();
    const [endLoading, setEndLoading] = useState(false);

    useEffect(() => {
        (async() => {
            try {
                setLoading(true);
            await fetchMembers();
            const storedUser = await AsyncStorage.getItem("userDetails");
            setUser(JSON.parse(storedUser));
            setLoading(false); 
            } catch(err) {
                console.warn("Error setting up member list:", err);
            }      
        })();
    }, []);

    useEffect(() => {
        setFilteredMembers(memberList);
        setAdvancedFilteredMembers(memberList);
    }, [memberList])

    useEffect(() => {
        toggleLevelFilter();
    }, [levelFilter, advancedFilterOptions]);

    const toggleLevelFilter = () => {
        const {frontline, intermediate, advanced} = levelFilter;
        if([frontline, intermediate, advanced].some(val => val)) {
            let filtered = memberList.filter(m => {
                if(frontline) return m.main_user.is_trained_frontline == 'Yes'
                if (intermediate) return m.main_user.is_trained_intermediate == 'Yes'
                if(advanced) return m.main_user.is_trained_advanced == 'Yes'
            });
            console.log("filtered:", filtered)
            setFilteredMembers(filtered);
        } else setFilteredMembers(memberList)
    }

    const levelAdvancedFilter = (option, text) => {
        const {frontline, intermediate, advanced} = levelFilter;
        let filtered = filteredMembers.filter(m => {
            let isMatch = [];
            if(frontline) isMatch.push(includesIgnoreCase(safeConvertToString(m.main_user[`${option}_frontline`]), text))
            if(intermediate) isMatch.push(includesIgnoreCase(safeConvertToString(m.main_user[`${option}_intermediate`]), text))
            if(advanced) isMatch.push(includesIgnoreCase(safeConvertToString(m.main_user[`${option}_advanced`]), text))
            return isMatch.some(m => m);
        });
        return filtered;
    }

    const getCurrentJob = (member) => {
        let currentJob = member.job_to_user.filter(j => j.is_current === "Yes");
        return currentJob[0] || member.job_to_user[0];
    }

    const handleAdvancedFilter = () => {
        const {frontline, intermediate, advanced} = levelFilter;
        const levelFilterEnabled = [frontline, intermediate, advanced].some(val => val)
        let filtered = filteredMembers;
        try {
            switch(advancedFilterOptions) {
                case "None": filtered = filteredMembers.filter(m => includesIgnoreCase(m.email, memberSearchText) || includesIgnoreCase(`${m.main_user.firstname} ${m.main_user.surname}`, memberSearchText)) 
                    break;
                case "Region": filtered = filteredMembers.filter(m => {
                    console.log(m)
                    let currentJob = getCurrentJob(m);
                    if(isDefined(currentJob) && isDefined(currentJob.region)) return includesIgnoreCase(getRegionById(currentJob.region), memberSearchText)
                    else return false;
                    })
                    break;
                case "District": filtered = filteredMembers.filter(m => {
                    let currentJob = getCurrentJob(m);
                    if(isDefined(currentJob) && isDefined(currentJob.district)) return includesIgnoreCase(getDistrictById(currentJob.district), memberSearchText)
                    else return false;
                    });
                    break;
                case "Level Of Health System": filtered = filteredMembers.filter(m => {
                    let currentJob = getCurrentJob(m);
                    if(isDefined(currentJob) && isDefined(currentJob.level_of_health_system)) return includesIgnoreCase(getLevelofHSById(currentJob.level_of_health_system), memberSearchText)
                    else return false;
                    })
                    break;
                case "Cohort Number": if(levelFilterEnabled) filtered = levelAdvancedFilter('cohort_number', memberSearchText) 
                // else ToastComponent.show("Please select a training level!", {timeOut: 2000, level: 'warning'})
                break;
                case "Year Completed": if(levelFilterEnabled) filtered = levelAdvancedFilter('yr_completed', memberSearchText)
                break;
            }
        } catch (err) {
            console.warn("Error handling advanced filter:", err)
        }     
        return filtered   
    }

    const fetchMembers = async() => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            let response = await findAllUsers(token);
            if(response.status == 200) {
                const members = response.alldata.results.filter(data => data.main_user !== null);
                setMemberList(members);
                setNextFetchURL(response.alldata.next);
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
        if(member.main_user.is_trained_advanced == "Yes") {
            finalLevel.level = 'advanced';
            finalLevel.yearCompleted = member.main_user.yr_completed_advanced;
        } else if(member.main_user.is_trained_intermediate == "Yes") {
            finalLevel.level = 'intermediate',
            finalLevel.yearCompleted = member.main_user.yr_completed_intermediate
        } else {
            finalLevel.level = 'frontline';
            finalLevel.yearCompleted = member.main_user.yr_completed_frontline;
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

    const fetchNextMemberList = async() => {
        if(!isDefined(nextFetchURL)) return;
        setEndLoading(true);
        try {
            const token = await AsyncStorage.getItem('authToken');
            let response = await findUsersFromNextURL(token, nextFetchURL);
            if(response.status == 200) {
                const members = response.alldata.results.filter(data => data.main_user !== null);
                setMemberList([...memberList, ...members]);
                setNextFetchURL(response.alldata.next);
            } else {
                ToastComponent.show("Failed to fetch member list", {timeOut: 3500, level: 'failure'});
            }    
        } catch(err) {
            console.warn("Error fetching member list:", err);
        }  
        setEndLoading(false); 
    } 

    const handleUserSearch = (text) => {
        setMemberSearchText(text);
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
                setAdvancedFilterOptions("Level Of Health System");
                setFilterModalVisible(false);
                }}>
                <Text style={styles.modalPressableText}>Level of Health</Text>
            </Pressable>
            <HorizontalLineComponent hrWidth='80%' hrStyle={{borderBottomColor: colors.primary, opacity: 1}}/>
            <Pressable 
            style={styles.modalPressable}  
            android_ripple={{color: colors.ivory}}
            onPress={() => {
                setAdvancedFilterOptions("Cohort Number");
                setFilterModalVisible(false);
                }}>
                <Text style={styles.modalPressableText}>Cohort Number</Text>
            </Pressable>
            <HorizontalLineComponent hrWidth='70%'/>
            <Pressable 
            style={styles.modalPressable}  
            android_ripple={{color: colors.ivory}}
            onPress={() => {
                setAdvancedFilterOptions("Year Completed");
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

    const ListEmpty = () => (
        <Text>No members found</Text>
    )

    return (
            <View style={styles.membersContainer}>
            <View style={styles.filterOptionView}>
            <Text>Advanced Filter:</Text>
            <Text style={styles.filterOption}> {advancedFilterOptions}</Text>
            </View>
            <View style={styles.headerView}>
                {/* <Text style={styles.screenTitle}>Members</Text> */}
                <View style={styles.searchBarView}>
                    <SearchBarComponent placeholder="Enter search text..." handleChange={handleUserSearch} value={memberSearchText} iconName="chevron-down-circle" onIconPress={() => setFilterModalVisible(true)}/>
                </View>
                <AvatarComponent avatarContainerStyle={styles.userAvatar} onPress={navigateSettings} src={isDefined(user) ? user.main_user.photo : null}/>
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
                data={handleAdvancedFilter()}
                renderItem={renderMemberCard}
                keyExtractor={(item) => safeConvertToString(item.id)}
                onEndReachedThreshold={0.5}
                onEndReached={fetchNextMemberList}
                // ListEmptyComponent={ListEmpty}
            />
                }
            { endLoading && <ActivityIndicator size={25} color={colors.lightPrimary} style={{marginTop: -20}} /> }
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
        paddingBottom: 150,
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
        borderColor: colors.secondaryBlack,
        // width: '60%'
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
    filterOptionView: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    filterOption: {
        color: colors.primary,
        marginLeft: 2
    }
});