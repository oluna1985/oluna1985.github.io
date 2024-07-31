const selectMes = document.querySelector('#mes')

const selectZona = document.querySelector('#zona')

const selectEscuela = document.querySelector('#escuela')


/*----------------------------------------------------------DASHBOARD INICIAL-----------------------------------------------*/

function cargarTotalesMatricula(nombre, total, css) {
    const tbody = document.querySelector('#totalesMatricula')
    insertHTML(tbody, `<div class="col-xl-2 col-md-6 mb-4">
           <div class="card mb-3 px-md-4 ${css}" >
            <div class="card-header"> <svg class="bi"><use xlink:href="#graph-up"></use></svg></div>
          <div class="card-body">
            <h5 class="card-title">${total}</h5>
            <p class="card-text">${nombre}</p>
          </div>
        </div>
        </div>`)

}

function cargarCard(element, title, nombre, total, css, col) {
    const tbody = document.querySelector(element)
    insertHTML(tbody, `<div class="${col} col-md-6 ">
           <div class="card mb-3 px-md-4 ${css}" >
           <div class="card-header">${title}</div>
          <div class="card-body">
            <h5 class="card-title">${total}</h5>
            <p class="card-text">${nombre}</p>
          </div>
        </div>
        </div>`)

}

function cargarListGroup(parent, name, total) {

    insertHTML(parent, `<a href="#" class="list-group-item list-group-item-action" aria-current="true">
         <div class="d-flex w-100 justify-content-between">
         <h6 class="mb-1">${name}</h6>
         </div>
        <h3 class="mb-1 text-center">${total}</h3>
        </a>`)

}

async function loadInicio() {
    try {

        var data = await load('Respuestas de formulario 1')
        const totalesPorGradoTurno = obtenerListadoPorColumna(data, 'CANTIDAD')
        //console.log(totalesPorGradoTurno)
        const totalesPorGrado = obtenerListadoPorGrado(totalesPorGradoTurno)


        /*CARGAR CARD CON TOTALES PARA NIVEL INICIAL Y PRIMARIO*/
        const totalesNivelInicialPrimario = obtenerTotalNivelPrimarioInicial(totalesPorGrado) //Le asigno el total obtenido por grados

        //REPITENCIA
        const totalesPorGradoTurnoRepitentes = obtenerListadoPorColumna(data, 'REPITENCIA')

        const totalRepitencia = obtenerTotalNivelPrimarioInicial(totalesPorGradoTurnoRepitentes)
        //console.log('total repitencia', totalRepitencia)
        //SOBREEDAD
        const totalMatriculasSobreEdadGradoTurno = obtenerListadoPorColumna(data, 'SOBREEDAD')
        const totalMatriculasSobreEdadGrado = obtenerListadoPorGrado(totalMatriculasSobreEdadGradoTurno)
        //console.log('Total matriculas con sobreedad grado turno', totalMatriculasSobreEdadGradoTurno)
        //console.log('Total matriculas con sobreedad', totalMatriculasSobreEdadGrado)
        const totalSobreEdad = obtenerTotalNivelPrimarioInicial(totalMatriculasSobreEdadGrado)
        //console.log('Total matriculas con sobre edad', totalSobreEdad)
        //CUD
        const totalesPorGradoTurnoCUD = obtenerListadoPorColumna(data, 'CUD')
        //console.log('Total por grado turno con CUD', totalesPorGradoTurnoCUD)
        var resultFilasSinCONCUD = totalesPorGradoTurnoCUD.filter(item => item.name.includes('CON'))
        var resultFilasCONCUD = totalesPorGradoTurnoCUD.filter(item => !item.name.includes('CON'))
        const totalCONCUD = obtenerTotalNivelPrimarioInicial(resultFilasSinCONCUD)
        const totalCUD = obtenerTotalNivelPrimarioInicial(resultFilasCONCUD)
        //console.log('Total con CONCUD', totalCONCUD)
        //console.log('Total con CUD', totalCUD)
        //Alumnos con adecuacion horaria - CANT ALUMN CON ADECUACION HORARIA
        const totalesAlumnosAdecuacionHorariaPorGradoTurno = obtenerListadoPorColumna(data, 'CANTALUMNCONADECUACIONHORARIA')
        //console.log('totalesAlumnosAdecuacionHorariaPorGradoTurno', totalesAlumnosAdecuacionHorariaPorGradoTurno)
        const totalesAlumnosAdecuacionHoraria = obtenerTotalNivelPrimarioInicial(totalesAlumnosAdecuacionHorariaPorGradoTurno)
        //console.log('totalesAlumnosAdecuacionHoraria', totalesAlumnosAdecuacionHoraria)
        //Alumnos con AT - CANT ALUMN CON AT
        const totalesAlumnosATPorGradoTurno = obtenerListadoPorColumna(data, 'CANTALUMNCONAT')
        // console.log('totalesAlumnosATPorGradoTurno', totalesAlumnosATPorGradoTurno)
        const totalesAlumnosAT = obtenerTotalNivelPrimarioInicial(totalesAlumnosATPorGradoTurno)
        // console.log('totalesAlumnosAT', totalesAlumnosAT)
        //Inasistencia  INASISTENCIA
        const totalesInasistenciaPorGradoTurno = obtenerListadoPorColumna(data, 'INASISTENCIA')
        console.log('totalesInasistenciaPorGradoTurno', totalesInasistenciaPorGradoTurno)
        const totalesInasistencia = obtenerTotalNivelPrimarioInicial(totalesInasistenciaPorGradoTurno)
        console.log('totalesInasistencia', totalesInasistencia)

        //console.log(totalesNivelInicialPrimario)
        cargarCard('#totalesMatricula', 'Nivel Inicial', '', `${totalesNivelInicialPrimario.totalInicial}`, 'text-bg-primary', 'col-xl-2')
        cargarCard('#totalesMatricula', 'Nivel Primario', '', `${totalesNivelInicialPrimario.totalPrimario}`, 'text-bg-success', 'col-xl-2')

        const ul = document.querySelector('#totales')
        ul.innerHTML = ""

        cargarListGroup(ul, 'Estudiantes con mas de 5 inasistencias injustificadas', totalesInasistencia.totalPrimario + totalesInasistencia.totalInicial)
        cargarListGroup(ul, 'Total CUD en tramite', totalCUD.totalPrimario + totalCUD.totalInicial)
        cargarListGroup(ul, 'Total Sobre Edad', totalSobreEdad.totalPrimario + totalSobreEdad.totalInicial)
        cargarListGroup(ul, 'Total con CUD', totalCONCUD.totalPrimario + totalCONCUD.totalInicial)
        cargarListGroup(ul, 'Total con adecuacion horaria', totalesAlumnosAdecuacionHoraria.totalPrimario + totalesAlumnosAdecuacionHoraria.totalInicial)
        cargarListGroup(ul, 'Total Repitencia', totalRepitencia.totalPrimario + totalRepitencia.totalInicial)
        cargarListGroup(ul, 'Total con AT', totalesAlumnosAT.totalPrimario + totalesAlumnosAT.totalInicial)

    } catch (error) {
        console.log(error.message)
    }
}

