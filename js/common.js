// When the logout button is clicked, executes an AJAX DELETE request to delete the current session
// and therefore logout the current user.
$('.logout').on('click', function() {
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