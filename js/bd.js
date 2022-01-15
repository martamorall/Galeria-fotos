let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
let dataBaseC = null;
let dataBase = null;
let registroActual = null;
let cursor = null;
let nuevo = true;
let campos=document.getElementById("campos");
let bvisualizar=document.getElementById("bvisualizar");

function startDB() {
    // Este objeto proporciona el método open que nos permite crear o abrir  la base de datos.
    dataBase = indexedDB.open("BdFotos", 1);
    dataBase.onupgradeneeded = function (e) {

        orden = dataBase.result;
        
        let tabla = orden.createObjectStore("Fotos", { keyPath: 'id', autoIncrement: true });
        //  createObjectStore crea una tabla, el campo clave obligatorio por medio de KeyPath y si el indice es autoincremento                  
        //tabla.createIndex('by_Id', 'claveId', { unique: false });
        //!!!!!!! cuidado con mayúsculas y mnísculas. No es igual by_IdCliente que by_idCliente
        tabla.createIndex('by_nombre', 'nombre', { unique: false });
        tabla.createIndex('by_tema', 'tema', { unique: false });
        tabla.createIndex('by_id', 'id', { unique: false });
        
        alert('Base de datos creada');

    };

    dataBase.onsuccess = function (e) {  
        // En este evento realizaremos una lectura secuencial de la bae de datos cmo despues se explica.                  
        crearcursor();
    };

    dataBase.onerror = function (e) {
        // Si se produce un error se ejecuta este método. Ocurre cuando cambiamos de versión
        alert('Error cargando la base de datos ' + e.target);
    };

}
bvisualizar.addEventListener("click", crearcursor, false);

function crearcursor() {
    // Lectura secuencial de los registros de la tabla 
    let orden = dataBase.result;
    let transacion = orden.transaction(["Fotos"], "readonly");
    let tabla = transacion.objectStore("Fotos");
    //  request = object.openCursor("isbn",IDBCursor.nextUnique);
    // request = tabla.openCursor(null, 'prev');
    request = tabla.openCursor(null, 'next');
    //   request = tabla.openCursor();
    //    let cursorRequest = store.index('date').openCursor(null, 'next'); 
    //  let dato = document.querySelector("#cdatoabuscar").value
    //   let request = object.get(dato);

    request.onerror = function (event) {
        alert("Error en lectura secuencial de la tabla");
    };

    request.onsuccess = function (event) {
        // Éxito de ejecución, este evento se ejecuta recursivamente hasta llegar al último registro
        // de la tabla.
        cursor = event.target.result;
        if (cursor) {
            visualizar(cursor.value);
            // cursor.continue();
        }
        else {
            alert("Fin de lectura de fotos");
        }
    };
}

function visualizar(registro) {
    nuevo = false;
    galeria = document.querySelector('#galeria');
    imag=document.createElement("img");
    imag.src=registro.imagen;
    galeria.appendChild(imag);
}

document.getElementById("bgrabar").addEventListener("click", grabar, false);

function grabar() {
    let id = document.getElementById("cId").value;
    let nombre = document.getElementById("cNombre").value;
    let tema = document.getElementById("cTema").value;
    
    let orden = dataBase.result;
    // Crea un objeto para ejecutar órdenes contra la base de datos               
    let transacion = orden.transaction(["Fotos"], "readwrite");
    // Crea una transación sobre una  tabla de la base de datos para lectura y escritura
    let tabla = transacion.objectStore("Fotos");
    // Crea un objeto para realizar la transacción sobre la tabla. 
    // El método put graba si no existe un registro con la clave indicada o lo sobreescribe (modifica) si existe.
    let request = null;
    if (nuevo) {
        let nid=parseInt(id.toString())
        request = tabla.add({
            id: nid,
            nombre: nombre,
            tema: tema,
            imagen: imagenCapturada.src,
        
        });
    }
    else {
        let nid = parseInt(id.toString())
        request = tabla.put({
            id: nid,
            nombre: nombre,
            tema: tema,
            imagen: imagenCapturada.src,
        });
    }

    request.onerror = function (e) {
        // Error de grabación                    
        alert(request.error.name + '\n\n' + request.error.message);
    };

    transacion.oncomplete = function (e) {
        // La transacion se ha ejecutado sin problemas y borramos el contenido de los <input> de texto                    
        document.getElementById("cId").value = "";
        document.getElementById("cNombre").value = "";
        document.getElementById("cTema").value = "";

        alert('Registro grabado');
    };
}

campos.addEventListener("change", buscarPorIndices, false);

function buscarPorIndices() {

    var dato = document.querySelector("#cdatoabuscar").value
    var orden = dataBase.result;
    var transacion = orden.transaction(["Fotos"], "readonly");
    var tabla = transacion.objectStore("Fotos");

    var porCampo = this.options[this.selectedIndex].value;
    
    // Leer por la clave principal id
    if (porCampo == "id") {

        var request = tabla.get(parseInt(dato));
        request.onsuccess = function () {
            var result = request.result;
            if (result !== undefined) {
                visualizar(result);
            }
            ;
        }
    }
    else {
        // Leer por índice seleccionado
        var index = tabla.index(porCampo);
 
        index.get(dato).onsuccess = function (evt) {
            var datos = evt.target.result;
            //alert(datos.id);
            //alert("Titu" + datos.Descripcion);
            visualizar(datos);
        }
        index.get(dato).onerror = function (event) {
            alert(" error");
        };
    }
}
startDB();