
  // Import the functions you need from the SDKs you need
  // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getStorage,ref as refS, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";

import { getDatabase, onValue, ref, set, child, get, update, remove } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwSjoWnIcTfwCL0SBpUewoHUNTbPR-Ang",
  authDomain: "autosusadosweb.firebaseapp.com",
  databaseURL: "https://autosusadosweb-default-rtdb.firebaseio.com",
  projectId: "autosusadosweb",
  storageBucket: "autosusadosweb.appspot.com",
  messagingSenderId: "917153788941",
  appId: "1:917153788941:web:4a1ff70f8b0f5e31a95144"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

var id = 0;             // Identificador unico del producto
var nombreP = "";       // Nombre del producto
var descripcionP = "";  // Descripción del producto
var precioP = 0.0;      // Precio del producto
var imagen = "";        // Ruta de la imagen cargada
var nombreImagen = "";  // Nombre imagen
var urlImagen = "";     // Dirección de la imagen
var estadoP = 0;        // Estado del producto

var txtBusqueda = document.getElementById('txtBusqueda');
var txtNombre = document.getElementById('txtNombre');
var txtDescripcion = document.getElementById('txtDescripcion');
var txtPrecio = document.getElementById('txtPrecio');
var lblImagen = document.getElementById('lblImagen');
var txtImagen = document.getElementById('txtImagen');
var imgProducto = document.getElementById('imgProducto');
var lblActivado = document.getElementById('lblActivado');
var cbxActivado = document.getElementById('cbxActivado');

var formulario = document.getElementById('contenido');
var btnCerar = document.getElementById('btnCerrar');
var btnProducto = document.getElementById('btnProducto');
var btnLimpiar = document.getElementById('btnLimpiar');
var btnBusqueda = document.getElementById('btnBusqueda');



// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// FUNCIONES

// AUTENTICACIÓN - Comprobación de inicio de seción
//onAuthStateChanged(autenticacion, (user) => {
//    if(user){
  //      console.log(user);
    //}
    //else{
        //location = '/html/administrador.html';
    //}
//});

// Limpiar campos
function limpiarProducto(){
    id = 0;
    nombreP = "";
    descripcionP = "";
    precioP = 0.0;
    imagen = "";
    nombreImagen = "";
    urlImagen = "";
    estadoP = "";

    txtBusqueda.value = "";
    txtNombre.value = "";
    txtDescripcion.value = "";
    txtPrecio.value = "";
    txtImagen.value = "";
    lblImagen.innerHTML = "Subir imagen...";
    imgProducto.src = "/img/Esperando.png";
    btnProducto.innerHTML = "Guardar";
    lblActivado.style.display = "none";
    cbxActivado.style.display = "none";
}

// Cargar imagen
function cargarImagen(){
    // Obtener imagen
    imagen = event.target.files[0];
    nombreImagen = event.target.files[0].name;

    // Mostrar nombre
    lblImagen.innerHTML = nombreImagen.substring(0, 29);
    if(nombreImagen.length > 30) lblImagen.innerHTML += "...";
}

// Agregar un nuevo producto a la base de datos
async function accionProducto(){
    // Cuando el boton señale 'Guardar'
    if(btnProducto.innerHTML == "Guardar"){
        if(camposLlenos() && txtImagen.value!=""){
            btnProducto.disabled = true;
            imgProducto.src = "";

            if(await subirImagen()){
                if(await bajarImagen()){
                    agregarProducto();
                }
                else alert("Error intentar bajar la imagen.")
            }
            else alert("Error al intentar subir la imagen.");
        }
        else alert("Favor de ingresar bien los datos.");
    }
    // Cuando el boton señale 'Actualizar'
    else if(btnProducto.innerHTML == "Actualizar"){
        if(camposLlenos()){
            btnProducto.disabled = true;
            //imgProducto.src = "/img/Esperando.gif";

            // En caso de cambiar la imagen
            let exito = true;
            if(txtImagen.value != ""){
                if(await subirImagen()){
                    if(! await bajarImagen()){
                        alert("Error intentar bajar la imagen.")
                        exito = false;
                    }
                }
                else{
                    alert("Error al intentar subir la imagen.");
                    exito = false;
                }
            }

            if(exito) actualizarProducto();
        }
    }
}

