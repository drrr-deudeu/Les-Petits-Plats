function recipeFactory(recipeData){
    const recipe = recipeData
    const id = recipe.id
    const ingredients = []
    const appareils = [{value:recipe.appliance,index: -1}]
    const ustensiles = []
    let length = recipe.ustensils.length
    for(let kval=0;kval<length;kval++){
        push(ustensiles,{value: recipe.ustensils[kval],index: -1})
    }
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
        push(ingredients,{value:ingredient,index: -1})
        return ingredient
    }
    
    function renderIngredients(recipe){
        let ingrHTMLList = ""
        let length = recipe.ingredients.length
        for(let kval = 0;kval<length;kval++){
            ingrHTMLList+=
                `<div class="row">
                    <p class="ingredient">
                        <span class="ingredient__name">${AddIngredient(recipe.ingredients[kval].ingredient)}</span>
                        <span class="quantities">${(recipe.ingredients[kval].quantity)?":"+recipe.ingredients[kval].quantity:""}${(recipe.ingredients[kval].unit)?" "+recipe.ingredients[kval].unit:""}
                        </span>
                    </p>
                </div>`
        }
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

    function getDisplay(){
        return display
    }

    return {id, recipe, getDisplay, ingredients, appareils, ustensiles, recipeCard, setDisplay}
}