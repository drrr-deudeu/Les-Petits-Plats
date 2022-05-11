class RecipesController{
    constructor(recipesData){
        if (RecipesController.exists) {
            return RecipesController.instance
        }
        this._recipesManager = RecipesManagerFactory(recipesData)
        RecipesController.instance = this
        RecipesController.exists = true

        this.DisplayRecipes()
        this.DisplayFilters()
        this.initFiltresListeners()
        return this
    }

    DisplayRecipes(){
        const divRecipe = document.querySelector("#recipes")
        this._recipesManager.recipes.forEach(recipe => this.DisplayRecipe(divRecipe,recipe.recipeCard))
    }

    DisplayRecipe(divRecipe,render) {
        divRecipe.innerHTML += render()
    }
    
    DisplayFilters() {
        this._recipesManager.renderFilters()
    }

    get recipesManager(){
        return this._recipesManager
    }


    initFiltresListeners(){
        this._recipesManager.filtersMgr._lstMgr.forEach(lm => {
            this.initFilterListeners(lm)
        })
    }

    initFilterListeners(lm){

    }

}

function RecipesManagerFactory(recipesData){
    const ingredientsList = []
    const appareilsList = []
    const ustensilesList = []
    const recipes = []
    let mainSearchValue = ""
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

    // le manager des filtres
    const filtersMgr = new FiltersManager(ingredientsList,appareilsList,ustensilesList)
    
    
    // set listener on mainsearch
    document.querySelector("#mainsearch").addEventListener('input',TreatValue)


    function renderFilters(){
        filtersMgr.renderFilters()
    }

    function TreatValue(event){
        TreatMainSearchValue(normalizeString(event.target.value))    
    }

    function RenderAllFiltresItems(){
        filtersMgr.RenderAllFiltresItems()
    }

    function ClearAllFiltresItems(flag){
        filtersMgr.ClearAllFiltreItems(flag)
    }

    function ClearAndRenderAllFiltresItems(flag) {
        ClearAllFiltresItems(flag)
        RenderAllFiltresItems()
    }

    function resetRecipeCards(flag){
        recipes.forEach(recipe =>{
            recipe.setDisplay(flag)
        })
    }

    function resetDisplay(flag=true){
        resetRecipeCards(flag)
        ClearAndRenderAllFiltresItems(flag)
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
                managerList.push({value:objitem.value,index:ind,ids:[recipeObjId],display: true})
                objitem.index = ind
            }
        })
    }

    function TreatMainSearchValue(value){
        // Si la valeur n'a pas changé , les mêmes recettes doivent être rendues
        if(value === mainSearchValue)
            return

        // si la recherche est moins longue que celle stockée, alors il faut recommencer toute la recherche
        if(value.length < mainSearchValue.length){
            resetDisplay()
        }
        // sinon la longeur est soit identique , soit supérieure
        else{
            if(value.length === mainSearchValue.length){
                // longueur identique, mais valeur forcément différente, cf. le premier test de la fonction
                resetDisplay()
            }
            else{
                // longueur supérieure, mais le début est peut-être différent
                if(value.slice(0,mainSearchValue.length) !== mainSearchValue){
                    resetDisplay()
                }
            }
        }

        mainSearchValue = value
        if(value.length < 3){
            resetDisplay()
            return
        }

        /* Clear des filtres */
        ClearAllFiltresItems(false)

        /* La recherche: d'abord dans le titre, puis dans les ingredients, puis dans la description */
        recipes.forEach(recipe =>{
            if(recipe.display){
                if(normalizeString(recipe.recipe.name).includes(value)
                    || IngredientInRecipe(recipe,value)
                    || normalizeString(recipe.recipe.description).includes(value)){
                    recipe.setDisplay(true)
                    SetDisplayAllFiltresItems(recipe) 
                }
                else recipe.setDisplay(false)
            }
        })
        RenderAllFiltresItems()
    }

    function SetDisplayAllFiltresItems(recipe){
        filtersMgr.SetDisplayItemsAllFiltres([recipe.ingredients,recipe.appareils,recipe.ustensiles])
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

    function normalizeString(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
    }

    // function IdsFusion(idsTarget,newIds) {
    //     newIds.forEach(id => {
    //         if(idsTarget.filter(idT => idT === id).length === 0){
    //             idsTarget.push(id)
    //         }
    //     })
    // }

    // function SearchInList(list,value) {
    //     const ids = []
    //     list.forEach(item => {
    //         if(normalizeString(item.value).includes(value)){
    //             IdsFusion(ids,item.ids)
    //         }
    //     })
    //     return ids
    // }
   

    console.log(ingredientsList)
    console.log(appareilsList)
    console.log(ustensilesList)
    return {recipes, filtersMgr,renderFilters, ingredientsList, appareilsList, ustensilesList, TreatMainSearchValue, resetDisplay, resetRecipeCards, RenderAllFiltresItems, SetDisplayAllFiltresItems}
}