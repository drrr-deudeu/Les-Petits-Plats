
function DisplayRecipe(render) {
    divRecipe = document.querySelector("#recipes")
    divRecipe.innerHTML += render()
}
 
function DisplayRecipes(recipesManager) {
    recipesManager.recipes.forEach(recipe => DisplayRecipe(recipe.recipeCard))
}

function DisplayFilters(recipesManager) {
    recipesManager.renderFilters()
}

function BuildRecipes() {
    const recipesController = new RecipesController(recipes)
    return recipesController.recipesManager
    // return RecipesManagerFactory(recipes)
}

function initApp() {
    const recipesManager = BuildRecipes()
    DisplayRecipes(recipesManager)
    DisplayFilters(recipesManager)
}

initApp()