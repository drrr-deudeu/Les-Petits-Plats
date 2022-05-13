class TagsByList {
    constructor(prefix,elName,color){
        this.tagList = []
        this.elName = elName
        this.elList = document.getElementById(elName)
        this.prefix = prefix
        this.color = color
        return this
    }

    AddTag(el) {
        if(this.tagList.indexOf(el.dataset.index)===-1){
            this.tagList.push(el.dataset.index)
            this.render(el)
        }
    }

    RemoveTag(el) {  
        this.tagList.splice(this.tagList.indexOf(el.dataset.index),1)
        document.getElementById(el.dataset.id).remove()
    }

    render(el) {
        if(this.elList.innerHTML === null) {
            this.elList.innerHTML = ""
        }
        this.elList.innerHTML += `<div class="col bg-${this.color} m-2 tag_filtre py-2" id="tag_${el.dataset.prefix}${el.dataset.index}" data-prefix="${el.dataset.prefix}" data-index="${el.dataset.index}">
                            <div class="row tag_contain">
                                <div class="col-8 tag_name"><span>${el.dataset.name}</span></div>
                                <button class="col-2 btn btn-${this.color} tag_button" data-id="tag_${el.dataset.prefix}${el.dataset.index}" data-prefix="${el.dataset.prefix}" data-index="${el.dataset.index}" onclick="closeTag(this)"><img src="assets/icons/close_tag.svg"></button>
                            </div>
                            </div>`
    }

}

class TagsManager {
    constructor(){
        this.tagByList = {'ingr_':new TagsByList('ingr_','ingredient-tags','primary'),
                            'app_':new TagsByList('app_','appareil-tags','success'),
                            'ust_':new TagsByList('ust_','ustensile-tags','danger')}
        return this
    }

    AddTag(el){

        this.tagByList[el.dataset.prefix].AddTag(el)
    }

    RemoveTag(el){
        this.tagByList[el.dataset.prefix].RemoveTag(el)
    }
}