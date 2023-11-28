export const ssr = false;
import { isValidToken } from "../utils/auth";

export async function load(){
    await isValidToken();
    
}