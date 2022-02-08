const firstAlbum = document.querySelector('#album-vanagloria');
const main = document.querySelector('main');
let songList = {};

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
                if(post.categories[0] === sortTypeOfPost(categories, "release")) {
                    console.log(post);
                    const mediaSource = media.filter(item => item.id === post.featured_media)[0].source_url;
                    firstAlbum.append(createAlbumHTML(post, mediaSource))
                }
            })

    } catch(err) {
            console.log(err);
    }
    
}       


//We only have one release, but this code will work for more releases. 
//This code creates the HTML for each album
//It sets an event listener for each song which on clicks fetches the HTML from a text file in /wp-content/uploads/

function createAlbumHTML(release, imageSource) {
    const container = document.createElement("div");
    container.innerHTML += `<div class="album-cover">
                                <img src=${imageSource} alt="album cover image">
                            </div>`;
    const listingContainer = document.createElement("div");
    listingContainer.innerHTML = `<h2>${release.title.rendered}</h2>`;
    const orderedList = document.createElement("ol");
    listingContainer.append(orderedList);
    listingContainer.classList.add("song-listing")

    const albumName = createList()[0].album
    songList[albumName] = createList();
    
    createList().forEach(function(object) {
        const listElement = document.createElement("li");
        listElement.setAttribute("id", object.id);
        listElement.innerText = object.name;
        listElement.addEventListener("click", function() {
            console.log("test");
            openLyrics(object.id, object.album)
        })
        orderedList.append(listElement)
    })

    container.append(listingContainer)

    function createList() {
        const htmlNodes = stringToHTMLNodes(release.content.rendered)
        let listElements = [];
        let counter = 1;
        htmlNodes.forEach(function(node) {
            if(node.className === "wp-block-file") {
                listElements.push({link : node.firstChild.href, 
                                name : node.firstChild.innerHTML,
                                id : "open-" + node.firstChild.innerHTML,
                                album : release.title.rendered}) 
                                }
            counter++
        })
        return listElements;
       
    }
    return container;
}


async function openLyrics(id, album) {
    const textUrl = songList[album].filter(item => item.id === id)[0].link;
    const text = document.createElement("div");
    text.classList.add("lyrics-container")
    const iFrame = document.createElement("iFrame");
    iFrame.setAttribute("type", "text/html");
    iFrame.setAttribute("src", textUrl);
    iFrame.setAttribute("id", "iframe-lyrics");
    const exitButton = document.createElement("button");
    exitButton.classList.add("exit-button")
    exitButton.setAttribute("id", "exit-lyrics")
    exitButton.addEventListener("click", function() {
        document.querySelector(".lyrics-container").remove()
    })
    console.log(iFrame);
    text.append(iFrame, exitButton);
    firstAlbum.append(text);
    const testIframe = document.querySelector('#iframe-lyrics');
    console.log(testIframe.contentWindow.document);
}


