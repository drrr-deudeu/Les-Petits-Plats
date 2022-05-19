function RecipesManagerFactory(recipesData){
    const ingredientsList = []
    const appareilsList = []
    const ustensilesList = []
    const recipes = []
    let ind

    recipesData.forEach(recipe => {
        let recipeObj = recipeFactory(recipe)
        recipes.push(recipeObj)

        // Ajout ou mise à jour de la liste generale des ingredients
        UpdateList(recipeObj.ingredients,recipeObj.id,ingredientsList)
        
        // Ajout ou mise à jour de la liste generale des appareils
        UpdateList(recipeObj.appareils,recipeObj.id,appareilsList)

        // Ajout ou mise à jour de la liste generale des ustensiles
        UpdateList(recipeObj.ustensiles,recipeObj.id,ustensilesList)

    })

    function resetRecipeCards(flag){
        recipes.forEach(recipe =>{
            recipe.setDisplay(flag)
        })
    }

    function UpdateList(recipeObjList,recipeObjId,managerList) {
        recipeObjList.forEach(objitem => {
            let ingr = managerList
                .filter(item => normalizeString(item.value) === normalizeString(objitem.value))
            if(ingr && ingr.length){
                ingr[0].ids.push(recipeObjId)
                objitem.index = ingr[0].index
            }
            else {
                ind = managerList.length
                managerList.push({value:objitem.value,index:ind,ids:[recipeObjId],display: true, displayInSearch: true})
                objitem.index = ind
            }
        })
    }

    function SearchInRecipeList(list,value){
        let ret = false

        list.forEach(item => {
            if(normalizeString(item.value).includes(value)){
                ret = true
            }
        })
        return ret
    }

    function IngredientInRecipe(recipe,value){
        return SearchInRecipeList(recipe.ingredients,value)
    }

    function recipesDisplayedCount() {
        return recipes.filter(recipe => recipe.getDisplay() === true).length
    }

    // console.log(ingredientsList)
    // console.log(appareilsList)
    // console.log(ustensilesList)
    return {recipes, IngredientInRecipe, ingredientsList, appareilsList, ustensilesList, resetRecipeCards, recipesDisplayedCount}
}