/*----------------------------------------------------------NIVEL PRIMARIO PAGE LOAD-----------------------------------------------*/
function cargarTable(table, element) {
    const tbody = document.querySelector(element)
    tbody.innerHTML = ""
    table.forEach(item => {
        insertHTML(tbody, `<tr>
            <td>${item.name}</td>
            <td>${item.total}</td>
            </tr>`)
    });
}

function loadDataNivelPrimario(data) {
    //Totales
    const totalesPorGradoTurno = obtenerListadoPorColumna(data, 'CANTIDAD')
    const totalesPorGradoTurnoPrimaria = totalesPorGradoTurno.filter(item => !item.name.includes('S'))
    const totalesPorGrado = obtenerListadoPorGrado(totalesPorGradoTurno)
    const totalesPorGradoPrimaria = totalesPorGrado.filter(item => !item.name.includes('S'))
    //REPITENCIA
    const totalesPorGradoTurnoRepitentes = obtenerListadoPorColumna(data, 'REPITENCIA')

    const totalRepitencia = obtenerTotalNivelPrimarioInicial(totalesPorGradoTurnoRepitentes)
    //console.log('total repitencia', totalRepitencia)
    //SOBREEDAD
    const totalMatriculasSobreEdadGradoTurno = obtenerListadoPorColumna(data, 'SOBREEDAD')
    const totalMatriculasSobreEdadGrado = obtenerListadoPorGrado(totalMatriculasSobreEdadGradoTurno)
    //console.log('Total matriculas con sobreedad grado turno', totalMatriculasSobreEdadGradoTurno)
    //console.log('Total matriculas con sobreedad', totalMatriculasSobreEdadGrado)
    const totalSobreEdad = obtenerTotalNivelPrimarioInicial(totalMatriculasSobreEdadGrado)
    //console.log('Total matriculas con sobre edad', totalSobreEdad)
    //CUD
    const totalesPorGradoTurnoCUD = obtenerListadoPorColumna(data, 'CUD')
    //console.log('Total por grado turno con CUD', totalesPorGradoTurnoCUD)
    var resultFilasSinCONCUD = totalesPorGradoTurnoCUD.filter(item => item.name.includes('CON'))
    var resultFilasCONCUD = totalesPorGradoTurnoCUD.filter(item => !item.name.includes('CON'))
    const totalCONCUD = obtenerTotalNivelPrimarioInicial(resultFilasSinCONCUD)
    const totalCUD = obtenerTotalNivelPrimarioInicial(resultFilasCONCUD)
    //console.log('Total con CONCUD', totalCONCUD)
    //console.log('Total con CUD', totalCUD)
    //Alumnos con adecuacion horaria - CANT ALUMN CON ADECUACION HORARIA
    const totalesAlumnosAdecuacionHorariaPorGradoTurno = obtenerListadoPorColumna(data, 'CANTALUMNCONADECUACIONHORARIA')
    //console.log('totalesAlumnosAdecuacionHorariaPorGradoTurno', totalesAlumnosAdecuacionHorariaPorGradoTurno)
    const totalesAlumnosAdecuacionHoraria = obtenerTotalNivelPrimarioInicial(totalesAlumnosAdecuacionHorariaPorGradoTurno)
    //console.log('totalesAlumnosAdecuacionHoraria', totalesAlumnosAdecuacionHoraria)
    //Alumnos con AT - CANT ALUMN CON AT
    const totalesAlumnosATPorGradoTurno = obtenerListadoPorColumna(data, 'CANTALUMNCONAT')
    // console.log('totalesAlumnosATPorGradoTurno', totalesAlumnosATPorGradoTurno)
    const totalesAlumnosAT = obtenerTotalNivelPrimarioInicial(totalesAlumnosATPorGradoTurno)
    // console.log('totalesAlumnosAT', totalesAlumnosAT)
    //Inasistencia  INASISTENCIA
    const totalesInasistenciaPorGradoTurno = obtenerListadoPorColumna(data, 'INASISTENCIA')
    console.log('totalesInasistenciaPorGradoTurno', totalesInasistenciaPorGradoTurno)
    const totalesInasistencia = obtenerTotalNivelPrimarioInicial(totalesInasistenciaPorGradoTurno)
    console.log('totalesInasistencia', totalesInasistencia)
    //Cargar tablas
    cargarTable(totalesPorGradoTurnoRepitentes, '.bodyTableRepitente')
    cargarTable(totalesPorGradoTurnoPrimaria, '.bodyTableMatriculaGradoTurno')
    cargarTable(totalesPorGradoPrimaria, '.bodyTableMatriculaGrado')
    //cargar totales nivel primario
    const ul = document.querySelector('#totales')
    ul.innerHTML = ""
    cargarListGroup(ul, 'Estudiantes con mas de 5 inasistencias injustificadas', totalesInasistencia.totalPrimario)
    cargarListGroup(ul, 'Total CUD en tramite', totalCUD.totalPrimario)
    cargarListGroup(ul, 'Total Sobre Edad', totalSobreEdad.totalPrimario)
    cargarListGroup(ul, 'Total con CUD', totalCONCUD.totalPrimario)
    cargarListGroup(ul, 'Total con adecuacion horaria', totalesAlumnosAdecuacionHoraria.totalPrimario)
    cargarListGroup(ul, 'Total Repitencia', totalRepitencia.totalPrimario)
    cargarListGroup(ul, 'Total con AT', totalesAlumnosAT.totalPrimario)
}


