CREATE TABLE Countries (
  country VARCHAR(255) NOT NULL PRIMARY KEY
);

CREATE TABLE Genres (
  genre VARCHAR(255) NOT NULL PRIMARY KEY
);

CREATE TABLE Users (
  username VARCHAR(255) NOT NULL PRIMARY KEY,
  passwd VARCHAR(255) NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  gender VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  FOREIGN KEY (country) REFERENCES Countries(country) 
);

CREATE TABLE Shows (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  showName VARCHAR(255) NOT NULL,
  showDescription VARCHAR(2000) NOT NULL,
  showStatus VARCHAR(255) NOT NULL,
  showYear INT NOT NULL,
  totalEpisodes INT,
  currentEpisodes INT
);

ALTER TABLE Shows AUTO_INCREMENT=1;

CREATE TABLE Comments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  content VARCHAR(500) NOT NULL,
  commentDate DATETIME NOT NULL,
  username VARCHAR(255) NOT NULL,
  showId INT NOT NULL,
  FOREIGN KEY (username) REFERENCES Users(username),
  FOREIGN KEY (showId) REFERENCES Shows(id)
);

ALTER TABLE Comments AUTO_INCREMENT=1;

CREATE TABLE FollowedShows (
  username VARCHAR(255) NOT NULL,
  showId INT NOT NULL,
  PRIMARY KEY (username, showId),
  FOREIGN KEY (username) REFERENCES Users(username),
  FOREIGN KEY (showId) REFERENCES Shows(id)
);

CREATE Table Ratings (
  username VARCHAR(255) NOT NULL,
  showId INT NOT NULL,
  score INT NOT NULL,
  PRIMARY KEY (username, showId),
  FOREIGN KEY (username) REFERENCES Users(username),
  FOREIGN KEY (showId) REFERENCES Shows(id)
);