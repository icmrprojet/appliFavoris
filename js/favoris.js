var data = {
    daily: [
        {
            urlImage: "https://www.google.fr/images/branding/googlelogo/2x/googlelogo_color_120x44dp.png",
            siteName: "Google",
            siteUrl: "http://google.fr"
        },
        {
            urlImage: "data:image/png;base64,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",
            siteName: "Yahoo",
            siteUrl: "http://yahoo.fr"
        }
    ],
    weekly: [

    ],
    yearly: [

    ]
};


function chargerFavoris() {
    var toutFavoris = "";
    data.daily.forEach(function (element) {
            toutFavoris += printElement(element);
    });
    $("#affichage").html(toutFavoris);
}


function printElement(element) {
    return '<a href="' + element.siteUrl + '"><img src="' + element.urlImage + '" /> ' + element.siteName + '</a><br />';
}

function ajouterFavoris() {
    var siteName = $('input[name=siteName]').val();
    var siteUrl  = $('input[name=siteUrl]').val();
    var urlImage = $('input[name=urlImage]').val();

    data.daily.push({
        urlImage: urlImage,
        siteName: siteName,
        siteUrl: siteUrl
    });

   // chargerFavoris();
}

$(document).ready(function () {
    chargerFavoris();

    $('input[type=submit][value=Ajouter]').on('click', function (event) {
        event.preventDefault();
        ajouterFavoris();
    });
});
