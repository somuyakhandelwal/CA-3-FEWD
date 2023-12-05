const searchbar = document.getElementsByClassName('search-input')[0];
const search = document.getElementsByClassName('search-submit')[0];
const bodyofsearch = document.getElementsByClassName('horizontal-scroll-wrapper')[0];
const searchresult = document.getElementsByClassName('Search-results')[0];

document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && searchbar.value.trim() !== '') {
        click();
    }
});

const foodcard = document.getElementsByClassName('food-card')[0];

const randommealDiv = document.getElementsByClassName('Random-Meal')[0];

function getData() {
    axios.get('https://www.themealdb.com/api/json/v1/1/random.php')
        .then((res) => {
            const Foodimg = document.createElement('div');
            Foodimg.setAttribute('class', 'food-img');

            const Randomimage = document.createElement('img');
            Randomimage.setAttribute('src', res.data.meals[0].strMealThumb);
            Foodimg.append(Randomimage);

            const foodtext = document.createElement('div');
            foodtext.setAttribute('class', 'food-text');

            const title = document.createElement('h1');
            title.innerText = res.data.meals[0].strMeal;
            const line = document.createElement('hr');
            const Ingridients = document.createElement('h3');
            Ingridients.innerText = "INGREDIENTS";

            const hidden = document.createElement('div');
            hidden.setAttribute('class', 'modal');
            hidden.innerText = "Click on Image to reveal Ingridients";

            Foodimg.addEventListener('click', function () {
                list.style.display = 'block';
                hidden.style.display = 'none';
            });

            const list = document.createElement('ul');
            list.style.display = 'none';

            for (let i = 0; i < 20; i++) {
                let ingredient = res.data.meals[0]['strIngredient' + i];
                if (ingredient) {
                    let li = document.createElement('li');
                    li.append(ingredient);
                    list.append(li);
                }
            }

            foodtext.append(title);
            foodtext.append(line);
            foodtext.append(Ingridients);
            foodtext.append(hidden);
            foodtext.append(list);

            foodcard.append(Foodimg);
            foodcard.append(foodtext);
        })
        .catch(error => {
            console.error('Error fetching random meal:', error);
        });
}

getData();

search.onclick = click;

function click() {
    const searchTerm = searchbar.value.trim();
    if (searchTerm !== '') {
        document.getElementsByClassName('Search-results')[0].style.display = "block";
        axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchTerm}`)
            .then((res) => {
                console.log(res.data);
                const result = res.data.meals;
                bodyofsearch.innerHTML = '';
                if (result && result.length > 0) {
                    result.forEach((user) => {
                        const box = document.createElement('div');
                        box.setAttribute('class', 'search-food-card');

                        const imagediv = document.createElement('div');
                        imagediv.setAttribute('class', 'search-food-img');

                        const image = document.createElement('img');
                        image.setAttribute('src', user.strMealThumb);

                        const namerandom = document.createElement('h3');
                        namerandom.innerText = user.strMeal;

                        imagediv.append(image);
                        imagediv.append(namerandom);

                        box.append(imagediv);

                        bodyofsearch.append(box);
                    });
                    
                } else {
                    // Handle empty result
                    console.log('No results found.');
                    const headingSearch = document.createElement('h1')
                    headingSearch.setAttribute('class','error')
                    headingSearch.innerText="Sorry Try Searching something else 😔"

                    bodyofsearch.append(headingSearch)
                }
                setTimeout(() => {
                    searchresult.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
                }, 1000);
            })
            .catch(error => {
                // Handle axios request error
                console.error('Error fetching search results:', error);
                alert("We were unable to get your request")
            });
    }
}

let initialKeyPress = true;

document.addEventListener('keydown', function (event) {
    if ((event.key === 'S' || event.key === 's') && searchbar.value.trim() === '') {
        if (initialKeyPress) {
            setTimeout(() => {
                searchbar.focus();
                initialKeyPress = false;
            }, 10);
        } else {
            searchbar.focus();
        }
    }
});


