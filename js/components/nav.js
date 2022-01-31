const header = document.querySelector('header');

header.innerHTML = `
                    <a href="index.html"><img src="/logo/logo small.png" alt="logo image"></a>
                    <nav class="desktop-nav">
                    <ul>
                        <a href="home.html" id="nav-home"><li>Home</li></a>
                        <a href="all-posts.html" id="nav-all-posts"><li>Posts</li></a>
                        <a href="releases.html" id="nav-releases"><li>Releases</li></a>
                        <a href="about.html" id="nav-about"><li>About</li></a>
                        <li id="open-contact-form">Contact</li>
                    </ul>
                    </nav>`;