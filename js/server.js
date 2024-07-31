
const output = document.querySelector('.output');
const url = "https://docs.google.com/spreadsheets/d/"
const ssid = "1em15J05fytJZCeC5S99zfB51wJH3xdbXdpBC8I9kB44";
const query1 = `/gviz/tq?`; //visualization data
const query2 = 'tqx=out:json';


//Allow get table from google sheet
function getTable(endpoint) {
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


function load(sheet, query = "select *") {
    const query3 = `sheet=${sheet}`;
    const select = query
    const query4 = encodeURIComponent(select);
    var rows = []
    var cols = []
    var table = []
    const endpoint = `${url}${ssid}${query1}&${query2}&${query3}&tq=${query4}`;
    getTable(endpoint).then(data => {
        data.rows.forEach((row) => {
            rows.push(row.c)
        });
        data.cols.forEach((col) => {
            cols.push(col.label.replace(/ /g, ""))
        })
        //console.log(rows)
        //console.log(cols)
        for (let i = 0; i < rows.length; i++) {
            let obj = {}
            for (let j = 0; j < cols.length; j++) {
                if (rows[i][j] === null) {
                    obj[cols[j]] = 0
                } else {
                    obj[cols[j]] = rows[i][j].v
                }
            }

            table.push(obj);
        }
    })
    const data = new Promise((resolve, reject) => {
        setTimeout(() => {

            resolve(table);
            if (table.length === 0) {
                reject(new Error('There are not data'))
            }

        }, 1000);
    });
    return data
}

/**------------------------------------------FUNCIONES QUE PERMITEN CALCULAR DATOS GLOBALES ----------------------*/
function suma(array, column) {
    const total = array.reduce(function (resultado, element) {
        const valor = resultado + element[`${column}`];
        return valor
    }, 0)
    return total;
}

function getPropertyNames(data, filter) {
    var propertyNames = Object.keys(data[0]).filter(item => item.includes(`${filter}`));
    return propertyNames
}
function getPropertyNamesNotInclude(data, filter) {
    var propertyNames = Object.keys(data[0]).filter(item => !item.includes(`${filter}`));
    return propertyNames
}

/*--------------------------------------------MANAGE ELEMENTS-------------------------------------*/
function createElement(parent, element, css, text) {
    const el = document.createElement(`${element}`)
    el.className = css
    el.innerHTML = text
    if (typeof parent === 'string') {
        document.querySelector(`${parent}`).appendChild(el)
    } else {

        parent.appendChild(el)
    }
    return el;
}

function insertHTML(parent, element) {
    const el = parent.insertAdjacentHTML('beforeend', `${element}`);
    return el;
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

/*******************************METODOS GENERALES************************************/

function suma(array, column) {
    const total = array.reduce(function (resultado, element) {
        const valor = resultado + element[`${column}`];
        return valor
    }, 0)
    return total;
}

function getPropertyNames(data, filter) {
    var propertyNames = Object.keys(data[0]).filter(item => item.includes(`${filter}`));
    return propertyNames
}

function getArrayByPropertyNames(data, propertyNames) {
    var array = []
    for (let i = 0; i < data.length; i++) {
        const objData = {}
        for (let j = 0; j < propertyNames.length; j++) {
            objData[propertyNames[j]] = data[i][propertyNames[j]]
        }
        array.push(objData)
    }
    return array
}

function percentage(partialValue, totalValue) {
    let result =  (100 * partialValue) / totalValue;
    return result.toFixed(2)
 }


/***************************************TOTALES****************************************/

function calcularMatriculaTotalGradoTurno(data, columns) {
    const array = []
    columns.forEach(item => {
        let obj = {}
        obj.name = item
        obj.total = suma(data, item)
        array.push(obj)
    })
    //console.log(array)
    return array;
}

function calcularMatriculaTotalGradoTurnoGenero(data, columns, totalCantidad) {

    const array = []

    for (let i = 0; i < columns.length; i++) {
        let obj = {}
        var colGenero = columns[i].replace('VARONES', '')
        var colCantidad = totalCantidad[i].name.replace('CANTIDAD', '')
        obj.name = colGenero
        var totalVarones = suma(data, columns[i])
        obj.totalVarones = totalVarones
        if (colGenero === colCantidad) {
            obj.totalMujeres = totalCantidad[i].total - totalVarones
        }
        obj.cantidad = totalCantidad[i].total
        array.push(obj)
    }

    return array;
}

function calcularTotalMatriculasPorGenero(data) {
    var varones = 0
    var mujeres = 0
    var obj = {}
    data.forEach(item => {
        varones += item.totalVarones
        mujeres += item.totalMujeres
    });
    const sum = varones + mujeres
    obj.varones = varones
    obj.mujeres = mujeres
    obj.porcentajeVarones = percentage(varones, sum)
    obj.porcentajeMujeres = percentage(mujeres, sum)
    return obj

}



function obtenerTotalesPorGrado(data) {
    const array = []
    data.forEach(ma => {
        const name = ma.name.replace('CANTIDAD', '').replace('A', '').replace('B', '') //suprime el turno
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

function obtenerTotalesPorGradoGenero(data) {
    const array = []
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




function stankedMatriculaGenero(data) {
    var label = []
    var varones = []
    var mujeres = []
    data.forEach(item => {
        label.push(item.name)
        varones.push(item.totalVarones)
        mujeres.push(item.totalMujeres)
    });
    var ctx = document.getElementById("stacker-bar-chart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: label,
            datasets: [{
                label: 'Varones',
                backgroundColor: "#3366cc",
                data: varones,
            }, {
                label: 'Mujeres',
                backgroundColor: "#dc3912",
                data: mujeres,
            }],
        },
        options: {
            tooltips: {
                displayColors: true,
                callbacks: {
                    mode: 'x',
                },
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            },
            responsive: true
        }
    });
}


function PieMatriculaGeneroTotal(data) {

    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        const array = google.visualization.arrayToDataTable([
            ['Genero', 'Mhl'],
            [`Masculino (${data.varones})`, parseFloat(data.porcentajeVarones)],
            [`Femenino (${data.mujeres})`, parseFloat(data.porcentajeMujeres)],

        ]);

        const options = {
            title: ''
        };

        const chart = new google.visualization.PieChart(document.getElementById('myChart'));
        chart.draw(array, options);
    }
}


async function cargarGraficos() {
    try {

        var data = await load('Respuesta')
        //console.log('Fetch data: Data =', data)
        let propertyNameCantidad = getPropertyNames(data, 'CANTIDAD')
        let propertyNameGenero = getPropertyNames(data, 'VARONES')
        // console.log('Property name genero:',propertyNameGenero)
        let arrayCantidad = getArrayByPropertyNames(data, propertyNameCantidad)
        let arrayGenero = getArrayByPropertyNames(data, propertyNameGenero)
        //console.log('propertyNameCantidad', propertyNameCantidad)
        //console.log('arrayCantidad', arrayCantidad)
        //console.log('array genero', arrayGenero)
        const totalMatriculasGradoTurno = calcularMatriculaTotalGradoTurno(arrayCantidad, propertyNameCantidad)
        const totalMatriculasGradoTurnoGenero = calcularMatriculaTotalGradoTurnoGenero(arrayGenero, propertyNameGenero, totalMatriculasGradoTurno)



        /**SHOW GRAFICO STAKED > Total matriculas por genero, grado, turno */
        console.log(totalMatriculasGradoTurnoGenero)
        stankedMatriculaGenero(totalMatriculasGradoTurnoGenero)
        let resultTotalMatriculaGenero = calcularTotalMatriculasPorGenero(totalMatriculasGradoTurnoGenero)
        //console.log(resultTotalMatriculaGenero)
        PieMatriculaGeneroTotal(resultTotalMatriculaGenero)
    } catch (error) {
        console.log(error.message)
    }
}



