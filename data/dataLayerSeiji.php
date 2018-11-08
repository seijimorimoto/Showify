<?php
  
  # Connects to the database of the web application.
  # Return: The connection object if the connection was successful. Otherwise, null.
  function connect() {
    $serverName = 'localhost';
    $serverUserName = 'root';
    $serverPassword = '';
    $databaseName = 'showify';

    $connection = new mysqli($serverName, $serverUserName, $serverPassword, $databaseName);

    if ($connection->connect_error) {
      return null;
    } else {
      return $connection;
    }
  }

  function retrieveCountries() {
    $conn = connect();

    if ($conn != null) {
      $sql = "SELECT country FROM Countries";
      $result = $conn->query($sql);

      if ($result->num_rows > 0) {
        $response = $result->fetch_all(MYSQLI_ASSOC);
        $conn->close();
        return array('status' => 'SUCCESS', 'response' => $response);
      } else {
        $conn->close();
        return array('status' => 'NOT_FOUND', 'code' => 406);
      }
    }

    else {
      return array('status' => 'INTERNAL_SERVER_ERROR', 'code' => 500);
    }
  }
?>