const welcomeCont = document.querySelector('.front-page div');
const frontPage = document.querySelector('.front-page');
const main = document.querySelector('main');
const imageReel = document.querySelector('.image-reel');
const postsContainer = document.querySelector('#latest-posts-container');

let toggled = false;

setInterval(welcomeText, 6000)

function welcomeText() {
    const welcomeSign = document.createElement("p")
    document.querySelector('.front-page p').remove()
    if(toggled) {
        welcomeSign.innerHTML = "Welcome, Human.";
        welcomeCont.append(welcomeSign)
        toggled = !toggled;
        
    } else {
        welcomeSign.innerHTML = "We have been expecting you."
        toggled = !toggled;
        welcomeCont.append(welcomeSign)
    }
    
}
//Defining which element should be set for scroll width in nav.js
setScrollElement(imageReel);

insertImages()

async function insertImages (){
    let JSONObj;
    if(!getSessionStorage("api-call")) {
        //function location: session-storage.js
        JSONObj = await newObject();
    } else {
        newObject();
        JSONObj = getSessionStorage("api-call");
    }

    const {posts, tags, media, categories} = JSONObj;

    function findFeaturedPost() {
        //finding id of featured post tag
        const featuredTagID = tags.filter(tags => tags.name === "featured post");
        //Check for featured post and returning first result as there should be only one featured post
        const featuredPost = posts.filter(function(post){
            let hasFeaturedTag = [];
            //Check if post.tags array contain a featured tag
            for(let i = 0; i <= post.tags.length; i++) {
                if(post.tags[i] === featuredTagID[0].id){
                    hasFeaturedTag.push(post);
                    return hasFeaturedTag;
                } 
            }
        })[0];
        //if I have forgotten to put a featured post tag in WP, the last post will be set as featured
        if(!featuredPost) {
            return posts[0];
        } else {
            return featuredPost;
        }
        
    }

    createHTMLFeaturedPost(findFeaturedPost())

    function createHTMLFeaturedPost(post) {
        const parent = document.querySelector('.container');
        const container = document.createElement("div");
        container.classList.add("featured-post");
        const imageSource = media.filter(item => item.id === post.featured_media)[0].source_url;
        container.innerHTML = `<a href="post.html?id=${post.id}"><img src="${imageSource}">
                                <span><div></div><h3>Featured Post</h3></span>
                                <h2>${post.title.rendered}</h2></a>`;
        parent.insertBefore(container, parent.firstChild);
    }
    document.querySelector('.loader').remove();
    let counter = 0;
    let totalCount = 0;
    let newImageGroup;

    //Logic for the Latest posts image reel
    //- inserting groups of 4 cards into a <picture> container
    //- if post.length % 4 != 0, the code should insert whatever is left into a <picture> container
    //- Also if the post category is not "post" it should not be inserted. And the length of the posts array should be decremented
    let postsLength = posts.length;
    
    posts.forEach(function(post) {
        if(post.categories[0] === sortTypeOfPost(categories, "post") && totalCount <=8) {
            //function location: sorting.js
            if(counter === 0) {
                createImageGroup()
                counter++;
                totalCount++;
            } else if (counter > 0 && counter < 4) {
                newImageGroup.append(createImageDiv(post));
                counter++;
                totalCount++;
                if(totalCount === postsLength) {
                    imageReel.append(newImageGroup);
                    newImageGroup = "";
                }
            } else if (counter === 4) {
                imageReel.append(newImageGroup);
                newImageGroup = "";
                createImageGroup()
                counter = 1;
                totalCount++;
            } 
        } else {
            postsLength--;
        }
        function createImageGroup() {
            newImageGroup = document.createElement("picture");
            newImageGroup.classList.add("image-group");
            newImageGroup.append(createImageDiv(post));
        }

        function createImageDiv(post) {
            const newHTML = document.createElement("a");
            newHTML.setAttribute("href", "post.html?id="+String(post.id))
            newHTML.classList.add("image-container");

            const headerImage = media.filter(media => media.id === post.featured_media)[0];
        
            newHTML.setAttribute("id", post.id);
            newHTML.innerHTML = `<img src="${headerImage.source_url}">
                                    <h3>${post.title.rendered}</h3>`;
            console.log(newHTML);
            return newHTML;
        }
        
    })
    lastPost()
    function lastPost() {
        newImageGroup = document.createElement("picture");
        newImageGroup.classList.add("image-group");
        newImageGroup.setAttribute("id", "link-to-all");
        const newHTML = document.createElement("a");
        newHTML.classList.add("image-container");
        newHTML.setAttribute("href", "all-posts.html");
        newHTML.innerHTML = `<h3>Click to see all posts</h3>`;
        newImageGroup.append(newHTML);
        imageReel.append(newImageGroup);
    }
    
}