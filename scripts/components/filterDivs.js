class ListFilterManager {
    constructor(list,prefix,name,style){
        this._list = list
        this._prefix = prefix
        this._name = name
        this._elOpen = document.querySelector(this._name+'-button-open')
        this._elClose = document.querySelector(this._name+'-button-close')
        this._elInput = document.getElementById(this._name+'-input')
        this._open = false
        this._n_elDisplay = 0
        this._n_col = 0
        this._html = ""
        this._style = style

    }

    calc_n_col(nel){
        console.log(nel)
        if(nel < 15){
            return 1
        }
        if(nel < 30){
            return 2
        }
        return 3
    }

    _nbdisplay()
    {
        let nb_disp = this._list.filter(elt => elt.display === true).length
        console.log("display:"+nb_disp)
        return nb_disp
    }

    renderFilter(){
        const n_disp = this._nbdisplay()
        let n_col = 0
        if(this._n_elDisplay !== n_disp) {
            this._n_elDisplay = n_disp
            n_col = this.calc_n_col(this._n_elDisplay)
            if(n_col !== this._n_col){
                this._n_col = n_col
                this._renderList()
                return
            }
        }
        this._RenderDisplayItems()
    }

    _RenderDisplayItems(){
        this._list.forEach((item,index) => this._RenderDisplayItem(item,index))
    }

    _RenderDisplayItem(item,index) {
        const el = document.getElementById(this._prefix+index)
        switch(item.display){
            case false:
                el.classList.add('d-none')
                break;
            case true:
                el.classList.remove('d-none')
                break;
        }
    }
  
    _ClearList(flag) {
        this._list.forEach(item => {
            item.display = flag
        })
    }

    _renderList() {
        const filterName = '#filtre-'+this._name+'s'
        console.log(filterName+" nbcol:"+this._n_col)
        this._list.forEach((item,index) => {
            if(index === 0){
                document.querySelector(filterName).innerHTML = ""    
            }
            let ncol_item = 0
            switch(this._n_col){
                case 1:
                    ncol_item = 12
                    break
                case 2:
                    ncol_item = 6
                    break
                case 3:
                    ncol_item = 4
                    break
            }
            document.querySelector(filterName).innerHTML += `<button class="btn col-${ncol_item} ${this._style} 
                text-white item ${this._prefix}item ${(item.display === false)?'d-none':''}" id="${this._prefix}${index}" 
                data-set="${this._list[index].ids}" data-name="${item.value}" data-index=${index} data-prefix="${this._prefix}" onclick="clickItem(this)">
                ${item.value}</button>`
        })
    }

    _SetDisplayItemsFiltre(listRecipe,flag=true) {
        listRecipe.forEach(elt => {
            this._list[elt.index].display = flag
        })
    }

    get elOpen(){
        return this._elOpen
    }
    get elClose(){
        return this._elClose
    }

    get list(){
        return this._list
    }

}

class FiltersManager {
    constructor(ingredients,appareils,ustensiles) {
        this._lstMgr = [new ListFilterManager(ingredients,'ingr_','ingredient','btn-primary'),
                        new ListFilterManager(appareils,'app_','appareil','btn-success'),
                        new ListFilterManager(ustensiles,'ust_','ustensile','btn-danger')]
    }

    get lstMgr(){
        return this._lstMgr
    }

    renderFilters(){
        this._lstMgr.forEach(lm => {
            lm.renderFilter()
        })
    }
    RenderAllFiltresItems(){
        this._lstMgr.forEach(lm => {
            lm._RenderDisplayItems()
        })
    }
    ClearAllFiltreItems(flag){
        this._lstMgr.forEach(lm => {
            lm._ClearList(flag)
        })
    }
    
    SetDisplayItemsAllFiltres(listesRecipe,flag=true){
        this._lstMgr.forEach((lm,index) => {
            lm._SetDisplayItemsFiltre(listesRecipe[index],flag)
        })
    }
}


function openFilterDivs(id,close_column_size,open_column_size){
    const div = document.getElementById(id.toLowerCase()+'-div')
    div.classList.remove('col-'+close_column_size)
    div.classList.add('col-'+open_column_size)
    document.getElementById(id.toLowerCase()+"s-input").classList.remove("not_display")
    document.getElementById(id.toLowerCase()+"s-fields").classList.remove("not_display")
    document.getElementById(id.toLowerCase()+"s-button").classList.add("not_display")
}

function closeFilterDivs(id,close_column_size,open_column_size){
    const div = document.getElementById(id.toLowerCase()+'-div')
    div.classList.remove('col-'+open_column_size)
    div.classList.add('col-'+close_column_size)

    document.getElementById(id.toLowerCase()+"s-fields").classList.add("not_display")
    document.getElementById(id.toLowerCase()+"s-input").classList.add("not_display")
    document.getElementById(id.toLowerCase()+"s-button").classList.remove("not_display")
}

function AddTag(recipesManager, el) {
    let list, tag_list, color

    switch(el.dataset.prefix){
        case 'ingr_':
            list = recipesManager.ingredientsList
            tag_list = 'ingredient-tags'
            color = 'primary'
            break;
        case 'app_':
            list = recipesManager.appareilsList
            tag_list = 'appareil-tags'
            color = 'success'
            break;
        case 'ust_':
            list = recipesManager.ustensilesList
            tag_list = 'ustensile-tags'
            color = 'danger'
            break;
    }

    el_tags = document.getElementById(tag_list)
    if(el_tags.innerHTML === null) {
        el_tags.innerHTML = ""
    }
    el_tags.innerHTML += `<div class="col bg-${color} m-2 tag_filtre py-2" id="tag_${el.dataset.prefix}_${el.dataset.index}" data-prefix="${el.dataset.prefix}" data-index="${el.dataset.index}">
                        <div class="row tag_contain">
                            <div class="col-8 tag_name"><span>${el.dataset.name}</span></div>
                            <button class="col-2 btn btn-${color} tag_button" data-id="tag_${el.dataset.prefix}_${el.dataset.index}" onclick="closeTag(this)"><img src="assets/icons/close_tag.svg"></button>
                        </div>
                        </div>`
}

function closeTag(el) {
    document.getElementById(el.dataset.id).remove()
    const recipesManager = (new RecipesController(null)).recipesManager
    recipesManager.resetDisplay(true)
}

function clickItem(el) {
    const recipesManager = (new RecipesController(null)).recipesManager

    AddTag(recipesManager,el)
    let ids = el.dataset.set.split(',')
    recipesManager.resetRecipeCards(false)
    ids.forEach(recipeId => {
        recipesManager.recipes[recipeId-1].setDisplay(true)
        recipesManager.SetDisplayAllFiltresItems(recipesManager.recipes[recipeId-1])
    })
    recipesManager.RenderAllFiltresItems()

}