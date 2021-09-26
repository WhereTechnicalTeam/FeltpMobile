import firestore from '@react-native-firebase/firestore';

const chatRef = firestore().collection('chats');

const getUserChats = (userId, callback) => {
    let chatList = [];
    chatRef.where('members', 'array-contains', userId)
    .get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            chatList.push({id: doc.id, ...doc.data()})
        });
        callback(chatList); 
    }).catch(error => console.warn("Error fetching user chats:", error));
}

const getChatMessages = (chatID, callback) => {
    let messages = [];
    chatRef.doc(chatID).collection("messages").orderBy("createdAt", "desc")
    .get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            messages.push({
                id: doc.id,
                ...doc.data()
            });
        });
        callback(messages);
    }).catch(error => console.warn("Error fetching chat messages:", error))
}

const createChat = (userOne, userTwo, callback) => {
    chatRef.where("members", "array-contains-any", [] )
    .where("isGroup", "==", "false").get()
    .then(querySnapshot => {
        let chat = {
            name: "",
            members: [userOne, userTwo],
            avatar: "",
            createdAt: Date.now()
        };
        if(querySnapshot.size) chat = {id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data()}
        else {
            chatRef.add().then(data => {
                chat = {id: data.id, ...chat};
            }).catch(error => console.warn("Error creating chat:", error));
        }
        callback(chat);
    }).catch(error => console.warn("Error creating chat:", error));
}

export {getUserChats, getChatMessages, createChat};