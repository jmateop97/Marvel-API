// //----------------------------------------------------------------------------------------------------------------------
const urlAPI = 'https://gateway.marvel.com/v1/public/comics/3537?offset=';
var urlCharacters = 'https://gateway.marvel.com:443/v1/public/characters?limit=100&offset='
var urlComics = 'https://gateway.marvel.com:443/v1/public/comics?limit=100&offset='
var urlSeries = 'https://gateway.marvel.com:443/v1/public/series?limit=100&offset='
var urlEvents = 'https://gateway.marvel.com:443/v1/public/events?limit=100&offset='
var tiempoEspera=20000;

// const restoURL = "&ts=1&apikey=ee96dda5519334616bf7fc899b1f3642&hash=43b18ea9140e849e9fd68cf7bc0907c2"
// const restoURL = "&ts=1&apikey=b870f65c899b2f131ab50461401a42d3&hash=6b99c8b03cb53de8a82e7bc3e251a952"
// const restoURL = "&ts=1&apikey=a9c74dafc327d24f40d953a08e0eef9a&hash=a9131a330402b4bafc72630ec0c0766e"
const restoURL = "&ts=1&apikey=6f7fd38a8d0087953e9ed5884e9faf11&hash=9b4a6548f63e760f0c5a6906b9978aca"
const restoURLCharacters = restoURL;
const urlCompleta = urlAPI + restoURL;
// //-------------------------------------------------------------------------------------------------------------------------
let arrayHeroes = [];
let arrayComics = [];
let arraySeries = [];
let arrayEventos = [];
let filtrosOption = ["Heroes", "Comics", "Series", "Events"];
let enInicio = false;

/**
 * Método que se ejecuta cuando abres la web. En el tiempo de espera, se cargan los arrays de heroes, comics, series y eventos,
 * además de crear la página inicial. 
 */
function cargaInicial() {
    heroesEnArray();
    comicsEnArray();
    seriesEnArray();
    eventosEnArray();
    document.body.style.zoom=1.0;
    let pantallaCarga = document.createElement("div");
    pantallaCarga.classList.add("pantallaCarga");
    let cargando = document.createElement("div");
    cargando.classList.add("cargando");
    cargando.setAttribute("style", "margin:50vh auto auto auto;");
    let imagenCargando = document.createElement("img");
    imagenCargando.setAttribute("src", "css/Imagenes/circleSpiderMan.png");
    imagenCargando.setAttribute("style", "width:80%;height:80%");
    cargando.append(imagenCargando);
    pantallaCarga.appendChild(cargando);
    let mensajeCarga = document.createElement("p");
    mensajeCarga.innerHTML = "The data from the wiki is loading. Please wait";
    pantallaCarga.appendChild(mensajeCarga);
    document.body.append(pantallaCarga);
    // setTimeout(()=>{
    //     carruselImagenesCarga(2);
    // },tiempoEspera/4)
    // setTimeout(()=>{
    //     carruselImagenesCarga(3);
    // },13000)
    setTimeout(() => {
        document.getElementsByClassName("pantallaCarga")[0].remove();
        arrayHeroes = arrayHeroes.sort((a, b) => b.comics.available - a.comics.available);
        console.log(arrayHeroes);
        console.log(arraySeries);
        console.log(arrayEventos);
    }, tiempoEspera);
    desplegarElementosIniciales(tiempoEspera);
    setTimeout(()=>{
        enInicio = true;
    },tiempoEspera)

}

function carruselImagenesCarga(numDiapositiva) {
    let intervalo = tiempoEspera/4;
    let pantallaCarga = document.getElementsByClassName("pantallaCarga")[0];
    pantallaCarga.style.backgroundImage=`url(css/Imagenes/Diapositiva${numDiapositiva}.jpg)`;
}

/**
 * Método que busca los contenidos marcados como favoritos, y les pone el logo del corazón en rojo.
 * @param {"Categoría de la API, en la que se va a buscar los favoritos. Puede ser heroes, comics, eventos o series"} opcion 
 * @param {"Dependiendo de donde estemos, la clase que contienen todos los heroes, con sus corazones se llamará 
*          de una manera u otra. Por eso, se pasa por parámetro, y así se adapta a todos los casos."} claseContenedor 
 */
function marcarFavoritos(opcion,claseContenedor){

        if(localStorage.getItem(`favoritos${opcion}`)!=null){
            let cadenaFav = localStorage.getItem(`favoritos${opcion}`);
            let arrayFav = cadenaFav.split("|");
            console.log(arrayFav);
            let contenedor = document.getElementsByClassName(`${claseContenedor}`)[0];
            console.log(contenedor);
            let divsContenedor;
            if(opcion=="Heroes"){
                divsContenedor = contenedor.getElementsByClassName("heroe");
            }
            else if(opcion=="Comics"){
                divsContenedor = contenedor.getElementsByClassName("comic");
            }

            else{
                divsContenedor = contenedor.getElementsByClassName("serie");
            }
            console.log(divsContenedor);
            for(let divContenedor of divsContenedor){
                console.log(divContenedor.getElementsByTagName("input")[0])
                for(let nombreFav of arrayFav){
                    if(divContenedor.getElementsByTagName("input")[0].value==nombreFav){
                        let imagenFav = divContenedor.getElementsByClassName("favorito")[0].getElementsByTagName("img")[0];
                        imagenFav.setAttribute("style","filter:invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%);");
                    }                        
                }
            }
        }
}

/**
 * Método que muestra todos los favoritos que están guardados en el local storage.
 */
function mostrarFavoritos() {
    borrar();
    let mainContainer = document.createElement("DIV");
    mainContainer.classList.add("mainContainerFav");
    document.body.append(mainContainer);
    let h1 = document.createElement("h1");
    h1.innerHTML="Your favorites";
    h1.classList.add("h1Favoritos");
    mainContainer.append(h1);
    let cadenaFavoritos="";
    let favoritos;
    var arrayFav=[];
    enInicio=false;
    let categorias =["Heroes","Comics","Series","Events"];
    let contador =0;
    for(let i=0;i<categorias.length;i++){
        if(localStorage.getItem(`favoritos${categorias[i]}`)!=null){7
            let pCategoria = document.createElement("p");
            pCategoria.innerHTML=categorias[i];
            pCategoria.classList.add("categoriaPagFavoritos");
            mainContainer.append(pCategoria);
            if(contador>0){
                document.getElementsByClassName("contenedorIndex")[0].classList.add("contenedorFavoritos");
                document.getElementsByClassName("contenedorIndex")[0].classList.remove("contenedorIndex");
            }
            let contenedorIndex = document.createElement("section");
            contenedorIndex.classList.add("contenedorIndex");
            mainContainer.append(contenedorIndex);
            cadenaFavoritos = localStorage.getItem(`favoritos${categorias[i]}`);
            arrayFav = cadenaFavoritos.split("|");
            console.log(arrayFav);
            if(arrayFav[arrayFav.length-1]==""){
                arrayFav.pop();
            }
            for(let j=0;j<arrayFav.length;j++){
                let arrayFavAux;
                if(i==0){
                    arrayFavAux = arrayHeroes.filter(heroe=> heroe.name==arrayFav[j]);
                }
                else if(i==1){
                    arrayFavAux = arrayComics.filter(elemento=> elemento.title==arrayFav[j]);
                    console.log(arrayFavAux[0])
                }

                else if(i==2){
                    arrayFavAux = arraySeries.filter(elemento=> elemento.title==arrayFav[j]);
                    console.log(arrayFavAux[0])
                }

                else if(i==3){
                    arrayFavAux = arrayEventos.filter(elemento=> elemento.title==arrayFav[j]);
                    console.log(arrayFavAux[0])
                }
                crearDivDato(categorias[i],arrayFavAux[0]);
                console.log(document.getElementsByTagName("section")[contador])
                contador++;
                marcarFavoritos(categorias[i],"contenedorIndex");

            }
        }

    }
    document.getElementsByClassName("contenedorIndex")[0].setAttribute("style","justify-content:start;")

    marcarFavoritos("Comics","contenedorIndex");
    marcarFavoritos("Eventos","contenedorIndex");
    marcarFavoritos("Series","contenedorIndex");


}

