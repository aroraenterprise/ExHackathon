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
var dataset = {};

$('#carto-explorer-btn').on('click', function () {
  //do the request
  cartoSql('SELECT count(*) FROM data_1', function (data) {
    $("#raw-dataset").prepend("<p>Found: " + data.rows[0].count + ' records...</p>');
  });
  cartoSql('SELECT * FROM data_1 LIMIT 100', function (data) {
    $("#loader").remove();
    var html = '<pre>'
    $.each(data.rows, function (key, val) {
      console.log(val);
      html += '\n' + val.date + ' - ' + val.tasmin + '(C)';
    });
    html += '</pre>'
    $("#raw-dataset").append(html);
  });
})

$("#carto-graphs-btn").on('click', function () {
  $("#raw-dataset").css({ display: 'none' });
  $(this).css({ display: 'none' });
  $("#carto-graphs").css({ display: 'block' });
  $("#carto-maps-btn").css({ display: 'inline-block' })
})

$("#carto-maps-btn").on('click', function () {
  $(this).css({ display: 'none' });
  $("#carto-graphs").css({ display: 'none' });
  $("#carto-dashboard").css({ display: 'block' });
})

// $('#carto-explorer-btn').trigger('click');