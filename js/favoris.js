/*
var data2 = {
    daily: [
        {
            urlImage: "https://www.google.fr/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png",
            siteName: "Google",
            siteUrl: "http://google.fr"
        },
        {
            urlImage: "https://s.yimg.com/dh/ap/default/130909/y_200_a.png",
            siteName: "Yahoo",
            siteUrl: "http://yahoo.fr"        
    ],
    weekly: [],
    monthly: []
    };
}*/
// tab[] => tableau => on recupere avec tab[]
// tab{} => liste => on recupere avec tab.

var action = {valeur: "", ligne : ""};
var indexCible="";
//Constructeur pour l'objet Favoris
function Favoris(urlImage, siteName, siteUrl, lastVisitDate)
{
	this.urlImage = urlImage;
	this.siteName = siteName;
	this.siteUrl = siteUrl;
	this.lastVisitDate = lastVisitDate;	
}
function generateLine(type, data, time) {
    // initialisation de la ligne dans lineTemp
    var lineTemp = '<div class="ligne" name="' + type + '" ondrop="drop(event)" ondragover="allowDrop(event)"><div class="entete"><h1>' + type +
    '</h1><span class="modifIco" data-active="false" data-type="'+ type +'"></span><span class="supprIco" data-active="false" data-type="' + type + '"></span></div>';
    if(action.valeur == "supprimer" && action.ligne == type){
        var supprActif = true;}
    else{
        var supprActif = false;
    }
    if(action.valeur == "modifier" && action.ligne == type){
        var modifActif = true;}
    else{
        var modifActif = false;
    }
    // creation des favoris de la ligne
    data.forEach(function (element, index){
        lineTemp += printElement(element, time, index, supprActif, modifActif);
    });   
    //CREATION DU BUTTON [+] 
    //visible par defaut uniquement si la ligne est vide     
    lineTemp += '<button class="test ';
    if(action.valeur == "modifier" || action.valeur == "supprimer")
    {
        lineTemp += "hide";
    }
    else
    {
        if(data.length == 0)
        {
            lineTemp += "forceAffichage";
        }
    }

    lineTemp +=' pave" name="' + type + '">+</button></div>'; 
    return lineTemp;

};
// UPDATE DU DOM
function chargerFavoris() {
    var day=1000*60*60*24;
    var week = day*7;
    var month = day*30;
    var year = day*365;
	data = recupLocalStorage();
    var lignesFavoris = generateLine('daily', data.daily, day);
    lignesFavoris += generateLine('weekly', data.weekly, week);
    lignesFavoris += generateLine('monthly', data.monthly, month);
    lignesFavoris += generateLine('yearly', data.yearly, year);

    $("#affichage").html(lignesFavoris);
    liaisonOnClicks();
    bindActionsButtons();
}

function printElement(element, date, order, supprActif, modifActif) {
    var favoris ='<div class="pave fav ';
    if((Date.now()-element.lastVisitDate-date)<0)
    {
        favoris += 'coche';
    }
    //var testImg = "https://www.google.fr/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png"; // => remplace element.urlImage
    favoris += '" ondragstart="drag(event)" draggable="true" ondragenter="deplacementItem(event)" ondragleave="getBack(event)" name='+(order)+'><span class="modif';
    if(modifActif){
        favoris+=" showFront";
    }
    favoris += '"></span><span class="suppr';
    if(supprActif){
        favoris+=" showFront";
    }
    favoris +='"></span><a target="_blank" href="' + element.siteUrl + '"><span style="background-image:url('+element.urlImage+')"></span><span> ' + element.siteName + '</span></a></div>';
    return favoris; // permet de recupérer le favoris en dehors de la fonction printElement
}

