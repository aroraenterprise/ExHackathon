function onInit() {
    var mapconfig = {
        "version": "1.3.1",
        "layers": [{
            "type": "cartodb",
            "options": {
                "cartocss_version": "2.1.1",
                "cartocss": "#layer { polygon-fill: #FFF; }",
                "sql": "select * from european_countries_e"
            }
        }]
    }

    $.ajax({
        crossOrigin: true,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        url: 'https://aroraenterprise.carto.com/api/v1/map',
        data: JSON.stringify(mapconfig),
        success: function (data) {
            var templateUrl = 'https://aroraenterprise.carto.com/api/v1/map/' + data.layergroupid + '/{z}/{x}/{y}.png'
            console.log(templateUrl);
        }
    })
}

$(document).ready(function(){
    onInit();
});