/**
 * Método que forma la pantalla de inicio. 
 */
function formarPantallaInicio() {
    borrar();


    if (document.getElementsByClassName("bannerInicio").length <= 0) {
        // Se empieza a crear la pantalla de inicio
        //Se crea el div del banner
        let banner = document.createElement("div");
        banner.classList.add("bannerInicio");
        document.body.appendChild(banner);
        //-----------------------------------------------

        //Se crea la sección de selección del superheroe
        let seleccionSuperheroe = document.createElement("div");
        seleccionSuperheroe.classList.add("seleccionSuperheroe");
        document.body.appendChild(seleccionSuperheroe);
        //-------------------------------------------------------------------------------------

        //Se crean sus contenidos y/o divs hijos
        //----------------Creación del h2------------------------
        let h2SeleccSuperheroe = document.createElement("h2");
        h2SeleccSuperheroe.innerHTML = "Select your Superhero";
        seleccionSuperheroe.appendChild(h2SeleccSuperheroe);
        //-------------------------------------------------------

        //Se crea el div del buscador de superheroes, con todos sus elementos hijos
        let buscadorSuperHeroes = document.createElement("div");
        buscadorSuperHeroes.classList.add("buscadorSuperHeroes");
        seleccionSuperheroe.appendChild(buscadorSuperHeroes);

        let pBuscador = document.createElement("p");
        pBuscador.innerHTML = "Find your superhero";
        buscadorSuperHeroes.appendChild(pBuscador);

        //Se crea los select de búsqueda
        let select = document.createElement("select");
        select.setAttribute("onchange", "opcionEscogida(event)");
        buscadorSuperHeroes.appendChild(select);
        for (let i = 0; i < filtrosOption.length; i++) {
            let option = document.createElement("option");
            option.value = filtrosOption[i];
            option.text = filtrosOption[i];
            select.appendChild(option);
        }

        //-----------------Creación del cuadro de búsqueda---------------------------------
        let cuadroBusqueda = document.createElement("input");
        cuadroBusqueda.setAttribute("type", "text");
        cuadroBusqueda.setAttribute("name", "datoBuscado");
        cuadroBusqueda.setAttribute("minlength", "3");
        cuadroBusqueda.setAttribute("placeholder", "Write a superhero to search");
        buscadorSuperHeroes.appendChild(cuadroBusqueda);
        //----------------------------------------------------------------------------------

        //-------------Se crea el div contenedor de superheroes---
        let contenedorIndex = document.createElement("div");
        contenedorIndex.classList.add("contenedorIndex");
        seleccionSuperheroe.appendChild(contenedorIndex);
        //------------------------------------------------------

        //-------------Se crea el div del indice de páginas---
        let indicePaginas = document.createElement("div");
        indicePaginas.classList.add("indicePaginas");
        document.body.appendChild(indicePaginas);
        mostrarIndicePaginas("Heroes");
        //------------------------------------------------------

        //
        //-------------------------------------------------------------------------------------
    }




}

/**
 * Método que introduce los heroes obtenidos de las diferentes llamadas, en un array.
 */
async function heroesEnArray() {
    for (let i = 0; i < 16; i++) {
        var respuesta = null;
        if (i == 0) {
            respuesta = await fetch(`${urlCharacters}${0}${restoURL}`);
        }
        else if (i != 0) {
            respuesta = await fetch(`${urlCharacters}${i * 100 - 1}${restoURL}`);
        }

        let json = await respuesta.json();

        for (let j = 0; j < 100; j++) {

            if (!json.data.results[j].thumbnail.path.includes("not_ava")) {
                arrayHeroes.push(json.data.results[j]);
            }
            else {
                let heroe = json.data.results[j];
                heroe.thumbnail.path = "css/Imagenes/ImagenNoEncontrada";
                heroe.thumbnail.extension = "jpg";
                arrayHeroes.push(heroe);
            }
        }
    }
}

/**
 * Método que introduce las series obtenidas de las diferentes llamadas, en un array.
 */
async function seriesEnArray() {
    for (let i = 0; i < 1; i++) {
        var respuesta = null;
        if (i == 0) {
            respuesta = await fetch(`${urlSeries}${0}${restoURL}`);
        }
        else if (i != 0) {
            respuesta = await fetch(`${urlSeries}${i * 100 - 1}${restoURL}`);
        }
        let json = await respuesta.json();
        for (let j = 0; j < 100; j++) {
            if (!json.data.results[j].thumbnail.path.includes("not_ava")) {
                arraySeries.push(json.data.results[j]);
            }
        }
    }
}

/**
 * Método que introduce los eventos obtenidos de las diferentes llamadas, en un array.
 */
async function eventosEnArray() {
    for (let i = 0; i < 1; i++) {
        var respuesta = null;
        if (i == 0) {
            respuesta = await fetch(`${urlEvents}${0}${restoURL}`);
        }
        else if (i != 0) {
            respuesta = await fetch(`${urlEvents}${i * 100 - 1}${restoURL}`);
        }
        let json = await respuesta.json();
        for (let j = 0; j < 100; j++) {
            if (!json.data.results[j].thumbnail.path.includes("not_ava")) {
                arrayEventos.push(json.data.results[j]);
            }
        }
    }
}

/**
 * Método que introduce los comics obtenidos de las diferentes llamadas, en un array.
 */
async function comicsEnArray() {
    for (let i = 100; i < 101; i++) {
        var respuesta = null;
        var respuesta2=null;
        let json2=null;
        if (i == 0) {
            respuesta = await fetch(`${urlComics}${0}${restoURL}`);
            respuesta2= await fetch(`${urlAPI}${0}${restoURL}`);
            json2 = await respuesta2.json();
            arrayComics.push(json2.data.results[0]);
        }
        else if (i != 0) {
            respuesta = await fetch(`${urlComics}${i * 100 - 1}${restoURL}`);
        }
        let json = await respuesta.json();
        for (let j = 0; j < 100; j++) {
            if (!json.data.results[j].thumbnail.path.includes("not_ava")) {
                arrayComics.push(json.data.results[j]);
            }
        }
    }
    
    console.log(arrayComics[0]);
}


/**
 * Método que forma, y plasma en pantalla, los diferentes cuadros de páginas.
 * @param {"Dependiendo de la elección, se desplegarán datos de una categoría (Heroes,Series,Comics,Eventos), 
 *          se despliegarán los datos de una u otra"} eleccion 
 */
function mostrarIndicePaginas(eleccion) {
    let indicePaginas = document.getElementsByClassName("indicePaginas")[0];
    if (indicePaginas != undefined) {
        indicePaginas.innerHTML = "";
    }
    let numIndices=0;
    let numeroIn;
    switch (String(eleccion)) {
        case "Events":
            numeroIn = arrayEventos.length/100;
            if(numeroIn<1){
                numIndices = numeroIn;
            }
            else{
                numIndices = numeroIn+1;

            }
            console.log(numIndices)
            break;

        case "Series":
            numeroIn = arrayEventos.length/100;
            numIndices = numeroIn;
            console.log(numIndices)
            break;

        case "Comics":
            numeroIn = arrayEventos.length/100;
            numIndices = numeroIn;
            console.log(numIndices)
            break;

        case "Heroes":
            numeroIn = arrayHeroes.length/100;
            numIndices = numeroIn;
            console.log(numIndices)
            break;
    
        default:
            break;
    }

    console.log("Hay"+numIndices+"índices");
    for (i = 0; i < numIndices; i++) {
        let divPagina = document.createElement("DIV");
        if (i == 0) {
            divPagina.setAttribute("onClick", `desplegarDatos(0,'${eleccion}')`);
        }
        else {
            divPagina.setAttribute("onClick", `desplegarDatos(${(i * 100) - i},'${eleccion}')`);
        }
        let numPagina = document.createElement("P");
        numPagina.innerHTML = `${i + 1}`;
        divPagina.appendChild(numPagina);
        if (document.getElementsByClassName("indicePaginas").length != 0) {
            let indicePaginas = document.getElementsByClassName("indicePaginas")[0];
            indicePaginas.appendChild(divPagina);
        }
        else {
            let indicePaginas = document.createElement("div");
            indicePaginas.classList.add("indicePaginas");
            indicePaginas.appendChild(divPagina);
        }

    }
}

