import { BASE_URL } from "@utils/config";

const findUserByEmail = async (email) => {
    return fetch(`${BASE_URL}/verifyemail`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
    })
    .then((response) => response.json())
    .then(json => {
        return json;
    })
    .catch((error) => {
        console.warn("Error fetching user by email:", error);
        return {status: 500};
    });
}

const updateUser = async(user, id) => {
    return fetch(`${BASE_URL}/useredit/${id}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then((response) => response.json())
    .then(json => {
        console.log("update response:", json);
        return json;
    })
    .catch((error) => {
        console.warn("User update error:", error);
        return {status: 500};
    });
}

const findAllUsers = async(token) => {
    return fetch(`${BASE_URL}/alldata`, {
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
        console.warn("Error fetching all users:", error);
        return {status: 500};
    });
}

const findUserById = async(id, token) => {
    return fetch(`${BASE_URL}/alldata/${id}`, {
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
        return null;
    })
    .catch((error) => {
        console.error(error);
        return {status: 500};
    });
}

const fetchUserStats = async(token) => {
    return fetch(`${BASE_URL}/statistics`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`
        }
    })
    .then((response) => {
        if(response.ok) return response.json();
        else return {status: response.status};
    })
    .then(json => {
        console.log(json);
        return json;
    })
    .catch((error) => {
        console.error(error);
        return {status: 500};
    });
}

const fetchUserJobHistory = async(token, id) => {
    return fetch(`${BASE_URL}/jobdetail/${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`
        }
    })
    .then((response) => response.json())
    .then(json => {
        console.log(json);
        return json;
    })
    .catch((error) => {
        console.error(error);
        return {status: 500};
    });
}

const updateJobHistory = async(token, id, joblist) => {
    return fetch(`${BASE_URL}/jobdetail/${id}/edit`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`
        },
        body: JSON.stringify(joblist)
    })
    .then((response) => response.json())
    .then(json => {
        console.log(json);
        return json;
    })
    .catch((error) => {
        console.error(error);
        return {status: 500};
    });
}

export {findUserByEmail, findAllUsers, updateUser, findUserById, fetchUserStats, fetchUserJobHistory, updateJobHistory};