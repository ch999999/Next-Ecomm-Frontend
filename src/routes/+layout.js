export const ssr = false;
import { isValidToken } from '../utils/auth.js';

export async function load(){
    await isValidToken();
    
}