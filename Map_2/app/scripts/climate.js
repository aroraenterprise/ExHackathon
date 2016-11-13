$('#ts').TimeSlider({
  start_timestamp: -602294400,
  end_timestamp: 2553465600,
  update_timestamp_interval: 1000,
  update_interval: 1000,
  graduation_step: 40
});

$('#carto-climate-explorer').on('shown.bs.modal', function () {
  $('#carto-climate-explorer').focus()
})

function cartoSql(sql, callback) {
  $.getJSON('https://sajarora.carto.com/api/v2/sql?q=' + sql + '&api_key=4ff8b9ddf97c920f633367e7b9ce3f9dd8aa9f42', callback);
}
var data = [];
var rcp = '85';
function DoD3() {
  console.log(data);
  var chart = new CanvasJS.Chart("chart-container",
    {
      zoomEnabled: true,
      title: {
        text: "Orlando Temperature vs. RCP Level: " + rcp,
      },
      animationEnabled: true,
      axisX: {
        labelAngle: 30
      },

      axisY: {
        includeZero: false
      },

      data: data  // random generator below

    });
  chart.render();
}

function RenderChart(input) {
  var limit = 100;    //increase number of dataPoints by increasing this

  var y = 0;
  var dataSeries = { type: "line" };
  var dataPoints = [];

  $.each(input, function (key, val) {
    dataPoints.push({
      x: new Date(val.date),
      y: val.tasmin
    });
  });

  dataSeries.dataPoints = dataPoints;
  data.push(dataSeries);
  DoD3();
}

function GetCartoData(rcp) {
  //do the request
   $("#loader").css({display:'block'});
  cartoSql('SELECT count(*) FROM data_1', function (data) {
    $("#raw-dataset").prepend("<p>Found: " + data.rows[0].count + ' records...</p>');
  });
  cartoSql("SELECT * FROM data_1 WHERE scenario='rcp"+rcp+"'", function (data) {
    RenderChart(data.rows);
   $("#loader").css({display:'none'});
    var html = '<pre>'
    $.each(data.rows, function (key, val) {
      html += '\n' + val.date + ' - ' + val.tasmin + '(C)';
    });
    html += '</pre>'
    $("#raw-dataset").append(html);
  });
}

$('#carto-explorer-btn').on('click', function () {
  GetCartoData(rcp);
})

$("#carto-graphs-btn").on('click', function () {
  $("#raw-dataset").css({ display: 'none' });
  $(this).css({ display: 'none' });
  $("#carto-dashboard").css({ display: 'block' });
})

// $('#carto-explorer-btn').trigger('click');

$(".rcp-click").on('click', function () {
  rcp = ($(this).data('rcp'));
  GetCartoData(rcp);
})