
/**---------------------------------------------------------OBTENER TOTALES -------------------------------------*/
//Genera listado de columnas filtrando por una determinada columna, por ejemplo CANTIDAD, CUD, VARONES
function obtenerListadoPorColumna(data, nombreColumna) {
    var properties = getPropertyNames(data, `${nombreColumna}`)
    //console.log(propertiesCantidad)
    const newArray = []
    properties.forEach(item => {
        //console.log(item)
        let suma = 0
        let obj = {}
        data.forEach(object => {
            //console.log(obj)                
            for (const key in object) {
                if (key == item) {
                    suma += object[item]
                }
            }
        })
        obj.name = item.replace(nombreColumna, '')
        obj.total = suma
        newArray.push(obj)
    })
    return newArray
}

//Genera listado teniendo en cuenta solo el grado, por lo que le quita el turno A, B
function obtenerListadoPorGrado(data) {
    const array = []
    //Remueve el turno generando un nuevo listado para poder unificar y generar una suma
    data.forEach(ma => {
        const name = ma.name.replace('A', '').replace('B', '') //suprime el turno
        const obj = {}
        obj.name = name
        obj.total = ma.total
        array.push(obj)
    })
    const resultData = array.reduce((arrGroup, current) => {
        let thatItem = arrGroup.find(item => item.name == current.name)
        if (thatItem == undefined) arrGroup = [...arrGroup, { ...current }]
        else {
            thatItem.total += current.total
        }
        return arrGroup
    }, [])
    return resultData
}

//Retorna un objeto que tiene el total de matriculas para nivel primario y nivel secundario
function obtenerTotalNivelPrimarioInicial(data) {
    var obj = {}
    var i = 0;
    var p = 0;
    data.forEach(ma => {
        if (ma.name.includes('S')) {
            i += ma.total
        } else {
            p += ma.total
        }
    })
    obj.totalInicial = i
    obj.totalPrimario = p

    return obj
}

//Calculo alternativo para los que tienen CUD o nombre de columna similares
function obtenerTotalPorNivelConFiltro(data, filtro, include=false) {
    var obj = {}
    var i = 0;
    var p = 0;
    var newList = []
    if(include){
      newList = getPropertyNames(data, filtro)  
    } else {
      newList =  Object.keys(data).filter(item => !item.name.includes(`${filtro}`));
    }   
    console.log(newList)
    newList.forEach(ma => {
        if (ma.name.includes('S')) {
            i += ma.total
        } else {
            p += ma.total
        }
    })
    obj.totalInicial = i
    obj.totalPrimario = p

    return obj
}













