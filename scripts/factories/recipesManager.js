function RecipesManagerFactory(recipesData){
    const ingredientsList = []
    const appareilsList = []
    const ustensilesList = []
    const recipes = []
    let ind

    let length = recipesData.length
    for (let kval = 0;kval < length;kval++){
        let recipeObj = recipeFactory(recipesData[kval])
        recipes.push(recipeObj)

        // Ajout ou mise à jour de la liste generale des ingredients
        UpdateList(recipeObj.ingredients,recipeObj.id,ingredientsList)
        
        // Ajout ou mise à jour de la liste generale des appareils
        UpdateList(recipeObj.appareils,recipeObj.id,appareilsList)

        // Ajout ou mise à jour de la liste generale des ustensiles
        UpdateList(recipeObj.ustensiles,recipeObj.id,ustensilesList)

    }

    function resetRecipeCards(flag){
        let length = recipes.length
        for(kval = 0;kval<length;kval++){
            recipes[kval].setDisplay(flag)
        }
    }

    function UpdateList(recipeObjList,recipeObjId,managerList) {
        let mlength
        let olength = recipeObjList.length
        for(let dval = 0;dval< olength;dval++){
            let ingr = []
            mlength = managerList.length
            for(let kval = 0;kval < mlength;kval++){
                if(normalizeString(managerList[kval].value) === normalizeString(recipeObjList[dval].value)){
                    ingr.push(managerList[kval])
                    break
                }
            }
            if(ingr && ingr.length){
                ingr[0].ids.push(recipeObjId)
                recipeObjList[dval].index = ingr[0].index
            }
            else {
                ind = managerList.length
                managerList.push({value:recipeObjList[dval].value,index:ind,ids:[recipeObjId],display: true, displayInSearch: true})
                recipeObjList[dval].index = ind
            }
        }
    }

    function SearchInRecipeList(list,value){
        let ret = false
        let length = list.length
        for(let kval = 0;kval < length; kval++){
            if(normalizeString(list[kval].value).includes(value)){
                ret = true
            }
        }
        return ret
    }

    function IngredientInRecipe(recipe,value){
        return SearchInRecipeList(recipe.ingredients,value)
    }

    function recipesDisplayedCount() {
        let count = 0
        const rlength = recipes.length
        for(let kval = 0; kval < rlength; kval++)
            if(recipes[kval].getDisplay() === true)
                count++
        return count
    }

    // console.log(ingredientsList)
    // console.log(appareilsList)
    // console.log(ustensilesList)
    return {recipes, IngredientInRecipe, ingredientsList, appareilsList, ustensilesList, resetRecipeCards, recipesDisplayedCount}
}