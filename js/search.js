// Initializes the 'select' components when the page loads.
$(document).ready(function(){
  $('select').formSelect();
});

// AJAX GET request executed when the page loads for retrieving all the available genres.
$.ajax({
  url: './data/applicationLayerSeiji.php',
  type: 'GET',
  data: { 'action': 'GENRES' },
  ContentType: 'application/json',
  dataType: 'json',
  success: function(data) {
    let $genres = $('#genres');
    for (let index in data) {
      $($genres).append(createSelectOptionHtml(data[index].genre));
    }
    // Reinitializes the 'select' components to be able to display the received data.
    $('select').formSelect();
  },
  error: function(err) {
    swal({
      text: 'The server is down',
      title: 'Error!',
      type: "error"
    }).then((_) => $(location).attr('href', './index.html'));
  }
});

// AJAX GET request executed when the page loads for retrieving all the available show years.
$.ajax({
  url: './data/applicationLayerSeiji.php',
  type: 'GET',
  data: { 'action': 'YEARS' },
  ContentType: 'application/json',
  dataType: 'json',
  success: function(data) {
    let $years = $('#years');
    for (let index in data) {
      $($years).append(createSelectOptionHtml(data[index].showYear));
    }
    // Reinitializes the 'select' components to be able to display the received data.
    $('select').formSelect();
  },
  error: function(err) {
    swal({
      text: 'The server is down',
      title: 'Error!',
      type: "error"
    }).then((_) => $(location).attr('href', './index.html'));
  }
});

// Creates the HTML for an option to be included in a 'select' element.
function createSelectOptionHtml(optionValue) {
  return `<option value="${optionValue}">${optionValue}</option>`;
}