// //----------------------------------------------------------------------------------------------------------------------
const urlAPI='https://gateway.marvel.com:443/v1/public/characters';
const restoURLCharacters = "&ts=1&apikey=ee96dda5519334616bf7fc899b1f3642&hash=43b18ea9140e849e9fd68cf7bc0907c2";
var idHeroe="";
const restoURL = "&ts=1&apikey=ee96dda5519334616bf7fc899b1f3642&hash=43b18ea9140e849e9fd68cf7bc0907c2"
const urlCompleta = urlAPI+restoURL;
let urlComic2="";

// //----------------------------------------------------------------------------------------------------------------------

//     // const urlAPI1='https://gateway.marvel.com:443/v1/public/characters?name=Spider-Man (Miles Morales)';
//     // const urlCharacters1='https://gateway.marvel.com:443/v1/public/characters?limit=100&offset=1200'
//     // const restoURLCharacters1 = "&ts=1&apikey=6f7fd38a8d0087953e9ed5884e9faf11&hash=9b4a6548f63e760f0c5a6906b9978aca";
//     // var idHeroe="";
//     // const restoURL1 = "&ts=1&apikey=6f7fd38a8d0087953e9ed5884e9faf11&hash=9b4a6548f63e760f0c5a6906b9978aca"
//     // const urlCompleta1 = urlAPI1+restoURL1;

// //-------------------------------------------------------------------------------------------------------------------------




function mostrarIndicePaginas(){
    let indicePaginas = document.getElementsByClassName("indicePaginas")[0];
    for(i=0;i<16;i++){
        let divPagina = document.createElement("DIV");
        if(i==0){
            divPagina.setAttribute("onClick","desplegarHeroes(0)");
        }
        else{
            divPagina.setAttribute("onClick",`desplegarHeroes(${(i*100)-i})`);
        }
        let numPagina = document.createElement("P");
        numPagina.innerHTML=`${i+1}`;
        divPagina.appendChild(numPagina);
        indicePaginas.appendChild(divPagina);
    }
}


function desplegarHeroes(offset){
    let contenedorHeroes = document.getElementsByClassName("contenedorHeroes")[0];
    if(document.querySelector("FORM")!=null){
        document.querySelector("FORM").remove();
    }
    const urlCharacters=`https://gateway.marvel.com:443/v1/public/characters?limit=100&offset=${offset}`
    fetch(urlCharacters+restoURL).then(res => res.json()).then(json =>{
        let form = document.createElement("FORM");
        form.setAttribute("action","hero.html");
        form.setAttribute("onsubmit","SeleccionHeroe");
        form.setAttribute("method","post");
        contenedorHeroes.appendChild(form);
        console.log(json);
        for(let heroe of json.data.results){
            let divHeroe = document.createElement("DIV");
            let labelHeroe = document.createElement("LABEL");
            labelHeroe.setAttribute("for","urlHeroe");
            let imagenHeroe = document.createElement("IMG");
            let nombreHeroe = document.createElement("P");
            let submitHeroe = document.createElement("BUTTON");
            submitHeroe.setAttribute("type","submit");
            submitHeroe.setAttribute("style","display:none;");
            submitHeroe.setAttribute("name","urlHeroe");
            submitHeroe.setAttribute("id","urlHeroe");
            submitHeroe.setAttribute("value",`https://gateway.marvel.com:443/v1/public/characters?name=${heroe.name}`+restoURL);
            divHeroe.classList.add("heroe");
            imagenHeroe.setAttribute("src",`${heroe.thumbnail.path}.${heroe.thumbnail.extension}`);
            nombreHeroe.innerHTML=`${heroe.name}`;
            labelHeroe.appendChild(imagenHeroe);
            divHeroe.appendChild(labelHeroe);
            divHeroe.appendChild(nombreHeroe);
            divHeroe.appendChild(submitHeroe);
            form.appendChild(divHeroe);
        }
    })
}

function desplegarElementosIniciales(){
    mostrarIndicePaginas();
    desplegarHeroes(0);
}

