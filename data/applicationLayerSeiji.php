<?php
  header('Content-type: application/json');
  header('Accept: application/json');

  require_once __DIR__ . '/dataLayerSeiji.php';
  
  $request_method = $_SERVER['REQUEST_METHOD'];

  switch ($request_method) {
    case 'GET':
      $action = $_GET['action'];
      getRequests($action);
      break;
    case 'POST':
      $action = $_POST['action'];
      postRequests($action);
      break;
  }

  # Handles GET requests.
  # Parameters:
  # - $action: String representing an action requested by the front-end.
  function getRequests($action) {
    switch ($action) {
      case 'COUNTRIES':
        requestCountries();
        break;
      case 'LOGIN':
        requestLogin();
        break;
      case 'MOST_FOLLOWED_SHOWS':
        requestMostFollowedShows();
        break;
    }
  }

  # Handles POST requests.
  # Parameters:
  # - $action: String representing an action requested by the front-end.
  function postRequests($action) {
    switch ($action) {
      case 'REGISTER':
        registerUser();
        break;
    }
  }

  # Handles the request for all the countries registered in the DB.
  function requestCountries() {
    $response = retrieveCountries();

    if ($response['status'] == 'SUCCESS') {
      echo json_encode($response['response']);
    } else {
      $message = null;
      if ($response['code'] == 406)
        $message = 'There are no countries registered in the database';
      errorHandler($response['status'], $response['code'], $message);
    }
  }

  # Handles the login of the application.
  function requestLogin() {
    $username = $_GET['username'];
    $password = $_GET['password'];

    $response = attemptLogin($username, $password);
    
    if ($response['status'] == 'SUCCESS') {
      session_start();
      $_SESSION['firstName'] = $response['response']['firstName'];
      $_SESSION['lastName'] = $response['response']['lastName'];
      $_SESSION['username'] = $username;

      echo json_encode($response['response']['message']);
    } else {
      errorHandler($response['status'], $response['code']);
    }
  }

  # Handles the registration of a user to the application.
  function registerUser() {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $email = $_POST['email'];
    $gender = $_POST['gender'];
    $country = $_POST['country'];

    $response = attemptRegistration($username, $password, $firstName, $lastName, $email, $gender, $country);

    if ($response['status'] == 'SUCCESS') {
      session_start();
      $_SESSION['firstName'] = $firstName;
      $_SESSION['lastName'] = $lastName;
      $_SESSION['username'] = $username;
      echo json_encode($response['response']);
    } else {
      errorHandler($response['status'], $response['code'], 'The username provided already exists');
    }
  }

  # Handles the request for getting the most followed shows.
  function requestMostFollowedShows() {
    validateSession();
    $response = retrieveMostFollowedShows();

    if ($response['status'] == 'SUCCESS') {
      echo json_encode($response['response']);
    } else {
      errorHandler($response['status'], $response['code']);
    }
  }

  # Validates that a session exists.
  function validateSession() {
    session_start();

    if (isset($_SESSION['firstName']) && isset($_SESSION['lastName']) && isset($_SESSION['username'])) {
      return;
    } else {
      errorHandler("UNAUTHORIZED", 401);
    }
  }

  # Handles errors that occured in the data layer and returns an appropriate message to front-end.
  # Parameters:
  # - $status: Integer representing the status/reason of the error.
  # - $code: Integer representing an HTTP error code.
  # - $message: String representing an specific message to be sent to the front-end. If null, a
  #   default message for each error code will be used.
  function errorHandler($status, $code, $message = null) {
    switch ($code) {
      case 401:
        header("HTTP/1.1 $code $status");
        if ($message == null)
          $message = "User not authorized or authenticated";
      case 406:
        header("HTTP/1.1 $code User $status");
        if ($message == null)
          $message = 'Wrong credentials provided'; 
        break;
      case 409:
        header("HTTP/1.1 $code $status");
        if ($message == null)
          $message = 'There was a conflict with the data being sent'; 
        break;
      case 500:
        header("HTTP/1.1 $code $status. Bad connection, portal is down");
        if ($message == null)
          $message = "The server is down, we couldn't retrieve data from the database";
        break;
    }
    die($message);
  }
?>