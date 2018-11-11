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
      $sql = "SELECT country FROM Countries ORDER BY country ASC";
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

  function attemptLogin($username, $password) {
    $conn = connect();

    if ($conn != null) {
      $sql = "SELECT passwd, firstName, lastName FROM Users WHERE username = ?";
      $stmt = $conn->prepare($sql);

      $stmt->bind_param('s', $username);
      $stmt->execute();
      $result = $stmt->get_result();

      if ($result->num_rows > 0) {
        $passwordIsCorrect = false;
        while ($row = $result->fetch_assoc()) {
          $passwordHash = $row['passwd'];
          $firstName = $row['firstName'];
          $lastName = $row['lastName'];
          if (password_verify($password, $passwordHash)) {
            $passwordIsCorrect = true;
          }
        }

        $stmt->close();
        $conn->close();

        if ($passwordIsCorrect) {
          $response = array('firstName' => $firstName, 'lastName' => $lastName, 'message' => 'Successful login');
          return array('status' => 'SUCCESS', 'response' => $response);
        } else {
          return array('status' => 'NOT_FOUND', 'code' => 406);
        }
      }
      
      else {
        $stmt->close();
        $conn->close();
        return array('status' => 'NOT_FOUND', 'code' => 406);
      }
    }

    else {
      return array('status' => 'INTERNAL_SERVER_ERROR', 'code' => 500);
    }
  }

  function attemptRegistration($username, $password, $firstName, $lastName, $email, $gender, $country) {
    $conn = connect();

    if ($conn != null) {
      $sql = "SELECT username FROM Users WHERE username = ?";
      $stmt = $conn->prepare($sql);
      $stmt->bind_param('s', $username);
      $stmt->execute();
      $result = $stmt->get_result();

      if ($result->num_rows == 0) {
        $stmt->close();
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $sql = "INSERT INTO Users (username, passwd, firstName, lastName, email, gender, country)
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('sssssss', $username, $passwordHash, $firstName, $lastName, $email, $gender, $country);
        
        if ($stmt->execute()) {
          $stmt->close();
          $conn->close();
          return array('status' => 'SUCCESS', 'response' => 'Successful user registration');
        } else {
          $stmt->close();
          $conn->close();
          return array('status' => 'INTERNAL_SERVER_ERROR', 'code' => 500);
        }
      }

      else {
        $stmt->close();
        $conn->close();
        return array('status' => 'CONFLICT', 'code' => 409);
      }
    }

    else {
      return array('status' => 'INTERNAL_SERVER_ERROR', 'code' => 500);
    }
  }

  function retrieveMostFollowedShows() {
    $conn = connect();

    if ($conn != null) {
      $sql = "SELECT id, showName, showImage FROM Shows S JOIN FollowedShows F ON S.id = F.showId
              GROUP BY showId ORDER BY COUNT(username) DESC LIMIT 10";
      $result = $conn->query($sql);

      $response = $result->fetch_all(MYSQLI_ASSOC);
      $conn->close();
      return array('status' => 'SUCCESS', 'response' => $response);
    }

    else {
      return array('status' => 'INTERNAL_SERVER_ERROR', 'code' => 500);
    }
  }

  function searchShows($pattern, $genre, $year) {
    $conn = connect();

    if ($conn != null) {
      $sql = "SELECT DISTINCT(id), showName, showImage
              FROM Shows S JOIN ShowsGenres SG ON S.id = SG.showId
              WHERE
                showName LIKE CONCAT('%', IFNULL(?, showName), '%')
                AND genre = IFNULL(?, genre)
                AND showYear = IFNULL(?, showYear)
              ORDER BY showName ASC";
      $stmt = $conn->prepare($sql);
      $stmt->bind_param('ssi', $pattern, $genre, $year);
      $stmt->execute();
      $result = $stmt->get_result();

      $response = $result->fetch_all(MYSQLI_ASSOC);
      $stmt->close();
      $conn->close();
      return array('status' => 'SUCCESS', 'response' => $response);
    }

    else {
      return array('status' => 'INTERNAL_SERVER_ERROR', 'code' => 500);
    }
  }

  function retrieveGenres() {
    $conn = connect();

    if ($conn != null) {
      $sql = "SELECT genre FROM Genres ORDER BY genre ASC";
      $result = $conn->query($sql);

      $response = $result->fetch_all(MYSQLI_ASSOC);
      $conn->close();
      return array('status' => 'SUCCESS', 'response' => $response);
    }

    else {
      return array('status' => 'INTERNAL_SERVER_ERROR', 'code' => 500);
    }
  }

  function retrieveYears() {
    $conn = connect();

    if ($conn != null) {
      $sql = "SELECT DISTINCT(showYear) FROM Shows ORDER BY showYear ASC";
      $result = $conn->query($sql);

      $response = $result->fetch_all(MYSQLI_ASSOC);
      $conn->close();
      return array('status' => 'SUCCESS', 'response' => $response);
    }

    else {
      return array('status' => 'INTERNAL_SERVER_ERROR', 'code' => 500);
    }
  }
?>