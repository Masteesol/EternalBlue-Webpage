const releasesBtn = document.querySelector(".releasesBtn");
const releases = document.querySelector(".releases");
const aboutBtn = document.querySelector(".aboutBtn");
const about = document.querySelector(".about");
const viewBtn = document.querySelector(".view");
const exitView = document.querySelector(".exitview");
const nav = document.querySelector("nav");
const lyricsContainer = document.querySelector(".lyricscontainer");
const rightColumn = document.querySelector(".rightcolumn");
const main = document.querySelector("main")
const songListNav = document.querySelectorAll(".song")
const headerLyrics = document.querySelector(".headerlyrics")
const navBar = document.querySelector("#navbar")

releasesBtn.addEventListener("click", function (e) {
    releases.style.display = "flex";
    about.style.display = "none";
    aboutBtn.style.textDecoration = "none"
    releasesBtn.style.textDecoration = "underline"
})

aboutBtn.addEventListener("click", function (e) {
    releases.style.display = "none";
    about.style.display = "block";
    aboutBtn.style.textDecoration = "underline"
    releasesBtn.style.textDecoration = "none"
    lyricsContainer.style.display ="none"
})

viewBtn.addEventListener("click", function (e) {
    addNavButton()
    nav.style.display = "none";
    lyricsContainer.style.display = "flex";
    rightColumn.style.display = "none";
    viewBtn.style.display ="none";
    exitView.style.display = "inline"
    songListNav.forEach(item => item.classList.remove("song"))
    songListNav.forEach(item => item.classList.add("song-mod"))
    headerLyrics.style.display = "inline"
    navBar.classList.add("navbaractive")
    openNavFunction()
})

function addNavButton () {
    const button = document.createElement("button");
    button.classList.add("opennav");
    const listingContainer = document.querySelector(".listingcontainer")
    main.insertBefore(button, listingContainer);
}


exitView.addEventListener("click", function (e) {
    navBar.removeAttribute("class")
    navBar.removeAttribute("style")
    nav.style.display = "inline";
    lyricsContainer.style.display = "none";
    rightColumn.style.display = "flex";
    viewBtn.style.display ="block";
    exitView.style.display = "none"
    headerLyrics.style.display = "none"
    songListNav.forEach(item => item.classList.remove("song-mod"))
    songListNav.forEach(item => item.classList.add("song"))
    document.querySelector(".opennav").remove()
})


main.addEventListener("click",function (e) {
    console.log(e)
    let event = e.target.id;
    let targetElm = "#lyrics"
    if (event.includes("song")) {
        targetElm = targetElm + event.substring("4")
        let scrollToElm = document.querySelector(targetElm)
    scrollToElm.scrollIntoView({behavior: "smooth"})
    }
})

function openNavFunction () {
    const openNavBtn = document.querySelector(".opennav")
    let toggled = 0;
    openNavBtn.addEventListener("click", function(e) {
        if (toggled === 0) { 
            openNavBtn.style.cssText =`
                                        background-image: url(images/times-solid.svg);
                                        top: 20px;
                                        left: 200px;
                                        `;
            document.querySelector("#navbar").style.width = "250px";
            toggled = 1;
        } else {
            openNavBtn.style.cssText =`
                                        background-image: url(images/list-ol-solid.svg);
                                        left: 20px;
                                        `;  
            document.querySelector("#navbar").style.width = "0";
            toggled = 0;
        }
    })
}