// ON CLICK
function liaisonOnClicks(){
    // ne peut être fait qu'après réaffichage des button dans le DOM, sinon on perd le event

    // CLICK sur AJOUTER
    $(".test").on("click",function(){
        $('#logo').attr('src','images/b_80x80.png');
        $("#ligneFavName").attr("name",this.name);
        $("#formSubmit")[0].setAttribute("value", "Ajouter");
        $("#ajouterFavForm").toggle();
        $(".container").toggleClass('moveContainerTop');
        $(".container").toggleClass('moveContainerDown');
        $(".filtre").addClass("filtreOn");
        $(".filtre").removeClass("filtreOff");
        // vider les champs du formulaire
        $('input[name=urlImage]').val("");
        $('input[name=siteName]').val("");
        $('input[name=siteUrl]').val("");
    })

    // CLICK sur un FAVORIS
    $('.fav').on('click', function (elem) { 
        var ligne =  this.parentElement.getAttribute("name");
        var index = this.getAttribute("name");
		console.log(ligne, index);
        if($(this).children('.modif.showFront').length > 0) 
        {

            if(!$("#ajouterFavForm").is(':visible')) // si menu n'est pas visible
            {
                $('input[name=urlImage]').val(data[ligne][index].urlImage);
                $('input[name=siteName]').val(data[ligne][index].siteName);
                $('input[name=siteUrl]').val(data[ligne][index].siteUrl);
                //var urlPict=data[ligne][index].urlImage;
                //$('#logo').attr('src',urlPict);
                $("#ajouterFavForm").show();
                $(".filtre").addClass("filtreOn");
                $(".filtre").removeClass("filtreOff");
                $(".container").removeClass('moveContainerTop');
                $(".container").addClass('moveContainerDown');
                $("#formSubmit")[0].setAttribute("value","Modifier");
                $("#formSubmit")[0].setAttribute("ligne",ligne);
                $("#formSubmit")[0].setAttribute("index",index); 
                var urlImage = data[ligne][index].urlImage;
                $('#logo').attr('src',urlImage);     
            }
            else
            {
                $("#ajouterFavForm").hide();
                $(".container").addClass('moveContainerTop');
                $(".container").removeClass('moveContainerDown');
                action=null;

            }
        }
        else if($(this).children('.suppr.showFront').length > 0)
        {
            supprimerFavoris(ligne,index); 
            console.log(index);
        }
        else
        {
        data[ligne][index].lastVisitDate=Date.now(); 
        saveLocalStorage(data);
		chargerFavoris();
        }
    });
}

// ENREGISTREMENT EN LOCAL STORAGE
function saveLocalStorage(data){
	localStorage.setItem('data',JSON.stringify(data));
}

// CHECK DU LOCAL STORAGE sur la string 'data'
function recupLocalStorage(){
	if(!localStorage.getItem('data'))
	{
        //Si l'entrée liée à la clé 'data' est vide alors renvoi d'une liste de 3 tableaux vides
		return  {daily: [],weekly: [],monthly: [],yearly: []};
	}
	else
        //Si l'entrée liée à la clé 'data' est pleine alors renvoi d'une liste de 3 tableaux pleins du LS
		return  JSON.parse(localStorage.getItem('data'));
}

// Enregistrement des codes Facebook en localStorage  
$("#save").click(function(){
    var valeurId = $("#appId").val();
    var valeurSecret = $("#appSecret").val();
    localStorage.setItem("valeurId", valeurId);
    localStorage.setItem("valeurSecret", valeurSecret);
    actionBda();
});



// AJOUTER FAVORIS
function ajouterFavoris() {
	var ligne = $("#ligneFavName").attr("name"); //Récupération du DOM depuis les champs du formulaire
	var urlImage = $('input[name=urlImage]').val();
    var urlImage = $('#logo').attr('src');
    var siteName = $('input[name=siteName]').val();
    var siteUrl  = $('input[name=siteUrl]').val();	
	var newFavoris = new Favoris(urlImage,siteName,siteUrl,0); // 
	//data[<variable>] = récupération du tableau "<variable>" dans data = liste de tableaux
    data[ligne].push(newFavoris); // push du nouveau favoris dans le tableau ligne
	saveLocalStorage(data);
    chargerFavoris();
}

// SUPPRIMER FAVORIS
function supprimerFavoris(ligne, index) {
    //console.log(ligne,index)
    data[ligne].splice(index,1);
    saveLocalStorage(data);
    chargerFavoris();
}

// MODIFIER FAVORIS
function modifierFavoris(ligne, index) {
    var urlImage = $('#logo').attr('src');
    var siteName = $('input[name=siteName]').val();
    var siteUrl  = $('input[name=siteUrl]').val();
    data[ligne][index].urlImage=urlImage;
    data[ligne][index].siteName=siteName;
    data[ligne][index].siteUrl=siteUrl;
    saveLocalStorage(data);
    action.valeur = "";
    action.ligne = "";
    chargerFavoris();
}


