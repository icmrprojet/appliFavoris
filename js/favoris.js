

var action = {valeur: "", ligne : ""};   // Nécessaire pour garder en mémoire la dernière action en session et empêcher l'AJOUT en MODE édition/suppression
var indexCible="";                       // Nécessaire pour stocker en la position de la Cible en Drag

$(document).ready(function(){
    // SUBMIT FORM // Présent dans le HTML dès le départ
    $('#formSubmit').on('click', function (event)   
    {
        event.preventDefault();
        var action = $("#formSubmit")[0].getAttribute("value");
        //console.log(action);
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

/*
var data2 = {
    daily: [
        {
        urlImage: "https://www.google.fr/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png",
        siteName: "Google",
        siteUrl: "http://google.fr"
        },       
    ],
    weekly: [],
    monthly: []
    };
}*/
// tab[] => tableau => on recupere avec tab[]
// tab{} => liste => on recupere avec tab.

//CONSTRUCTUER DE L'OBJET FAVORIS
function Favoris(urlImage, siteName, siteUrl, lastVisitDate)
{
	this.urlImage = urlImage;
	this.siteName = siteName;
	this.siteUrl = siteUrl;
	this.lastVisitDate = lastVisitDate;	
}

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
    liaisonActionsButtons();
}

// CONSTITUTION DE NOUVEAU FAVORIS
function printElement(element, date, order, supprActif, modifActif) {
    var favoris ='<div class="pave fav ';
    if((Date.now()-element.lastVisitDate-date)<0)
    {
        favoris += 'coche';
        var test=element.siteUrl.substr(0,7);
        //console.log (test);
        if( test != "http://" && test !="https:/"){
            favoris += ' alert';
        }
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
    return favoris; // permet de recupérer le favoris en dehors de la fonction printElement (generateLine)
}

// INITIALISATION DE LIGNE EN FONCTION DU TYPE
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

    // CREATION DU BUTTON [+] 
    // visible par défaut uniquement si la ligne est vide     
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
    return lineTemp; // permet de recupérer lineTemp en dehors de la fonction generateLine (chargerFavoris)
};

// ON CLICK
function liaisonOnClicks(){
    // ne peut être fait qu'après réaffichage du DOM, sinon on perd les event

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
            var test=data[ligne][index].siteUrl.substr(0,7);
            if ( test !="http://" && test !="https:/"){                
                event.preventDefault();
                alert ("Penser à indiquer une URL valide pour ce FAVORIS !\n \nIl suffit de modifier ce FAVORIS en cliquant sur le crayon \npuis lui attribuer un lien du type : http://google.fr \ndans le champ URL du site");
            }
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
        //Si l'entrée liée à la clé 'data' est vide alors renvoi d'une liste de 3 tableaux vides : CONSTRUCTEUR
		return  {daily: [],weekly: [],monthly: [],yearly: []};
	}
	else
        //Si l'entrée liée à la clé 'data' est pleine alors renvoi d'une liste des 3 tableaux pleins du LS
		return  JSON.parse(localStorage.getItem('data'));
}

// AJOUTER FAVORIS
function ajouterFavoris() {
	var ligne = $("#ligneFavName").attr("name"); // Récupération du DOM depuis les champs du formulaire
	var urlImage = $('input[name=urlImage]').val();
    var urlImage = $('#logo').attr('src');
    var siteName = $('input[name=siteName]').val();
    var siteUrl  = $('input[name=siteUrl]').val();	
	var newFavoris = new Favoris(urlImage,siteName,siteUrl,0);
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
    data[ligne][index].lastVisitDate="";
    saveLocalStorage(data);
    action.valeur = "";
    action.ligne = "";
    chargerFavoris();
}

// APPEL DES ACTIONS
function liaisonActionsButtons() {
    $("#ajouterFavForm").hide();
    $(".container").addClass('moveContainerTop');
    $(".container").removeClass('moveContainerDown');
    $("#urlSiteBis").removeClass("urlOpened");
    $("#urlSiteBis").addClass("urlClosed");
    $(".choixLogos").removeClass("logosOpened");
    $(".choixLogos").addClass("logosClosed");

    // EN FONCTION DES ICONES: édition / modification / suppression
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
    // ICO MODIFIER
    $(".modifIco").on('click', actionButton('modif'));

    // ICO SUPPRIMER
    $('.supprIco').on('click', actionButton('suppr'));
}





// MENU INTERNE //
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

// FERMER MENU 
$(".close").on("click",function(event){
    event.preventDefault();
    $(".choixLogos").removeClass("logosOpened");
    $(".choixLogos").addClass("logosClosed");
    $("#urlSiteBis").removeClass("urlOpened");
    $("#urlSiteBis").addClass("urlClosed");       
    $("#ajouterFavForm").hide();
    $(".container").addClass('moveContainerTop');
    $(".container").removeClass('moveContainerDown');
    $(".filtre").removeClass("filtreOn");
    $(".filtre").addClass("filtreOff");
    $('#logo').attr('src','');
    $('input[name=siteName]').val('');
    $('input[name=siteUrl]').val('');
    $('.choixLogos').html('');
});


// ouvrir fermer choix logo : toogleClass
$("#moreImages").on("click",function(){
    event.preventDefault();
    $("#moreImages").toggleClass("open");
    if($("#moreImages").hasClass("open"))
    {  
        $(".choixLogos").addClass("logosOpened");
        $(".choixLogos").removeClass("logosClosed");
    }else{
        $(".choixLogos").removeClass("logosOpened");
        $(".choixLogos").addClass("logosClosed");
    }
});
// ouvrir fermer set url : toogleClass
$("#setUrl").on("click",function(){
    event.preventDefault();
    $("#setUrl").toggleClass("open");
    if($("#setUrl").hasClass("open"))
    {
        //$("#moreImages").text("More images");
        $("#urlSiteBis").addClass("urlOpened");
        $("#urlSiteBis").removeClass("urlClosed");
    }else{
        $("#urlSiteBis").removeClass("urlOpened");
        $("#urlSiteBis").addClass("urlClosed");       
    }
});


// DRAG AND DROP //
// quand on clique et deplace un item
function drag(ev) {
    var ligne;  // Vérification : Chrome prend l'élément Parent tandis que Firefox prend l'enfant
    var temp=ev.target.parentElement.getAttribute("name");
    var tempIndex=ev.target.getAttribute("name");
    if (temp == "daily"||temp =="weekly"||temp =="monthly"||temp =="yearly"){
        ligne=ev.target.parentElement.getAttribute("name");
    }else{
        ligne=ev.target.parentElement.parentElement.getAttribute("name");
    }
    if (!tempIndex){
        tempIndex=ev.target.parentElement.getAttribute("name");
    }
    console.log("XXX=", ligne);
    ev.dataTransfer.setData("ligne", ligne); // on stocke la ligne de l'item déplacé
    ev.dataTransfer.setData("index", tempIndex);               // on stocke l'index de l'item déplacé
    $(".test").hide();                                                              // on cache les boutons d'ajouts tant qu'on drag
}
// quand on passe en drag sur un element, on stocke son index dans la variable globale "indexCible", et on pousse l'element.
function deplacementItem(ev){
    ev.target.parentElement.parentElement.style.borderLeft  = "10px solid transparent";
    //indexCible = ev.target.parentElement.parentElement.getAttribute("name");
    indexCible = ev.target.parentElement.parentElement.getAttribute("name");
    console.log(indexCible);
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
            droppedFavoris(ligneSource, indexSource, ligne,"");     // on dépose l'item
            supprimerFavoris(ligneSource, indexSource);             // on supprime l'item initial
        }        
    }
    else
    {
        // on récupère la ligne en étant sur un pavé, donc on remonte avec parentElement
        var ligne = ev.target.parentElement.parentElement.parentElement.getAttribute("name"); 
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
    console.log(data,ligneSource);
    // on recréé le favoris déplacé depuis le localstorage avec la ligne et l'index sources
    // function Favoris(urlImage, siteName, siteUrl, lastVisitDate)
    var newFavoris = new Favoris(data[ligneSource][indexSource].urlImage,data[ligneSource][indexSource].siteName,data[ligneSource][indexSource].siteUrl,0);
    if(indexCible != "")
    {
        data[ligneSource].splice(indexSource,1);         // on supprime un element a la position de l'indexSource
        data[ligne].splice(indexCible, 0,newFavoris);    // on supprime ZERO element a la position de l'indexCible, et on y rajoute newFavoris
    }
    else
    {
        data[ligne].push(newFavoris); // push du nouveau favori a la fin du tableau ligne  
    }
    saveLocalStorage(data);
    chargerFavoris();      
}




$('#import').on("click",function(){
    importFavoris();
    chargerFavoris();
});

function importFavoris(){
    localStorage.setItem('data','{"daily":[{"urlImage":"https://graph.facebook.com/1675509779382742/picture/?width=200","siteName":"producthunt","siteUrl":"http://producthunt.com","lastVisitDate":0},{"urlImage":"https://graph.facebook.com/826369634133772/picture/?width=200","siteName":"news.y","siteUrl":"http://news.ycombinator.com","lastVisitDate":""},{"urlImage":"https://graph.facebook.com/63780066824/picture/?width=80","siteName":"feedly","siteUrl":"http://www.feedly.com","lastVisitDate":0},{"urlImage":"https://graph.facebook.com/20302481344/picture/?width=200","siteName":"techmeme","siteUrl":"http://www.techmeme.com","lastVisitDate":0},{"urlImage":"https://graph.facebook.com/159107397912/picture/?width=200","siteName":"codrops","siteUrl":"http://www.codrops.com","lastVisitDate":0},{"urlImage":"https://graph.facebook.com/181220782279765/picture/?width=200","siteName":"frontend focus","siteUrl":"https://frontendfoc.us/","lastVisitDate":""},{"urlImage":"https://graph.facebook.com/504460666411687/picture/?width=80","siteName":"quora","siteUrl":"https://fr.quora.com/","lastVisitDate":0},{"urlImage":"https://graph.facebook.com/1663475260572824/picture/?width=200","siteName":"designernews","siteUrl":"https://www.designernews.co/","lastVisitDate":""},{"urlImage":"https://graph.facebook.com/357501734264788/picture/?width=200","siteName":"smashing magazine","siteUrl":"https://www.smashingmagazine.com/","lastVisitDate":""},{"urlImage":"https://graph.facebook.com/1570709153240362/picture/?width=80","siteName":"social media","siteUrl":"https://www.socialmediatoday.com/","lastVisitDate":""}],"weekly":[{"urlImage":"https://graph.facebook.com/1757540494309673/picture/?width=200","siteName":"dribbble.","siteUrl":"http://www.dribbble.com","lastVisitDate":0},{"urlImage":"https://graph.facebook.com/1851238671787787/picture/?width=200","siteName":"awwwards","siteUrl":"http://www.awwwards.com","lastVisitDate":""},{"urlImage":"https://graph.facebook.com/298124187018065/picture/?width=200","siteName":"makery","siteUrl":"http://www.makery.info/","lastVisitDate":""},{"urlImage":"https://graph.facebook.com/29092950651/picture/?width=200","siteName":"ted","siteUrl":"http://www.ted.com","lastVisitDate":0},{"urlImage":"https://graph.facebook.com/164135253786231/picture/?width=200","siteName":"goodui","siteUrl":"http://goodui.org/","lastVisitDate":0},{"urlImage":"https://graph.facebook.com/118907414834755/picture/?width=200","siteName":"sidebar.io","siteUrl":"https://sidebar.io/","lastVisitDate":0},{"urlImage":"https://graph.facebook.com/10150098174700375/picture/?width=200","siteName":"useronboard","siteUrl":"https://www.useronboard.com/user-onboarding-teardowns/","lastVisitDate":""},{"urlImage":"https://graph.facebook.com/124436167285/picture/?width=80","siteName":"css-tricks","siteUrl":"https://css-tricks.com/","lastVisitDate":""},{"urlImage":"https://graph.facebook.com/8062627951/picture/?width=80","siteName":"techcrunch","siteUrl":"https://techcrunch.com/","lastVisitDate":0}],"monthly":[{"urlImage":"https://graph.facebook.com/215162105183945/picture/?width=80","siteName":"angellist","siteUrl":"http://angel.co","lastVisitDate":""},{"urlImage":"https://graph.facebook.com/180047058742759/picture/?width=80","siteName":"trello","siteUrl":"https://trello.com/","lastVisitDate":0},{"urlImage":"https://graph.facebook.com/139920599752407/picture/?width=200","siteName":"ifttt","siteUrl":"https://ifttt.com/discover","lastVisitDate":""},{"urlImage":"https://graph.facebook.com/1475789069318711/picture/?width=200","siteName":"sansfransis .co","siteUrl":"http://www.sansfrancis.co/","lastVisitDate":0},{"urlImage":"https://graph.facebook.com/527639823914514/picture/?width=80","siteName":"medium","siteUrl":"https://medium.com/","lastVisitDate":0},{"urlImage":"https://graph.facebook.com/121938278443062/picture/?width=200","siteName":"slideshare","siteUrl":"https://www.slideshare.net/","lastVisitDate":0},{"urlImage":"https://graph.facebook.com/164929129743/picture/?width=80","siteName":"socialbakers","siteUrl":"https://www.socialbakers.com/","lastVisitDate":0},{"urlImage":"https://graph.facebook.com/124136227972/picture/?width=200","siteName":"blog du moderateur","siteUrl":"https://www.blogdumoderateur.com/","lastVisitDate":""},{"urlImage":"https://graph.facebook.com/214252288606133/picture/?width=200","siteName":"creapills","siteUrl":"https://creapills.com/","lastVisitDate":0}],"yearly":[{"urlImage":"https://graph.facebook.com/14627055407/picture/?width=200","siteName":"litmus","siteUrl":"http://www.litmus.com","lastVisitDate":0},{"urlImage":"https://graph.facebook.com/262588213843476/picture/?width=200","siteName":"github","siteUrl":"http://www.github.com","lastVisitDate":""},{"urlImage":"https://graph.facebook.com/473141349450143/picture/?width=80","siteName":"slack","siteUrl":"https://cifap.slack.com","lastVisitDate":0},{"urlImage":"https://graph.facebook.com/507202942694496/picture/?width=200","siteName":"meyerweb","siteUrl":"https://meyerweb.com/eric/tools/css/reset/","lastVisitDate":0},{"urlImage":"https://graph.facebook.com/30670583128/picture/?width=80","siteName":"evernote","siteUrl":"https://www.evernote.com","lastVisitDate":0},{"urlImage":"https://graph.facebook.com/1102260929887634/picture/?width=200","siteName":"outofpluto","siteUrl":"https://www.outofpluto.com","lastVisitDate":""}]}');
}




