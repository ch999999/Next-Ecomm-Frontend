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
        const resp = await fetch(
            PUBLIC_BACKEND_BASE_URL+"/sign-in",
            {
                method:"POST",
                mode:"cors",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": getTokenFromLocalStorage()
                },
            }
        );

        const res = await resp.json();
        if(resp.status==200){
            localStorage.setItem("auth", JSON.stringify({
                "token": res.accessToken
            }));
            isLoggedIn.set(true);
            return true;
        }
        return false;
    }catch{
        return false;
    }
}

export async function authenticateUser(email, password){
    const resp = await fetch(
        PUBLIC_BACKEND_BASE_URL+"/sign-in",
        {
            method: "POST",
            mode: "cors",
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                identity: email,
                password
            })
        }
    );

    const res = await resp.json();

    if(resp.status==200){
        localStorage.setItem("auth", JSON.stringify({
            "token":res.accessToken
        }));

        isLoggedIn.set(true);
        return{
            success:true,
            res: res
        }
    }

    return{
        success: false,
        res: res
    }
}