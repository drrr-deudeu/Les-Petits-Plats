class ListFilterManager {
    constructor(list,prefix,name,style,indexFiltre){
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
        this._indexFiltre = indexFiltre
        this.inputListener()
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
        let nb_disp = 0
        const length = this._list.length
        for(let kval = 0;kval < length;kval++){
            if(this._list[kval].display === true && this._list[kval].displayInSearch === true)
                nb_disp++
        }
        return nb_disp
    }

    renderFilter(){
        if(this._open === false)
            return
        const n_disp = this._nbdisplay()
        let n_col = 0
        if(this._n_elDisplay !== n_disp) {
            this._n_elDisplay = n_disp
            n_col = this.calc_n_col(this._n_elDisplay)
            if(n_col !== this._n_col){
                this._n_col = n_col
                this.renderColsList()
            }
            this._renderList()
            return
        }
    }

    renderColsList(){
        const div = document.getElementById(this._name+'-div')
        if(this._open)
            div.setAttribute('class',`mt-2 pb-0 me-1 col-${this.ncol_div_open()}`)    
    }

    // _RenderDisplayItem(item,index) {
    //     const el = document.getElementById(this._prefix+index)
    //     switch(item.display){
    //         case false:
    //             el.classList.add('d-none')
    //             break;
    //         case true:
    //             el.classList.remove('d-none')
    //             break;
    //     }
    // }
  
    _ClearList(flag) {
        let length = this._list.length
        for(let kval=0;kval<length;kval++){        
            this._list[kval].display = flag
        }
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
        let length = this._list.length
        for(let index= 0;index<length;index++){
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
                text-white item ${this._prefix}item ${(this._list[index].display === false || this._list[index].displayInSearch === false)?'d-none':''}" id="${this._prefix}${index}" 
                data-set="${this._list[index].ids}" data-indexfiltre="${this._indexFiltre}" data-name="${this._list[index].value}" data-index=${index} data-prefix="${this._prefix}" onclick="clickItem(this)">
                ${this._list[index].value}</button>`
        }
    }

    _SetDisplayItemsFiltre(listRecipe,flag=true) {
        let length = listRecipe.length 
        for(let kval = 0;kval<length;kval++){
            this._list[listRecipe[kval].index].display = flag
        }
    }

    get list(){
        return this._list
    }

    get open(){
        return this._open
    }

    setOpen(flag){
        this._open = flag
    }

    openFiltre() {
        this.setOpen(true)
        this.renderFilter()
    }

    inputListener() {            
        this._elInput.addEventListener('input',e => {
            const searchValue = normalizeString(e.target.value)
            let length = this._list.length
 
            for(let index = 0;index<length;index++){               
                if(this._list[index].display === true){
                    if(normalizeString(this._list[index].value).includes(searchValue)){
                        if(this._list[index].displayInSearch === false){
                            this._list[index].displayInSearch = true
                            document.getElementById(this._prefix+index).classList.remove('d-none')        
                        }
                    }
                    else {
                        if(this._list[index].displayInSearch){
                            this._list[index].displayInSearch = false
                            document.getElementById(this._prefix+index).classList.add('d-none')
                        }
                    }

                }
            }
            this.renderFilter()
        })       
    }

    clearInput(el) {
        this._elInput.value = ''
        let length = this._list.length

        for(let kval = 0;kval < length; kval++){
            this._list[kval].displayInSearch = true
        }
    }
}

class FiltersManager {
    constructor(ingredients,appareils,ustensiles) {
        this._lstMgr = [new ListFilterManager(ingredients,'ingr_','ingredient','btn-primary',0),
                        new ListFilterManager(appareils,'app_','appareil','btn-success',1),
                        new ListFilterManager(ustensiles,'ust_','ustensile','btn-danger',2)]
        this.FiltersListeners()
        return this           
    }

    get lstMgr(){
        return this._lstMgr
    }

    renderFilters(){
        let length = this._lstMgr.length
        for(let kval = 0;kval<length;kval++){
            this._lstMgr[kval].renderFilter()
        }
    }

    ClearAllFiltreItems(flag){
        let length = this._lstMgr.length
        for(let kval = 0;kval<length;kval++){
            this._lstMgr[kval]._ClearList(flag)
        }
    }
    
    SetDisplayItemsAllFiltres(listesRecipe,flag=true){
        let length = this._lstMgr.length
        for(let index = 0;index<length;index++){
            this._lstMgr[index]._SetDisplayItemsFiltre(listesRecipe[index],flag)
        }
    }

    closeFilter(indexFiltre) {
        if(this._lstMgr[indexFiltre].open) {
            this._lstMgr[indexFiltre].setOpen(false)
            const div = document.getElementById(this._lstMgr[indexFiltre]._name+'-div')
            div.setAttribute('class','mt-2 pb-0 me-1 col-2')
            document.getElementById(this._lstMgr[indexFiltre]._name+"s-fields").classList.add("not_display")
            document.getElementById(this._lstMgr[indexFiltre]._name+"s-input").classList.add("not_display")
            document.getElementById(this._lstMgr[indexFiltre]._name+"s-button").classList.remove("not_display")
        }
    }

    closeOtherFiltres(indexFiltre) {
        let length = this._lstMgr.length
        for(let index = 0;index<length;index++){
            if(index !== indexFiltre){
                this.closeFilter(index) 
            }
        }
    }

    openFilter(indexFiltre){
        this.closeOtherFiltres(indexFiltre)
        const div = document.getElementById(this._lstMgr[indexFiltre]._name+'-div')
        this._lstMgr[indexFiltre].openFiltre()
        div.setAttribute('class',`mt-2 pb-0 me-1 col-${this._lstMgr[indexFiltre].ncol_div_open()}`)
        document.getElementById(this._lstMgr[indexFiltre]._name+"s-input").classList.remove("not_display")
        document.getElementById(this._lstMgr[indexFiltre]._name+"s-fields").classList.remove("not_display")
        document.getElementById(this._lstMgr[indexFiltre]._name+"s-button").classList.add("not_display")
    }
    
    FiltersListeners(){
        let length = this._lstMgr.length

        for(let indexFiltre = 0;indexFiltre<length;indexFiltre++){
            document.getElementById(this._lstMgr[indexFiltre]._name + "-button-open").addEventListener('click',e => this.openFilter(indexFiltre))
        }
        for(let indexFiltre = 0;indexFiltre<length;indexFiltre++){
            document.getElementById(this._lstMgr[indexFiltre]._name + "-button-close").addEventListener('click',e => this.closeFilter(indexFiltre))
        }
    }

    ClearInput(el) {
        this._lstMgr[el.dataset.indexfiltre].clearInput(el)
    }
}

function closeTag(el) {
    const recipesCtrl = (new RecipesController(null))
    recipesCtrl.CloseTag(el)
}

function clickItem(el) {
    const recipesCtrl = (new RecipesController(null))
    recipesCtrl.AddTag(el)
}