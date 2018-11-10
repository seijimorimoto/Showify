// Initializes the sidenav component when the page loads.
$(document).ready(function(){
  $('.sidenav').sidenav();
});

// AJAX GET request executed when the page loads for retrieving the most followed shows.
$.ajax({
  url: './data/applicationLayerSeiji.php',
  type: 'GET',
  data: { 'action': 'MOST_FOLLOWED_SHOWS' },
  ContentType: 'application/json',
  dataType: 'json',
  success: function(data) {
    let $mostFollowedShows = $('#mostFollowedShows');
    if (data.length > 0) {
      for (let index in data) {
        let showHtml = createMostFollowedShowHtml(data[index]);
        $mostFollowedShows.append(showHtml);
      }
    } else {
      let noShowsHtml = `<h5 class="center-align">
                          <i>Currently there are no shows being followed.</i>
                          &#x1F622
                        </h5>`;
      $mostFollowedShows.append(noShowsHtml);
    }
  },
  error: function(err) {
    switch (err.status) {
      case 401:
        swal({
          text: 'Your session has expired',
          title: 'Error!',
          type: "error"
        }).then((_) => $(location).attr('href', './index.html'));
        break;
      case 500:
        swal({
          text: 'The server is down',
          title: 'Error!',
          type: "error"
        }).then((_) => $(location).attr('href', './index.html'));
        break;
    }
  }
});

// Creates HTML content to hold the name and image of a most followed show and to display them
// appropriately on the home page.
function createMostFollowedShowHtml(show) {
  return `<div class="col s6 m4 l3">
            <div class="card showCard hoverable clickable blue accent-2">
              <div class="card-image showImage">
                <img src="${show.showImage}" alt="${show.showName} image">
              </div>
              <div class="card-content showCardContent center white-text bold">
                <p>${show.showName}</p>
                <p class="showId hide">${show.id}</p>
              </div>
            </div>
          </div>`;
}

// When any of the most followed shows (displayed as cards) is clicked, redirects the browser to
// the page corresponding to that specific show.
$('#mostFollowedShows').on('click', '.card', function() {
  let showId = $(this).find('.showId').text();
  let url = './showPage.html?show=' + encodeURIComponent(showId);
  $(location).attr('href', url);
});