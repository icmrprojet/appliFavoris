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
    weekly: [

    ],
    monthly: [

    ]
};
}*/
var action = null;
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
	data = pullLocalStorageInto();
	var index=0;
    //daily
    var lignesFavoris = '<div class="ligne" name="daily" ondrop="drop(event)" ondragover="allowDrop(event)"><div class="entete"><h1>Daily</h1><span class="modifIco modifButton"></span><span class="supprIco supprButton"></span></div>';
    data.daily.forEach(function (element) {
		index++;
        lignesFavoris += printElement(element, day, index);
        });
    lignesFavoris += '<button class="test pave" name="daily">+</button></div>'; 
    //weekly
    lignesFavoris += '<div class="ligne" name="weekly" ondrop="drop(event)" ondragover="allowDrop(event)"><div class="entete"><h1>Weekly</h1><span class="modifIco modifButton"></span><span class="supprIco"></span></div>';
	index = 0;
	data.weekly.forEach(function (element) {
		index++;
        lignesFavoris += printElement(element, week, index);
        });
	lignesFavoris += '<button class="test pave" name="weekly">+</button></div>';
    //monthly
    lignesFavoris += '<div class="ligne" name="monthly" ondrop="drop(event)" ondragover="allowDrop(event)"><div class="entete"><h1>Monthly</h1><span class="modifIco modifButton"></span><span class="supprIco"></span></div>';
	index = 0;
	data.monthly.forEach(function (element) {
		index++;
        lignesFavoris += printElement(element, month, index);
        });
    lignesFavoris += '<button class="test pave" name="monthly">+</button></div>';
    $("#affichage").html(lignesFavoris);
    liaisonOnClicks();


}

// ON CLICK
function liaisonOnClicks(){
    // ne peut être fait qu'après réaffichage des button dans le DOM, sinon on perd le event

    // CLICK sur AJOUTER
    $(".test").on("click",function(){
        $("#ligneFavName").attr("name",this.name);
        action = "Ajouter";
        $("#formSubmit")[0].setAttribute("value",action);
        $("#ajouterFavForm").toggle();
        // vider les champs du formulaire
        $('input[name=urlImage]').val("");
        $('input[name=siteName]').val("");
        $('input[name=siteUrl]').val("");
        $('.modifButton').css("color", "red");
        $('span.modif').addClass("show");
		$('.supprButton').css("color", "black");
        $('span.suppr').removeClass("show");
    })

    // CLICK sur un FAVORIS
    $('.fav').on('click', function (elem) { 
        var ligne =  this.parentElement.getAttribute("name");
        var index = this.getAttribute("name")-1;
		console.log(ligne, index);	
        if(action == "Modifier") 
        {

            if(!$("#ajouterFavForm").is(':visible')) // si menu n'est pas visible
            {
                $('input[name=urlImage]').val(data[ligne][index].urlImage);
                $('input[name=siteName]').val(data[ligne][index].siteName);
                $('input[name=siteUrl]').val(data[ligne][index].siteUrl);
                $("#ajouterFavForm").show();
                $("#formSubmit")[0].setAttribute("value",action);
                $("#formSubmit")[0].setAttribute("ligne",ligne);
                $("#formSubmit")[0].setAttribute("index",index);        
            }
            else
            {
                $("#ajouterFavForm").hide();
                action=null;
                $('.modifButton').css("color", "black");
                $('span.modif').removeClass("show");

            }
        }
        else if(action == "Supprimer")
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

    });

}


// HTML GENERE DEPUIS LE JS
function printElement(element, date, order) {
    var favoris ='<div class="pave fav ';
    if((Date.now()-element.lastVisitDate-date)<0)
    {
        favoris += 'coche';
    }
    var testImg = "https://www.google.fr/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png"; // => remplace element.urlImage
    return favoris += '" ondragstart="drag(event)" draggable="true" name='+(order)+'><span class="modif"></span><span class="suppr"></span><a target="blank" href="' + element.urlImage + '"><span style="background-image:url('+testImg+')"></span><span> ' + element.siteName + '</span></a></div>';
}

