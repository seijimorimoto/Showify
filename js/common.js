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