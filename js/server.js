//----------------------JS------------------------------
//import { cargarGrafico } from './grafico.js'
// ----------------------Elements-----------------------
//Selects
const selectEscuela = document.querySelector("#escuelas")
const selectZonas = document.querySelector("#zonas")
const selectGrados = document.querySelector("#grados")
const selectMeses = document.querySelector("#meses")
//Error 
const error = document.querySelector('#error')
const output = document.querySelector('.output');
//Tables
const header = document.querySelector("#headerTable")
const colsTable = document.querySelector("#colTable")
const colData = document.querySelector(".colData")
const headerTableMatricula = document.querySelector("#headerTableMatricula")
const colTableMatricula = document.querySelector("#colTableMatricula")
const headerTableMatriculaGrado = document.querySelector("#headerTableMatriculaGrados")
const colTableMatriculaGrado = document.querySelector("#colTableMatriculaGrados")
const colsGradoTurnoSexo = document.querySelector(".colsGradoTurnoSexo")
const colsGradoSexo = document.querySelector(".colsGradoSexo")
const filasGradoTurnoSexo = document.querySelector("#filasGradoTurnoSexo")
const filasGradoSexo = document.querySelector("#filasGradoSexo")
//Graficos
const graficaMatriculasGrado = document.querySelector("#graficaMatriculaGrado");
const graficaMatriculasGradoTurno = document.querySelector("#graficaMatriculaGradoTurno");
const graficoGradoTurnoSexo = document.querySelector("#graficoGradoTurnoSexo");
const graficoGradoSexo = document.querySelector("#graficoGradoSexo");
const graficoTotalPorGenero = document.querySelector("#graficoTotalPorGenero");

function limpiarMatriculasPorGenero() {
    colsGradoSexo.innerHTML = ""
    colsGradoTurnoSexo.innerHTML = ""
    filasGradoSexo.innerHTML = ""
    filasGradoTurnoSexo.innerHTML = ""
    graficoGradoSexo.innerHTML = ""
    graficoGradoTurnoSexo.innerHTML = ""
    graficoTotalPorGenero.innerHTML = ""
}
//------------------------Sheet ----------------------
const url = "https://docs.google.com/spreadsheets/d/"
const ssid = "1nWcH22t9_BSuaFwWT6bpt4_2wSYuUQzhUOWw0shaQ8o";
const query1 = `/gviz/tq?`; //visualization data
const query2 = 'tqx=out:json';
const sheet = `sheet=Respuestas de formulario 1`;
//---------------VARIABLES---------------------------
var rowsMatricula = [];
var filterRows = [];
//var columns = [];
var columnsMatricula = [];
//var listColumns = [];
var listColumnsMatricula = [];
var listResultados = [];
var listResultadosMatricula = [];

var select = ``

function clean() {
    select = ''
    error.innerHTML = '';
    colsTable.innerHTML = "";
    header.innerHTML = "";
    filterRows = [];
    listResultados = [];
}

function setSelect() {
    select = 'select *'
    if (selectZonas.value === "0" && selectGrados.value === "0" && selectEscuela.value === "0" && selectMeses.value === "0") {
        select = 'select *'
    } else {
        if (selectGrados.value != "0" && selectEscuela.value == "0" && selectMeses.value == "0") {
            select = 'select *'
        } else {
            select += ' where'
            if (selectEscuela.value != "0") {
                select += ` B contains '${selectEscuela.value}'`
            }
            if (selectMeses.value != "0" && selectEscuela.value != "0") {
                select += ` and EI contains '${selectMeses.value}'`
            } else if (selectMeses.value != "0") {
                select += ` EI contains '${selectMeses.value}'`
            }
        }
    }
}

function setSelectMatricula() {
    select = 'select *'
    if (selectEscuela.value === "0" && selectMeses.value === "0") {
        select = 'select *'
    } else {
        if (selectEscuela.value == "0" && selectMeses.value == "0") {
            select = 'select *'
        } else {
            select += ' where'
            if (selectEscuela.value != "0") {
                select += ` B contains '${selectEscuela.value}'`
            }
            if (selectMeses.value != "0" && selectEscuela.value != "0") {
                select += ` and EI contains '${selectMeses.value}'`
            } else if (selectMeses.value != "0") {
                select += ` EI contains '${selectMeses.value}'`
            }
        }
    }
}


