import React, {useEffect, useState} from 'react';
import { FlatList, StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import SearchBarComponent from '@components/search-bar/SearchBarComponent';
import { includesIgnoreCase, safeConvertToString } from '@utils/helperFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AvatarComponent from '@components/avatar/AvatarComponent';
import { createChat } from '@utils/chatroom';
import { findAllUsers, findUsersFromNextURL } from '@api/userApi';
import ToastComponent from '@components/toast/ToastComponent';
import { colors } from '@theme/colors';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { isDefined } from '@utils/validation';

const SelectChatScreen = (props) => {

    const [memberList, setMemberList] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [user, setUser] = useState();
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState();
    const [nextFetchURL, setNextFetchURL] = useState();
    const [endLoading, setEndLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const authToken = await AsyncStorage.getItem('authToken');
            setToken(authToken);
            let storedUser = await AsyncStorage.getItem("userDetails");
            storedUser = JSON.parse(storedUser)
            setUser(storedUser);
            await fetchMembers(authToken, storedUser.id);
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        if(memberList.length > 0) setFilteredMembers(memberList);
    }, [memberList])

    const navigateChatScreen = (chatInfo) => {
        console.log("navigating chat:", chatInfo)
        props.navigation.navigate("ChatScreen", {
            chatInfo
        });
    }

    const fetchMembers = async(token, userId) => {
        try {
            let response = await findAllUsers(token);
            console.log("fetch members response:", response);
            if(response.status == 200) {
                const members = response.alldata.results.filter(data => isDefined(data) && data.main_user !== null && data.id != userId);
                setMemberList(members);
                setFilteredMembers(members);
                setNextFetchURL(response.alldata.next);
            } else {
                ToastComponent.show("Failed to fetch member list", {timeOut: 3500, level: 'failure'});
            }    
        } catch(err) {
            console.warn("Error fetching member list:", err);
        }                  
    }

    const fetchNextMemberList = async() => {
        if(!isDefined(nextFetchURL)) return;
        try {
            setEndLoading(true);
            let response = await findUsersFromNextURL(token, nextFetchURL);
            setEndLoading(false); 
            if(response.status == 200) {
                const members = response.alldata.results.filter(data => isDefined(data) && data.main_user !== null && data.id != user.id);
                setMemberList([...memberList, ...members]);
                setNextFetchURL(response.alldata.next);
            } else {
                ToastComponent.show("Failed to fetch member list", {timeOut: 3500, level: 'failure'});
            }    
        } catch(err) {
            console.warn("Error fetching member list:", err);
        }  
    } 

    const getFinalLevel = (main_user) => {
        if(main_user.is_trained_advanced == "Yes") return "Advanced";
        if(main_user.is_trained_intermediate) return "Intermediate";
        return "Frontline";
    } 

    const renderItem = ({item}) => (
        <Pressable onPress={() => createChat(user, item, navigateChatScreen)} style={styles.listItemView}>
            <AvatarComponent src={item.main_user.photo} avatarContainerStyle={styles.avatar} />
            <View>
                <Text>{`${item.main_user.firstname} ${item.main_user.surname}`}</Text>
                <Text style={{color: colors.primary}}>{getFinalLevel(item.main_user)}</Text>
            </View>
        </Pressable>
    );

    const filterMemberList = (text) => {
        setSearchText(text);
        let filtered = memberList.filter(m => includesIgnoreCase(m.email, text) || includesIgnoreCase(`${m.main_user.firstname} ${m.main_user.surname}`, text))
        setFilteredMembers(filtered);
    }

    const SkeletonLoader = () => {
        return (
        <SkeletonPlaceholder>
            {
                [1, 2, 3, 4].map(e => (
                    <SkeletonPlaceholder.Item  key={e} width="90%" height={50} alignSelf="center" marginBottom={5} marginTop={10}/>
                ))
            }
        </SkeletonPlaceholder>
        )
    }

    return (
        <View style={styles.container}> 
            <Text style={styles.headerText}>Select Member</Text>
            <View style={styles.searchBarView}>
                <SearchBarComponent placeholder="Enter a name or email..." value={searchText} handleChange={filterMemberList}/>
            </View>
            <View style={{marginTop: 20}}>
            {loading ? <SkeletonLoader/> : 
            <FlatList 
              keyExtractor={(item) => safeConvertToString(item.id)} 
              onRefresh={() => fetchMembers(token, user.id)} 
              refreshing={refresh} 
              data={filteredMembers} 
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
              onEndReachedThreshold={0.5}
              onEndReached={fetchNextMemberList}
            />}
            { endLoading && <ActivityIndicator size={25} color={colors.lightPrimary} style={{marginTop: -20}} /> }
            </View>
            </View>
    );
}

export default SelectChatScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 25,
        paddingTop: 30,
        backgroundColor: colors.white,
        paddingBottom: 100,
        position: 'relative'
    },
    listItemView: {
        flexDirection: 'row',
        marginBottom: 20
    },
    headerText: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: "600",
        marginBottom: 10,
    },
    searchBarView: {
        borderWidth: 0.5, 
        borderRadius: 5, 
        borderColor: colors.secondaryBlack,
        width: '90%',
        alignSelf: 'center'
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20
    }
});