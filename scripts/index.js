
function BuildRecipes() {
    const recipesController = new RecipesController(recipes)
    return recipesController.recipesManager
}

function initApp() {
    const recipesManager = BuildRecipes()
}

initApp()