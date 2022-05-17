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
        this.renderFilters()
        this.initListeners()

        RecipesController.instance = this
        RecipesController.exists = true
        return this
    }

    AddTag(el){
        this.filtersMgr.ClearInput(el)
        this.filtersMgr.closeFilter(el.dataset.indexfiltre)
        this.tagsMgr.AddTag(el)
        this.SearchRecipes()
    }

    CloseTag(el){
        this.tagsMgr.RemoveTag(el)
        this.SearchRecipes()
    }

    setFlagsTabs(tab){
        this._recipesManager.recipes.forEach((r,index) => {
            tab.push(0)
        })
    }
    
    SearchRecipes(){
        // on reset les recipes sur la base true
        this.resetDisplay(true)
        this.FiltreRecipes()
        // this.TreatMainSearchValue()
        TreatMainSearchValue(this)
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
            this._recipesManager.recipes.forEach((recip,index) => {
                recip.setDisplay((flagTabResult[index] && recip.getDisplay())?true:false)
            })
        }
    }

    // Cette fonction a été sortie de la classe afin de faciliter l'utilisation de jsbench
    // TreatMainSearchValue(){
    //     let value = this._mainSearchValue
    //     if(value.length < 3){
    //         return
    //     }
    //     /* La recherche: d'abord dans le titre, puis dans les ingredients, puis dans la description */
    //     this._recipesManager.recipes.forEach(recipe =>{
    //         if(recipe.getDisplay()){
    
    //             if(normalizeString(recipe.recipe.name).includes(value)
    //                 || this._recipesManager.IngredientInRecipe(recipe,value)
    //                 || normalizeString(recipe.recipe.description).includes(value)){
    //                 recipe.setDisplay(true)
    //             }
    //             else {
    //                 recipe.setDisplay(false)
    //             }
    //         }
    //     })
    // }

    SetDisplayAllFiltres(){
        this.ClearAllFiltresItems(false)
        this._recipesManager.recipes.forEach(recipe => {
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
    
    renderFilters(){
        this.filtersMgr.renderFilters()
    }

    ClearAllFiltresItems(flag){
        this.filtersMgr.ClearAllFiltreItems(flag)
    }

    ClearAndRenderAllFiltresItems(flag) {
        this.ClearAllFiltresItems(flag)
        this.renderFilters()
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
    }

}