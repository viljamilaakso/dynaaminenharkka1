document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const cocktailData = document.getElementById('cocktailData');

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm === '') {
            cocktailData.innerHTML = '<p>Please enter a cocktail name.</p>';
            return;
        }

        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`)
            .then(response => response.json())
            .then(data => {
                if (data.drinks === null) {
                    cocktailData.innerHTML = '<p>No cocktails found.</p>';
                } else {
                    const cocktail = data.drinks[0];
                    const cocktailName = cocktail.strDrink;
                    const cocktailImage = cocktail.strDrinkThumb;
                    const ingredients = [];

                    for (let i = 1; i <= 15; i++) {
                        const ingredient = cocktail[`strIngredient${i}`];
                        const measurement = cocktail[`strMeasure${i}`];

                        if (ingredient && ingredient.trim() !== '') {
                            ingredients.push(`${measurement} ${ingredient}`);
                        }
                    }

                    const instructions = cocktail.strInstructions;

                    cocktailData.innerHTML = `
                        <h2>${cocktailName}</h2>
                        <img src="${cocktailImage}" alt="${cocktailName}">
                        <h3>Ingredients:</h3>
                        <ul>
                            ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                        </ul>
                        <h3>Instructions:</h3>
                        <p>${instructions}</p>
                    `;
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    });
});
