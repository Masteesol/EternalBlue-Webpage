const header = document.querySelector('header');
const body = document.querySelector("body");
createNav()
function createNav () {
    const nav = document.createElement("nav");
    const logo = document.createElement("a")
    const burgerMenu = document.createElement("button")
    
    nav.innerHTML = `<ul>
                        <a href="home.html" id="nav-home"><li>Home</li></a>
                        <a href="all-posts.html" id="nav-all-posts"><li>Posts</li></a>
                        <a href="releases.html" id="nav-releases"><li>Music</li></a>
                        <a href="about.html" id="nav-about"><li>About</li></a>
                        <a href="contact.html" id="nav-contact"><li>Contact</li></a>
                    </ul>
                    `;

    logo.setAttribute("href", "index.html");
    logo.innerHTML = `<img src="/logo/logo small.png" alt="logo image">`;

    burgerMenu.classList.add("burger-menu-inactive")
    burgerMenu.setAttribute("id", "burger-menu")
    burgerMenu.addEventListener("click", function() {
        if(this.className === "burger-menu-inactive") {
            nav.classList.add("nav-active")
            this.classList.replace(this.className, "burger-menu-active")
        } else {
            nav.classList.remove("nav-active");
            this.classList.replace(this.className, "burger-menu-inactive") 
        }
    })
    header.append(logo);
    header.append(nav);
    header.append(burgerMenu)
    
}

//Navigation buttons: up/down, left/right
body.addEventListener("click", function(e) {
    const id = e.target.id;
    switch(id) {
        case("go-down-btn"):
            scrollYByVh(main.clientHeight);
            break;
        case("go-up-btn"):
            scrollYByVh(-main.clientHeight);
            break;
        case("go-right-btn"):
            scrollXByClientWidth(horizontalScrollElement.clientWidth);
            break;
        case("go-left-btn"):
            scrollXByClientWidth(-horizontalScrollElement.clientWidth);
            break;
    }
})

let horizontalScrollElement;

function setScrollElement(scrollElement) {
    horizontalScrollElement = scrollElement;
}

function scrollYByVh(upOrDown) {
    main.scrollBy({top: upOrDown,
                    left: 0,
                    behavior: 'smooth'});
  }

function scrollXByClientWidth(leftOrRight) {
    horizontalScrollElement.scrollBy({top: 0,
                    left: leftOrRight,
                    behavior: 'smooth'});
  }