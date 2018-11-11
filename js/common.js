// When the logout button is clicked, executes an AJAX DELETE request to delete the current session
// and therefore logout the current user.
$('.navRow').on('click', '.logout', function() {
  $.ajax({
    url: './data/applicationLayerSeiji.php',
    type: 'DELETE',
    data: { 'action': 'SESSION' },
    ContentType: 'application/json',
    dataType: 'json',
    success: function(data) {
      swal({
        text: 'You have been successfully logged out.',
        title: 'Successful Logout',
        type: 'success'
      }).then((_) => { $(location).attr('href', './index.html'); });
    },
    error: function(err) {
      swal({
        text: 'There was a problem performing the logout. To successfully logout close the browser',
        title: 'Error!',
        type: 'error'
      });
    }
  });
});

// Creates HTML content to hold the name and image of a show and to display them appropriately.
function createShowHtml(show) {
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

// Function that retrieves the GET parameters inside a URL.
$.urlParam = function (name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results == null) {
    return null;
  }
  return decodeURI(results[1]) || 0;
}

// When the ENTER key is pressed while the seach box in the navbar is focused, redirects the browser
// to the search page, unless the search box is empty.
$('.navRow').on('keypress', '#search', function(event) {
  let keyPressed = event.which;
  let showName = $(this).val().trim();
  if (keyPressed == 13 && showName != '') { // The key code of ENTER.
    let url = "./search.html?show=" + encodeURIComponent(showName);
    event.preventDefault();
    $(location).attr('href', url);
  }
});

// Function that handles an AJAX error based on its HTTP status code.
function ajaxErrorHandler(err) {
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