document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);
});

//Allows the use of select.
$(document).ready(function () {
  $('select').formSelect();
});

//This function allows you to get the parameters inside a URL
$.urlParam = function (name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results == null) {
    return null;
  }
  return decodeURI(results[1]) || 0;
}

//Here all the series information is loaded
let jsonToSend = {
  "action": "LOAD_SERIES_DATA",
  "showID": $.urlParam('show')
};
$.ajax({
  url: "./data/applicationLayerIvan.php",
  type: "GET",
  data: jsonToSend,
  dataType: "json",
  success: function (data) {
    $("#showTitle").text(data["responseSeriesData"]["showName"]);
    $("#showStatus").text(data["responseSeriesData"]["showStatus"]);
    $("#showYear").text(data["responseSeriesData"]["showYear"]);
    $("#showEpisodes").text(data["responseSeriesData"]["totalEpisodes"]);
    $("#showSeasons").text(data["responseSeriesData"]["currentSeasons"]);
    $("#showDescription").text(data["responseSeriesData"]["showDescription"]);
    $('#showImage').prepend($('<img>', { id: 'image', src: data["responseSeriesData"]["showImage"] }));
    let genres = "";
    $.each(data["responseGenre"], function (i) {
      if (i == 0) {
        genres += data["responseGenre"][i]["genre"];
      } else {
        genres += ", " + data["responseGenre"][i]["genre"];
      }
    });
    $("#showGenre").text(genres);
    getRate();
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

//This function obtains the rate of a serie and updates it
function getRate(){
  let jsonToSend2 = {
    "action": "LOAD_SERIES_RATING",
    "showID": $.urlParam('show')
  };
  $.ajax({
    url: "./data/applicationLayerIvan.php",
    type: "GET",
    data: jsonToSend2,
    dataType: "json",
    success: function (data) {
      let temp = Math.round(data.score * 100) / 100;
      $("#showRating").text(temp);
    },
    error: function (err) {
      console.log(err);
    }
  });
}

//This function allows the user to update/make a rating
$('#rateNow').on('click', function () {
  let jsonToSend = {
    "action": "RATE_SERIE",
    "showID": $.urlParam('show'),
    "rate": $("#rateSelect").val()
  };
  if ($("#rateSelect").val() != null) {
    $.ajax({
      url: "./data/applicationLayerIvan.php",
      type: "POST",
      data: jsonToSend,
      dataType: "json",
      success: function (data) {
        swal({
          title: 'Congratulations!',
          text: 'You successfully rated this serie!',
          type: 'success',
          confirmButtonText: 'Ok'
        })
        getRate();
      },
      error: function (err) {
        if (err.responseText == "The server is down, we couldn't retrieve data from the data base") {
          swal({
            title: 'Error!',
            text: 'The server is down',
            type: 'error',
            confirmButtonText: 'Ok'
          }).then((_) => {
            $(location).attr('href', './index.html');
          });
        }
      }
    });
  }
});
