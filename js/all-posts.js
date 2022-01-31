const postContainer = document.querySelector('.post-content');

insertData()

async function insertData() {
    try {   
            let JSONObj;
            if(!getSessionStorage("api-call")) {
                //function location: session-storage.js
                JSONObj = await newObject();
            } else {
                newObject();
                JSONObj = getSessionStorage("api-call");
            }
            const post = JSONObj.posts;
            const author = JSONObj.author;
            const media = JSONObj.media;
            const categories = JSONObj.categories;
            console.log(JSONObj);
            post.forEach(function(post) {
                if(post.categories[0] === sortTypeOfPost(categories, "post")) {
                    const mediaSource = media.filter(item => item.id === post.featured_media)[0].source_url;
                    const authorName = author.filter(item => item.id === post.author)[0].name;
                    postContainer.append(createPostHTML(post, mediaSource, authorName))
                }
            })

    } catch(err) {
            console.log(err);
    }
    
}       

function createPostHTML(post, mediaSource, author) {
    console.log(mediaSource);
    const newHTML = document.createElement("div");
    newHTML.classList.add("new-post")
    newHTML.innerHTML = `<a href="post.html?id=${post.id}" class="featured-image-container">
                           <img src="${mediaSource}"> </a>
                        <h2>${post.title.rendered}</h2>
                        <div class="date-author">
                                <p>Author: ${author}</p>
                                <p>Published: ${reformatDate(post.modified)}</p>
                        </div>`;
    return newHTML;
}

function createFeaturedImage(source) {
    const htmlImage = document.createElement("img");
    htmlImage.setAttribute("src", source);
    htmlImage.classList.add("featured-image");
    return htmlImage;
}

function reformatDate(date) {
    const onlyDate = date.substring(0,10)
    const newDate = onlyDate.split("-");
    return newDate[2] +'.' + newDate[1]+ '.' + newDate[0]

}