function bindActionsButtons() {
    $("#ajouterFavForm").hide();
    $(".container").addClass('moveContainerTop');
    $(".container").removeClass('moveContainerDown');
    $("#urlSiteBis").removeClass("choixUrlOpen");
    $("#urlSiteBis").addClass("choixUrlClosed");
    $(".choixLogos").removeClass("choixLogoOpen");
    $(".choixLogos").addClass("choixLogoClosed");

    // cta ICONES d'edition-modification-suppression
    function actionButton(typeButton) {

        return function () {
            var currentLine = $(this).data('type');
            var active = $(this).data("active");  
            $("#ajouterFavForm").hide();
            $(".container").addClass('moveContainerTop');
            $(".container").removeClass('moveContainerDown');
            console.log(action);
            var ligne = $(this)[0].getAttribute("data-type");
            if(typeButton == "suppr")
            {
                $(".test").addClass('hide');
                if(action.valeur == "supprimer")
                {
                    if(action.ligne == ligne)
                    {
                       action.ligne = ""; 
                       action.valeur = "";
                    }
                    else
                    {
                        action.ligne = ligne;
                    }                        
                }
                else
                {
                    action.valeur = "supprimer";
                    action.ligne = ligne;                        
                }
            }
            else
            {
                if(action.valeur == "modifier")
                {
                    $(".test").addClass('hide');                        
                    if(action.ligne == ligne)
                    {
                       action.ligne = ""; 
                       action.valeur = "";
                    }
                    else
                    {
                        action.ligne = ligne;
                    }                        
                }
                else
                {
                    action.valeur = "modifier";
                    action.ligne = ligne;                        
                }                    
            }
            chargerFavoris();
        }
    }
    // cta MODIFIER
    $(".modifIco").on('click', actionButton('modif'));

    // cta SUPPRIMER
    $('.supprIco').on('click', actionButton('suppr'));
}



$(document).ready(function(){
    // cta SUBMIT formulaire
    $('#formSubmit').on('click', function (event)   
    {
        event.preventDefault();
        var action = $("#formSubmit")[0].getAttribute("value");
        console.log(action);
        if(action == "Ajouter")
        { 
            ajouterFavoris();
        }
        else
        {            
            modifierFavoris(this.getAttribute("ligne"),this.getAttribute("index")); //console.log("modifier")
        }
        $("#ajouterFavForm").hide();
        $(".container").addClass('moveContainerTop');
        $(".container").removeClass('moveContainerDown');
        $(".filtre").removeClass("filtreOn");
        $(".filtre").addClass("filtreOff");

    });
    chargerFavoris();
});// fin document ready








//------------ INTERACTION CSS ----------------------//
$(".bouddha").on("click",function(){
        actionBda();
    });

function actionBda(){
    $(".bouddha").toggleClass("open");
    if ($(".bouddha").hasClass("open") == true)
    {
        $(".bda").addClass("enlarge");
        $(".bda").removeClass("lesslarge");
        $(".menuBda").addClass("moveRight");
        $(".menuBda").removeClass("moveBack");
        $(".bouddha").addClass("moveUp");
        $(".bouddha").removeClass("moveDown");
        $(".filtre").addClass("filtreOn");
        $(".filtre").removeClass("filtreOff");
    }else{
        $(".bda").removeClass("enlarge");
        $(".bda").addClass("lesslarge");
        $(".menuBda").removeClass("moveRight");
        $(".menuBda").addClass("moveBack");
        $(".bouddha").removeClass("moveUp");
        $(".bouddha").addClass("moveDown");
        $(".filtre").removeClass("filtreOn");
        $(".filtre").addClass("filtreOff");          
    }
        var valeurId= localStorage.getItem('valeurId');
        var valeurSecret=localStorage.getItem('valeurSecret');  
        $("#appId").val(valeurId);
        $("#appSecret").val(valeurSecret);
}

$(".close").on("click",function(){
    $("#ajouterFavForm").hide();
    $(".container").addClass('moveContainerTop');
    $(".container").removeClass('moveContainerDown');
    $(".filtre").removeClass("filtreOn");
    $(".filtre").addClass("filtreOff");
});

// RECUPERATION DES LOGOS VIA L'API faceBook + Affichage
function getPictures(query, AppId, AppSecret){
    query=localStorage.getItem('nomSite');
    AppId=localStorage.getItem('valeurId');
    AppSecret = localStorage.getItem('valeurSecret');
    $.getJSON('https://graph.facebook.com/search?q='+query+'&type=page&access_token='+AppId+'|'+AppSecret+'',function(monJSON){
        var length = monJSON.data.length;
        $('.choixLogos').html('');
        for(var i=0;i<15;i++){
            var pageid = monJSON.data[i].id;
            $('.choixLogos').append('<img id="page-'+i+'" src="https://graph.facebook.com/'+pageid+'/picture/?width=200">');
        }
        // création du logo central qui doit apparaitre en quittant le focus sur champ nom
        var pageid = monJSON.data[0].id;// on prend par defaut le premier logo du tableau cad l'index 0
        $('#logo').attr('src',"https://graph.facebook.com/"+pageid+"/picture/?width=80");
    });
}

