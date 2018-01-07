
var valeurId="";
var valeurSecret="";
var ligne = "";// Récupération de l'id de la ligne de l'élément cliqué
var lastfav, diff;// variables création id unique
var tempId; // 


$(document).ready(function(){
 	
 	$("#modifier").addClass('hide');

    if(!localStorage.getItem("listFavoris"))// s'il est null, vide, undefined, s'il n'extiste pas.
    {
        // Intancier un tableau vide sans taille que l'on va remplir de façon dynamique
        localStorage.setItem("listFavoris", JSON.stringify(new Array())); 
        // le localStorage ne pouvant enregistrer que des string, et vu que nous avons un array, JSON sert d'intermédiaire
    }else{
    	var listFavoris = JSON.parse(localStorage.getItem("listFavoris"));
    	ajouterFavoris(true,false);
		$(".newDiv .checked").each(function(e){
			var dateFav = this.getAttribute("data-visit");
			var currentLigne = this.getAttribute("data-ligne");
			var currentId = $(this).parent().attr('id');
			console.log('test id='+currentId);
			var displayed = false;
			var diff=(dateFav-Date.now());
			switch(currentLigne){
				case "day":
							if(diff>-1000*60*60*24)
								displayed = true;
				break;
				case "week":
							if(diff>-1000*60*60*24*7)
								displayed = true;
				break;
				case "month":
							if(diff>-1000*60*60*24*30)
								displayed = true;
				break;
			}
			//console.log(dateFav);			
			if(displayed)
			{
			console.log('affiche coche = '+ currentLigne + " " +diff);
			$('#' +currentId+' .checked').removeClass('hide');
			$('#' +currentId+' .checked').addClass('show');
			}else{
			console.log('affiche pas coche = '+ currentLigne + " " +diff);
			$('#' +currentId+' .checked').removeClass('show');
			$('#' +currentId+' .checked').addClass('hide');
			}
		});
    }

    // Enregistrement des codes Facebook en localStorage  
    $("#save").click(function(){
        var valeurId = $("#appId").val();
    	var valeurSecret = $("#appSecret").val();
	    localStorage.setItem("valeurId", valeurId);
	    localStorage.setItem("valeurSecret", valeurSecret);
	    actionBouddha();
    });


	// Affichage du Logo central quand on quitte le focus du champ nom
	$("#nomSite").focusout(ajouterPicture);
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
	        $("#urlSiteBis").animate({"left":"5"});
        }
    });

    // DETECTION DE LA LIGNE : Daily / Weekly / Monthly / Bas
	$(".ligne").on('click',function(a){
         ligne = this.id;
         ligne= ligne.slice(6); // id en HTML est ligne suivi d'un tiret
         //console.log( 'ligne a traiter=' + ligne);
     });

	// AJOUTER UN FAVORI
   	$('#ajouter').on('click',function(){
   		ajouterFavoris(false, ligne);// ligne existe
   		//function ajouterFavoris(retrieveState, ligne)
   		$(".filtreOut").addClass("filtreOn");
    });

    // MODIFIER UN FAVORI
   	$('#modifier').on('click',function(){
   		//function modifierFavoris(idToModif, nom, urlsite, imglogo)
		//on récupère les données modifiées depuis la fenètre de modification pour les passer en paramètre	
   		modifierFavoris(tempId, $("#nomSite").val(), $("#urlSite").val(),$("#logo").attr("src"));
		$("#"+tempId).attr("href",$("#urlSite").val());
		$("#"+tempId).css('background-image','url('+$("#logo").attr("src")+')');
		$("#"+tempId).attr("data-bg",$("#logo").val());
		$("#"+tempId+" .titreSite").html($("#nomSite").val());
		tempId = ""; // on vide le tempId.
   		$(".filtreOut").addClass("filtreOut");
   		$(".newDiv").removeClass('lienInactif');
	    $(".newDiv").addClass('lienActif');
    });

	// SUPPRIMER UN FAVORI
	$(document).on('click','.suppr', function(event){
		event.preventDefault();
		var idToDel = $(this).parent().attr('id');
		console.log("idToDel="+idToDel);
		$("#"+idToDel).remove();// Suppression dans le DOM
		// Récupération des données
		var listFavoris = JSON.parse(localStorage.getItem("listFavoris")); //récuperation du localstorage en array
		var index;
		listFavoris.forEach(function(e){ // Suppression dans le localStorage
			if (e.lastfav==idToDel)
			{
				index=listFavoris.indexOf(e); // parcours des id de listFavoris avec e
				return true; // qd l'id est trouvée récupérer l'index correspondant dans le tableau
			}
		});		
		listFavoris.splice(index,1);// supprime dans mon Array l'element equivalent à mon 1er argument + tous ceux qui suivent selon le second argument, ici 1 seul
		localStorage.setItem("listFavoris", JSON.stringify(listFavoris)); // enregistrement du tableau dans le localstorage
	});

	// CHARGER UN FAVORI DANS LE MENU Add a Site
	$(document).on('click','.modif', function(event){
		event.preventDefault();
		var idToModif = $(this).parent().attr('id');
		var nom = $("#" +idToModif+' .titreSite').text();
		var urlsite = $("#" + idToModif).attr('href');
		var imglogo= $("#" + idToModif).attr('data-bg');
		var posifav =$("#" + idToModif).attr('data-posi');
		tempId = idToModif; //on garde l'id de l'objet a modifier en mémoire pour s'en servir apres.
		console.log("idToModif="+idToModif);
		console.log('nom='+ nom + ' | urlsite='+ urlsite+' | imglogo='+imglogo+' | posifav='+ posifav );
		effacePictosmodifs();
		$("#nomSite").val(nom);
		$("#urlSite").val(urlsite);
		$('#logo').attr("src",imglogo +'&'+'width=80');
		afficheMenuFavoris();
	});

	// GESTION DES VISITES
	$(document).on('click','.newDiv', function(event){
		var idToChecked = $(this).attr('id');
		var datevisit=Date.now();
		if($("#"+ idToChecked).hasClass("lienActif")){
		$('#' +idToChecked+' .checked').addClass('show');
		//console.log(idToChecked);
		$('#' +idToChecked).attr("data-visit",datevisit);
		//console.log("datevisit=" +datevisit);

		var listFavoris = JSON.parse(localStorage.getItem("listFavoris")); //récuperation du localstorage en array
		var index;// Identification de l'objet à supprimer
		listFavoris.forEach(function(e){ //parcours des id de listFavoris avec e
			if (e.lastfav==idToChecked)// Compare les id
			{
				index=listFavoris.indexOf(e); // recupere l'index de l'objet e qui est dans le tableau
				return true; // qd l'id est trouvée récupérer l'index correspondant dans le tableau
			}	
		});
		listFavoris[index].datevisit=Date.now();
		localStorage.setItem("listFavoris", JSON.stringify(listFavoris)); // enregistrement du tableau dans le localstorage		
		}
	});

 	////  ANIMATIONS ET AUTRES EFFETS VISUELS ////////////////////