// ENREGISTREMENT EN LOCAL STORAGE
function saveLocalStorage(data){
	localStorage.setItem('data',JSON.stringify(data));
}


// CHECK DU LOCAL STORAGE sur la string 'data'
function pullLocalStorageInto(){
	if(!localStorage.getItem('data'))
	{
        //Si l'entrée liée à la clé 'data' est vide alors renvoi d'une liste de 3 tableaux vides
		return  {daily: [],weekly: [],monthly: []};
	}
	else
        //Si l'entrée liée à la clé 'data' est pleine alors renvoi d'une liste de 3 tableaux pleins du LS
		return  JSON.parse(localStorage.getItem('data'));
}


// AJOUTER FAVORIS
function ajouterFavoris() {
	var ligne = $("#ligneFavName").attr("name"); //Récupération du DOM depuis les champs du formulaire
	var urlImage = $('input[name=urlImage]').val();
    var siteName = $('input[name=siteName]').val();
    var siteUrl  = $('input[name=siteUrl]').val();	
	var newFavoris = new Favoris(urlImage,siteName,siteUrl,0); // 
	//data[<variable>] = récupération du tableau "<variable>" dans data = liste de tableaux
    data[ligne].push(newFavoris); // push du nouveau favori dans le tableau ligne
	saveLocalStorage(data);
    chargerFavoris();
}


// SUPPRIMER FAVORIS
function supprimerFavoris(ligne, index) {
    console.log(ligne,index)
    data[ligne].splice(index,1);
    saveLocalStorage(data);
    chargerFavoris();
}

// MODIFIER FAVORIS
function modifierFavoris(ligne, index) {
    var urlImage = $('input[name=urlImage]').val();
    var siteName = $('input[name=siteName]').val();
    var siteUrl  = $('input[name=siteUrl]').val();
    data[ligne][index].urlImage=urlImage;
    data[ligne][index].siteName=siteName;
    data[ligne][index].siteUrl=siteUrl;
    saveLocalStorage(data);
    chargerFavoris();
}


	
	


$(document).ready(function () {
	$("#ajouterFavForm").hide();
    chargerFavoris();

	// MISE EN PLACE des evenements de click sur les elements du DOM présents dans le fichier HTML
    
    // cta AJOUTER ou autre possiblité MODIFIER
    $('#formSubmit').on('click', function (event)   
    {
        event.preventDefault();
        if(action == "Ajouter")
        {            
            ajouterFavoris(); //console.log("ajout");
        }
        else
        {            
            modifierFavoris(this.getAttribute("ligne"),this.getAttribute("index")); //console.log("modifier")
        }
        $("#ajouterFavForm").hide();
    });

    // cta MODIFIER
    $('.modifButton').on('click', function (event,ligne) 
    {
        $("#ajouterFavForm").hide();
        if(action == "Modifier")
        {
            action = null;
            $('span.modif').removeClass("show");
            $('.modifButton').css("color", "black");
        }
        else 
        {
            action = "Modifier";
            $('span.modif').addClass("show");
            $('.modifButton').css("color", "red");
            $('span.suppr').removeClass("show");
            $('.supprButton').css("color", "black");
        }

    });

    // cta SUPPRIMER
    $('.supprButton').on('click', function (event) 
    {
        $("#ajouterFavForm").hide();
        if(action == "Supprimer")
        {
            action = null;
            $('span.suppr').removeClass("show");
            $('.supprButton').css("color", "black");
        }
        else 
        {
            action = "Supprimer";
            $('span.suppr').addClass("show");
            $('.supprButton').css("color", "red");
            $('span.modif').removeClass("show");
            $('.modifButton').css("color", "black");
        }
    });

});// fin document ready





// DRAG AND DROP ***********************************************
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
// DRAG AND DROP ***********************************************
