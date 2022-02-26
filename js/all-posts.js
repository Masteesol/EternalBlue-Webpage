const postContainer = document.querySelector('.post-content');
const main = document.querySelector('main');

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
            
            //Destructuring of the object created in the newObject() function
            const {posts, author, media, categories} = JSONObj;
            
            const onlyPosts = posts.filter(post => post.categories[0] === sortTypeOfPost(categories, "post"));
            
            //Function for search field and radio buttons......................................................
            const filteringHTML = () => {
                const container = document.createElement("div");
                container.classList.add("filter-container");

                function searchField() {
                    const container = document.createElement("div");
                    container.classList.add("search-field-container");

                    const navContainer = document.createElement("span");
                    navContainer.innerHTML = `<h3>Advanced search</h3>`;

                    const navButton = document.createElement("div");
                    navButton.classList.add("reveal-search")
                    navButton.addEventListener("click", function(e) {
                        this.classList.toggle("active");
                        hideSearchField();
                    })

                    navContainer.append(navButton);

                    container.append(navContainer);

                    const inputPhrase = document.createElement("input");
                    inputPhrase.setAttribute("type", "text");
                    inputPhrase.setAttribute("id", "search-field-phrase");
                    inputPhrase.setAttribute("placeholder", "Enter word or phrase...");
                    inputPhrase.addEventListener("keydown", function(e) {
                        if(e.key === "Enter") {
                            const htmlOfResults = htmlResultArticle(inputPhrase.value);
                            body.append(htmlOfResults)
                        }
                    })
                    const input = document.createElement("input");
                    input.setAttribute("type", "text");
                    input.setAttribute("id", "search-field-title");
                    input.setAttribute("placeholder", "Enter title...");

                    const array = [input, inputPhrase];

                    const listContainer = document.createElement("div");
                    listContainer.classList.add("search-results");

                    //SEARCH FOR TITLE with dynamicly appearing results..........
                    input.addEventListener("input", function() {
                        const text = this.value.toLowerCase().trim();
                        if(text !== "") {
                            const result = onlyPosts.filter(post => post.title.rendered.toLowerCase().includes(text));
                            listContainer.innerHTML = "";
                            listContainer.append(htmlResult(result));
                            container.append(listContainer);
                        } else if ( text === "") {
                            listContainer.innerHTML = "";
                            listContainer.remove()
                        }
                        function htmlResult(results) { 
                            const newList = document.createElement("ol");
                            results.forEach(function(result) {
                               /*const listElement = document.createElement("a");
                               listElement.setAttribute("href", `post.html?id=${result.id}`);
                               listElement.innerHTML = `<li>${result.title.rendered}</li>`;*/
                               const listElement = document.createElement("li");
                               listElement.innerHTML = `<a href=post.html?id=${result.id}>${result.title.rendered}</a>`
                               newList.append(listElement);
                            });
                            return newList;
                        };
                    })
                    
                    const inputs = array.map(function(el){
                        const div = document.createElement("div");
                        div.classList.add("search-field");
                        const searchButton = document.createElement("button");
                        if(el.id === "search-field-phrase") {
                            searchButton.setAttribute("id", el.id + "-button")
                        }
                        searchButton.addEventListener("click", function() {
                            if(el.id === "search-field-phrase") {
                                if(inputPhrase.value.trim() !== "") {
                                    const htmlOfResults = htmlResultArticle(inputPhrase.value);
                                    body.append(htmlOfResults);
                                } else {
                                    alert("Empty search field");
                                }
                                
                            }
                        })
                        div.append(el, searchButton);
                        return div;
                    })
                    /*Code for creating HTML of results when looking for a word or phrase in existing post articles*/
                    function htmlResultArticle(inputValue) {
                        const container = document.createElement("div");
                        const exitButton = document.createElement("button");
                        exitButton.classList.add("exit-button");
                        exitButton.addEventListener("click", function() {
                            this.parentElement.remove();
                        })

                        container.classList.add("search-results-article-container");
                        container.innerHTML = `<h2>Search results</h2>`;

                        const unorderedList = document.createElement("ul");

                        const objectList = onlyPosts.map(post => {
                            const nodes = stringToHTMLNodes(post.content.rendered);

                            let onlyText = []
                            nodes.forEach(function(node) {
                                if(node.tagName === "P") {
                                    onlyText.push(node.innerText);
                                }})
                            return {
                                title: post.title.rendered,
                                id: post.id,
                                text: onlyText.join(" ")
                            }
                        })

                        const matches = objectList.filter(object => {
                            const postText = object.text.toLowerCase();
                            const inputText = inputValue.toLowerCase();
                            if(postText.match(inputText)) {
                                const indexOfMatch = postText.indexOf(inputText)
                                const wordsBefore = postText.substring(indexOfMatch, indexOfMatch-50);
                                const charsAfter = postText.substring(indexOfMatch+inputText.length, indexOfMatch+inputText.length+50);
                                object["excerpt"] = `...${wordsBefore}<strong>${inputText}</strong>${charsAfter}...`;
                                return object;
                            }
                        });

                        matches.forEach(object => {
                            const listElement = document.createElement("li");
                            listElement.innerHTML = `<a href=post.html?id=${object.id}><h4>${object.title}</h4></a>
                                                        <p>${object.excerpt}</p>
                                                        `;
                            unorderedList.append(listElement);
                        })
                        console.log("unordered list",unorderedList);
                        container.append(unorderedList, exitButton)
                        return container;
                    }
                    function hideSearchField() {
                        inputs.forEach(div => {
                            div.classList.toggle("active");
                        })
                    }
                    container.append(inputs[1], inputs[0]);
                    return container;
                }

                //Function for creating HTML for filtering/sorting posts
                function sorting() {
                    const container = document.createElement("div");
                    container.classList.add("sort-by-container");

                    const sortByLatest = document.createElement("input");
                    sortByLatest.setAttribute("id", "sort-by-latest");
                    sortByLatest.setAttribute("checked", "true");
                    sortByLatest.setAttribute("value", "Latest");

                    const sortByOldest = document.createElement("input");
                    sortByOldest.setAttribute("id", "sort-by-oldest");
                    sortByOldest.setAttribute("value", "Oldest");


                    const sortByTitle = document.createElement("input");
                    sortByTitle.setAttribute("id", "sort-by-title");
                    sortByTitle.setAttribute("value", "Title");

                    const array = [sortByLatest, sortByOldest, sortByTitle];
                    
                    container.innerHTML = `<p>Sort by:</p>`;
                    
                    function label(id, value) {
                        const el = document.createElement("label")
                        el.setAttribute("for", id);
                        el.innerHTML = value;
                        return el
                    }
                                            
                    array.forEach(element => {
                            element.setAttribute("type", "radio");
                            element.setAttribute("name", "filter-buttons");
                            element.addEventListener("click", function() {
                                sortBy(element.id);
                            });
                            container.append(element);
                            container.append(label(element.id, element.value));
                        });
                    return container;
                }
    
                container.append(sorting(), searchField());
                return container;
            }

            main.insertBefore(filteringHTML(), postContainer)

           

            //creating 8 posts HTML cards at a time when called
            function getMorePosts (fromIndex, toIndex, array) {
                let eigthPosts = [];
                for(let i = 0; i < array.length; i++){
                    if(i >= fromIndex && i < toIndex) {
                        const post = array[i];
                        const currentMedia = media.filter(item => item.id === post.featured_media)[0];
                        const authorName = author.filter(item => item.id === post.author)[0].name;
                        eigthPosts.push(createPostHTML(post, currentMedia, authorName));
                    }
                }
                return eigthPosts;
            }

            let startIndex = 0;
            let endIndex = 8;
            
            addPosts(onlyPosts);

            function addPosts(array) {
                getMorePosts(startIndex, endIndex, array).forEach(function(post) {
                    postContainer.append(post)
                })
                if(endIndex < posts.length) {
                    const viewMore = document.createElement("button");
                    viewMore.innerHTML = `View More`;
                    viewMore.classList.add("view-more");
                    viewMore.addEventListener("click", function() {
                        addPosts(array);
                        this.remove();
                    })
                postContainer.append(viewMore);
                startIndex = startIndex + 8;
                endIndex = endIndex + 8;
                }
                
            }
            
            document.querySelector('.loader').remove();

    function sortBy(id) {
        postContainer.innerHTML = "";
        startIndex = 0;
        endIndex = 8;
        const sortedPosts = onlyPosts.slice().sort(function(a,b) {
            const sort = (a, b) => {
                if(a > b) {
                    return 1;
                } else {
                    return -1;
                }
            };
            switch(id) {
                case("sort-by-latest"):
                    return sort(b.date, a.date);
                case("sort-by-oldest"):
                    return sort(a.date, b.date);
                case("sort-by-title"):
                    return sort(a.title.rendered, b.title.rendered);
            }
        })
        addPosts(sortedPosts);
    }
    } catch(err) {
            console.log(err);
    }
}


function createPostHTML(post, media, author) {
    const newHTML = document.createElement("div");
    newHTML.classList.add("new-post")
    newHTML.innerHTML = `<a href="post.html?id=${post.id}" class="featured-image-container">
                           <img src="${media.source_url}" alt="${media.alt_text}"></a>
                           <div class="date-author">
                                <p>Author: ${author}</p>
                                <p>Published: ${reformatDate(post.modified)}</p>
                            </div>
                            <h2>${post.title.rendered}</h2>
                        `;
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

