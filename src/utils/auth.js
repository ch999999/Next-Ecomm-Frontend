import {PUBLIC_BACKEND_BASE_URL} from '$env/static/public';
import { writable } from 'svelte/store';

const empthAuth = {
    "token": "",
    "userId": ""
}

export let isLoggedIn = writable(false);

export function logOut(){
    localStorage.setItem("auth", JSON.stringify(empthAuth))
    isLoggedIn.set(false);
    return true;
}

//may not be used
export function getUserId(){
    const auth = localStorage.getItem("auth")
    if(auth){
        return JSON.parse(auth)["userId"]
    }
    return null;
}

export function getTokenFromLocalStorage(){
    const auth = localStorage.getItem("auth")
    if(auth){
        return JSON.parse(auth)["token"]; 
    }
    return null;
}

export async function isValidToken(){
    if(!getTokenFromLocalStorage()){

        return false;
    }

    try{
        //sends a GET request requiring auth token
        const resp = await fetch(
            PUBLIC_BACKEND_BASE_URL+"/protected",
            {
                method:"GET",
                mode:"cors",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+getTokenFromLocalStorage()
                },
            }
        );

        const res = await resp.json();
        //if response is successful, that means token is valid. Set isLoggedIn to true
        if(resp.status==200){
            // localStorage.setItem("auth", JSON.stringify({
            //     "token": res.accessToken
            // }));
            isLoggedIn.set(true);
            return true;
        }else{ //if response is not successful, that means token is invalid. Set the token to empty string in local storage, set isLoggedIn to false
           localStorage.setItem("auth", JSON.stringify({
                "token":"",
                "userId":""
           }));
           isLoggedIn.set(false)
           return false;
        }
    }catch(err){
        
        return false;
    }
}

export async function authenticateUser(email, password){
    const resp = await fetch(
        PUBLIC_BACKEND_BASE_URL+"/auth",
        {
            method: "POST",
            mode: "cors",
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        }
    );

    const res = await resp.json();

    if(resp.status==200){
        localStorage.setItem("auth", JSON.stringify({
            "token":res.accessToken,
            "userId":res.id
        }));

        isLoggedIn.set(true);
        return{
            success:true,
            res
        }
    }

    return{
        success: false,
        res
    }
}