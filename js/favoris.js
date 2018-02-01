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
//Constructeur pour l'objet Favoris
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

function generateLine(type, collection, time) {
    var lineTemp = '<div class="ligne" name="' + type + 
    '" ondrop="drop(event)" ondragover="allowDrop(event)"><div class="entete"><h1>' + type +
    '</h1><span class="modifIco" data-active="false" data-type="'+ type +'"></span><span class="supprIco" data-active="false" data-type="' + type + '"></span></div>';
    collection.forEach(function (element, index) {
        lineTemp += printElement(element, time, index);
    });
    lineTemp += '<button class="test pave" name="' + type + '">+</button></div>'; 
    return lineTemp;

    }
    var lignesFavoris = generateLine('daily', data.daily, day);
    lignesFavoris += generateLine('weekly', data.weekly, week);
    lignesFavoris += generateLine('monthly', data.monthly, month);
    lignesFavoris += generateLine('yearly', data.yearly, year);

    $("#affichage").html(lignesFavoris);
    liaisonOnClicks();
    bindActionsButtons();
}

function printElement(element, date, order) {
    var favoris ='<div class="pave fav ';
    if((Date.now()-element.lastVisitDate-date)<0)
    {
        favoris += 'coche';
    }
    var testImg = "https://www.google.fr/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png"; // => remplace element.urlImage
    return favoris += '" ondragstart="drag(event)" draggable="true" name='+(order)+'><span class="modif"></span><span class="suppr"></span><a target="_blank" href="' + element.siteUrl + '"><span style="background-image:url('+element.urlImage+')"></span><span> ' + element.siteName + '</span></a></div>';
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
        // vider les champs du formulaire
        $('input[name=urlImage]').val("");
        $('input[name=siteName]').val("");
        $('input[name=siteUrl]').val("");
        disactiveAllButtons();
    })

    // CLICK sur un FAVORIS
    $('.fav').on('click', function (elem) { 
        var ligne =  this.parentElement.getAttribute("name");
        var index = this.getAttribute("name");
		console.log(ligne, index);
        if($(this).children('.modif.show').length > 0) 
        {

            if(!$("#ajouterFavForm").is(':visible')) // si menu n'est pas visible
            {
                $('input[name=urlImage]').val(data[ligne][index].urlImage);
                $('input[name=siteName]').val(data[ligne][index].siteName);
                $('input[name=siteUrl]').val(data[ligne][index].siteUrl);
                //var urlPict=data[ligne][index].urlImage;
                //$('#logo').attr('src',urlPict);
                $("#ajouterFavForm").show();
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
        else if($(this).children('.suppr.show').length > 0)
        {
            supprimerFavoris(ligne,index); 
            console.log(index);
        }
        else
        {
            data[ligne][index].lastVisitDate=Date.now();
            $('.supprButton').css("display", "block");  
            saveLocalStorage(data);
			chargerFavoris();
        }
        disactiveAllButtons();
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
		return  {daily: [],weekly: [],monthly: [],yearly: [],};
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
    if (data[ligne]==0){
        console.log(data[ligne]);
        $(".test").show();
    }

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
    chargerFavoris();
}

function disactiveAllButtons() {
        function disactivate() {
             $(this).data('active', false);
        }
        $(".modifIco").each(disactivate); // Passer la function en paramètre
        $(".supprIco").each(disactivate); 
        $('span.modif').removeClass("show");
        $('span.suppr').removeClass("show");
}


function bindActionsButtons() {
    $("#ajouterFavForm").hide();
    $(".container").addClass('moveContainerTop');
    $(".container").removeClass('moveContainerDown');
    $("#urlSiteBis").removeClass("choixUrlOpen");
    $("#urlSiteBis").addClass("choixUrlClosed");
    $(".choixLogos").removeClass("choixLogoOpen");
    $(".choixLogos").addClass("choixLogoClosed");
  
    // cta SUBMIT formulaire
    $('#formSubmit').unbind('click').on('click', function (event)   
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

    });

    // cta ICONES d'edition-modification-suppression
    function actionButton(typeButton) {

        return function () {
            var currentLine = $(this).data('type');
            var active = $(this).data("active");  
            $("#ajouterFavForm").hide();
            $(".container").addClass('moveContainerTop');
            $(".container").removeClass('moveContainerDown');
            disactiveAllButtons();

            if (!active) {
                $(this).data('active', true);
                $('div[name='+currentLine+'] span.' + typeButton).addClass("show");
            }
        }
    }
    // cta MODIFIER
    $(".modifIco").unbind('click').on('click', actionButton('modif'));

    // cta SUPPRIMER
    $('.supprIco').unbind('click').on('click', actionButton('suppr'));

}



$(document).ready(chargerFavoris);// fin document ready





//DRAG AND DROP ***********************************************
function drop(ev) {
    ev.preventDefault();
    var urlImage = ev.dataTransfer.getData("urlImage");
    var siteName = ev.dataTransfer.getData("siteName");
    var index = ev.dataTransfer.getData("index");
    var ligneSrc = ev.dataTransfer.getData("ligneSrc");
    if(ev.target.className == "ligne")
    {
        var ligne = ev.target.getAttribute("name");
        droppedFavoris(ligne, urlImage, siteName);
        supprimerFavoris(ligneSrc, index-1);        
    }
}

function allowDrop(ev) {
    ev.preventDefault();
    console.log("dropped");
}

function drag(ev) {
    ev.dataTransfer.setData("urlImage", ev.target.getElementsByTagName("img")[0].attributes.src.nodeValue);
    ev.dataTransfer.setData("siteName", ev.target.getElementsByTagName("span")[1].innerHTML);
    ev.dataTransfer.setData("index", ev.target.getAttribute("name"));
    ev.dataTransfer.setData("ligneSrc", ev.target.parentElement.getAttribute("name"));
    //ev.dataTransfer.setData("siteUrl", ev.target.getElementsByTagName("a")[0].attributes.src.nodeValue);
}

function droppedFavoris(ligne, urlImage,siteName){
    var newFavoris = new Favoris(urlImage,siteName,"",0); // 
    data[ligne].push(newFavoris); // push du nouveau favori dans le tableau ligne
    saveLocalStorage(data);
    chargerFavoris();   
}






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



