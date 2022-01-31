function setSessionStorage(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
}

function getSessionStorage(key) {
    return JSON.parse(sessionStorage.getItem(key));
}

async function newObject() {
    const newObject = {
     posts : await getApi(urlPosts +"?per_page=100"),
     media : await getApi(urlMedia +"?per_page=100"),
     categories : await getApi(urlCategories),
     author : await getApi(urlUsers +"?per_page=100")
    }
    setSessionStorage("api-call", newObject);
    return newObject;
}

