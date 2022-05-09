
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

}

function clickItem(el) {
    const recipesManager = (new RecipesController(null)).recipesManager

    AddTag(recipesManager,el)
    let ids = el.dataset.set.split(',')
    recipesManager.resetDisplay(false)
    ids.forEach(recipeId => {
        recipesManager.recipes[recipeId-1].setDisplay(true)
        recipesManager.SetDisplayAllFiltresItems(recipesManager.recipes[recipeId-1])
    })
    recipesManager.RenderAllFiltresItems()

}