let video = document.getElementById("Video1");
let imagenCapturada=document.getElementById("imagenCapturada");

document.getElementById('files').addEventListener('change', VisualizarVideoSleccionado, false);

function VisualizarVideoSleccionado(evt){   
    let files = evt.target.files; // Se crea el array files con los ficheros seleccionados

    f = files[0]; // Solo no interesa el primero.
    reader = new FileReader(); // El objeto reader leerá el archivo cuando ocurra el evento onload

  //  VideoReproduciendose.value = f.name;
    let ElElFichero = f.name;//"http://127.0.0.1:8080/sostenible.mp4"//

    reader.onload = (function (ElFichero) {
        return function (e) {
            try {

                video.src = e.target.result;
                video.currentTime = 0;
                video.load();
                video.play();
            }
            catch (err) {
                //  alert("Error : " + err);
            }

        };
    })(f);
    reader.readAsDataURL(f);
}

function capturarFoto(){
    oFoto = document.querySelector('#foto');
    // Define la resolución de la fotografia capturada
    w = 600; //oCamara.width();
    h = 100; //oCamara.height();
    oFoto.width = w;
    oFoto.height = h;
    

    //Obtener el contexto 2d del canvas que posibilita capturar la imagen
    oContexto = oFoto.getContext('2d');
    oContexto.drawImage(video, 0, 0, w, h);
    //   alert(cclasificacion.value)
    let myImage = oFoto.toDataURL("image/png");
    //console.log(myImage)
    imagenCapturada.src=myImage;
    console.log(imagenCapturada.src);
}