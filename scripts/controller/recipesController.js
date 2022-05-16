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
        this.tagsMgr.AddTag(el)
        this.SearchRecipes()
    }

    CloseTag(el){
        this.tagsMgr.RemoveTag(el)
        this.SearchRecipes()
    }

    setFlagsTabs(tab){
        let length = this._recipesManager.recipes.length
        for(let index=0;index<length;index++){
            tab.push(0)
        }
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
        let value_index
        // on filtre les recipes sur la base des tags
        // on parcourt les valeurs => la valeur de l'index dans les listes associées
        let plength = this.prefixs.length
        for(let indexliste=0;indexliste<plength;indexliste++){
            let tlength = this.tagsMgr.tagByList[this.prefixs[indexliste]].tagList.length
            for(let dval=0;dval<tlength;dval++){
                value_index = this.tagsMgr.tagByList[this.prefixs[indexliste]].tagList[dval]
                // les ids des recettes associées
                let ilength = this.filtersMgr.lstMgr[indexliste].list[value_index].ids.length
                for(let kval=0;kval<ilength;kval++){
                    flagTabNew[this.filtersMgr.lstMgr[indexliste].list[value_index].ids[kval] - 1] = 1
                    if(flagFirst){
                        flagTabResult[this.filtersMgr.lstMgr[indexliste].list[value_index].ids[kval] - 1] = 1
                    }
                }
                flagFirst = false
                let jlength = flagTabNew.length
                for(let index=0;index<jlength;index++){
                    if(!flagTabResult[index] || !flagTabNew[index]){
                        flagTabResult[index] = 0
                    }
                }
                let klength = this.filtersMgr.lstMgr[indexliste].list[value_index].ids.length
                for(let kval=0;kval<klength;kval++){
                    flagTabNew[this.filtersMgr.lstMgr[indexliste].list[value_index].ids[kval] - 1] = 0
                }
            }
        }
        // set Final des displays
        // si il y a au moins un tag:
        if(flagFirst === false){
            let rlength = this._recipesManager.recipes.length
            for(let index=0;index<rlength;index++){
                this._recipesManager.recipes[index].setDisplay((flagTabResult[index] && this._recipesManager.recipes[index].getDisplay())?true:false)
            }
        }
    }

    TreatMainSearchValue(){
        let value = this._mainSearchValue
        if(value.length < 3){
            return
        }
        /* La recherche: d'abord dans le titre, puis dans les ingredients, puis dans la description */
        let rlength = this._recipesManager.recipes.length
        let recipe
        for(let kval=0;kval<rlength;kval++){
            recipe = this._recipesManager.recipes[kval]
            if(recipe.getDisplay()){
    
                if(normalizeString(recipe.recipe.name).includes(value)
                    || this._recipesManager.IngredientInRecipe(recipe,value)
                    || normalizeString(recipe.recipe.description).includes(value)){
                    recipe.setDisplay(true)
                }
                else {
                    recipe.setDisplay(false)
                }
            }
        }
    }

    SetDisplayAllFiltres(){
        this.ClearAllFiltresItems(false)
        let rlength = this._recipesManager.recipes.length
        let recipe
        for(let kval=0;kval<rlength;kval++){
            recipe = this._recipesManager.recipes[kval]
            if(recipe.getDisplay())
                this.SetDisplayAllFiltresItems(recipe)
        }
        this.renderFilters()
    }
    
    DisplayRecipes(){
        const divRecipe = document.querySelector("#recipes")
        let rlength = this._recipesManager.recipes.length
        for(let kval=0;kval<rlength;kval++){
            this.DisplayRecipe(divRecipe,this._recipesManager.recipes[kval].recipeCard)
        }
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