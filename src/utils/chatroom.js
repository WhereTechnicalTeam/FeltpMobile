import firestore from '@react-native-firebase/firestore';

const chatRef = firestore().collection('chats');

const getUserChats = (userId, callback) => {
    let chatList = [];
    chatRef.where('members', 'array-contains', userId)
    .get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            const otherUser = doc.data().memberInfo.filter(i => i.id !== userId);
            chatList.push({
                id: doc.id,
                ...doc.data(),
                name: otherUser[0].main_user.firstname,
                avatar: otherUser[0].main_user.photo
            });
        });
        callback(chatList); 
    }).catch(error => console.warn("Error fetching user chats:", error));
}

const createChat = (userOne, userTwo, callback) => {
    let chat = {};
    chatRef.where("members", "array-contains-any", [userOne.id, userTwo.id] )
    .get()
    .then(querySnapshot => {
        if(querySnapshot.size > 0) chat = {id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data()}
        else {
            chatRef.add({
                name: "",
                members: [userOne.id, userTwo.id],
                memberInfo: [
                    {
                        id: userOne.id,
                        name: userOne.main_user.firstname + " " + userOne.main_user.surname,
                        avatar: userOne.main_user.photo
                    }, 
                    {
                        id: userTwo.id,
                        name: userTwo.main_user.firstname + " " + userTwo.main_user.surname,
                        avatar: userTwo.main_user.photo
                    }],
                avatar: "",
                createdAt: Date.now()
            }).then(data => {
                chat = {id: data.id, ...chat};
            }).catch(error => console.warn("Error creating chat:", error));
        }
        callback(chat);
    }).catch(error => console.warn("Error creating chat:", error));
}

export {getUserChats, createChat};