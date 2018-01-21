var data = {
    daily: [
        /*{
            urlImage: "https://www.google.fr/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png",
            siteName: "Google",
            siteUrl: "http://google.fr"
        },
        {
            urlImage: "https://s.yimg.com/dh/ap/default/130909/y_200_a.png",
            siteName: "Yahoo",
            siteUrl: "http://yahoo.fr"
        }*/
    ],
    weekly: [

    ],
    monthly: [

    ]
};
function Favoris(urlImage, siteName, siteUrl, order, lastVisitDate)
{
	this.urlImage = urlImage;
	this.siteName = siteName;
	this.siteUrl = siteUrl;
	this.order = order;
	this.lastVisitDate = lastVisitDate;	
}


function chargerFavoris() {
	data = pullLocalStorageInto();
    var toutFavoris = "";
    data.daily.forEach(function (element) {
            toutFavoris += printElement(element);
    });
	toutFavoris+= "<br />//////___________\\\\\\";
	data.weekly.forEach(function (element) {
            toutFavoris += printElement(element);
    });
	toutFavoris+= "<br />//////___________\\\\\\";
	data.monthly.forEach(function (element) {
            toutFavoris += printElement(element);
    });
    $("#affichage").html(toutFavoris);
}


function printElement(element) {
    return '<a href="' + element.siteUrl + '"><img src="' + element.urlImage + '" /> ' + element.siteName + '</a><br />';
}

function saveLocalStorage(data){
	localStorage.setItem('data',JSON.stringify(data));
}

function pullLocalStorageInto(){
	if(!localStorage.getItem('data'))
	{
		return  {daily: [],weekly: [],monthly: []};
	}
	else
		return  JSON.parse(localStorage.getItem('data'));
}
function ajouterFavoris() {
	var ligne = $("#ligneFavName").attr("name");
	var urlImage = $('input[name=urlImage]').val();
    var siteName = $('input[name=siteName]').val();
    var siteUrl  = $('input[name=siteUrl]').val();
	//data[ligne].length = nombre d'element contenu dans le tableau ayant le nom stocké dans la variable "ligne"
	var order = data[ligne].length+1;
	var newFavoris = new Favoris(urlImage,siteName,siteUrl,order,0);
	// data = tableau de données
	//data[<variable>] = récupération du tableau "<variable>" dans le tableau de données
    data[ligne].push(newFavoris);
	saveLocalStorage(data);
   // chargerFavoris();
}

$(document).ready(function () {
	$("#ajouterFavForm").hide();
    chargerFavoris();
	//fonction d'ajout des boutons en fin de ligne

    $('input[type=submit][value=Ajouter]').on('click', function (event) {
        event.preventDefault();
        ajouterFavoris();
    });
	$(".test").on("click",function(){
		$("#ligneFavName").attr("name",this.name);
		$("#ajouterFavForm").toggle();
	})
});

 