async function fetchData() {
    const response = await fetch('./data.json');
    try {
        const data = await response.json();
        return data
    } catch (e) {
        console.log('error' + e);
    }
}

let selectedTagsWrapper = document.querySelector('.selected-tags-wrapper');
let selectedTags = [];



async function createCards() {
    const fetchedData = await fetchData();
    const main = document.querySelector('main');

    const data = filterByTags (fetchedData, selectedTags);

    data.forEach(el => {
        const card = document.createElement('div');
        card.classList.add('card');

        
        let displayNewBtn;
        if (el.new) displayNewBtn = 'display';

        let displayFeaturedBtn;
        let displayFeaturdCard;
        if (el.featured) {
            displayFeaturedBtn = 'display' 
            card.classList.add('featured-card')
        }

        const tagWrapper = document.createElement('div')
        tagWrapper.classList.add('tag-wrapper');
        tagWrapper.innerHTML = `
        <button class="tag">${el.role}</button>
        <button class="tag">${el.level}</button>
        `
        card.classList.add(el.role.toLowerCase(), el.level.toLowerCase())

        el.languages.forEach(el => {
            tagWrapper.innerHTML += `<button class="tag">${el}</button>`;
            card.classList.add(el.toLowerCase());
        })
        el.tools.forEach(el => {
            tagWrapper.innerHTML += `<button class="tag tools">${el}</button>`;
            card.classList.add(el.toLowerCase());
        })

        card.innerHTML =
        `
        <img class="company-logo" src="${el.logo}" alt="Company Logo">
        <div class="card-first-line">
        <h2 class="company-name">${el.company}</h2>
        <div class="status-btn new-btn ${displayNewBtn}">NEW !</div>
        <div class="status-btn featured-btn ${displayFeaturedBtn}">FEATURED</div> 
        </div>
        <p class="job-title">${el.position}</p>
        <p class="job-characteristics">${el.postedAt} · ${el.contract} · ${el.location}</p>
        <div class="divider"></div>
        <div class="tag-wrapper">
        ${tagWrapper.innerHTML}
        </div>
        `;
        main.append(card);

        let tags = document.querySelectorAll(".tag");
        tags.forEach(el => {   
        el.addEventListener('click', () => {
            let value = el.innerHTML;
            displaySelectedTags(value, main);
            });
        });

    });



}


function filterByTags(data, tags) {
    return data.filter(job => tags.every(tag => Object.values(job.tools).includes(tag)))
    // return data.filter(job => tags.every(tag => Object.values(job).includes(tag)))
}



function displaySelectedTags(value, main) {
    if (!selectedTags.includes(value)) {
        selectedTagsWrapper.style.display = "flex";
        selectedTags.push(value);
        selectedTagsWrapper.innerHTML += `<button class="selected-tags" onclick="deleteTag(this)">${value}</button>`
        main.innerHTML = "";
        console.log(selectedTags);
        createCards();
    }

}

function deleteTag(tag) {
    let index = selectedTags.indexOf(tag.innerHTML);
    tag.remove();
    selectedTags.splice(index, 1);
    

    if (selectedTags.length === 0) selectedTagsWrapper.style.display = "none";
}

window.onload = createCards();