function centralPicture(){
    var query = $("#nomSite").val();
    localStorage.setItem("nomSite", query);
    $("#moreImages").addClass("opacity1");
    $("#setUrl").addClass("opacity1");
    $('#nomSite').removeClass("infosOn");
    getPictures();
}
$("#nomSite").focusout(centralPicture);

// Remplacement du logo central en cliquant sur les vignettes
$(".choixLogos").click(function(a){
    if(a.target.id.indexOf("page-") != -1)
    {
        //console.log(a.target.id);     
        var urlPict=a.target.src;
        //console.log(a.target.src);
        $('#logo').attr('src',urlPict).css("width","80");
    }
});
// remplacement du logo central par la saisie de l'url d'une image
$('#urlSiteBis').keyup(function(e) {   
    var urlBis= $("#urlSiteBis").val(); 
    if(e.keyCode == 13) 
    { // KeyCode de la touche entrée
        $('#logo').attr('src',urlBis);
    }
});
// ouvrir fermer choix logo : toogleClass
$("#moreImages").on("click",function(){
    event.preventDefault();
    $("#moreImages").toggleClass("openchoixlogo");
    if($("#moreImages").hasClass("openchoixlogo"))
    {  
        $(".choixLogos").addClass("choixLogoOpen");
        $(".choixLogos").removeClass("choixLogoClosed");
    }else{
        $(".choixLogos").removeClass("choixLogoOpen");
        $(".choixLogos").addClass("choixLogoClosed");
    }
});
// ouvrir fermer set url : toogleClass
$("#setUrl").on("click",function(){
    event.preventDefault();
    $("#setUrl").toggleClass("openUrl");
    if($("#setUrl").hasClass("openUrl"))
    {
        //$("#moreImages").text("More images");
        $("#urlSiteBis").addClass("choixUrlOpen");
        $("#urlSiteBis").removeClass("choixUrlClosed");
    }else{
        $("#urlSiteBis").removeClass("choixUrlOpen");
        $("#urlSiteBis").addClass("choixUrlClosed");       
    }
});




//DRAG AND DROP ***********************************************
// quand on clique et deplace un item
function drag(ev) {
    ev.dataTransfer.setData("ligne", ev.target.parentElement.getAttribute("name")); // on stocke la ligne de l'item déplacé
    ev.dataTransfer.setData("index", ev.target.getAttribute("name"));               // on stocke l'index de l'item déplacé
    $(".test").hide();                                                              // on cache les boutons d'ajouts tant qu'on drag
}
// quand on passe en drag sur un element, on stocke son index dans la variable globale "indexCible", et on pousse l'element.
function deplacementItem(ev){
    ev.target.parentElement.parentElement.style.borderLeft  = "10px solid transparent";
    indexCible = ev.target.parentElement.parentElement.getAttribute("name");
}
// on replace l'element quand on sort de son espace avec le drag
function getBack(ev){
    ev.target.parentElement.parentElement.style.borderLeft  = "0px solid transparent";
}
// quand on dépose un item
function drop(ev) {
    ev.preventDefault();    
    var indexSource = ev.dataTransfer.getData("index");     // on récupère les données du drag
    var ligneSource = ev.dataTransfer.getData("ligne");


    if(ev.target.className == "ligne")                      // quand on drop sur une ligne
    {
        var ligne = ev.target.getAttribute("name");         // on récupère la ligne 
        if(ligne && ligne != null )
        {
            droppedFavoris(ligneSource, indexSource, ligne,"");     // on depose l'item
            supprimerFavoris(ligneSource, indexSource);             // on supprime l'item initial
        }        
    }
    else
    {
        var ligne = ev.target.parentElement.parentElement.parentElement.getAttribute("name"); // on récupère la ligne en étant sur un pavé, donc on remonte avec parentElement
                if(ligne && ligne != null )
        {

            droppedFavoris(ligneSource, indexSource, ligne,indexCible);     // on dépose l'item 
            
        }
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}



function droppedFavoris(ligneSource, indexSource, ligne, indexCible){  
    console.log(ligne);
    var newFavoris = new Favoris(data[ligneSource][indexSource].urlImage,data[ligneSource][indexSource].siteName,"",0); // on recréé le favoris déplacé depuis le localstorage avec la ligne et l'index sources
    if(indexCible != "")
    {
        data[ligneSource].splice(indexSource,1);                // on supprime un element a la position de l'indexSource
        data[ligne].splice(indexCible, 0,newFavoris);           // on supprime ZERO element a la position de l'indexCible, et on y rajoute newFavoris
    }
    else
    {
        data[ligne].push(newFavoris); // push du nouveau favori a la fin du tableau ligne  
    }
    saveLocalStorage(data);
    chargerFavoris();      
}