function opcionEscogida(e) {
    document.getElementsByTagName("input")[0].value="";
    desplegarDatos(0, e.target.value);
}


/**
 * El método que despliega los datos, haciendo llamadas iteradas, al método crearDivDato
 * @param {"Indice del array por el que se empieza a sacar los datos. Si estoy en la página 1, offset es 0, y si estoy en la 3, offset será 198"} offset 
 * @param {"Categoría de la cual, se van a desplegar los datos."} opcionBuscar 
 */
function desplegarDatos(offset, opcionBuscar) {
    let claseCss = "";
    console.log(opcionBuscar);
    let contenedorIndex = document.getElementsByClassName("contenedorIndex")[0];
    let arrayBusqueda = [];
    if (document.getElementsByClassName("contenedorIndex").length > 0) {
        contenedorIndex.innerHTML = "";
    }

    if (String(opcionBuscar) == "Heroes") {
        arrayBusqueda = arrayHeroes;
    }
    else if (String(opcionBuscar) == "Comics") {
        arrayBusqueda = arrayComics;
    }
    else if (String(opcionBuscar) == "Series") {
        arrayBusqueda = arraySeries;
    }

    else if (String(opcionBuscar) == "Events") {
        arrayBusqueda = arrayEventos;
    }

    for (let i = offset; i < (offset + 100); i++) {
        if(arrayBusqueda[i]!=undefined){
            crearDivDato(String(opcionBuscar),arrayBusqueda[i]);
        }
    }
    mostrarIndicePaginas(opcionBuscar);
    marcarFavoritos(opcionBuscar,"contenedorIndex");
}

/**
 * Método que forma el HTML del Index, y muestra la primera página de los heroes. El tiempo de espera será mayor que 0, SOLO la primera
 * vez que se abre la aplicación. 
 * @param {"El tiempo que se va a esperar hasta que se ejecute esta función"} tiempoEspera 
 */
function desplegarElementosIniciales(tiempoEspera) {
   setTimeout(()=>{
        formarPantallaInicio();
        let buscarHeroe = document.getElementsByClassName("buscadorSuperHeroes")[0];
        let inputBusqueda = buscarHeroe.getElementsByTagName("input")[0];
        inputBusqueda.addEventListener("keyup", (e) => {
            let select = document.getElementsByTagName("select")[0];
            encontrarDatosBusqueda(e.target.value, select.value);
        })
        console.log(document.getElementsByClassName("indicePaginas")[0])
        if (document.getElementsByClassName("indicePaginas").length <= 0) {
            mostrarIndicePaginas("Heroes");
        }
        if (document.getElementsByClassName("bannerInicio").length != 0) {

        }
        if (enInicio == false) {
            console.log("Entra en la condición")
            document.getElementsByClassName("seleccionSuperheroe")[0].style.display = "block";
            document.getElementsByClassName("bannerInicio")[0].style.display = "block";
            if (document.getElementsByClassName("pantallaCarga").length != 0) {
                document.getElementsByClassName("pantallaCarga")[0].remove();
            }
            console.log(arrayHeroes.length);
            for (let i = 0; i < 100; i++) {
                console.log("Entra en el for")
                crearDivDato("Heroes",arrayHeroes[i]);
            }
            console.log(arrayHeroes[0])
        }
        crearSeccionNotas();
        enInicio = true;
        marcarFavoritos("Heroes","contenedorIndex");
   },tiempoEspera)

}

/**
 * Método que "dibuja" el elemento que se quiera mostrar. Dependiendo de en qué apartado estemos de la página, mostrará un heroe,
 * un comic, una serie, o un evento. Se usa cada vez que se tiene que sacar un elemento de la API en pantalla. 
 * @param {*} opcionSelect 
 * @param {*} elemento 
 */
function crearDivDato(opcionSelect, elemento) {
    let contenedorIndex;
    if(document.getElementsByClassName("contenedorImagenesComics").length>0){
        contenedorIndex = document.getElementsByClassName("contenedorImagenesComics")[0];
    }

    else{
        contenedorIndex = document.getElementsByClassName("contenedorIndex")[0];
    }



    let claseCss = "";
    switch (opcionSelect) {
        case "Heroes":
            claseCss = "heroe";

            break;

        case "Series":
            if(document.getElementsByClassName("contenedorImagenesSeries").length>0){
                contenedorIndex = document.getElementsByClassName("contenedorImagenesSeries")[0];
            }
            claseCss = "serie"

            break;


        case "Comics":
            claseCss = "comic";

            break;

        case "Events":
            claseCss = "serie";
            if(document.getElementsByClassName("contenedorImagenesEventos").length>0){
                contenedorIndex = document.getElementsByClassName("contenedorImagenesEventos")[0];
            }
            
            break;

        default:
            break;
    }
    let divDato = document.createElement("DIV");
    let divImagenDato = document.createElement("div");
    let iamgenElemento = document.createElement("IMG");
    let nombreElemento = document.createElement("P");
    let inputHidden = document.createElement("input");
    let seccionFavorito = document.createElement("section");
    seccionFavorito.classList.add("favorito");
    let imagenFavorito = document.createElement("img");
    imagenFavorito.src = "css/Imagenes/heart-solid.svg";
    seccionFavorito.appendChild(imagenFavorito);
    divDato.appendChild(seccionFavorito);
    inputHidden.setAttribute("type", "hidden");
    
    if (opcionSelect == "Heroes") {
        inputHidden.setAttribute("value", `${elemento.name}`);
        nombreElemento.innerHTML = `${elemento.name}`;
    }
    else {
        inputHidden.setAttribute("value", `${elemento.title}`);
        nombreElemento.innerHTML = `${elemento.title}`;
    }
    divDato.classList.add(`${claseCss}`);
    iamgenElemento.setAttribute("src", `${elemento.thumbnail.path}.${elemento.thumbnail.extension}`);

    divImagenDato.appendChild(iamgenElemento);
    divDato.appendChild(divImagenDato);
    divDato.appendChild(nombreElemento);
    divDato.appendChild(inputHidden);
    contenedorIndex.appendChild(divDato);
    // Ese elemento tiene un evento de click, que obtiene como resultado, la página detallada del mismo.
    iamgenElemento.addEventListener("click", (e) => {
        let divDato = e.target.parentElement.parentElement;
        let inputH = divDato.getElementsByTagName("input")[0];
        console.log(inputH.value);
        let nombreElemento = "";
        console.log(e.target.value)
        nombreElemento = `${inputH.value}`;
        console.log(nombreElemento);
        if(opcionSelect=="Heroes"){
            obtenerDatosHeroe(nombreElemento);
        }

        else if(opcionSelect=="Comics"){
            mostrarPaginaElemento("Comics",nombreElemento);
        }


        else if(opcionSelect=="Series"){
            mostrarPaginaElemento("Series",nombreElemento);
        }

        else if(opcionSelect=="Events"){
            mostrarPaginaElemento("Events",nombreElemento);
        }
    })

    // Ese elemento tiene un evento de click, que obtiene como resultado, la página detallada del mismo.
    seccionFavorito.addEventListener("click", (e) => {
        let favoritos = localStorage.getItem("favoritos");
        let divDato = e.target.parentElement.parentElement;
        console.log(divDato);
        let corazon = e.target;

        let inputCampoDiv = divDato.getElementsByTagName("input")[0];
        if(!esElementoFavorito(inputCampoDiv.value,opcionSelect)){
            corazon.style.filter = "invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)";
            aniadirFavorito(inputCampoDiv.value,opcionSelect);
        }

        else{
            eliminarFavorito(inputCampoDiv.value,opcionSelect);
            corazon.style.filter = "none";

        }

    })
}

