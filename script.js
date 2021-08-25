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
const songListNav = document.querySelectorAll("ol li button")
const headerLyrics = document.querySelector(".headerlyrics")


releasesBtn.addEventListener("click", function (e) {
    releases.style.display = "flex";
    about.style.display = "none";
    aboutBtn.style.textDecoration = "none"
    releasesBtn.style.textDecoration = "underline"
})

aboutBtn.addEventListener("click", function (e) {
    releases.style.display = "none";
    about.style.display = "flex";
    aboutBtn.style.textDecoration = "underline"
    releasesBtn.style.textDecoration = "none"
    lyricsContainer.style.display ="none"
})

viewBtn.addEventListener("click", function (e) {
    nav.style.display = "none";
    lyricsContainer.style.display = "flex";
    rightColumn.style.display = "none";
    viewBtn.style.display ="none";
    exitView.style.display = "inline"
    songListNav.forEach(item => item.classList.add("song"))
    headerLyrics.style.display = "inline"
})

exitView.addEventListener("click", function (e) {
    nav.style.display = "inline";
    lyricsContainer.style.display = "none";
    rightColumn.style.display = "flex";
    viewBtn.style.display ="block";
    exitView.style.display = "none"
    headerLyrics.style.display = "none"
    songListNav.forEach(item => item.classList.remove("song"))
})

main.addEventListener("click",function (e) {
    let event = e.originalTarget.id;
    let targetElm = "#lyrics"
    if (event.includes("song")) {
        targetElm = targetElm + event.substring("4")
        let scrollToElm = document.querySelector(targetElm)
    scrollToElm.scrollIntoView({behavior: "smooth"})
    }
})
