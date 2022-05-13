class RecipesController{
    constructor(recipesData){
        //singleton
        if (RecipesController.exists) {
            return RecipesController.instance
        }
        // données de base
        this.prefixs = ['ingr_','app_','ust_']

        // le manager des recettes
        this._recipesManager = RecipesManagerFactory(recipesData)

        // le manager des filtres
        this.filtersMgr = new FiltersManager(this._recipesManager.ingredientsList
            ,this._recipesManager.appareilsList,this._recipesManager.ustensilesList)

        // Le manager des tags
        this.tagsMgr = new TagsManager()

        this.DisplayRecipes()
        this.DisplayFilters()
        this.initListeners()

        RecipesController.instance = this
        RecipesController.exists = true
        return this
    }

    AddTag(el){
        this.tagsMgr.AddTag(el)
        this.SearchRecipes()
    }

    CloseTag(el){
        this.tagsMgr.RemoveTag(el)
        this.SearchRecipes()
    }

    setFlagsTabs(tab){
        this.recipesManager.recipes.forEach((r,index) => {
            tab.push(0)
        })
    }
    SearchRecipes(){
        // on reset les recipes sur la base true
        this.resetDisplay(true)
        this.FiltreRecipes()
        this.TreatMainSearchValue()
        this.SetDisplayAllFiltres()
    }

    FiltreRecipes(){
        const flagTabResult = []
        const flagTabNew = []
        this.setFlagsTabs(flagTabResult,0)
        this.setFlagsTabs(flagTabNew,0)
        let flagFirst = true

        // on filtre les recipes sur la base des tags
        // on parcourt les valeurs => la valeur de l'index dans les listes associées
        this.prefixs.forEach((prefix,indexliste) => {
            this.tagsMgr.tagByList[prefix].tagList.forEach(value_index =>{
                // les ids des recettes associées
                this.filtersMgr.lstMgr[indexliste].list[value_index].ids.forEach(id =>{
                    flagTabNew[id - 1] = 1
                    if(flagFirst){
                        flagTabResult[id - 1] = 1
                    }
                })
                flagFirst = false
                flagTabNew.forEach((v,index) =>{
                    if(!flagTabResult[index] || !v){
                        flagTabResult[index] = 0
                    }
                })
                this.filtersMgr.lstMgr[indexliste].list[value_index].ids.forEach(id =>{
                    flagTabNew[id - 1] = 0
                })
            })
        })
        // set Final des displays
        // si il y a au moins un tag:
        if(flagFirst === false){
            this.recipesManager.recipes.forEach((recip,index) => {
                recip.setDisplay((flagTabResult[index] && recip.getDisplay())?true:false)
            })
        }
        this.filtersMgr.renderFilters()
    }

    TreatMainSearchValue(){
        let value = this._mainSearchValue
        if(value.length < 3){
            return
        }
        /* La recherche: d'abord dans le titre, puis dans les ingredients, puis dans la description */
        this.recipesManager.recipes.forEach(recipe =>{
            if(recipe.getDisplay()){
    
                if(normalizeString(recipe.recipe.name).includes(value)
                    || this.recipesManager.IngredientInRecipe(recipe,value)
                    || normalizeString(recipe.recipe.description).includes(value)){
                    recipe.setDisplay(true)
                }
                else {
                    recipe.setDisplay(false)
                }
            }
        })
    }

    SetDisplayAllFiltres(){
        this.ClearAllFiltresItems(false)
        this.recipesManager.recipes.forEach(recipe => {
            if(recipe.getDisplay())
                this.SetDisplayAllFiltresItems(recipe)
        })
        this.renderFilters()
    }
    
    DisplayRecipes(){
        const divRecipe = document.querySelector("#recipes")
        this._recipesManager.recipes.forEach(recipe => this.DisplayRecipe(divRecipe,recipe.recipeCard))
    }

    DisplayRecipe(divRecipe,render) {
        divRecipe.innerHTML += render()
    }
    
    DisplayFilters() {
        this.renderFilters()
    }

    renderFilters(){
        this.filtersMgr.renderFilters()
    }

    RenderAllFiltresItems(){
        this.filtersMgr.RenderAllFiltresItems()
    }

    ClearAllFiltresItems(flag){
        this.filtersMgr.ClearAllFiltreItems(flag)
    }

    ClearAndRenderAllFiltresItems(flag) {
        this.ClearAllFiltresItems(flag)
        this.RenderAllFiltresItems()
    }

    SetDisplayAllFiltresItems(recipe){
        this.filtersMgr.SetDisplayItemsAllFiltres([recipe.ingredients,recipe.appareils,recipe.ustensiles])
    }

    resetDisplay(flag=true){
        this._recipesManager.resetRecipeCards(flag)
        this.ClearAndRenderAllFiltresItems(flag)
    }

    initListeners(){
        // set listener on mainsearch
        this._mainSearchValue = ""
        document.querySelector("#mainsearch").addEventListener('input',e => {
            this._mainSearchValue = normalizeString(e.target.value)
            this.SearchRecipes()  
        })

        this.filtersMgr._lstMgr.forEach(lm => {
            this.initFilterListeners(lm)
        })
    }

    initFilterListeners(lm){

    }

    get recipesManager(){
        return this._recipesManager
    }
    get mainSearchValue(){
        return this._mainSearchValue
    }
}

function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
}

function RecipesManagerFactory(recipesData){
    const ingredientsList = []
    const appareilsList = []
    const ustensilesList = []
    const recipes = []
    // let mainSearchValue = ""
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
                managerList.push({value:objitem.value,index:ind,ids:[recipeObjId],display: true})
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

    // console.log(ingredientsList)
    // console.log(appareilsList)
    // console.log(ustensilesList)
    return {recipes, IngredientInRecipe, ingredientsList, appareilsList, ustensilesList, resetRecipeCards}
}