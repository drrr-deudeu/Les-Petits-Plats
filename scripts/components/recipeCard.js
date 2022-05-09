function recipeFactory(recipeData){
    const recipe = recipeData
    const id = recipe.id
    const ingredients = []
    const appareils = [{value:recipe.appliance,index: -1}]
    const ustensiles = []
    recipe.ustensils.forEach(ustensil => {
        ustensiles.push({value: ustensil,index: -1})
    })
    if(id === 1)console.log(ustensiles)
    let display = true
    const html = 
        `<div id="cardtop_${id}" class="col-12 col-lg-6 col-xl-4 gy-5 card_top">
            <div id="card_${id}" class="card">
                <div class="card-header"></div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-8">
                            <h5 class="card-title">${recipe.name}</h5>
                        </div>
                        <div class="col-1">
                            <img class="icon" src="assets/icons/time.svg" alt="search" />
                        </div>
                        <div class="col-3 mr-0 pr-0">
                            <div class="card-title bold">${recipe.time} min</div>
                        </div>
                    </div>
                    <div class="row recipe">
                        <div class="col-6">
                            ${renderIngredients(recipe)}
                        </div>
                        <div class="col-6">
                            <div class="card-text">
                                <p class="description">${recipe.description}</p>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>`

    function AddIngredient(ingredient){
        ingredients.push({value:ingredient,index: -1})
        return ingredient
    }
    
    function renderIngredients(recipe){
        let ingrHTMLList = ""
        recipe.ingredients.forEach(ingredient =>{
            ingrHTMLList+=
                `<div class="row">
                    <p class="ingredient">
                        <span class="ingredient__name">${AddIngredient(ingredient.ingredient)}</span>
                        <span class="quantities">${(ingredient.quantity)?":"+ingredient.quantity:""}${(ingredient.unit)?" "+ingredient.unit:""}
                        </span>
                    </p>
                </div>`
        })
        return ingrHTMLList
    }

    function recipeCard(){
        return html
    }

    function setDisplay(displayP=true){
        display = displayP
        if(display){
            document.querySelector('#cardtop_'+id).classList.remove('not_display')
            return
        }
        document.querySelector('#cardtop_'+id).classList.add('not_display')
    }
    return {id, recipe, display, ingredients, appareils, ustensiles, recipeCard, setDisplay}
}