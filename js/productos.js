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

    

    
    var divContenido = document.getElementById('contenido');



// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// Ejecuciones
mostrarProductos();



// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// FUNCIONES
function mostrarProductos(){
    const db = getDatabase(app);
    const dbRef = ref(db, 'carros');
    

    onValue(dbRef, (snapshot)=>{
        snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();

            if(childData.estado == 0){
                divContenido.innerHTML +=
                    "<div class='divProducto'>" +
                        "<div class='producto'>" +
                            "<picture><img src='" + childData.url + "" + childData.nombre + "'></picture>" +
                            "<div>" +
                                "<h2>Carro</h2>" +
                                "<h3>--------</h3>" +
                                "<h2 id='lblSabor' class='lblSabor'>" + childData.nombre + "</h2>" +
                            "</div>" +
                        "</div>" +
                        "<div>" +
                            "<hr>" +
                            "<h3 id='' class='lblPrecio'>$" + childData.precio + "</h3>" +
                            "<hr>" +
                        "</div>" +
                        "<div class='descripcion'>" +
                            "<p>" + childData.descripcion + "</p>" +
                        "</div>" +
                    "</div>";
            }
        });
    },{
        onlyOnce: true
    });
}