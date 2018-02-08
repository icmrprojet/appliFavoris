$(document).ready( function () {

	$(".bouddha").on("click",function(){
		controlPanelApi('');
		controlPanelThemes('');
        actionBda();
	    });

	// Enregistrement des codes Facebook en localStorage  
	$("#save").click(function(){
	    var valeurId = $("#appId").val();
	    var valeurSecret = $("#appSecret").val();
	    localStorage.setItem("valeurId", valeurId);
	    localStorage.setItem("valeurSecret", valeurSecret);
	    controlPanelApi('');
	    controlPanelThemes('');
	    actionBda();
	});


	function actionBda(){
	    $(".bouddha").toggleClass("open");
	    if ($(".bouddha").hasClass("open") == true)
	    {
	        $("#fbapi").removeClass("openbox");
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

	$("#panelThemes").addClass('hide');
	$("#panelFbApi").addClass('hide');

	function controlPanelApi(status){
		console.log('status=' + status);
	    $("#fbapi").toggleClass(status);
	    if ($("#fbapi").hasClass(status) == true){
	        $('#themes').addClass('repli');
	          $('#themes').removeClass('depli');
	        $('#fbapi').addClass('turn');
	        $('#fbapi').addClass('menuCtaFirst');
	        $('#import').addClass('repli');
	          $('#import').removeClass('depli');
	        $('#notifications').addClass('repli');
	          $('#notifications').removeClass('depli');
	        $('#share').addClass('repli');
	          $('#share').removeClass('depli');
	        $("#panelFbApi").addClass('showFront');
	    }else{
	        $('#themes').removeClass('repli');
	          $('#themes').addClass('depli');
	        $('#fbapi').removeClass('turn');
	        $('#fbapi').removeClass('menuCtaFirst');
	          $('#fbapi').addClass('depli');
	        $('#import').removeClass('repli');
	          $('#import').addClass('depli');
	        $('#notifications').removeClass('repli');
	          $('#notifications').addClass('depli');
	        $('#share').removeClass('repli');
	          $('#share').addClass('depli');
	        $("#panelFbApi").removeClass('showFront');
	        $("#panelFbApi").addClass('hide');
	    }
	} 
	$("#fbapi").on('click', function(event){
		controlPanelApi('openbox')
		{
			event.preventDefault();
		};
	});

	function controlPanelThemes(status){
		console.log('status=' + status);
		$("#themes").toggleClass(status);
		if ($("#themes").hasClass(status) == true){
			$('#themes').addClass('turn');
			$('#fbapi').addClass('repli');
			  $('#fbapi').removeClass('depli');
			$('#import').addClass('repli');
			  $('#import').removeClass('depli');
			$('#notifications').addClass('repli');
			  $('#notifications').removeClass('depli');
			$('#share').addClass('repli');
			  $('#share').removeClass('depli');
			$("#panelThemes").addClass('showFront');
		}else{
			$('#themes').removeClass('turn');
			$('#fbapi').removeClass('repli');
			  $('#fbapi').addClass('depli');
			$('#import').removeClass('repli');
			  $('#import').addClass('depli');
			$('#notifications').removeClass('repli');
			  $('#notifications').addClass('depli');
			$('#share').removeClass('repli');
			  $('#share').addClass('depli');
			$("#panelThemes").removeClass('showFront');
			$("#panelThemes").addClass('hide');
		}
	};
	$("#themes").on('click', function(event){
		controlPanelThemes('openbox')
		{
			event.preventDefault();
		};
	});

	// GESTION DES THEMES
	$('#c1').on('click',function(event){
		$('body').addClass('green');
		$('body').removeClass('red');
		$('body').removeClass('blue');
		$('body').removeClass('white');
		$('body').removeClass('pink');
		$('body').removeClass('brown');			
	});
	$('#c2').on('click',function(event){
		$('body').removeClass('green');
		$('body').addClass('red');
		$('body').removeClass('blue');
		$('body').removeClass('white');
		$('body').removeClass('pink');
		$('body').removeClass('brown');			
	});
	$('#c3').on('click',function(event){
		$('body').removeClass('green');
		$('body').removeClass('reb');
		$('body').addClass('blue');
		$('body').removeClass('white');
		$('body').removeClass('pink');
		$('body').removeClass('brown');			
	});
	$('#c4').on('click',function(event){
		$('body').removeClass('green');
		$('body').removeClass('red');
		$('body').removeClass('blue');
		$('body').addClass('white');
		$('body').removeClass('pink');
		$('body').removeClass('brown');			
	});
	$('#c5').on('click',function(event){
		$('body').removeClass('green');
		$('body').removeClass('red');
		$('body').removeClass('blue');
		$('body').removeClass('white');
		$('body').addClass('pink');
		$('body').removeClass('brown');			
	});
	$('#c6').on('click',function(event){
		$('body').removeClass('green');
		$('body').removeClass('red');
		$('body').removeClass('blue');
		$('body').removeClass('white');
		$('body').removeClass('pink');
		$('body').addClass('brown');			
	});

});