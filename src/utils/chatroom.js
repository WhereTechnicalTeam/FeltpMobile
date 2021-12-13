import firestore from '@react-native-firebase/firestore';
import { safeConvertToString } from '@utils/helperFunctions';

const chatRef = firestore().collection('chats');

const getUserChats = (userId, callback) => {
    
   return chatRef.where('members', 'array-contains', userId)
    .onSnapshot(querySnapshot => {
        let chatList = [];
        querySnapshot.forEach(doc => {
            const otherUser = doc.data().memberInfo.filter(i => i.id !== userId);
            chatList.push({
                id: doc.id,
                ...doc.data(),
                name: otherUser[0].name,
                avatar: otherUser[0].avatar
            });
        });
        callback(chatList); 
    },
    error => console.warn("Error fetching user chats:", error));
}

const createChat = (currentUser, otherUser, callback) => {
    let chat = {};
    chatRef.where("members", "array-contains", [currentUser.id, otherUser.id] )
    .get()
    .then(querySnapshot => {
        if(querySnapshot.size > 0) {
            chat = {id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data()};
            callback(chat);
        } else {
            chat = {
                name: otherUser.main_user.firstname + " " + otherUser.main_user.surname,
                members: [currentUser.id, otherUser.id],
                memberInfo: [
                    {
                        id: currentUser.id,
                        name: currentUser.main_user.firstname + " " + currentUser.main_user.surname,
                        avatar: safeConvertToString(currentUser.main_user.photo)
                    }, 
                    {
                        id: otherUser.id,
                        name: otherUser.main_user.firstname + " " + otherUser.main_user.surname,
                        avatar: safeConvertToString(otherUser.main_user.photo)
                    }],
                avatar: "", 
                
            }
            chatRef.add({...chat, createdAt: Date.now()}).then(data => {
                chat = {id: data.id, ...chat};
                callback(chat);
            }).catch(error => console.warn("Error creating chat:", error));
        }
    }).catch(error => console.warn("Error creating chat:", error));
}

export {getUserChats, createChat};