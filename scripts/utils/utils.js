function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
}

function push(tab,value){
    tab[tab.length] = value
}

function indexOf(tab,value){
    const length = tab.length
    for(let kval = 0;kval < length;kval++){
        if(tab[kval] === value)
            return kval
    }
    return -1
}

function splice(tab,index){
    const length = tab.length - 1
    for(let kval=index;kval<length;kval++){
        tab[kval] = tab[kval+1]
    }
    tab.length -= 1
}