function loadDataNivelInicial(data) {
    //Totales
    const totalesPorGradoTurno = obtenerListadoPorColumna(data, 'CANTIDAD')
    const totalesPorGradoTurnoPrimaria = totalesPorGradoTurno.filter(item => item.name.includes('S'))
    const totalesPorGrado = obtenerListadoPorGrado(totalesPorGradoTurno)
    const totalesPorGradoPrimaria = totalesPorGrado.filter(item => item.name.includes('S'))
    //REPITENCIA
    const totalesPorGradoTurnoRepitentes = obtenerListadoPorColumna(data, 'REPITENCIA')

    const totalRepitencia = obtenerTotalNivelPrimarioInicial(totalesPorGradoTurnoRepitentes)
    //console.log('total repitencia', totalRepitencia)
    //SOBREEDAD
    const totalMatriculasSobreEdadGradoTurno = obtenerListadoPorColumna(data, 'SOBREEDAD')
    const totalMatriculasSobreEdadGrado = obtenerListadoPorGrado(totalMatriculasSobreEdadGradoTurno)
    //console.log('Total matriculas con sobreedad grado turno', totalMatriculasSobreEdadGradoTurno)
    //console.log('Total matriculas con sobreedad', totalMatriculasSobreEdadGrado)
    const totalSobreEdad = obtenerTotalNivelPrimarioInicial(totalMatriculasSobreEdadGrado)
    //console.log('Total matriculas con sobre edad', totalSobreEdad)
    //CUD
    const totalesPorGradoTurnoCUD = obtenerListadoPorColumna(data, 'CUD')
    //console.log('Total por grado turno con CUD', totalesPorGradoTurnoCUD)
    var resultFilasSinCONCUD = totalesPorGradoTurnoCUD.filter(item => item.name.includes('CON'))
    var resultFilasCONCUD = totalesPorGradoTurnoCUD.filter(item => !item.name.includes('CON'))
    const totalCONCUD = obtenerTotalNivelPrimarioInicial(resultFilasSinCONCUD)
    const totalCUD = obtenerTotalNivelPrimarioInicial(resultFilasCONCUD)
    //console.log('Total con CONCUD', totalCONCUD)
    //console.log('Total con CUD', totalCUD)
    //Alumnos con adecuacion horaria - CANT ALUMN CON ADECUACION HORARIA
    const totalesAlumnosAdecuacionHorariaPorGradoTurno = obtenerListadoPorColumna(data, 'CANTALUMNCONADECUACIONHORARIA')
    //console.log('totalesAlumnosAdecuacionHorariaPorGradoTurno', totalesAlumnosAdecuacionHorariaPorGradoTurno)
    const totalesAlumnosAdecuacionHoraria = obtenerTotalNivelPrimarioInicial(totalesAlumnosAdecuacionHorariaPorGradoTurno)
    //console.log('totalesAlumnosAdecuacionHoraria', totalesAlumnosAdecuacionHoraria)
    //Alumnos con AT - CANT ALUMN CON AT
    const totalesAlumnosATPorGradoTurno = obtenerListadoPorColumna(data, 'CANTALUMNCONAT')
    // console.log('totalesAlumnosATPorGradoTurno', totalesAlumnosATPorGradoTurno)
    const totalesAlumnosAT = obtenerTotalNivelPrimarioInicial(totalesAlumnosATPorGradoTurno)
    // console.log('totalesAlumnosAT', totalesAlumnosAT)
    //Inasistencia  INASISTENCIA
    const totalesInasistenciaPorGradoTurno = obtenerListadoPorColumna(data, 'INASISTENCIA')
    console.log('totalesInasistenciaPorGradoTurno', totalesInasistenciaPorGradoTurno)
    const totalesInasistencia = obtenerTotalNivelPrimarioInicial(totalesInasistenciaPorGradoTurno)
    console.log('totalesInasistencia', totalesInasistencia)
    //Cargar tablas
    cargarTable(totalesPorGradoTurnoPrimaria, '.bodyTableMatriculaGradoTurno')
    cargarTable(totalesPorGradoPrimaria, '.bodyTableMatriculaGrado')
    //cargar totales nivel primario
    const ul = document.querySelector('#totales')
    ul.innerHTML = ""
    cargarListGroup(ul, 'Estudiantes con mas de 5 inasistencias injustificadas', totalesInasistencia.totalInicial)
    cargarListGroup(ul, 'Total CUD en tramite', totalCUD.totalInicial)
    cargarListGroup(ul, 'Total Sobre Edad', totalSobreEdad.totalInicial)
    cargarListGroup(ul, 'Total con CUD', totalCONCUD.totalInicial)
    cargarListGroup(ul, 'Total con adecuacion horaria', totalesAlumnosAdecuacionHoraria.totalInicial)
    cargarListGroup(ul, 'Total con AT', totalesAlumnosAT.totalInicial)
}