//{ balise pour replier les animations. Permet de mieux parcourir le code.
	$(".bouddha").on("click",function(){
		actionBouddha();
		effacePictosmodifs();
	});
	// fermer le menu Add a Site avec la croix
	$(".cross").on("click",function(){
		if($(".cross").hasClass("openchoixlogo"))
		{
			$(".choixLogos").animate({"left":"5"});
			$("#urlSiteBis").animate({"left":"5"});
     		$("#moreImages").text("More images");
	 		$(".addSite").animate({"top":"-1000","left":"-1000"});
	 		$(".choixLogos").animate({"top":"-1000","left":"-1000"});
	 		$("#urlSiteBis").animate({"top":"-1000","left":"-1000"});
	 		$(".general").animate({"margin-top":"0","margin-left":"0"});
	 		$(".filtreOut").removeClass("filtreOn");
	 		$("#setUrl").removeClass("openUrl");
	 		$('#logo').attr("src","img/bouddha_central-gris.png");
	 		$('.choixLogos img').attr("src","");
	 		$("#moreImages").removeClass("opacity1");
			$("#setUrl").removeClass("opacity1");
			$("#modifier").addClass('hide');
			$(".newDiv").removeClass('lienInactif');
	        $(".newDiv").addClass('lienActif');
	 	}else{
	 		$(".addSite").animate({"top":"-1000","left":"-1000"});
	 		$(".choixLogos").animate({"top":"-1000","left":"-1000"});
	 		$("#urlSiteBis").animate({"top":"-1000","left":"-1000"});
	 		$(".general").animate({"margin-top":"0","margin-left":"0"});
	 		$(".filtreOut").removeClass("filtreOn");
	 		$("#setUrl").removeClass("openUrl");
	 		$("#nomSite").val("");
	 		$("#urlSite").val("");
	 		$('#logo').attr("src","img/bouddha_central-gris.png");
	 		//$('.choixLogos img').attr("src","");
	 		$('.choixLogos').empty();
	 		$("#moreImages").removeClass("opacity1");
			$("#setUrl").removeClass("opacity1");
			$("#modifier").addClass('hide');
			$(".newDiv").removeClass('lienInactif');
	        $(".newDiv").addClass('lienActif');
	 	}
	});
	// ferme le menu Add a Site et reset les infos de la page en cliquant sur Add to Collection
	$('#ajouter').on("click",function(){
		$(".choixLogos").animate({"top":"-1000","left":"-1000"});
		$(".addSite").animate({"top":"-1000","left":"-1000"});
		$(".filtreOut").removeClass("filtreOn");
		$("#urlSiteBis").animate({"top":"-1000","left":"-1000"});
		$(".general").animate({"margin-top":"0","margin-left":"0"});
		$("#nomSite").val("");
		$("#urlSite").val("");
		$('#logo').attr("src","img/bouddha_central-gris.png");
		$('.choixLogos').empty();
		$("#moreImages").removeClass("opacity1");
		$(".newDiv").removeClass('lienInactif');
	    $(".newDiv").addClass('lienActif');
	});
	// ouvrir fermer choix logo : toogleClass
    $("#moreImages").on("click",function(){
     	$("#moreImages").toggleClass("openchoixlogo");
     	if($("#moreImages").hasClass("openchoixlogo"))
     	{
     		$(".choixLogos").animate({"left":"305"});
     	}else{
     		$(".choixLogos").animate({"left":"5"});
     	}
    });

    // ouvrir fermer set url : toogleClass
    $("#setUrl").on("click",function(){
     	$("#setUrl").toggleClass("openUrl");
     	if($("#setUrl").hasClass("openUrl"))
     	{
     		$("#moreImages").removeClass("openchoixlogo");
     		$(".choixLogos").animate({"left":"5"});
     		$("#moreImages").text("More images");
     		$("#urlSiteBis").animate({"left":"315"});
     	}else{
     		$("#urlSiteBis").animate({"left":"5"});     		
     	}
    });