/**
 * Método que forma el HTML en la que se mostrará el elemento comic, serie, o evento en concreto escogido.
 * @param {"Dependiendo de si se ha elegido un tipo de elemento u otro, algunas partes de la página, cambian"} seccionMostrar
 * @param {"El elemento que se va a mostrar. Es un array, porque viene de un método filter de otro array"} elementoEscogido 
 */
function crearHTMLElemento(seccionMostrar){
    
    //------------------------------Creación del lado de info del comic o evento------------------------------------------------

    // -------------Se crea el div de infoElementoEscogido--------------
    let infoElementoEscogido = document.createElement("DIV");
    infoElementoEscogido.classList.add("infoElementoEscogido");
    document.body.appendChild(infoElementoEscogido);
    //-------------------------------------------------------

    //--------Se crea el lado de nombre del comic-----------------
    let nombreElementoEscogido = document.createElement("DIV");
    nombreElementoEscogido.classList.add("nombreElementoEscogido");
    infoElementoEscogido.appendChild(nombreElementoEscogido);
    //-----------------------------------------------------------

    // -------------Se crea la imagen y el h1 y el div del fondo borroso--------------
    let imagenElementoEscogido = document.createElement("IMG");
    imagenElementoEscogido.classList.add("imagenElementoEscogido");
    nombreElementoEscogido.appendChild(imagenElementoEscogido);
    let h1ElementoEscogido = document.createElement("H1");
    nombreElementoEscogido.appendChild(h1ElementoEscogido);
    //-------------------------------------------------------

    // -------------Se crea el div de la sinopsis--------------
    let sinopsisElementoEscogido = document.createElement("DIV");
    sinopsisElementoEscogido.classList.add("sinopsisElementoEscogido");
    nombreElementoEscogido.appendChild(sinopsisElementoEscogido);
    let parrafoSinopsis = document.createElement("P");
    sinopsisElementoEscogido.appendChild(parrafoSinopsis);
    //-------------------------------------------------------

    //--------------------Se crea el div de la parte derecha de la página (Personajes, comics,series...)-----
    let otrosDatosElementoEscogido = document.createElement("DIV");
    otrosDatosElementoEscogido.classList.add("otrosDatosComic");
    infoElementoEscogido.appendChild(otrosDatosElementoEscogido);
    // Se crea el div que contiene los enlaces a los diferentes secciones de otros datos de comic-----
    let enlacesOtrosDatosElementoEscogido = document.createElement("DIV");
    otrosDatosElementoEscogido.appendChild(enlacesOtrosDatosElementoEscogido);
    enlacesOtrosDatosElementoEscogido.classList.add("enlacesOtrosDatosElementoEscogido");
    let enlaceUno = document.createElement("A");
    let enlaceDos = document.createElement("A");
    enlaceUno.innerHTML = "Characters";
    enlaceDos.innerHTML = "Comics, Series";
    enlaceUno.setAttribute("onclick","verPersonajes()");
    enlaceDos.setAttribute("onclick","verOtrosElementosEvento()");
    enlacesOtrosDatosElementoEscogido.appendChild(enlaceUno);
    if(seccionMostrar=="Events"){
        enlacesOtrosDatosElementoEscogido.appendChild(enlaceDos);
    }
    //------------------------------------------------------------------------------------------------

    //------------------Se crea el contenedor de personajes o series del comic-----------
    let contenedorContenidoElemento = document.createElement("DIV");
    contenedorContenidoElemento.classList.add("contenedorPersonajes");
    otrosDatosElementoEscogido.appendChild(contenedorContenidoElemento);
    //-----------------------------------------------------------------------------------
}


/**
 * Método que muestra la página de un comic,serie o evento en concreto. Primero forma el HTML de la página, y luego la rellena con los datos
 * correspondientes, según lo que se halla hecho click.
 * @param {"La sección que se va a mostrar. Puede ser un comic concreto, una serie en concreto, o un evento en concreto."} seccionMostrar 
 * @param {"El nombre del comic, serie o evento en concreto del que se va a mostrar toda la información."} titulo 
 */
function mostrarPaginaElemento(seccionMostrar,titulo) {
    borrar();
    console.log(titulo);
    let elementoEscogido;
    if(seccionMostrar=="Comics"){
         elementoEscogido = arrayComics.filter(element => element.title == `${titulo}`);
    }
    else if(seccionMostrar=="Events"){
        elementoEscogido = arrayEventos.filter(element => element.title == `${titulo}`);
    }

    else if(seccionMostrar=="Series"){
        elementoEscogido = arraySeries.filter(element => element.title == `${titulo}`);
    }


    

    console.log(elementoEscogido);
    let body = document.querySelector("body");
    body.removeAttribute("onload");
    let contenidoWiki = document.getElementsByClassName("contenidoWiki")[0];
    if (document.getElementsByClassName("contenidoWiki").length > 0) {
        contenidoWiki.remove();
    }
    else {
        borrar();
    }

    
    crearHTMLElemento(seccionMostrar);

    //Se empieza a rellenar los elementos HTML con los datos del elemento escogido.
    let imagenElementoEscogido = document.getElementsByClassName("imagenElementoEscogido")[0];
    imagenElementoEscogido.setAttribute("src", `${elementoEscogido[0].thumbnail.path}.${elementoEscogido[0].thumbnail.extension}`);
    let h1ElementoEscogido = document.getElementsByTagName("h1")[1];
    h1ElementoEscogido.innerHTML = `${elementoEscogido[0].title}`;

    let parrafoSinopsis = document.getElementsByClassName("sinopsisElementoEscogido")[0].getElementsByTagName("p")[0];
    if (elementoEscogido[0].description != null) {
        parrafoSinopsis.innerHTML = `${elementoEscogido[0].description}`
    }
    else {
        parrafoSinopsis.innerHTML = "Description not found for this comic.";
    }

    //Para cada personaje que tenga el comic, se crea un div personaje, con una imagen, un enlace a su biografia y su nombre
    let personajesElementoEscogido = [];
    let comicsEvento =[];
    for (let personaje of elementoEscogido[0].characters.items) {
        personajesElementoEscogido.push(`${personaje.name}`);
    }
    console.log(personajesElementoEscogido);
    console.log(arrayHeroes[0].name);

    for (let i = 0; i < personajesElementoEscogido.length; i++) {
        let personaje = arrayHeroes.filter(heroe => heroe.name == `${personajesElementoEscogido[i]}`);
        if(personaje[0]!=undefined){
            console.log("Entra para crear los personajes")
            crearElementosContenedorElementoEscogido(personaje[0],"contenedorPersonajes","personaje");
        }
    }

    //En caso de que el elemento elegido sea un evento, habrá un segundo apartado (Aparte del de personaje), que será comics, en el que
    // se podrán ver los comics que componen el evento. No se muestra hasta que se haga click en el enlace de comics.
    if(seccionMostrar=="Events"){
        //Se guarda en un array, los títulos de los comics que componen el evento.
        for (let comic of elementoEscogido[0].comics.items) {
            comicsEvento.push(`${comic.name}`);
        }

        console.log(comicsEvento);
        let contenedorComicsEventos = document.createElement("div");
        contenedorComicsEventos.classList.add("contenedorComicsEventos");
        contenedorComicsEventos.setAttribute("style","display:none;");
        let otrosDatosElementoEscogido = document.getElementsByClassName("otrosDatosComic")[0];
        otrosDatosElementoEscogido.appendChild(contenedorComicsEventos);

        for (let i = 0; i < comicsEvento.length; i++) {
            //Se busca en el array de comics, un comic que tenga como título el elemento i del array de comics del evento.
            let comic = arrayComics.filter(comic => comic.title == `${comicsEvento[i]}`);
            console.log(comic);
            //Si el comic se encuentra, se crea su ficha dentro de la clase de contenedor de comics. 
            if(comic[0]!=undefined){
                crearElementosContenedorElementoEscogido(comic[0],"contenedorComicsEventos","comic");
            }
        }
    }

    //-------------------------------------------------------------------------------------------
}

