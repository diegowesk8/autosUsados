import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
  import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCwSjoWnIcTfwCL0SBpUewoHUNTbPR-Ang",
    authDomain: "autosusadosweb.firebaseapp.com",
    databaseURL: "https://autosusadosweb-default-rtdb.firebaseio.com",
    projectId: "autosusadosweb",
    storageBucket: "autosusadosweb.appspot.com",
    messagingSenderId: "917153788941",
    appId: "1:917153788941:web:4a1ff70f8b0f5e31a95144"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

// Obtener el cuadro de diálogo (modal) y el botón para abrirlo
var modal = document.getElementById("myModal");
var btn = document.getElementById("adminBtn");

// Obtener el elemento de cierre del cuadro de diálogo
var span = document.getElementsByClassName("close")[0];

// Abrir el cuadro de diálogo cuando se hace clic en el botón
btn.onclick = function() {
  modal.style.display = "block";
}

// Cerrar el cuadro de diálogo cuando se hace clic en el elemento de cierre
span.onclick = function() {
  modal.style.display = "none";
}

// Cerrar el cuadro de diálogo cuando se hace clic fuera de él
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Manejar el envío del formulario
var loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {
  event.preventDefault();

  // Obtener los valores del correo y la contraseña ingresados
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  const auth = getAuth();
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in
    window.location.href = "/html/administrador.html";
    // ...
  })
  .catch((error) => {
    // Manejo de errores en caso de fallo en el inicio de sesión
    var errorMessage = error.message;
    var errorElement = document.createElement("div");
    errorElement.textContent = errorMessage;
    errorElement.style.color = "red";
    loginForm.appendChild(errorElement);
  });
 


});
