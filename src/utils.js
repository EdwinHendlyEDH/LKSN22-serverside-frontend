import {API_BASE} from '@/config.js';

async function doFetch(path, options = {}){
    return await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type' : 'application/json',
            ...options.headers
        }
    });
}

async function checkLogin(token){
    const res = await fetch(`${API_BASE}/auth/me`, {headers: {
        'Authorization' : `Bearer ${token}`
    }});
    const data = await res.json();
    if(res.status == 200){
        return data.user;
    }else {
        return false;
    }
}

export {
    doFetch,
    checkLogin
}