/**
 * Método encargado de crear la ficha del tipo de elemento que se pase por parámetro.
 * @param {"El elemento el cual queremos crear"} elemento 
 * @param {"la clase CSS que tendrá asociada el elemento. Se pasa por parámetro para que este método se ajuste a todos los tipos de elementos"} claseContenedor 
 * @param {"La clase CSS que tendrá asociada el contenedor. Se pasa por parámetro para que este método se ajuste a todos los tipos de contenedores"} claseElementoContenedor 
 */
function crearElementosContenedorElementoEscogido(elemento,claseContenedor,claseElementoContenedor){
    console.log("Entra 2")
    let divPersonaje = document.createElement("DIV");
    divPersonaje.classList.add(`${claseElementoContenedor}`);
    let contenedorContenidoElemento = document.getElementsByClassName(`${claseContenedor}`)[0];
    console.log(contenedorContenidoElemento)
    contenedorContenidoElemento.appendChild(divPersonaje);
    let divImagenPersonaje = document.createElement("div");
    divImagenPersonaje.classList.add("divImagenPersonaje");
    let imagenPersonaje = document.createElement("IMG");

    //Si la imagen existe, se obtiene. En caso contrario, se pone una imagen auxiliar.
    if (!elemento.thumbnail.path.includes("not_ava")) {
        imagenPersonaje.src = `${elemento.thumbnail.path}.${elemento.thumbnail.extension}`;
    }
    else {
        imagenPersonaje.src = `css/Imagenes/ImagenNoEncontrada.jpg`;
    }


    let nombrePersonaje = document.createElement("P");
    let inputUrl = document.createElement("input");
    inputUrl.setAttribute("type", "hidden");
    if(claseElementoContenedor=="personaje"){
        inputUrl.value = `${elemento.name}`;
        console.log(elemento.name);
        nombrePersonaje.innerHTML = `${elemento.name}`;
    }
    else{
        inputUrl.value = `${elemento.title}`;
        console.log(elemento.title);
        nombrePersonaje.innerHTML = `${elemento.title}`;
    }
    divImagenPersonaje.appendChild(imagenPersonaje)
    divPersonaje.appendChild(divImagenPersonaje);
    divPersonaje.appendChild(inputUrl);
    divPersonaje.appendChild(nombrePersonaje);

    //A cada elemento se le asignará una función diferente al evento, dependiendo del tipo de elemento que se esté creando.
    divPersonaje.addEventListener("click", (e) => {
        console.log(e.target);
        if(claseElementoContenedor=="personaje"){
            obtenerDatosHeroe(`${inputUrl.value}`);
        }
        else{
            mostrarPaginaElemento("Comics",`${inputUrl.value}`);
        }
    })

}


/**
 * Método que obtiene el heroe, pasándole el nombre, y escribe su nombre en la página específica del mismo. Uno de los métodos que conforman
 * el método obtenerDatosHeroe, el cual se activa cuando hacemos click en un heroe específico, y el que se encarga de mostrar la página
 * de ese héroe específico.
 * @param {"El nombre del heroe"} nombreHeroe 
 * @returns el heroe encontrado a partir de su nombre.
 */
function obtenerNombreHeroe(nombreHeroe) {
    console.log(urlCompleta);
    console.log(arrayHeroes[0].name)
    let contador = 0;
    let heroeEncontrado;
    for (let i = 0; i < arrayHeroes.length; i++) {
        if (arrayHeroes[contador] != undefined) {
            if (arrayHeroes[contador].name == nombreHeroe) {
                heroeEncontrado = arrayHeroes[contador];
                let heroe = document.getElementsByClassName("superheroe")[0];
                let nombre = heroe.getElementsByTagName("p")[0];
                nombre.innerHTML = `${arrayHeroes[contador].name}`;
            }
            contador++;
        }
    }
    return heroeEncontrado;

}

/**
 * Método que escribe la imagen de un heroe específico, pasándole el nombre del heroe. Uno de los métodos que conforman
 * el método obtenerDatosHeroe, el cual se activa cuando hacemos click en un heroe específico, y el que se encarga de mostrar la página
 * de ese héroe específico.
 * @param {"El nombre del heroe."} nombreHeroe 
 */
function obtenerImagenHeroe(nombreHeroe) {
    for (let i = 0; i < arrayHeroes.length; i++) {

        if (arrayHeroes[i].name == nombreHeroe) {
            let heroe = document.getElementsByClassName("superheroe")[0];
            let imagen = heroe.getElementsByTagName("img")[0];
            imagen.src = `${arrayHeroes[i].thumbnail.path}.${arrayHeroes[i].thumbnail.extension}`;
        }

    }

}

/**
 * Método que obtiene la descripción del heroe, pasándole como parámetro el nombre de este. Uno de los métodos que conforman
 * el método obtenerDatosHeroe, el cual se activa cuando hacemos click en un heroe específico, y el que se encarga de mostrar la página
 * de ese héroe específico.
 * @param {""} nombreHeroe 
 */
function obtenerDescripcionHeroe(nombreHeroe) {
    for (let i = 0; i < arrayHeroes.length; i++) {
        if (arrayHeroes[i] != undefined) {
            if (arrayHeroes[i].name == nombreHeroe) {
                let heroe = document.getElementsByClassName("descripcion")[0];
                let descripcion = heroe.getElementsByTagName("p")[1];
                descripcion.innerHTML = `${arrayHeroes[i].description}`;

            }
        }
    }

}
/**
 * Método que obtiene los elementos de las diferentes categorías en las que aparece un heroe. Un heroe puede aparecer en comics y/o series.
 * @param {"El nombre del heroe."} nombreHeroe 
 * @param {"Depende de si es una serie o un comic, se harán unas operaciones u otras."} formatoAparicion 
 */
function obtenerAparacionesHeroe(nombreHeroe,formatoAparicion) {
    let contenedor;
    let arrayBusqueda;
    if(formatoAparicion=="Comics"){
        contenedor = document.getElementsByClassName("contenedorImagenesComics")[0];
        arrayBusqueda = arrayComics;
    }
    else if(formatoAparicion=="Series"){
        contenedor = document.getElementsByClassName("contenedorImagenesSeries")[0];
        arrayBusqueda = arraySeries;
    }

    else if(formatoAparicion=="Events"){
        contenedor = document.getElementsByClassName("contenedorImagenesEventos")[0];
        arrayBusqueda = arrayEventos;
    }

    //Mientras que se obtienen los datos de los comics, se crea el div de cargando. 
    let cargando = document.createElement("div");
    cargando.classList.add("cargando");
    let imagenCargando = document.createElement("img");
    imagenCargando.setAttribute("src", "css/Imagenes/circleSpiderMan.png");
    cargando.append(imagenCargando);
    let mensajeCarga = document.createElement("p");
    mensajeCarga.innerHTML = "Comics and series loading. Please wait";
    cargando.append(mensajeCarga);
    contenedor.appendChild(cargando);

    let aparicionesHeroe = [];

    for (let i = 0; i < arrayBusqueda.length; i++) {
        for (let personaje of arrayBusqueda[i].characters.items) {
            if (personaje.name == `${nombreHeroe}`) {
                aparicionesHeroe.push(arrayBusqueda[i]);
            }
        }
    }
    console.log(aparicionesHeroe);
    //Si no hay comics, se le muestra un mensaje de error al usuario
        if (aparicionesHeroe.length == 0) {
            let mensajeError = document.createElement("div");
            mensajeError.classList.add("mensajeError");
            let imagenError = document.createElement("img");
            imagenError.setAttribute("src", "css/Imagenes/MarvelSad.png");
            mensajeError.appendChild(imagenError);
            let pMensajeError = document.createElement("p");
            pMensajeError.innerHTML = "No comics found for this character. Sorry";
            mensajeError.appendChild(pMensajeError);
            contenedor.append(mensajeError);
        }
    //---------------------------------------------------------------------------

    for (let aparicion of aparicionesHeroe) {
        crearDivDato(formatoAparicion,aparicion);
    }
    cargando.remove();
}

