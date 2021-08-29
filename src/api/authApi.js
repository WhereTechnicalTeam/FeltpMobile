import { BASE_URL } from "@utils/config";

const registerUser = async(user) => {
    return fetch(`${BASE_URL}/userPR`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then((response) => {
        console.log("register" , response);
        return response.json();
    })    
    .then(json => {
        return json;
    })
    .catch((error) => {
        console.error("Registration error:", error);
        return {status: 500};
    });
}

const login = async(user) => {
    return fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then((response) => response.json())    
    .then(json => {
        console.log("login response:", json);
        return json;
    })
    .catch((error) => {
        console.error(error);
        return {status: 500};
    });
}

const logout = async(token) => {
    return fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({token})
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

const changePassword = async(passwords, token, id) => {
    return fetch(`${BASE_URL}/useredit/${id}/updatepassword`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify(passwords)
    })
    .then((response) => {
        if(response.ok) return response.json();
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

const verifyEmail = async(code) => {
    return fetch(`${BASE_URL}/verifycode`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({code})
    })
    .then((response) => response.json())
    .then(json => {
        console.log(json);
        return json;
    })
    .catch((error) => {
        console.error("Email verification error:", error);
        return {status: 500};
    });
}

const validateToken = async(token) => {
    return fetch(`${BASE_URL}/tokenvalidate`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({token})
    })
    .then((response) => response.json())
    .then(json => {
        console.log(json);
        return json;
    })
    .catch((error) => {
        console.warn("Error validating token:", error);
        return {status: 500};
    });
}

export {login, logout, registerUser, verifyEmail, changePassword, validateToken}