const firstAlbum = document.querySelector('#album-vanagloria');
const main = document.querySelector('main');
const albumContainer = document.querySelector('#albums');
const openPlayer = document.querySelector('#open-media-player');
const loader = document.querySelector('.loader');

let songList = {};

//Defining which element should be set for scroll width in nav.js
//I set main here as width for horizontal scroll for entire width of main in album releases. Will be cool, I think.
setScrollElement(main);

insertData()

async function insertData() {
    try {   
            let JSONObj;
            if(!getSessionStorage("api-call")) {
                //function location: session-storage.js
                //reloading the page as soon as the object is loaded into session storage as 
                //I ran into problems with the player when running the songs directyl from the api call
                JSONObj = await newObject();
                window.location.reload();
            } else {
                newObject();
                JSONObj = getSessionStorage("api-call");
            }
            const post = JSONObj.posts;
            const author = JSONObj.author;
            const media = JSONObj.media;
            const categories = JSONObj.categories;
            const onlyAudio = media.filter(item => item.mime_type.includes("audio"));
            createMediaPlayer(onlyAudio);
            openPlayer.addEventListener("click", function(){
                const mediaPlayer = document.querySelector('#media-player');
                openPlayer.style.display= "none";
                mediaPlayer.classList.add("media-player-container-active");
                mediaPlayer.removeAttribute("style");
                
            })

            
            console.log(JSONObj);
            post.forEach(function(post) {
                if(post.categories[0] === sortTypeOfPost(categories, "release")) {
                    console.log(post);
                    const mediaSource = media.filter(item => item.id === post.featured_media)[0].source_url;
                    albumContainer.append(createAlbumHTML(post, mediaSource))
                }
            })
            openPlayer.removeAttribute("style");
            loader.remove();
    } catch(err) {
            console.log(err);
    }
}       

body.addEventListener("click", function(e){
    const id = e.target.id;
    if(id === "exit-media-player") {
        const mediaPlayer = document.querySelector('#media-player');
        mediaPlayer.classList.remove(mediaPlayer.className);
        openPlayer.removeAttribute("style");
    }
})

//We only have one release, but this code will work for more releases. 
//This code creates the HTML for each album
//It sets an event listener for each song which on clicks fetches the HTML from a text file in /wp-content/uploads/

function createAlbumHTML(release, imageSource) {
    const container = document.createElement("div");
    container.classList.add("album-info-container");
    container.setAttribute("id", "album-" + release.title.rendered)
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

/*Code for the media player which takes the audio files in the media uploads folder in WP and creates a list and HTML*/

let playingSongID;

async function createMediaPlayer(onlyAudio) {
    let albums = [];

    const audioObjects = onlyAudio.map(function(item) {
        const albumName = item.media_details.album;
        const existingAlbum = albums.filter(item => item === albumName);
        if(existingAlbum.length === 0) {
            albums.push(albumName)
        }
        return {
            trackNum : parseInt(stringToHTMLNodes(item.caption.rendered)[0].innerHTML),
            album : item.media_details.album,
            title : item.media_details.title || item.title.rendered,
            length : item.media_details.length_formatted,
            link : item.guid.rendered,
            id : item.id
        };
    }).sort((firstItem, secondItem) => firstItem.trackNum - secondItem.trackNum);

    console.log(audioObjects);

    body.insertBefore(mediaPlayerHTML(), main);

    console.log(mediaPlayerHTML());
    /*Function for creating the HTML for the whole media player*/
    function mediaPlayerHTML() {
        const container = document.createElement("div");
        container.setAttribute("id", "media-player")
        
        const innerContainer = document.createElement("div");
        innerContainer.classList.add("media-player-container-inner");
        
        const exitButton = document.createElement("button");
        exitButton.classList.add("exit-button");
        exitButton.setAttribute("id", "exit-media-player")
        container.append(exitButton);
        
        container.innerHTML += `<h2>Media Player</h2>`;


        /*creating track listing with eventlisteners for each song*/

        albums.forEach(function(albumName) {
            const newAlbum = document.createElement("div");
            newAlbum.classList.add("audio-container");
            newAlbum.innerHTML = `<h3>${albumName}</h3>`
            
            
            audioObjects.forEach(function(song) {

                if(song.album === albumName) {
                    
                    const playButton = document.createElement("button");
                    playButton.setAttribute("id", song.id);
                    
                    playButton.innerHTML = `<li>${song.trackNum}. ${song.title}</li><span id="play-icon"></span>`;
                    playButton.addEventListener("click", function () {
                        //if song is already playing, it should be removed when another song has been triggered

                    function addHTML (el) {
                        const playIcon = el.getElementsByTagName("span")[0];
                        playIcon.classList.add("play-icon-active");
                        const audioHTML = document.createElement("audio");
                        audioHTML.setAttribute("controls", "");
                        audioHTML.setAttribute("src", song.link);
                        audioHTML.setAttribute("autoplay", "");
                        console.log(audioHTML);
                        playingSongID = {
                                        songID : el.closest("button").id,
                                        status: "play"
                                    }
                        mediaPlayerContainer.append(audioHTML);
                    }
                    /*Logic for playing and pausing songs*/
                        if(document.querySelector('audio')) {
                            const playIcons = document.querySelectorAll('#play-icon');
                            playIcons.forEach(icon => icon.removeAttribute("class"));
                            if(playingSongID.songID === this.closest("button").id && playingSongID.status === "play") {
                                document.querySelector('audio').pause();
                                playingSongID.status = "pause";
                            } else if (playingSongID.songID === this.closest("button").id && playingSongID.status === "pause"){
                                document.querySelector('audio').play();
                                this.getElementsByTagName("span")[0].classList.add("play-icon-active")
                                playingSongID.status = "play";
                            } else {
                                document.querySelector('audio').remove()
                                addHTML(this)
                            }
                        } else {
                            addHTML(this)
                        }
                            
                    })
                    newAlbum.append(playButton)
                }
            })
            innerContainer.append(newAlbum);
            container.append(innerContainer);
        })
        return container;
    }
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
    albumContainer.append(text);
    
}

const mediaPlayerContainer = document.querySelector('#media-player');