// GESTION AFFICHAGE DES PICTOS SUPPR ou MODIF
	function affichePbl(ligne){
    	$('#' +ligne+' .pbl').toggleClass("opensuppr");
    	$(".newDiv").addClass('lienInactif');
    	$(".newDiv").removeClass('lienActif');
    	if($('#' +ligne+' .pbl').hasClass("opensuppr"))
    	{
	        $('#' +ligne+' .suppr').addClass('show');
	        $('#' +ligne+' .suppr').addClass('lienActif');
	        $('#' +ligne+' .modif').removeClass('show');
	        $('#' +ligne+' .pen').removeClass('openmodif');
     	}else{
	        $('#' +ligne+' .suppr').removeClass('show');
	        $(".newDiv").removeClass('lienInactif');
	        $(".newDiv").addClass('lienActif');
     	}		
	}
	$('#ligne-day .pbl').on('click',function(){
		affichePbl('ligne-day');
		$(".newDiv").removeClass('lienInactif');
	    $(".newDiv").addClass('lienActif');
	});
	$('#ligne-week .pbl').on('click',function(){
		affichePbl('ligne-week');
	});
	$('#ligne-month .pbl').on('click',function(){
		affichePbl('ligne-month');
	});
	$('#ligne-bas .pbl').on('click',function(){
		affichePbl('ligne-bas');
	});

	function affichePen(ligne){
		console.log(ligne);
    	$('#' +ligne+' .pen').toggleClass("openmodif");
    	$(".newDiv").addClass('lienInactif');
    	$(".newDiv").removeClass('lienActif');
    	if($('#' +ligne+' .pen').hasClass("openmodif"))
    	{
	        $('#' +ligne+' .suppr').removeClass('show');
	        $('#' +ligne+' .modif').addClass('show');
	        $('#' +ligne+' .modif').addClass('lienActif');
	        $('#' +ligne+' .pbl').removeClass('opensuppr');
	       	$('#nomSite').addClass("infosOn");
	        $("#modifier").removeClass('hide');
     	}else{
     		$('#nomSite').removeClass("infosOn");
	        $('#' +ligne+' .modif').removeClass('show');
	        $(".newDiv").removeClass('lienInactif');
	        $(".newDiv").addClass('lienActif');
     	}		
	}
	$('#ligne-day .pen').on('click',function(){
		affichePen('ligne-day');
	});
	$('#ligne-week .pen').on('click',function(){
		affichePen('ligne-week');
	});
	$('#ligne-month .pen').on('click',function(){
		affichePen('ligne-month');
	});
	$('#ligne-bas .pen').on('click',function(){
		affichePen('ligne-bas');
	});

});// Fin document ready




