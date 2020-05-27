function saveData(key,value) {
    localStorage.setItem(key,value);
}

function readData(key) {
    if(key in localStorage)
        return localStorage.getItem(key);
}
