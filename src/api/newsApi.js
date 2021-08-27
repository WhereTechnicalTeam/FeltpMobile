import { BASE_URL } from "@utils/config";

const findAllNews = async (token) => {
    console.log("token", token);
    return fetch(`${BASE_URL}/newsdetail`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    })
    .then((response) => {
        if(response.ok) 
        return response.json()
        else return {status: response.status}
    })
    .then(json => {
        console.log(json);
        return json;
    })
    .catch((error) => {
        console.error(error);
        return null;
    });
}

const findNewsById = async(id, token) => {
    return fetch(`${BASE_URL}/newsdetail/${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    })
    .then((response) => response.json())
    .then(json => {
        console.log(json);
        return json;
    })
    .catch((error) => {
        console.error(error);
        return null;
    });
}

export {findAllNews, findNewsById};