// Définition des fonctions

// RECUPERATION DES LOGOS VIA L'API faceBook + Affichage
function getPictures(query, AppId, AppSecret){
	query=localStorage.getItem('nomSite');
	//var AppId='437660773298889';
	AppId=localStorage.getItem('valeurId');
	console.log(valeurId);
	//var AppSecret='371758459896094a60e6c3b878aa947a';// 
	AppSecret = localStorage.getItem('valeurSecret');
	$.getJSON('https://graph.facebook.com/search?q='+query+'&type=page&access_token='+AppId+'|'+AppSecret+'',function(monJSON){
		var length = monJSON.data.length;
		for(var i=0;i<15;i++){
			var pageid = monJSON.data[i].id;
			$('.choixLogos').append('<img id="page-'+i+'" src="https://graph.facebook.com/'+pageid+'/picture/?width=200">');
		}
		// création du logo central qui doit apparaitre en quittant le focus sur champ nom
		var pageid = monJSON.data[0].id;// on prend par defaut le premier logo du tableau cad l'index 0
		$('#logo').attr('src',"https://graph.facebook.com/"+pageid+"/picture/?width=80");
	});
}

function ajouterPicture(){
	var query = $("#nomSite").val();
	localStorage.setItem("nomSite", query);
	$("#moreImages").addClass("opacity1");
	$("#setUrl").addClass("opacity1");
	$('#nomSite').removeClass("infosOn");
	getPictures();
}
// AFFICHAGE PICTOS MODIF/SUPPR
function effacePictosmodifs(){
	$(".suppr").removeClass('show');
	$(".pbl").removeClass('opensuppr');
	$(".modif").removeClass('show');
	$(".pen").removeClass('openmodif');
}

// ouvrir/fermer le menu principal avec bouddha
function actionBouddha(){
	$(".bouddha").toggleClass("open");
	if ($(".bouddha").hasClass("open") == true)
	{
		$(".contenair1").animate({"width":"19%"});
		$(".bouddha").animate({"margin-top":"10vh"});
		$(".menuCta").animate({"left": "72"});
		$(".filtreOut").toggleClass("filtreOn");
		$(".bouddha").attr("src","img/bouddha_white.png");

	}else{
		$(".menuCta").animate({"left": "-1000"});
		$(".contenair1").animate({"width":"10%"});
		$(".bouddha").animate({"margin-top":"41vh"});
		$(".filtreOut").removeClass("filtreOn");
		$(".bouddha").attr("src","img/bouddha.png");			
	}
		var valeurId= localStorage.getItem('valeurId');
		var valeurSecret=localStorage.getItem('valeurSecret');	
		console.log(valeurId + valeurSecret);
		$("#appId").val(valeurId);
		$("#appSecret").val(valeurSecret);
}
	
// ouvrir le menu Add a Site
function afficheMenuFavoris (){
	effacePictosmodifs();
	$(".addSite").animate({"top":"-45","left":"5"});
	$(".choixLogos").animate({"top":"-45","left":"5"});
	$(".general").animate({"margin-top":"100","margin-left":"100"});
	$("#urlSiteBis").animate({"top":"67","left":"5"});
	$(".filtreOut").toggleClass("filtreOn");
}
$(".ajout").on("click",function(){
	afficheMenuFavoris();
});

