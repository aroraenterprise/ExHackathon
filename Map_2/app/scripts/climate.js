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