function disabledEscuela() {
    var valueEscuela = selectEscuela.value
    if (selectZona.value.length > 0) {
        selectEscuela.disabled = true
        valueEscuela = ""
    } else {
        selectEscuela.disabled = false
        valueEscuela = ""
    }
}

function filter() {
    var valueMes = selectMes.value;
    var valueZona = selectZona.value;
    var valueEscuela = selectEscuela.value

    var query = `select *`
    if (valueMes.length > 0 || valueEscuela.length > 0 || valueZona.length > 0) {
        query += ' where'
    }
    if (valueZona.length > 0) {
        query += ` A contains '${valueZona}'`
    }
    if (valueEscuela.length > 0) {
        query += ` C contains '${valueEscuela}'`
    }
    if (valueMes.length > 0) {
        if (valueZona.length > 0 || valueEscuela.length > 0) {
            query += ` and `
        }
        query += ` EJ contains '${valueMes}'`
    }
    console.log(query)
    return query
}

async function loadNivelPrimario() {
    try {

        const filtro = filter()
        const dataFilter = await load('Respuesta', filtro)
        loadDataNivelPrimario(dataFilter)


    } catch (error) {
        console.log(error.message)
    }
}

async function loadNivelInicial() {
    try {

        const filtro = filter()
        const dataFilter = await load('Respuesta', filtro)
        loadDataNivelInicial(dataFilter)


    } catch (error) {
        console.log(error.message)
    }
}