function favoris (lastfav,ligne,posifav,imglogo,nom,urlsite,datevisit){
	this.lastfav=lastfav;
	this.ligne =ligne;
    this.posifav =posifav;
    this.imglogo =imglogo;
    this.nom =nom;
    this.urlsite =urlsite;
    this.datevisit =datevisit;
};


function ajouterFavoris(retrieveState, ligne){
	//création d'un id unique pour chaque nouveau site
	if (lastfav) 
	{
		diff = Date.now() - lastfav
	}
	lastfav = parseInt(Date.now(), 10);
	console.log("id-unique =" + lastfav);

	$("#modifier").addClass('hide');

	// je récupère depuis la page HTML
	var nom = $("#nomSite").val();
	var urlsite = $("#urlSite").val();
	var imglogo = $('#logo').attr("src");
	var datevisit;
	// recupération dynamique de la taille du tableau + remplissage + test retrieveState
    var listFavoris = JSON.parse(localStorage.getItem("listFavoris"));//On parse pour getItem

    if (retrieveState)// Si je récupère depuis le localStorage
    {
    	listFavoris.forEach(function(e)
    	{
    		//console.log('ligne depuis le LS ='+ e.ligne);
    		$('#'+e.ligne).before('<a class="newDiv lienActif" id="'+e.lastfav+'" href="'+e.urlsite+'" target="_blank" data-bg="'+e.imglogo+'" data-posi="'+e.posifav+'" name="'+e.datevisit+'"><div class="imgSite"><span>'+e.posifav+'</span></div><div class="checked" data-visit="'+e.datevisit+'" data-ligne="'+e.ligne+'"></div><div class="suppr"></div><div class="modif"></div><div class="titreSite">'+e.nom+'</div></a>');
    		$("#"+e.lastfav).css('background-image','url('+e.imglogo+')');
    		console.log('test1='+e.datevisit);

    	});
    }else{ // création d'un nouveau Favori dans le localStorage
    	var posifav =$("#ligne-"+ligne+" .newDiv").length + 1;
    	var datevisit =$("#ligne-"+ligne).attr('data-visit');
    	//console.log('datevisit=' + datevisit);    
    	listFavoris[listFavoris.length] = new favoris( lastfav, ligne, posifav, imglogo, nom, urlsite, datevisit);    
    	localStorage.setItem("listFavoris", JSON.stringify(listFavoris));// on stringify pour setItem
    }
    
    if(ligne)// si ligne existe
    {
    	var posifav =$("#ligne-"+ligne+" .newDiv").length + 1;
    	var datevisit =$("#ligne-"+ligne).attr('data-visit');
    	$('#'+ligne).before('<a class="newDiv lienActif" id="'+lastfav+'" href="'+urlsite+'" target="_blank" data-bg="'+imglogo+'" data-posi="'+posifav+'" data-visit="'+datevisit+'"><div class="imgSite"><span>'+posifav+'</span></div><div class="checked" data-visit="'+datevisit+'" data-ligne="'+ligne+'"></div><div class="suppr"></div><div class="modif"></div><div class="titreSite">'+nom+'</div></a>');       
    	$("#"+lastfav).css('background-image','url('+imglogo+')');
	}; 
};

function modifierFavoris(idToModif, nom, urlsite, imglogo){
	$("#modifier").addClass('hide');
	// Récupération des données
	var listFavoris = JSON.parse(localStorage.getItem("listFavoris")); //récuperation du localstorage en array
	var index;// Identification de l'objet à supprimer
	listFavoris.forEach(function(e){ //parcours des id de listFavoris avec e
		if (e.lastfav==idToModif)// Compare les id
		{
			index=listFavoris.indexOf(e); // recupere l'index de l'objet e qui est dans le tableau
			return true; // qd l'id est trouvée récupérer l'index correspondant dans le tableau
		}	
	});
	listFavoris[index].nom=nom;
	listFavoris[index].urlsite=urlsite;
	listFavoris[index].imglogo=imglogo;
	localStorage.setItem("listFavoris", JSON.stringify(listFavoris)); // enregistrement du tableau dans le localstorage
};