// Subir imagen al servidor
async function subirImagen(){
    const storage = getStorage();
    const storageRef = refS(storage, 'imagenes/' + nombreImagen);
    
    let exito;
    await uploadBytes(storageRef, imagen).then((snapshot) => {
        exito = true;
    })
    .catch((error) => {
        exito = false;
    });

    return exito;
}

// Cargar Imagen
async function bajarImagen(){
    const storage = getStorage();
    const storageRef = refS(storage, 'imagenes/' + nombreImagen);

    // Obtener URL
    let exito;
    await getDownloadURL(storageRef).then((url) => {
        urlImagen = url;
        exito = true;
    })
    .catch((error) => {
        imgProducto.src = "/img/Error404.png";
        exito = false;
    });

    return exito;
}

// Leer y guardar el valor de los inputs
function leerInputs(){
    nombreP = txtNombre.value;
    descripcionP = txtDescripcion.value;
    precioP = txtPrecio.value;
}

// Agregar un nuevo producto (Empanada)
async function agregarProducto(){
    leerInputs();

    await set(ref(db,'carros/' + Math.floor(Math.random()*10000)),{
        nombre : nombreP,
        descripcion : descripcionP,
        precio : precioP,
        estado : 0,
        url : urlImagen,
        nombreImg : nombreImagen})
    .then((response) => {
        imgProducto.src = urlImagen;
        alert("Producto registrado.");
        btnProducto.innerHTML = "Actualizar";
        btnProducto.disabled = false;
        estadoP = 0;
    })
    .catch((error) => {
        alert("Error en el registro del producto.");
        imgProducto.src = "/img/Esperando.png";
    });
}

// VALIDACIÓN - Comprobar que los campos no esten vacios
function camposLlenos(){
    let exito = true;

    if(txtNombre.value == ""
    || txtDescripcion.value == ""
    || txtPrecio.value == ""){
        exito = false;
    }

    return exito;
}

// Consultar un producto con su sabor
function consultaCarro(){
    const db = getDatabase();
    const dbRef = ref(db, 'carros');
    

    onValue(dbRef, (snapshot)=>{
        let exito = false;

        snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();

            if(childData.nombre == txtBusqueda.value){
                id = childKey;
                txtNombre.value = nombreP = childData.nombre;
                txtDescripcion.value = descripcionP = childData.descripcion;
                txtPrecio.value = precioP = childData.precio;
                imgProducto.src = urlImagen = childData.url;
                lblImagen.innerHTML = nombreImagen = childData.nombreImg;
                estadoP = childData.estado;

                btnProducto.innerHTML = "Actualizar";
                txtBusqueda.value = "";

                lblActivado.style.display = "block";
                cbxActivado.style.display = "block";
                if(estadoP == 0)
                    cbxActivado.checked = 1;
                else
                    cbxActivado.checked = 0;

                exito = true;
            }
        });

        if(exito == false){
            let busqueda = txtBusqueda.value;
            limpiarProducto();
            txtBusqueda.value = busqueda;
        }
    },{
        onlyOnce: true
    });
}

// Guardar cambio de estado
function cambioEstado(){
    if(cbxActivado.checked)
        estadoP = 0;
    else estadoP = 1;
}

// Actualizar la información o estado de un producto
async function actualizarProducto(){
    leerInputs();

    await update(ref(db,'carros/'+ id),{
        descripcion : descripcionP,
        estado : estadoP,
        nombre : nombreP,
        nombreImg : nombreImagen,
        precio : precioP,
        url : urlImagen
    }).then(()=>{
        imgProducto.src = urlImagen;
        alert("Producto actualizado.");
        btnProducto.disabled = false;
    })
    .catch((error)=>{
        alert("Error inesperado");
        imgProducto.src = "/img/Esperando.png";
    });
}




// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// ASIGNACIÓN DE EVENTOS
formulario.addEventListener('submit', async e =>{});
//btnCerar.addEventListener('click', async () =>{
  //  await signOut(autenticacion);
    //location = '/index.html';
//});
txtImagen.addEventListener('change', cargarImagen);
btnProducto.addEventListener('click', accionProducto);
btnLimpiar.addEventListener('click', limpiarProducto);
btnBusqueda.addEventListener('click', consultaCarro);
cbxActivado.addEventListener('change', cambioEstado);
  