/**
 * Método encargado de borrar la página entera. Se usa cuando queremos cargar otra página.
 */
function borrar() {
    let seleccionSuperHeroe = document.getElementsByClassName("seleccionSuperheroe")[0];
    let banner = document.getElementsByClassName("bannerInicio")[0];
    let contenedorIndex = document.getElementsByClassName("contenedorIndex")[0];
    let contenidoWiki = document.getElementsByClassName("contenidoWiki")[0];
    let infoElementoEscogido = document.getElementsByClassName("infoElementoEscogido")[0];
    let indicePaginas = document.getElementsByClassName("indicePaginas")[0];
    let seccionNotas = document.getElementsByClassName("seccionNotas")[0]; 
    let mainContainerFav = document.getElementsByClassName("mainContainerFav")[0];
    console.log(mainContainerFav)
    
    if (mainContainerFav != null) {
        console.log("Entra en borrar")
        mainContainerFav.remove();
    }
        
    if (seleccionSuperHeroe != null) {
        seleccionSuperHeroe.remove();
    }

    if (contenedorIndex != null && mainContainerFav==null) {
        contenedorIndex.remove();
    }

    if (indicePaginas != null) {
        indicePaginas.remove();
    }

    if (banner != null) {
        banner.remove();
    }

    if (contenidoWiki != null) {
        contenidoWiki.remove();
    }

    if (infoElementoEscogido != null) {
        infoElementoEscogido.remove();
    }



    if(seccionNotas!=null){
        seccionNotas.remove();
    }
}

/**
 * Método que forma el HTML de la página del héroe. 
 */
function construirPaginaHeroe() {
    //Se crea el div con clase 'contenidoWiki' que contendrá los dos apartados de la página del héroe
    let contenidoWiki = document.createElement("div");
    contenidoWiki.classList.add("contenidoWiki");
    document.body.appendChild(contenidoWiki);
    //------------------------------------------------------------------------------------------------

    //Se crea el div de imagen y descripción del superheroe, con sus divs hijos
    let imagenYDescripcion = document.createElement("div");
    imagenYDescripcion.classList.add("imagenYDescripcion");
    contenidoWiki.appendChild(imagenYDescripcion);

    //Se crea el div superheroe con sus elementos de imagen y nombre
    let superheroe = document.createElement("div");
    superheroe.classList.add("superheroe");
    imagenYDescripcion.appendChild(superheroe);
    let imagenDivSuperheroe = document.createElement("img");
    superheroe.appendChild(imagenDivSuperheroe);
    let nombreSuperHeroe = document.createElement("p");
    superheroe.appendChild(nombreSuperHeroe);
    //----------------------------------------------------------------

    //Se crea el div superheroe con sus elementos de imagen y nombre
    let descripcion = document.createElement("div");
    descripcion.classList.add("descripcion");
    let tituloDesc = document.createElement("p");
    tituloDesc.classList.add("tituloDesc");
    descripcion.appendChild(tituloDesc);
    tituloDesc.innerHTML = "Description";
    let parrafoDesc = document.createElement("p");
    parrafoDesc.classList.add("parrafoDesc");
    descripcion.appendChild(parrafoDesc);
    imagenYDescripcion.appendChild(descripcion);
    //----------------------------------------------------------------
    //----------------------------------------------------------------------------------

    // Se crea el apartado de sus comics y series
    let comicSeries = document.createElement("div");
    comicSeries.classList.add("comicsSeries");
    contenidoWiki.appendChild(comicSeries);

    //Se crea los enlaces a comics y series
    let enlacesComicsSeriesEventos = document.createElement("div");
    enlacesComicsSeriesEventos.classList.add("enlacesComicsSeries");
    let enlaceComics = document.createElement("a");
    enlaceComics.setAttribute("onclick", "verComics()");
    enlaceComics.innerHTML = "Comics";
    enlacesComicsSeriesEventos.appendChild(enlaceComics);
    let enlaceSeries = document.createElement("a");
    enlaceSeries.setAttribute("onclick", "verSeries()");
    enlaceSeries.innerHTML = "Series";
    let enlaceEventos = document.createElement("a");
    enlaceEventos.setAttribute("onclick", "verEventos()");
    enlaceEventos.innerHTML = "Events";
    enlacesComicsSeriesEventos.appendChild(enlaceSeries);
    enlacesComicsSeriesEventos.appendChild(enlaceEventos);
    comicSeries.appendChild(enlacesComicsSeriesEventos);
    //------------------------------------------------------------

    // Se crean los contenedores de comics y de series
    let contenedorImagenesComics = document.createElement("div");
    contenedorImagenesComics.classList.add("contenedorImagenesComics");
    let contenedorImagenesSeries = document.createElement("div");
    contenedorImagenesSeries.classList.add("contenedorImagenesSeries");
    let contenedorImagenesEventos = document.createElement("div");
    contenedorImagenesEventos.classList.add("contenedorImagenesEventos");
    comicSeries.appendChild(contenedorImagenesComics);
    comicSeries.appendChild(contenedorImagenesSeries);
    comicSeries.appendChild(contenedorImagenesEventos);
    //----------------------------------------------------------------------


}

/**
 * Método encargado de obtener los datos de un héroe, haciendo uso de los métodos mencionados anteriormente. Borra la página, construye
 * la del heroe, y hace las llamadas a dichos métodos. 
 * @param {"El nombre del heroe"} nombreHeroe 
 */
function obtenerDatosHeroe(nombreHeroe) {
    borrar();
    construirPaginaHeroe();
    obtenerNombreHeroe(nombreHeroe);
    obtenerImagenHeroe(nombreHeroe);
    obtenerDescripcionHeroe(nombreHeroe);
    obtenerAparacionesHeroe(nombreHeroe,"Comics");
    obtenerAparacionesHeroe(nombreHeroe,"Series");
    obtenerAparacionesHeroe(nombreHeroe,"Events");
    enInicio = false;

}


/**
 * Método que, en la página del heroe, muestra sus series asociadas, cuando se le da click al enlace "Series"
 */
function verSeries() {
    let contenedorEventos = document.getElementsByClassName("contenedorImagenesEventos")[0];
    let contenedorSeries = document.getElementsByClassName("contenedorImagenesSeries")[0];
    let contenedorComics = document.getElementsByClassName("contenedorImagenesComics")[0];
    let enlacesComicSeries = document.getElementsByClassName("enlacesComicsSeries")[0];
    contenedorEventos.style.display = 'none';
    contenedorSeries.style.display = 'flex';
    contenedorComics.style.display = 'none';
    enlacesComicSeries.getElementsByTagName("A")[0].style.borderBottom = 'noe';
    enlacesComicSeries.getElementsByTagName("A")[1].style.borderBottom = '1px solid red';
    enlacesComicSeries.getElementsByTagName("A")[2].style.borderBottom = 'none';
    event.preventDefault();
}

/**
 * Método que, en la página del heroe, muestra sus comics asociados, cuando se le da click al enlace "Comics"
 */
