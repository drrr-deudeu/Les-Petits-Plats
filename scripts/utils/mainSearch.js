function TreatMainSearchValue(recipesCtrl){
    let value = recipesCtrl._mainSearchValue
    if(value.length < 3){
        return
    }
    /* La recherche: d'abord dans le titre, puis dans les ingredients, puis dans la description */
    const rlength = recipesCtrl._recipesManager.recipes.length
//    let recipe
    for(let kval=0;kval<rlength;kval++){
        recipe = recipesCtrl._recipesManager.recipes[kval]
        if(recipesCtrl._recipesManager.recipes[kval].getDisplay()){

            if(normalizeString(recipesCtrl._recipesManager.recipes[kval].recipe.name).includes(value)
                || recipesCtrl._recipesManager.IngredientInRecipe(recipesCtrl._recipesManager.recipes[kval],value)
                || normalizeString(recipesCtrl._recipesManager.recipes[kval].recipe.description).includes(value)){
                    recipesCtrl._recipesManager.recipes[kval].setDisplay(true)
            }
            else {
                recipesCtrl._recipesManager.recipes[kval].setDisplay(false)
            }
        }
    }
}
