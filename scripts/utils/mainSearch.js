function TreatMainSearchValue(recipesCtrl){
    let value = recipesCtrl._mainSearchValue
    if(value.length < 3){
        return
    }
    /* La recherche: d'abord dans le titre, puis dans les ingredients, puis dans la description */
    recipesCtrl._recipesManager.recipes.forEach(recipe =>{
        if(recipe.getDisplay()){

            if(normalizeString(recipe.recipe.name).includes(value)
                || recipesCtrl._recipesManager.IngredientInRecipe(recipe,value)
                || normalizeString(recipe.recipe.description).includes(value)){
                recipe.setDisplay(true)
            }
            else {
                recipe.setDisplay(false)
            }
        }
    })
}