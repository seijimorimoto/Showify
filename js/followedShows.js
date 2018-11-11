// IMPORTANT NOTE: INCLUDE THIS JAVASCRIPT FILE AFTER THE common.js FILE IN YOUR HTML, OTHERWISE IT
// WON'T WORK APPROPRIATELY, SINCE IT USES FUNCTIONS FROM THAT FILE.

// Initializes the sidenav component when the page loads.
$(document).ready(function(){
  $('.sidenav').sidenav();
});

// AJAX GET request executed when the page loads for retrieving the shows followed by the user.
$.ajax({
  url: './data/applicationLayerSeiji.php',
  type: 'GET',
  data: { 'action': 'FOLLOWED_SHOWS' },
  ContentType: 'application/json',
  dataType: 'json',
  success: function(data) {
    let $followedShows = $('#followedShows');
    if (data.length > 0) {
      for (let index in data) {
        let showHtml = createShowHtml(data[index]);
        $followedShows.append(showHtml);
      }
    } else {
      let noShowsHtml = `<h5 class="center-align">
                          <i>Currently you are not following any shows</i>
                          &#x1F622
                        </h5>`;
      $followedShows.append(noShowsHtml);
    }
  },
  error: function(err) {
    ajaxErrorHandler(err);
  }
});

// When any of the user followed shows (displayed as cards) is clicked, redirects the browser to the
// page corresponding to that specific show.
$('#followedShows').on('click', '.card', function() {
  let showId = $(this).find('.showId').text();
  let url = './showPage.html?show=' + encodeURIComponent(showId);
  $(location).attr('href', url);
});