function sortTypeOfPost (categories, type) {
    return categories.filter(function(category) {
        if(category.name === type) {return category.id;}
    })[0].id;
}

function stringToHTMLNodes(string) {
    const html = document.createElement("div");
    html.innerHTML = `${string}`;
    return html.childNodes;
}

function createFeaturedImage(source) {
    const htmlImage = document.createElement("img");
    htmlImage.setAttribute("src", source);
    htmlImage.classList.add("featured-image");
    return htmlImage;
}
