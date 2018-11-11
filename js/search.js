// IMPORTANT NOTE: INCLUDE THIS JAVASCRIPT FILE AFTER THE common.js FILE IN YOUR HTML, OTHERWISE IT
// WON'T WORK APPROPRIATELY, SINCE IT USES FUNCTIONS FROM THAT FILE.

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
    ajaxErrorHandler(err);
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
    ajaxErrorHandler(err);
  }
});

// Creates the HTML for an option to be included in a 'select' element.
function createSelectOptionHtml(optionValue) {
  return `<option value="${optionValue}">${optionValue}</option>`;
}

// Checks whether the URL has GET parameters, in which case performs a search with the 'show'
// parameter found in the URL.
let showName = $.urlParam('show');
if (showName != null) {
  $('#mainSearch').val(showName);
  searchShows();
}

// When the search button is clicked, an AJAX GET request is triggered for retrieving the shows that
// matched the search criteria.
$('#searchBtn').on('click', function() {
  searchShows();
});

// When the ENTER key is pressed while the main seach box is focused, an AJAX GET request is
// triggered for retrieving the shows that matched the search criteria.
$('#mainSearch').on('keypress', function(event) {
  let keyPressed = event.which;
  if (keyPressed == 13) { // The key code of ENTER.
    event.preventDefault();
    searchShows();
  }
});

// Performs an AJAX GET request for retrieving the shows that match the search criteria.
function searchShows() {
  let searchPattern = $('#mainSearch').val().trim();
  let genre = $('#genres').val();
  let year = $('#years').val();

  $.ajax({
    url: './data/applicationLayerSeiji.php',
    type: 'GET',
    data: {
      'action': 'SEARCH',
      'pattern': searchPattern,
      'genre': genre,
      'year': year
    },
    ContentType: 'application/json',
    dataType: 'json',
    success: function(data) {
      let $searchResults = $('#searchResultsSection');
      // Empties the search result section so that only shows that matched the current search
      // criteria are displayed.
      $searchResults.html('');

      if (data.length > 0) {
        for (let index in data) {
          // createShowHtml can be used because it is obtained from common.js
          let showHtml = createShowHtml(data[index]);
          $searchResults.append(showHtml);
        }
      } else {
        let noShowsHtml = `<h5 class="center-align">
                            <i>No results were found</i>
                            &#x1F622
                          </h5>`;
        $searchResults.append(noShowsHtml);
      }
    },
    error: function(err) {
      ajaxErrorHandler(err);
    }
  });
}

// When any of the searched shows (displayed as cards) is clicked, redirects the browser to the page
// corresponding to that specific show.
$('#searchResultsSection').on('click', '.card', function() {
  let showId = $(this).find('.showId').text();
  let url = './showPage.html?show=' + encodeURIComponent(showId);
  $(location).attr('href', url);
});