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
                getParagraphs(post.content.rendered).forEach(function(p) {
                        article.append(p);
                        if(counter === 1) {
                                description.innerHTML = `Excerpt: ${p.innerHTML}Read more...`;
                        }
                        article.innerHTML += `<br>`;
                        counter++;
                })
                loader.remove()
        } catch(err) {
                console.log(err);
        }
        
}       


function createFeaturedImage(source) {
        const htmlImage = document.createElement("img");
        htmlImage.setAttribute("src", source);
        htmlImage.classList.add("featured-image");
        return htmlImage;
}

function getParagraphs(content) {
        const htmlNodes = stringToHTMLNodes(content);
        let nodeList = [];
        htmlNodes.childNodes.forEach(function(node) {
                console.log(node);
                if(node.nodeName === "P") {
                        nodeList.push(node);
                }
        });
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