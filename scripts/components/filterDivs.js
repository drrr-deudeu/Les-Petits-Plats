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
        return this
    }

    calc_n_col(nel){
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

    ncol_div_open() {            
        let ncol_open = 0
        switch(this._n_col){
            case 1:
                ncol_open = 2
                break
            case 2:
                ncol_open = 4
                break
            case 3:
                ncol_open = 6
                break
        }
        return ncol_open
    }

    _renderList() {
        const filterName = '#filtre-'+this._name+'s'
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
        return this            
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


function openFilterDivs(id,close_column_size,open_column_size,prefix,indexFiltre){
    const recipesCtrl = (new RecipesController(null))
    const div = document.getElementById(id.toLowerCase()+'-div')
    // div.setAttribute('class',`mt-2 pb-0 me-1 col-${open_column_size}`)
    div.setAttribute('class',`mt-2 pb-0 me-1 col-${recipesCtrl.filtersMgr.lstMgr[indexFiltre].ncol_div_open()}`)
    document.getElementById(id.toLowerCase()+"s-input").classList.remove("not_display")
    document.getElementById(id.toLowerCase()+"s-fields").classList.remove("not_display")
    document.getElementById(id.toLowerCase()+"s-button").classList.add("not_display")
}

function closeFilterDivs(id,close_column_size,open_column_size,prefix,indexFiltre){
    const div = document.getElementById(id.toLowerCase()+'-div')
    div.setAttribute('class','mt-2 pb-0 me-1 col-2')
    document.getElementById(id.toLowerCase()+"s-fields").classList.add("not_display")
    document.getElementById(id.toLowerCase()+"s-input").classList.add("not_display")
    document.getElementById(id.toLowerCase()+"s-button").classList.remove("not_display")
}


function closeTag(el) {
    const recipesCtrl = (new RecipesController(null))
    recipesCtrl.CloseTag(el)
    // recipesCtrl.tagsMgr.RemoveTag(el)
    // recipesCtrl.resetDisplay(true)
}

function clickItem(el) {
    const recipesCtrl = (new RecipesController(null))

    recipesCtrl.AddTag(el)
//    recipesCtrl.RenderAllFiltresItems()

}