const featuredImageContainer = document.querySelector('.featured-image-container');
const article = document.querySelector('article');
const h1 = document.querySelector('h1');
const title = document.querySelector('title');
const description = document.querySelector('meta[name=description]');
const publishedAndAuthor = document.querySelector('.date-author');
const loader = document.querySelector('.loader');

const queryString = location.search;

const params = new URLSearchParams(queryString);

const id = params.get("id");

insertData()

async function insertData() {
        try {
                const post = await getApi(urlPosts + String(id));
                const author = await getApi(urlUsers + post.author);
                const media = await getApi(urlMedia + post.featured_media);
                console.log(post);
                //Setting heading image
                featuredImageContainer.append(createFeaturedImage(media.source_url));
                //Setting the title
                h1.innerHTML = post.title.rendered;
                title.innerHTML = post.title.rendered;
                //Setting author and date published
                publishedAndAuthor.innerHTML = `<p>Author: ${author.name}</p>
                                                 <p>Published: ${reformatDate(post.modified)}</p>`;
                //Adding paragraphs from WP and setting description of webpage as an excerpt of the article
                let counter = 1;
                getCleanHTML(post.content.rendered).forEach(function(p) {
                        article.append(p);
                        /*if(counter === 1) {
                                description.innerHTML = `Excerpt: ${p.innerHTML}Read more...`;
                        }
                        article.innerHTML += `<br>`;
                        counter++;*/
                })
                loader.remove()
        } catch(err) {
                console.log(err);
        }
        
}       

body.addEventListener("click", function(e) {
        const id = e.target.id;
        if(id.includes("post-image")) {
                //orginally used e.originalTarget.closest("picture"), but doesn't work in chrome
                const parentContainer = e.originalTarget.parentNode.parentNode;
                //I want to keep the original element in the DOM, so I create  a copy instead which I scale up with css
                const copyOfElement = document.createElement("picture");
                copyOfElement.innerHTML = parentContainer.innerHTML;
                const image = copyOfElement.getElementsByTagName("img")[0];
                image.removeAttribute("id");
                copyOfElement.classList.add("picture-active");
                copyOfElement.addEventListener("click", function() {
                        this.remove()
                })
                body.append(copyOfElement);
        } 
})

function createFeaturedImage(source) {
        const htmlImage = document.createElement("img");
        htmlImage.setAttribute("src", source);
        htmlImage.classList.add("featured-image");
        return htmlImage;
}


function getCleanHTML(content) {
        const htmlNodes = stringToHTMLNodes(content);
        console.log(htmlNodes);
        let nodeList = [];
        let counter = 1;
        htmlNodes.childNodes.forEach(function(node) {
                console.log(node);
                if(node.nodeName === "P") {
                        nodeList.push(node);
                }
                if(node.nodeName === "FIGURE") {
                        if(node.className.includes("wp-block-image")){
                                const div = document.createElement("picture");
                                const newHTML = document.createElement("figure");
                                const caption = document.createElement("figcaption");
                                newHTML.innerHTML = `<img src="${node.firstChild.src}" alt="${node.firstChild.alt}" id="post-image-${counter}">`;
                                newHTML.classList.add("wp-image");
                                caption.innerHTML = `${node.textContent}`;
                                div.append(newHTML, caption)
                                nodeList.push(div)
                                counter++;
                        }
                        if(node.className.includes("wp-block-audio")){
                                const div = document.createElement("div");
                                div.classList.add("audio-container")
                                const audio = `<audio
                                                        controls
                                                        src="${node.firstChild.src}">
                                                        Your browser does not support the
                                                        audio element.
                                                </audio>`;
                                const caption = document.createElement("figcaption");
                                caption.innerHTML = `Audio: ${node.textContent}`;
                                div.innerHTML= audio;
                                div.append(caption)
                                nodeList.push(div)
                                counter++;
                        }
                }
                
        });
        console.log("nodelist", nodeList);
        return nodeList;
}

function stringToHTMLNodes(string) {
        const html = document.createElement("div");
        html.innerHTML = `${string}`;
        return html;
}

function reformatDate(date) {
        const onlyDate = date.substring(0,10)
        const newDate = onlyDate.split("-");
        return newDate[2] +'.' + newDate[1]+ '.' + newDate[0]
    
    }