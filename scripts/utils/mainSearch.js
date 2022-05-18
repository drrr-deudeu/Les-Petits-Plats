function TreatMainSearchValue(recipesCtrl){
    let value = recipesCtrl._mainSearchValue
    if(value.length < 3){
        return
    }
    /* La recherche: d'abord dans le titre, puis dans les ingredients, puis dans la description */
    let rlength = recipesCtrl._recipesManager.recipes.length
    let recipe
    for(let kval=0;kval<rlength;kval++){
        recipe = recipesCtrl._recipesManager.recipes[kval]
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
    }
}