function load() {

    const sheet = `sheet=Respuestas de formulario 1`;
    clean()
    setSelect()
    const query4 = encodeURIComponent(select);
    const endpoint = `${url}${ssid}${query1}&${query2}&${sheet}&tq=${query4}`;
    console.log(endpoint)
    const rows = []
    const columns = []
    if (selectZonas.value === "0" && selectGrados.value === "0" && selectEscuela.value === "0" && selectMeses.value === "0") {
        error.insertAdjacentHTML('beforeend', `<div class="alert alert-warning" role="alert">
                                               Por favor seleccione al menos un grado para poder filtrar !
                                               </div>`);
    } else {
        fetch(endpoint)
            .then(res => res.text())
            .then(data => {
                const temp = data.substring(47).slice(0, -2);
                const json = JSON.parse(temp);
                json.table.cols.forEach((col) => {
                    columns.push(JSON.stringify(col.label))
                });
                if (json.table.rows.length === 0) {
                    error.innerHTML = ""
                    error.insertAdjacentHTML('beforeend', `<div class="alert alert-danger d-flex align-items-center" role="alert">
                 <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"></use></svg>
                   <div>
                   No se encontraron resultados para filtros seleccionados
                    </div>
               </div>`);
                }
                else {
                    json.table.rows.forEach((row) => {
                        rows.push(row.c)
                    });
                    //Header columns
                    const valueSelectedGrade = selectGrados.value;
                    const listColumns = []
                    var cols = columns.filter(item => item.includes(valueSelectedGrade));
                    //Crea las un listado de columnas de acuerdo al grado seleccionado, es importante que el nombre del grado sea correcto para poder buscar en el listado las columnas
                    for (let i = 0; i < columns.length; i++) {

                        const colum = {}
                        cols.forEach(c => {

                            if (c === columns[i]) {
                                colum.index = i
                                colum.name = columns[i]
                            }
                        })
                        if (colum.index != null) {
                            listColumns.push(colum)
                        }
                    }

                    //Crea el element header con los nombres de las columnas correspondientes.
                    listColumns.forEach(cols => {
                        var name = cols.name.replace(/"/g, ' ');

                        header.insertAdjacentHTML('beforeend', `<th scope="col">${name}</th>`);
                    })
                    const listResultados = []
                    for (let i = 0; i < rows.length; i++) {
                        let resultado = {}
                        for (let j = 0; j < listColumns.length; j++) {
                            var index = listColumns[j].index;
                            var name = listColumns[j].name.replace(/"/g, ' ').replace(/\s/g, '');
                            //console.log(index)
                            if (rows[i][index] != null) {

                                resultado[name] = rows[i][index].v
                            } else { resultado[name] = '-' }
                        }
                        listResultados.push(resultado)

                    }

                    var propertyNames = Object.getOwnPropertyNames(listResultados[0]) //Get list properties names for the second object

                    for (let i = 0; i < listResultados.length; i++) {

                        const tr = makeCell('tr', colsTable, '', 'cell') //create a tag <tr> for each new object  
                        for (let j = 0; j < propertyNames.length; j++) {
                            tr.insertAdjacentHTML('beforeend', `
                        <td >${listResultados[i][propertyNames[j]]}</td>
                    `);
                        }
                    }
                }
            }).catch((error) => {
                console.log(error)
            });
    }
}

function obtenerColumnasPorFiltro(columns, filtro) {
    const listColumns = []
    //Se toma la columna que contenga al palabra CANTIDAD para cada curso que existe
    const cols = columns.filter(item => item.label.includes(`${filtro}`));
    //HEADER - Nombre de las columnas Grado, Total
    //1. Creamos un objeto que va guardar el index y el nombre de cada columna teniendo en cuenta el listado cols
    for (let i = 0; i < columns.length; i++) {

        const colum = {}
        cols.forEach(c => {

            if (c === columns[i]) {

                colum.index = i
                colum.id = columns[i].id
                colum.name = columns[i].label

            }
        })
        if (colum.index != null) {
            listColumns.push(colum)
        }
    }
    return listColumns;
}


function crearRowsObjet(listColumns, rows, valueReplace) {
    const results = []
    for (let i = 0; i < rows.length; i++) {
        let resultado = {}
        for (let j = 0; j < listColumns.length; j++) {
            let index = listColumns[j].index;
            let name = listColumns[j].name.replace(/"/g, ' ').replace(/\s/g, '');
            //console.log(index)
            if (rows[i][index] != null) {
                resultado[name] = rows[i][index].v
            } else { resultado[name] = valueReplace }
        }
        results.push(resultado)
    }
    return results;
}

function cargarMatricula() {
    colTableMatricula.innerHTML = "";
    headerTableMatricula.innerHTML = "";
    headerTableMatriculaGrado.innerHTML = ""
    colTableMatriculaGrado.innerHTML = ""
    const sheet = `sheet=Respuestas de formulario 1`;
    const rows = []
    const cols = []
    const filtro = 'CANTIDAD'
    setSelectMatricula()

    const query4 = encodeURIComponent(select);
    const endpoint = `${url}${ssid}${query1}&${query2}&${sheet}&tq=${query4}`;
    console.log(endpoint)
    fetch(endpoint)
        .then(res => res.text())
        .then(data => {
            const temp = data.substring(47).slice(0, -2);
            const json = JSON.parse(temp);

            json.table.cols.forEach((col) => {
                cols.push(JSON.stringify(col.label))
            });

            json.table.rows.forEach((row) => {
                rows.push(row.c)
            });
            //obtiene el listado de columnas que tienen la palabra cantidad para poder calcular los totales
            const listColumns = obtenerColumnasPorFiltro(json.table.cols, filtro)
            //Genera un listado de columnas y rows asignando a cada row el nombre correspondiente de columna con su index
            const resultObject = crearRowsObjet(listColumns, rows, 0)
            //Obtiene los property names para poder buscar en el array 
            const propertyNames = Object.getOwnPropertyNames(resultObject[0]) //Get list properties names for the second object
            //console.log(propertyNames)
            var datos = []
            const listDatos = []
            for (let i = 0; i < propertyNames.length; i++) {
                datos = []
                resultObject.forEach(item => {
                    const dato = item[propertyNames[i]]; //guarda para determinada columna el valor que tiene de acuerdo al nombre de columna almacenado previamente
                    datos.push(dato)
                })
                listDatos.push(datos) //guarda listado del valor de la columna como un listado  
            }
            //realiza suma de los grupos para el total de columnas y crea la tabla correspondiente para ser mostrada
            // Tiene en cuenta para la creacion de la tabla dos columnas nombre y total
            const matriculas = [];
            for (let i = 0; i < listDatos.length; i++) {
                let obj = {}
                let total = listDatos[i].reduce((a, b) => a + b, 0);
                obj.name = propertyNames[i].replace(filtro, '').toString()
                obj.total = total
                matriculas.push(obj);
            }
            //eliminar A y B del listado de columnas para poder sumar por grado sin tener en cuenta turno
            const matriculas1 = []
            matriculas.forEach(ma => {
                const name = ma.name.replace('A', '').replace('B', '')
                const obj = {}
                obj.name = name
                obj.total = ma.total
                matriculas1.push(obj)
            })
            const resultData = matriculas1.reduce((arrGroup, current) => {
                let thatItem = arrGroup.find(item => item.name == current.name)
                if (thatItem == undefined) arrGroup = [...arrGroup, { ...current }]
                else {
                    thatItem.total += current.total
                }
                return arrGroup
            }, [])

            const listEtiquetas = []
            const listData = []
            const listEtiquetas1 = []
            const listData1 = []
            //mostrar la informacion dentro del HTML 
            matriculas.forEach(info => {
                const tr = makeCell('tr', colTableMatricula, '', 'cell') //create a tag <tr> for each new object 
                tr.insertAdjacentHTML('beforeend', `
                        <td >${info.name}</td>
                        <td >${info.total}</td>
                    `);
                listEtiquetas.push(info.name)
                listData.push(info.total)
            })

            resultData.forEach(info => {
                const tr = makeCell('tr', colTableMatriculaGrado, '', 'cell') //create a tag <tr> for each new object 
                tr.insertAdjacentHTML('beforeend', `
                        <td >${info.name}</td>
                        <td >${info.total}</td>
                    `);
                listEtiquetas1.push(info.name)
                listData1.push(info.total)
            })

            //crear HTML
            const colsheader = ['Grado', 'Total']
            colsheader.forEach(info => {
                headerTableMatricula.insertAdjacentHTML('beforeend', `<th scope="col">${info}</th>`);
                headerTableMatriculaGrado.insertAdjacentHTML('beforeend', `<th scope="col">${info}</th>`);
            })

            //cargar informacion para el grafico de matriculas totales por grado
            loadGrafico(graficaMatriculasGradoTurno, listData, listEtiquetas, 'Matriculas por grado y turno')
            //cargar informacion para el grafico de matriculas totales por grado y turno
            loadGrafico(graficaMatriculasGrado, listData1, listEtiquetas1, 'Matriculas por grado')

        }).catch((error) => {
            console.log(error)
        });
}

function obtenerTabla(endpoint) {
    const table = fetch(endpoint)
        .then(res => res.text())
        .then(data => {
            const temp = data.substring(47).slice(0, -2);
            const json = JSON.parse(temp);
            return json.table
        }).catch((error) => {
            console.log(error)
        });

    return table
}



function cargarTablaIndex() {
    clean()
    setSelect()

    const query4 = encodeURIComponent(select);
    const endpoint = `${url}${ssid}${query1}&${query2}&${sheet}&tq=${query4}`;
    //console.log(endpoint)
    const rows = []
    if (selectZonas.value === "0" && selectGrados.value === "0" && selectEscuela.value === "0" && selectMeses.value === "0") {
        error.insertAdjacentHTML('beforeend', `<div class="alert alert-warning" role="alert">
                                               Por favor seleccione al menos un grado para poder filtrar !
                                               </div>`);
    } else { 
    obtenerTabla(endpoint).then(data => {
        data.rows.forEach((row) => {
            rows.push(row.c)
        });
        //crear listado completo con nombre de establecimiento, mes 
        const valueSelectedGrado = selectGrados.value
      
        const listColumns = obtenerColumnasPorFiltro(data.cols, valueSelectedGrado)
        const listResult = []
        for (let i = 0; i < rows.length; i++) {
            const resultado = {}
            resultado.establecimiento = rows[i][1].v
            if (rows[i][138] != null) {
                resultado.mes = rows[i][138].v
            }
            else { resultado.mes = 'S/M' }
            for (let j = 0; j < listColumns.length; j++) {
                let index = listColumns[j].index;
                let name = listColumns[j].name.replace(/"/g, ' ').replace(/\s/g, '').replace(valueSelectedGrado, '');
                //console.log(index)
                if (rows[i][index] != null) {
                    resultado[name] = rows[i][index].v
                } else { resultado[name] = '0' }
            }
            listResult.push(resultado)
        }
        //console.log('datos', listResult)
        var propertyNames = Object.getOwnPropertyNames(listResult[0]) //Get list properties names for the second object
        propertyNames.forEach(label=> {
            header.insertAdjacentHTML('beforeend', `<th scope="col">${label.toUpperCase()}</th>`);
        })
        for (let i = 0; i < listResult.length; i++) {

            const tr = makeCell('tr', colsTable, '', 'cell') //create a tag <tr> for each new object  
            for (let j = 0; j < propertyNames.length; j++) {
                tr.insertAdjacentHTML('beforeend', `
                        <td >${listResult[i][propertyNames[j]]}</td>
                    `);
            }
        }

    })}
}


function cargarInformacionPorGenero() {
    limpiarMatriculasPorGenero()
    var select = 'select *'
    if (selectEscuela.value == "0" && selectMeses.value == "0") {
        select = 'select *'
    } else {
        select += ' where'
        if (selectEscuela.value != "0") {
            select += ` B contains '${selectEscuela.value}'`
        }
        if (selectMeses.value != "0" && selectEscuela.value != "0") {
            select += ` and EI contains '${selectMeses.value}'`
        } else if (selectMeses.value != "0") {
            select += ` EI contains '${selectMeses.value}'`
        }
    }
    const query4 = encodeURIComponent(select);
    const endpoint = `${url}${ssid}${query1}&${query2}&${sheet}&tq=${query4}`;
    //const listGrados = ["S4A", "S4B", "S5A", "S5B", "1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B"];
    var rows = []
    obtenerTabla(endpoint).then(data => {
        data.rows.forEach((row) => {
            rows.push(row.c)
        });
        //obtiene el listado de columnas que tienen la palabra cantidad para poder calcular los totales
        const listColumnsSexo = obtenerColumnasPorFiltro(data.cols, 'VARONES')
        const listColumnsCantidad = obtenerColumnasPorFiltro(data.cols, 'CANTIDAD')
        //console.log('List varones ', listColumnsSexo)
        //console.log('List Cantidad', listColumnsCantidad)
        //genera listado de con los  valores correspondientes a cada columna teniendo en cuenta todos los registros
        const resultObjectSexo = crearRowsObjet(listColumnsSexo, rows, 0)
        const resultObjectCantidad = crearRowsObjet(listColumnsCantidad, rows, 0)
        //console.log('List varones object ', resultObjectSexo)
        //console.log('List Cantidad object', resultObjectCantidad)
        //Obtiene los property names para poder buscar en el array 
        const propertyNamesSexo = Object.getOwnPropertyNames(resultObjectSexo[0]) //Get list properties names for the second object
        const propertyNamesCantidad = Object.getOwnPropertyNames(resultObjectCantidad[0]) //Get list properties names for the second object
        /*------------Generar listado de datos para cada conjunto sexo, cantidad*/
        const listDatosSexo = []
        const listDatosCantidad = []
        for (let i = 0; i < propertyNamesSexo.length; i++) {
            let datos = []
            resultObjectSexo.forEach(item => {
                const dato = item[propertyNamesSexo[i]]; //guarda para determinada columna el valor que tiene de acuerdo al nombre de columna almacenado previamente
                datos.push(dato)
            })
            listDatosSexo.push(datos) //guarda listado del valor de la columna como un listado  
        }
        for (let i = 0; i < propertyNamesCantidad.length; i++) {
            let datos = []
            resultObjectCantidad.forEach(item => {
                const dato = item[propertyNamesCantidad[i]]; //guarda para determinada columna el valor que tiene de acuerdo al nombre de columna almacenado previamente
                datos.push(dato)
            })
            listDatosCantidad.push(datos) //guarda listado del valor de la columna como un listado  
        }

        const matriculasGradoTurnoSexo = obtenerTotalesPorGradoTurno(listDatosSexo, propertyNamesSexo, 'VARONES');
        const matriculasGradoTurno = obtenerTotalesPorGradoTurno(listDatosCantidad, propertyNamesCantidad, 'CANTIDAD');
        console.log('Totales varones', matriculasGradoTurnoSexo)
        console.log('Totales cantidad', matriculasGradoTurno)
        const totalSexoGradoTurno = []
        for (let i = 0; i < matriculasGradoTurnoSexo.length; i++) {
            const obj = {}
            let total = 0
            matriculasGradoTurno.forEach(matricula => {
                if (matricula.name == matriculasGradoTurnoSexo[i].name) {
                    total = matricula.total - matriculasGradoTurnoSexo[i].total
                    obj.femenino = total
                    obj.masculino = matriculasGradoTurnoSexo[i].total
                    obj.name = matricula.name
                }
            })
            totalSexoGradoTurno.push(obj)
        }
        //console.log('Totales de alumnos por sexo teniendo en cuenta grado y turno', totalSexoGradoTurno)
        //Generar tabla de totales por grado
        const resultTotalGradoSexo = obtenerTotalesPorGrado(matriculasGradoTurnoSexo);
        const resultTotalGrado = obtenerTotalesPorGrado(matriculasGradoTurno)
        const totalSexoGrado = []
        for (let i = 0; i < resultTotalGradoSexo.length; i++) {
            const obj = {}
            let total = 0
            resultTotalGrado.forEach(matricula => {
                if (matricula.name == resultTotalGradoSexo[i].name) {
                    total = matricula.total - resultTotalGradoSexo[i].total
                    obj.femenino = total
                    obj.masculino = resultTotalGradoSexo[i].total
                    obj.name = matricula.name
                }
            })
            totalSexoGrado.push(obj)
        }
        //---------Total de matriculas ------------
        var totalFemenino = 0
        var totalMasculino = 0
        totalSexoGrado.forEach(item => {
            totalFemenino += item.femenino
            totalMasculino += item.masculino
        })
        cargarGraficoTotalPorGenero([totalMasculino, totalFemenino])
        //crear HTML
        const colsheader = ['Grado', 'Masculino', 'Femenino']
        colsheader.forEach(info => {
            colsGradoTurnoSexo.insertAdjacentHTML('beforeend', `<th scope="col">${info}</th>`);
            colsGradoSexo.insertAdjacentHTML('beforeend', `<th scope="col">${info}</th>`);
        })
        cargarHTMLMatriculasPorGenero(totalSexoGradoTurno, filasGradoTurnoSexo, graficoGradoTurnoSexo)
        cargarHTMLMatriculasPorGenero(totalSexoGrado, filasGradoSexo, graficoGradoSexo)

    })
}


function cargarHTMLMatriculasPorGenero(listTotales, elementTable, elementGrafico) {
    const listEtiquetas = []
    const listDataFemenino = []
    const listDataMasculino = []
    listTotales.forEach(info => {
        const tr = makeCell('tr', elementTable, '', 'cell') //create a tag <tr> for each new object 
        tr.insertAdjacentHTML('beforeend', `
                    <td >${info.name}</td>
                    <td >${info.masculino}</td>
                    <td >${info.femenino}</td>
                `);

        listEtiquetas.push(info.name)
        listDataMasculino.push(info.masculino)
        listDataFemenino.push(info.femenino)
    })
    const varones = {
        label: "Masculino",
        data: listDataMasculino, // La data es un arreglo que debe tener la misma cantidad de valores que la cantidad de etiquetas
        backgroundColor: 'rgba(54, 162, 235)', // Color de fondo
        borderColor: 'rgba(54, 162, 235)', // Color del borde
        borderWidth: 1,// Ancho del borde
    };
    const mujeres = {
        label: "Femenino",
        data: listDataMasculino, // La data es un arreglo que debe tener la misma cantidad de valores que la cantidad de etiquetas
        backgroundColor: 'rgba(255, 159, 64)',// Color de fondo
        borderColor: 'rgba(255, 159, 64)',// Color del borde
        borderWidth: 1,// Ancho del borde
    };
    cargarGrafico(elementGrafico, [varones, mujeres], listEtiquetas, 'bar')
}

function cargarGraficoTotalPorGenero(listData) {
    const listEtiquetas = ['Masculino', 'Femenino']
    const datos = {
        data: listData,
        backgroundColor: [
            'rgba(54, 162, 235)',
            'rgba(255, 159, 64)'
        ],// Color de fondo
        borderColor: [
            'rgba(54, 162, 235)',
            'rgba(255, 159, 64)'
        ],// Color del borde
        borderWidth: 1,// Ancho del borde
    }
    cargarGrafico(graficoTotalPorGenero, [datos], listEtiquetas, 'pie')
}


///tipos de grafico - line, bar
function cargarGrafico(elementId, listData, listEtiquetas, tipo) {
    // Las etiquetas son las que van en el eje X. 
    const etiquetas = listEtiquetas
    // Podemos tener varios conjuntos de datos. Comencemos con uno

    new Chart(elementId, {
        type: tipo,// Tipo de gráfica
        data: {
            labels: etiquetas,
            datasets: listData
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
            },
        }
    });
}




function obtenerTotalesPorGradoTurno(listDato, listPropertyNames, filtro) {
    const matriculas = [];
    for (let i = 0; i < listDato.length; i++) {
        let obj = {}
        let total = listDato[i].reduce((a, b) => a + b, 0);
        obj.name = listPropertyNames[i].replace(filtro, '').toString()
        obj.total = total
        matriculas.push(obj);
    }
    return matriculas
}

function obtenerTotalesPorGrado(listMatriculas) {
    const matriculas = []
    listMatriculas.forEach(ma => {
        const name = ma.name.replace('A', '').replace('B', '') //suprime el turno
        const obj = {}
        obj.name = name
        obj.total = ma.total
        matriculas.push(obj)
    })
    const resultData = matriculas.reduce((arrGroup, current) => {
        let thatItem = arrGroup.find(item => item.name == current.name)
        if (thatItem == undefined) arrGroup = [...arrGroup, { ...current }]
        else {
            thatItem.total += current.total
        }
        return arrGroup
    }, [])
    return resultData
}



function makeCell(element, parent, html, classAdd) {
    const ele = document.createElement(element);
    parent.append(ele); //create element to the parent
    ele.innerHTML = html;
    ele.classList.add(classAdd);
    return ele;
}


function filtrar() {
    clean()
    matriculaGradoTurno()
    load()
}


function loadGrafico(elementId, listData, listEtiquetas, label) {
    // Las etiquetas son las que van en el eje X. 
    const etiquetas = listEtiquetas
    // Podemos tener varios conjuntos de datos. Comencemos con uno
    const datos = {
        label: label,
        data: listData, // La data es un arreglo que debe tener la misma cantidad de valores que la cantidad de etiquetas
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Color de fondo
        borderColor: 'rgba(54, 162, 235, 1)', // Color del borde
        borderWidth: 1,// Ancho del borde
    };
    new Chart(elementId, {
        type: 'line',// Tipo de gráfica
        data: {
            labels: etiquetas,
            datasets: [
                datos,
                // Aquí más datos...
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
            },
        }
    });
}



