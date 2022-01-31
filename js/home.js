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

frontPage.addEventListener("click", function(e) {
    const id = e.target.id;
    console.log(id);
    if(id === "go-down-btn") {
        console.log("object");
        scrollYByVh(main.clientHeight)
    }
    if(id === "go-up-btn") {
        scrollYByVh(-main.clientHeight)
    }      
})

postsContainer.addEventListener("click", function(e) {
    const id = e.target.id;
    if(id === "go-right-btn") {
        scrollXByClientWidth(imageReel.clientWidth)
    }
    if(id === "go-left-btn") {
        scrollXByClientWidth(-imageReel.clientWidth)
    }      
})

function scrollYByVh(upOrDown) {
    main.scrollBy({top: upOrDown,
                    left: 0,
                    behavior: 'smooth'});
  }

function scrollXByClientWidth(leftOrRight) {
    imageReel.scrollBy({top: 0,
                    left: leftOrRight,
                    behavior: 'smooth'});
  }
//setting session storage with API- call object if it's not already there



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
    
    const posts = JSONObj.posts;
    const media = JSONObj.media;
    const categories = JSONObj.categories;

    console.log("categories: ", categories);
    console.log("posts: ", posts);
    console.log("images: ", media);

    let counter = 0;
    let totalCount = 0;
    let newImageGroup;

    //Logic for the Latest posts image reel
    //- inserting groups of 4 cards into a <picture> container
    //- if post.length % 4 != 0, the code should insert whatever is left into a <picture> container
    //- Also if the post category is not "post" it should not be inserted. And the length of the posts array should be decremented

    let postsLength = posts.length;
    
    posts.forEach(function(post) {
        if(post.categories[0] === sortTypeOfPost(categories, "post")) {
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
}