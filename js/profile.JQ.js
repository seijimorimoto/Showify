// Initializes the sidenav component when the page loads.
$(document).ready(function(){
  $('.sidenav').sidenav();
});

let jsonToSend = {
  "action": "LOAD_PROFILE",
};

//Loads the user's data 
$.ajax({
  url: "./data/applicationLayerIvan.php",
  type: "GET",
  data: jsonToSend,
  dataType: "json",
  success: function (data) {
    $("#username").text(data.username);
    $("#fName").text(data.firstName);
    $("#lName").text(data.lastName);
    $("#eMail").text(data.email);
    $("#gender").text(data.gender);
    $("#country").text(data.country);
  },
  error: function (err) {
    if (err.responseText == "The series you requested does not exist.") {
      swal({
        title: 'Error!',
        text: 'The serie you requested does not exist',
        type: 'error',
        confirmButtonText: 'Ok'
      }).then((_) => {
        $(location).attr('href', './home.html');
      });
    } else if (err.responseText == "The server is down, we couldn't retrieve data from the data base") {
      swal({
        title: 'Error!',
        text: 'The server is down',
        type: 'error',
        confirmButtonText: 'Ok'
      }).then((_) => {
        $(location).attr('href', './index.html');
      });
    } else {
      swal({
        title: 'Error!',
        text: 'Your session has expired',
        type: 'error',
        confirmButtonText: 'Ok'
      }).then((_) => {
        $(location).attr('href', './index.html');
      });
    }
  }
});