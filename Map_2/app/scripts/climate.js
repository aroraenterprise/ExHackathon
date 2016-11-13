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
var rcpValue = '85';
function DoD3() {
  console.log(data);
  var chart = new CanvasJS.Chart("chart-container",
    {
      zoomEnabled: true,
      title: {
        text: "Orlando Temperature vs. RCP Level: " + rcpValue,
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
  $("#loader").css({ display: 'block' });
  cartoSql('SELECT count(*) FROM data_1', function (data) {
    $("#raw-dataset").prepend("<p>Found: " + data.rows[0].count + ' records...</p>');
  });
  cartoSql("SELECT * FROM data_1 WHERE scenario='rcp" + rcp + "'", function (data) {
    RenderChart(data.rows);
    $("#loader").css({ display: 'none' });
    var html = '<pre>'
    $.each(data.rows, function (key, val) {
      html += '\n' + val.date + ' - ' + val.tasmin + '(C)';
    });
    html += '</pre>'
    $("#raw-dataset").append(html);
  });
}

$('#carto-explorer-btn').on('click', function () {
  GetCartoData(rcpValue);
})

$("#carto-graphs-btn").on('click', function () {
  $("#raw-dataset").css({ display: 'none' });
  $(this).css({ display: 'none' });
  $("#carto-dashboard").css({ display: 'block' });
})

$(".rcp-click").on('click', function () {
  rcpValue = ($(this).data('rcp'));
  $(".rcp-goal").html("RCP " + rcpValue);
  GetCartoData(rcpValue);
})


var tradeoff = {
  energy: 12000000000,
  energyInfra: 200000000,
  renewable: 2400000,
  renewableInfra: 1000000000,
  landUse: 2000000000
}

var rcp = {
  energy: 80,
  energyInfra: 25,
  renewable: 70,
  renewableInfra: 35,
  landuse: 40
}

var values = {
  energy: 100,
  energyInfra: 0,
  renewable: 50,
  renewableInfra: 0,
  landuse: 50
}


Number.prototype.formatMoney = function (c, d, t) {
  var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

var totalConsumptionHtml = $("#total-consumption");
var totalBudgetHtml = $("#total-budget");
var energy = $("#energy-badge");
var energyInfra = $("#energy-infra-badge");
var renewable = $("#renewable-badge")
var renewableInfra = $("#renewable-infra-badge")
var landbadge = $("#land-badge");

var totalBudget = ((values.energy + 0.1) * tradeoff.energy / 100) +
  ((values.energyInfra + 0.1) * tradeoff.energyInfra / 100) +
  ((values.renewable + 0.1) * tradeoff.renewable / 100) +
  ((values.renewableInfra + .1) * tradeoff.renewableInfra / 100) +
  ((values.landuse + .1) * tradeoff.landUse / 100);
var totalConsumption = totalBudget;
function updateValues() {
  energy.html((values.energy * tradeoff.energy / 100).formatMoney(2));
  energyInfra.html(parseInt(values.energyInfra * tradeoff.energyInfra / 100).formatMoney(2));
  renewable.html(parseInt(values.renewable * tradeoff.renewable / 100).formatMoney(2));
  renewableInfra.html(parseInt(values.renewableInfra * tradeoff.renewableInfra / 100).formatMoney(2));
  landbadge.html(parseInt(values.landuse * tradeoff.landUse / 100).formatMoney(2));

  if (values.energy > rcp.energy) {
    energy.css({ 'background-color': 'red' });
  } else {
    energy.css({ 'background-color': 'green' })
  }

  if (values.energyInfra < rcp.energyInfra) {
    energyInfra.css({ 'background-color': 'red' });
  } else {
    energyInfra.css({ 'background-color': 'green' })
  }

  if (values.renewable < rcp.renewable) {
    renewable.css({ 'background-color': 'red' });
  } else {
    renewable.css({ 'background-color': 'green' })
  }

  if (values.renewableInfra < rcp.renewableInfra) {
    renewableInfra.css({ 'background-color': 'red' });
  } else {
    renewableInfra.css({ 'background-color': 'green' })
  }

  if (values.landuse > rcp.landuse) {
    landbadge.css({ 'background-color': 'red' });
  } else {
    landbadge.css({ 'background-color': 'green' })
  }

  totalConsumption = ((values.energy + 0.1) * tradeoff.energy / 100) +
    ((values.energyInfra + 0.1) * tradeoff.energyInfra / 100) +
    ((values.renewable + 0.1) * tradeoff.renewable / 100) +
    ((values.renewableInfra + .1) * tradeoff.renewableInfra / 100) +
    ((values.landuse + .1) * tradeoff.landUse / 100);
  totalConsumptionHtml.html(totalConsumption.formatMoney(2));
  if (totalConsumption > totalBudget) {
    totalConsumptionHtml.css({ 'background-color': 'red' });
  } else {
    totalConsumptionHtml.css({ 'background-color': 'green' })
  }
}

$("#energy-slider").slider().on('slide', function (ev) {
  values.energy = ev.value;
  updateValues();
});
$("#energy-infra-slider").slider().on('slide', function (ev) {
  values.energyInfra = ev.value;
  updateValues();

});
$("#landuse-slider").slider().on('slide', function (ev) {
  values.landuse = ev.value;
  updateValues();
});
$("#agriculture-slider").slider().on('slide', function (ev) {
  values.agriculture = ev.value;
  updateValues();
});
$("#renewable-slider").slider().on('slide', function (ev) {
  values.renewable = ev.value;
  updateValues();
});
$("#renewable-infra-slider").slider().on('slide', function (ev) {
  values.renewableInfra = ev.value;
  updateValues();
});

updateValues();
totalBudgetHtml.html((totalBudget).formatMoney(2));
