class RecipesController{
    constructor(recipesData){
        if (RecipesController.exists) {
            return RecipesController.instance
        }
        this._recipesManager = RecipesManagerFactory(recipesData)
        RecipesController.instance = this
        RecipesController.exists = true
        return this
    }

    get recipesManager(){
        return this._recipesManager
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

    // set listener on mainsearch
    document.querySelector("#mainsearch").addEventListener('input',TreatValue)

    function TreatValue(event){
        TreatMainSearchValue(normalizeString(event.target.value))    
    }

    function RenderAllFiltresItems(){
        RenderDisplayFiltreItems(ingredientsList,'ingr_')
        RenderDisplayFiltreItems(appareilsList,'app_')
        RenderDisplayFiltreItems(ustensilesList,'ust_')
    }

    function ClearAllFiltresItems(flag){
        ClearList(ingredientsList,flag)
        ClearList(appareilsList,flag)
        ClearList(ustensilesList,flag)
    }
    function ClearAndRenderAllFiltresItems(flag) {
        ClearAllFiltresItems(flag)
        RenderAllFiltresItems()
    }

    function resetDisplay(flag=true){
        recipes.forEach(recipe =>{
            recipe.setDisplay(flag)
        })
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
        SetDisplayItemsFiltre(ingredientsList,recipe.ingredients)
        SetDisplayItemsFiltre(appareilsList,recipe.appareils)
        SetDisplayItemsFiltre(ustensilesList,recipe.ustensiles)
    }

    function ClearList(filtresList,flag) {
        filtresList.forEach(item => {
            item.display = flag
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

    function RenderDisplayFiltreItems(filtresList,prefixIDFiltre) {
        filtresList.forEach((item,index) => {
            el = document.getElementById(prefixIDFiltre+index)
            switch(item.display){
                case false:
//                    el.classList.add('not_display')
                    el.classList.add('d-none')
                    break;
                case true:
//                    el.classList.remove('not_display')
                    el.classList.remove('d-none')
                    break;
            }
        })
    }

    function SetDisplayItemsFiltre(filtresList,filtreListRecipe){
        filtreListRecipe.forEach(item => {
            filtresList[item.index].display = true
        })
    }

    function IngredientInRecipe(recipe,value){
        return SearchInRecipeList(recipe.ingredients,value)
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

    function normalizeString(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
    }

    function renderFilter(taille_colonne,filterName,filterList,prefixID, style) {        
        filterList.forEach((item,index) => {
            if(index === 0){
                document.querySelector(filterName).innerHTML = ""    
            }
            document.querySelector(filterName).innerHTML += `<button class="btn col-${taille_colonne} ${style} 
                text-white item ${prefixID}item" id="${prefixID}${index}" 
                data-set="${filterList[index].ids}" data-name="${item.value}" data-index=${index} data-prefix="${prefixID}" onclick="clickItem(this)">
                ${item.value}</button>`
        })
    }

    function renderFilters(){
        renderFilter(4,'#filtre-ingredients',ingredientsList,'ingr_','btn-primary')
        renderFilter(12,'#filtre-appareils',appareilsList,'app_','btn-success')
        renderFilter(6,'#filtre-ustensiles',ustensilesList,'ust_','btn-danger')

    }

    console.log(ingredientsList)
    console.log(appareilsList)
    console.log(ustensilesList)
    return {recipes, renderFilters, ingredientsList, appareilsList, ustensilesList, TreatMainSearchValue, resetDisplay, RenderAllFiltresItems, SetDisplayAllFiltresItems}
}