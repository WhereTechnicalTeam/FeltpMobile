import React, {useEffect, useState} from 'react';
import { FlatList, StyleSheet, Text, View, Pressable } from 'react-native';
import SearchBarComponent from '@components/search-bar/SearchBarComponent';
import { includesIgnoreCase } from '@utils/helperFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AvatarComponent from '@components/avatar/AvatarComponent';
import { createChat } from '@utils/chatroom';
import { findAllUsers } from '@api/userApi';
import ToastComponent from '@components/toast/ToastComponent';
import { colors } from '@theme/colors';

const SelectChatScreen = (props) => {

    const [memberList, setMemberList] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [user, setUser] = useState();
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                AsyncStorage.getItem("memberList").then(members => {
                    setMemberList(JSON.parse(members));
                    setFilteredMembers(JSON.parse(members));
                });
                AsyncStorage.getItem("userDetails").then(storedUser => setUser(JSON.parse(storedUser)));
            } catch(err) {
                console.warn("Error fetching member list:", err);
            } 
        })();
    }, []);

    const navigateChatScreen = (chatInfo) => {
        props.navigation.navigate("ChatScreen", {
            chatInfo
        });
    }

    const fetchMembers = async() => {
        setRefresh(true);
        try {
        const token = await AsyncStorage.getItem("authToken");
        let response = await findAllUsers(token);
        if(response.status == 200) {
            setMemberList(response.alldata);
            setFilteredMembers(response.alldata)
        } else {
            ToastComponent.show("Failed to fetch users", {level: 'failure', timeOut: 3000})
        }
        } catch(error) {
            console.warn("Error refreshing member list:", error)
        }
        setRefresh(false);
    }

    const getFinalLevel = (main_user) => {
        if(main_user.is_trained_advanced == "Yes") return "Advanced";
        if(main_user.is_trained_intermediate) return "Intermediate";
        return "Frontline";
    } 

    const renderItem = ({item}) => (
        <Pressable onPress={() => createChat(user, item, navigateChatScreen)}>
            <AvatarComponent src={item.main_user.photo} avatarContainerStyle={styles.avatar} />
            <View>
                <Text>{`${item.main_user.firstname} ${item.main_user.surname}`}</Text>
                <Text>{getFinalLevel(item.main_user)}</Text>
            </View>
        </Pressable>
    );

    const filterMemberList = (text) => {
        setSearchText(text);
        let filtered = memberList.filter(m => includesIgnoreCase(m.email, text) || includesIgnoreCase(`${m.main_user.firstname} ${m.main_user.surname}`, text))
        setFiltered(filtered);
    }

    return (
        <View style={styles.container}> 
            <Text style={styles.headerText}>Select Member</Text>
            <View style={styles.searchBarView}>
                <SearchBarComponent placeholder="Enter a name or email..." value={searchText} handleChange={filterMemberList}/>
            </View>
            <FlatList keyExtractor={(item) => item.id.toString()} onRefresh={fetchMembers} refreshing={refresh} data={filteredMembers} renderItem={renderItem}/>
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