function verComics() {
    let contenedorEventos = document.getElementsByClassName("contenedorImagenesEventos")[0];
    let contenedorSeries = document.getElementsByClassName("contenedorImagenesSeries")[0];
    let contenedorComics = document.getElementsByClassName("contenedorImagenesComics")[0];
    let enlacesComicSeries = document.getElementsByClassName("enlacesComicsSeries")[0];
    contenedorEventos.style.display = 'none';
    contenedorSeries.style.display = 'none';
    contenedorComics.style.display = 'flex';
    enlacesComicSeries.getElementsByTagName("A")[0].style.borderBottom = '1px solid red';
    enlacesComicSeries.getElementsByTagName("A")[1].style.borderBottom = 'rgba(0,0,0,0)';
    enlacesComicSeries.getElementsByTagName("A")[2].style.borderBottom = 'rgba(0,0,0,0)';
    event.preventDefault();
}

/**
 * Método que, en la página del heroe, muestra sus comics asociados, cuando se le da click al enlace "Comics"
 */
function verEventos() {
    let contenedorEventos = document.getElementsByClassName("contenedorImagenesEventos")[0];
    let contenedorSeries = document.getElementsByClassName("contenedorImagenesSeries")[0];
    let contenedorComics = document.getElementsByClassName("contenedorImagenesComics")[0];
    let enlacesComicSeries = document.getElementsByClassName("enlacesComicsSeries")[0];
    contenedorEventos.style.display = 'flex';
    contenedorSeries.style.display = 'none';
    contenedorComics.style.display = 'none';
    enlacesComicSeries.getElementsByTagName("A")[2].style.borderBottom = '1px solid red';
    enlacesComicSeries.getElementsByTagName("A")[1].style.borderBottom = 'none';
    enlacesComicSeries.getElementsByTagName("A")[0].style.borderBottom = 'none';
    event.preventDefault();
}

/**
 * Botón que muestra los comics y series asociados a este evento.
 */
function verOtrosElementosEvento(){
    let contenedorSeries = document.getElementsByClassName("contenedorPersonajes")[0];
    let contenedorComics = document.getElementsByClassName("contenedorComicsEventos")[0];
    let enlacesComicSeries = document.getElementsByClassName("enlacesOtrosDatosElementoEscogido")[0];
    contenedorComics.style.display = 'flex';
    contenedorSeries.style.display = 'none';
    enlacesComicSeries.getElementsByTagName("A")[1].style.borderBottom = '1px solid red';
    enlacesComicSeries.getElementsByTagName("A")[0].style.borderBottom = 'none';
    event.preventDefault();
}

function verPersonajes() {
    let contenedorPersonajes = document.getElementsByClassName("contenedorPersonajes")[0];
    let contenedorComics = document.getElementsByClassName("contenedorComicsEventos")[0];
    let enlacesComicSeries = document.getElementsByClassName("enlacesOtrosDatosElementoEscogido")[0];
    contenedorPersonajes.style.display = 'flex';
    contenedorComics.style.display = 'none';
    enlacesComicSeries.getElementsByTagName("A")[0].style.borderBottom = '1px solid red';
    enlacesComicSeries.getElementsByTagName("A")[1].style.borderBottom = 'none';
    event.preventDefault();
}



/**
 * Método que, ayudándose del método encontrarDatosBusqueda, muestra los heroes buscados, de forma dinámica.
 * @param {"Elemento que se quiere buscar"} datoBuscado 
 * @param {"Categoría sobre la que se va a realizar la búsqueda."} opcionSelect 
 */
function busquedaPersonajes(datoBuscado, opcionSelect) {
    opcionSelect = document.getElementsByTagName("select").value;
    const heroesEncontrados = encontrarDatosBusqueda(datoBuscado, opcionSelect);
    if (heroesEncontrados == 0) {
        //Si la busqueda de heroes no ha sido positiva, se le muestra el mensaje de error al usuario
        let contenedorIndex = document.getElementsByClassName("contenedorIndex")[0];
        let mensajeError = document.createElement("div");
        mensajeError.classList.add("mensajeError");
        let imagenError = document.createElement("img");
        imagenError.setAttribute("src", "css/Imagenes/venom.png");
        mensajeError.appendChild(imagenError);
        let pMensajeError = document.createElement("p");
        pMensajeError.innerHTML = "No hero came for the rescue.";
        mensajeError.appendChild(pMensajeError);
        mensajeError.setAttribute("style", " margin:auto;");
        contenedorIndex.append(mensajeError);
        //---------------------------------------------------------------------------
    }
}

/**
 * Método encargado de realizar la búsqueda.
 * @param {"Elemento que se quiere buscar"} datoBuscado 
 * @param {"Categoría sobre la que se va a realizar la búsqueda."} opcionSelect 
 */
