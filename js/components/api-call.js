const urlPosts = "https://eternalblue.cmsma1mariussolheim.one/wp-json/wp/v2/posts/";
const urlMedia = "https://eternalblue.cmsma1mariussolheim.one/wp-json/wp/v2/media/";
const urlUsers = "https://eternalblue.cmsma1mariussolheim.one/wp-json/wp/v2/users/";
const urlCategories = "https://eternalblue.cmsma1mariussolheim.one/wp-json/wp/v2/categories/";

async function getApi(url) {
    try {
        const response = await fetch(url);
        console.log(response);
        return await response.json();    
    } catch(error) {
        console.log(`Error message is: ${error}`);
    }
}