function encontrarDatosBusqueda(datoBuscado, opcionSelect) {
    let arrayBusqueda = [];
    let claseCss = "";
    switch (opcionSelect) {
        case "Heroes":
            arrayBusqueda = arrayHeroes;
            claseCss = "heroe";
            console.log("Entra dentro del switch");
            break;

        case "Comics":
            arrayBusqueda = arrayComics;
            claseCss = "comic";
            console.log("Entra dentro del switch");
            break;

            
        case "Series":
            arrayBusqueda = arraySeries;
            claseCss = "comic";
            console.log("Entra dentro del switch");
            break;

            
        case "Events":
            arrayBusqueda = arrayEventos;
            claseCss = "comic";
            console.log("Entra dentro del switch");
            break;

        default:
            break;
    }
    let busquedaPositiva = Boolean(false);
    datoBuscado = datoBuscado.toString();
    datoBuscado = datoBuscado.toLowerCase();
    datoBuscado = datoBuscado.split(" ").join("");
    datoBuscado = datoBuscado.replace("-", "");
    console.log(datoBuscado);
    let contenedorIndex = document.getElementsByClassName("contenedorIndex")[0];
    //Se borra la búsqueda que se había hecho en la anterior ejecución del método
    while (contenedorIndex.lastElementChild) {
        contenedorIndex.removeChild(contenedorIndex.lastElementChild);
    }
    //---------------------------------------------------------------------------

    for (let i = 0; i < arrayBusqueda.length; i++) {
        if (arrayBusqueda[i] != undefined) {
            let nombreHeroe = "";
            if (opcionSelect == "Heroes") {
                nombreHeroe = arrayBusqueda[i].name;
            }
            else {
                nombreHeroe = arrayBusqueda[i].title;
            }
            nombreHeroe = String(nombreHeroe);
            nombreHeroe = nombreHeroe.toLowerCase();
            nombreHeroe = nombreHeroe.split(" ").join("");
            nombreHeroe = nombreHeroe.replace("-", "");
            if (nombreHeroe.includes(datoBuscado.toLowerCase())) {
                busquedaPositiva = true;
                //Por cada elemento resultante de la búsqueda, se le crea su ficha.
                crearDivDato(opcionSelect,arrayBusqueda[i]);
            }
        }

    }
    marcarFavoritos(opcionSelect,"contenedorIndex");
    // return document.getElementsByClassName("heroe").length;
}
//--------------------------------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------APARTADO DEL LOCAL STORAGE-------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------

    /**
     * Método que elimina un favorito de comic, series o eventos
     * @param {"El nomnbre del elemento que se quiere quitar de favoritos"} nombreFav 
     * @param {"La categoría del elemento a desmarcar."} categoriaFav 
     */

    function aniadirFavorito (nombreFav,categoriaFav){
        let cadenaFav;
        if(localStorage.getItem(`favoritos${categoriaFav}`)!=null){
            cadenaFav = localStorage.getItem(`favoritos${categoriaFav}`).concat(nombreFav);
        }
        else{
            cadenaFav = nombreFav;
        }
        console.log("La cadena a introducir es " + cadenaFav);
        localStorage.setItem(`favoritos${categoriaFav}`,cadenaFav.concat("|"));
    }
    function eliminarFavorito(nombreFav,categoriaFav) {
        let cadenaFav = localStorage.getItem(`favoritos${categoriaFav}`);
        let arrayFav =[];
        arrayFav = cadenaFav.split("|");
        arrayFav.pop();
        console.log(arrayFav);
        let favsCadena = "";
        for(let i=0; i <arrayFav.length;i++){
            if(arrayFav[i] !=nombreFav){
                favsCadena = favsCadena.concat(arrayFav[i]).concat("|");
            }
        }

        console.log(favsCadena);
        if(favsCadena!=""){
            console.log("Entra 1")
            localStorage.setItem(`favoritos${categoriaFav}`,favsCadena);
        }
        else{
            console.log("Entra 2")
            localStorage.removeItem(`favoritos${categoriaFav}`);
        }
    }

    function esElementoFavorito(nombreFav,categoriaFav){
        let esta=false;
        if(localStorage.getItem(`favoritos${categoriaFav}`)!=null){
            let cadenaFav = localStorage.getItem(`favoritos${categoriaFav}`);
            let arrayFav = cadenaFav.split("|");
     
            const resultado = arrayFav.filter(elemento => elemento==nombreFav);
            if(resultado.length>0){
                esta = true;
            }
            else{
                esta = false;
            }

            return esta;

        }
    }


    /**
     * Método encargado de crear el HTML de la sección de notas.
     */
    function crearSeccionNotas() {
        //Se crea la sección de notas
            let sectionNotas = document.createElement("section");
            sectionNotas.classList.add("seccionNotas");
            document.body.appendChild(sectionNotas);

            //Se crea el título de la sección de notas
                let tituloSeccionNotas = document.createElement("p");
                tituloSeccionNotas.classList.add("tituloSeccionNotas");
                tituloSeccionNotas.innerHTML="Notes";
                sectionNotas.appendChild(tituloSeccionNotas);
            //-------------------------------------------------------

            //Se crea el contenedor del CRUD de notas y el contenedor de los botones
                let contenedorCRUD = document.createElement("div");
                contenedorCRUD.classList.add("contenedorCRUD");
                sectionNotas.appendChild(contenedorCRUD);

                //Se crea el apartado de escribir la nota
                    let apartadoCrear = document.createElement("div");
                    apartadoCrear.classList.add("escribirNota");
                    let inputCrearNota = document.createElement("input");
                    inputCrearNota.setAttribute("placeholder","Write your note");
                    let boton = document.createElement("button");
                    boton.innerHTML=`Add note`;
                    boton.setAttribute("onclick","crearNota(event)")
                    apartadoCrear.append(inputCrearNota);
                    apartadoCrear.append(boton);
                    contenedorCRUD.append(apartadoCrear)
                    
                //------------------------------------------------------------

                //Se crea el apartado de ver todas las notas
                    let notasGuardadas = document.createElement("div");
                    notasGuardadas.classList.add("notasGuardadas");
                    document.getElementsByClassName("contenedorCRUD")[0].append(notasGuardadas);
                    mostrarCuadrosGuardados();
                //----------------------------------------------------------
            
    }


    /**
     * Método encargado de crear la nota que hemos escrito. Se activa cuando hacemos click en el botón de CREATE
     * @param {"evento"} e 
     */
    function crearNota(e){
        if(document.getElementsByClassName("seccionNotas")[0].getElementsByTagName("button").length>4){
            document.getElementsByClassName("seccionNotas")[0].getElementsByTagName("button")[4].remove();
        }
        let notaEscrita = e.target.parentElement.getElementsByTagName("input")[0].value.concat("|");
        let notas;
        let arrayNotas;
        if(localStorage.getItem("notasGuardadas")!=null){
            notas = localStorage.getItem("notasGuardadas");
            localStorage.setItem("notasGuardadas",notas.concat(notaEscrita));
        }
        else{
            localStorage.setItem("notasGuardadas",notaEscrita);
        }
        //Las notas se guardan con el siguiente formato: "contenidoNota1"|"contenidoNota2"|...
        arrayNotas = localStorage.getItem("notasGuardadas").split("|");
        //--------------------------------------------------------------------------------------
        
        //A veces quedan espacios en blanco al final
        arrayNotas.pop();
        //------------------------------------------
        
        let mensaje = document.createElement("p");
        mensaje.innerHTML="Note inserted";
        document.getElementsByClassName("escribirNota")[0].append(mensaje);

        //El mensaje de confirmación de la creación de la nota, se borra a los dos segundos de aparecer
        setTimeout(()=>{
            document.getElementsByClassName("escribirNota")[0].getElementsByTagName("p")[0].remove();
        },2000)

        //Se muestra las notas que se tengan hasta ahora.
        mostrarCuadrosGuardados();
        

    }


    /**
     * Método encargado de mostrar las notas que tenemos guardadas.
     */
    function mostrarCuadrosGuardados(){
        if(document.querySelectorAll(".divNotaCrear").length>0){
            for(let texto of document.querySelectorAll(".divNotaCrear")){
                texto.remove();
            }

        }
        
            if(localStorage.getItem("notasGuardadas")!=null){
                console.log("entraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
                let notasCadena = localStorage.getItem("notasGuardadas");
                let arrayNotas = notasCadena.split("|");
                console.log(arrayNotas);
                arrayNotas.pop();
                console.log(arrayNotas)
                let  contador=0;

                for(let i=arrayNotas.length-1;i>=0;i--){
                    let divNotaCrear = document.createElement("div");
                    divNotaCrear.classList.add("divNotaCrear");

                    let notaP = document.createElement("p");
                    divNotaCrear.append(notaP);
                    notaP.innerHTML=`${arrayNotas[i]}`;

                    let botonBorrar = document.createElement("button");
                    botonBorrar.innerHTML="DELETE";
                    botonBorrar.setAttribute("onclick","eliminarNota(event)");
                    divNotaCrear.append(botonBorrar);
                    console.log("Entra Read")
                    contador++;

                    document.getElementsByClassName("notasGuardadas")[0].append(divNotaCrear);
                }
            }
    }

    function actualizarDatos() {

        let bloquesTexto = document.getElementsByTagName("textarea");
        let notas ="";
        for(let i=0;i<bloquesTexto.length;i++){
            if(bloquesTexto[i].value!=""){
                notas = notas.concat(bloquesTexto[i].value).concat("|");
            }
        }

        localStorage.setItem("notasGuardadas",notas);
        for(let j=0;j<document.getElementsByClassName("divNotaCrear").length;j++){
            document.getElementsByClassName("divNotaCrear")[j].innerHTML="";
        }
        let mensaje = document.createElement("p");
        mensaje.innerHTML="Notes updated";
        document.getElementsByClassName("seccionNotas")[0].appendChild(mensaje);
        document.getElementsByClassName("seccionNotas")[0].getElementsByTagName("button")[4].remove();
        setTimeout(()=>{
            mensaje.remove();
        },2000)
    }


    /**
     * Método encargado de eliminar una nota del local storage. 
     * @param {"Evento"} e 
     */
    function eliminarNota(e) {
        let divNotaCrear = e.target.parentElement;
        console.log(divNotaCrear);
        let cadenaBorrar = divNotaCrear.getElementsByTagName("p")[0].innerHTML;
        console.log(cadenaBorrar);
        divNotaCrear.remove();
        let cadenaLS = localStorage.getItem("notasGuardadas");
        let arrayNotas = cadenaLS.split("|");
        let arrayAux=[];
        let cadenaAux="";
        for(let nota of arrayNotas){
            if(nota!=cadenaBorrar){
                arrayAux.push(nota)
            }
        }
        console.log(arrayAux);
        arrayAux.pop();
        for(let nota of arrayAux){
            cadenaAux = cadenaAux.concat(nota).concat("|");
        }
        console.log(cadenaAux);
        // Si se borra la única nota que hay, se borra el item del localstorage. En caso contrario, se pasa la nueva cadena. 
        if(cadenaAux==""){
            localStorage.removeItem("notasGuardadas");
        }
        else{
            localStorage.setItem("notasGuardadas",cadenaAux);
        }

    }   






