$('#loginBtn').on('click', function() {
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    buttonsStyling: false,
    cancelButtonClass: 'waves-effect waves-light btn bold red confirmCancelBtn',
    confirmButtonClass: 'waves-effect waves-light btn bold teal confirmCancelBtn',
    confirmButtonText: 'Login',
    focusConfirm: false,
    html:
    `
    <div class="row">
      <form class="col s12">
        <div class="row">
          <div class="input-field col s12">
            <i class="material-icons prefix">account_circle</i>
            <input id="loginUsername" type="text" class="validate">
            <label id="labelUsername" for="loginUsername">Username</label>
          </div>
          <div class="input-field col s12">
            <i class="material-icons prefix">lock</i>
            <input id="loginPassword" type="password" class="validate">
            <label id="labelPassword" for="loginPassword">Password</label>
          </div>
        </div>
      </form>
    </div>
    `,
    preConfirm: function() {
      return new Promise(function (resolve, reject) {
        if (validateLogin()) {
          tryLogin()
            .then(result => { resolve(true); })
            .catch(error => { swal.showValidationMessage(`Request failed: ${error.message}`); resolve(false); });
        } else {
          swal.showValidationMessage('Some fields are not filled correctly');
          resolve(false);
        }
      });
    },
    showCancelButton: true,
    title: 'Login',
    type: 'info'
  }).then((result) => {
    if (result.value) {
      swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        buttonsStyling: false,
        confirmButtonClass: 'waves-effect waves-light btn bold teal',
        confirmButtonText: 'Go!',
        text: 'You have been successfully logged. We will redirect you to your home page.',
        title: 'Successful Login',
        type: 'success',
      }).then((_) => {
        $(location).attr('href', './home.html');
      });
    }
  });
});

$('#registerBtn').on('click', function() {
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    buttonsStyling: false,
    cancelButtonClass: 'waves-effect waves-light btn bold red confirmCancelBtn',
    confirmButtonClass: 'waves-effect waves-light btn bold teal confirmCancelBtn',
    confirmButtonText: 'Register',
    focusConfirm: false,
    html:
    `
    <div class="row">
      <form class="col s12">
        <div class="row">
          <div class="input-field col s12 m6">
            <input id="registerFirstName" type="text">
            <label id="labelFirstName" for="registerFirstName">First Name</label>
          </div>
          <div class="input-field col s12 m6">
            <input id="registerLastName" type="text">
            <label id="labelLastName" for="registerLastName">Last Name</label>
          </div>
          <div class="input-field col s12">
            <input id="registerEmail" type="email">
            <label id="labelEmail" for="registerEmail">Email</label>
          </div>
          <div class="input-field col s12">
            <input id="registerUsername" type="text">
            <label id="labelUsername" for="registerUsername">Username</label>
          </div>
          <div class="input-field col s12 m6">
            <input id="registerPassword" type="password">
            <label id="labelPassword" for="registerPassword">Password</label>
          </div>
          <div class="input-field col s12 m6">
            <input id="registerPasswordConf" type="password">
            <label id="labelPasswordConf" for="registerPasswordConf">Password Confirmation</label>
          </div>
          <div class="input-field col s12 m6">
            <select id="registerGender">
              <option value="" disabled selected>Choose an option</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <label id="labelGender">Gender</label>
          </div>
          <div class="input-field col s12 m6">
            <select id="registerCountry">
              <option value="" disabled selected>Choose an option</option>
            </select>
            <label id="labelCountry">Country</label>
          </div>
        </div>
      </form>
    </div>
    `,
    onOpen: function() {
      // Initialize select elements for Materialize to work.
      $('select').formSelect();

      // Remove select element that appears for no reason.
      let selectTypeElements = $('.select-wrapper');
      $(selectTypeElements[2]).remove();

      retrieveCountryList(
        function(countryList) {
          let $countrySelect = $('#registerCountry');
          for (let index in countryList) {
            let country = countryList[index].country;
            let newHtml = `<option value="${country}">${country}</option>`;
            $($countrySelect).append(newHtml);
          }

          // Re-initialize select elements so that the options appended to the #registerCountry
          // select element are displayed.
          $('select').formSelect();
        }
      );
    },
    preConfirm: function() {
      return new Promise(function (resolve, reject) {
        if (validateRegistration()) {
          tryRegistration()
            .then(result => { resolve(true); })
            .catch(error => { swal.showValidationMessage(`Request failed: ${error.message}`); resolve(false); });
        } else {
          swal.showValidationMessage('Some fields are not filled correctly');
          resolve(false);
        }
      });
    },
    showCancelButton: true,
    title: 'Registration',
    type: 'info'
  }).then((result) => {
    if (result.value) {
      swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        buttonsStyling: false,
        confirmButtonClass: 'waves-effect waves-light btn bold teal',
        confirmButtonText: 'Got it!',
        text: 'You have been successfully registered. We will redirect you to your home page.',
        title: 'Successful Registration',
        type: 'success',
      }).then((_) => {
        $(location).attr('href', './home.html');
      });
    }
  });
});

function retrieveCountryList(callback = function(countryList) {}) {
  $.ajax({
    url: './data/applicationLayerSeiji.php',
    type: 'GET',
    data: { 'action': 'COUNTRIES' },
    ContentType: 'application/json',
    dataType: 'json',
    success: function(data) {
      callback(data);
    },
    error: function(err) {
      console.log(err);
    }
  });
}

function validateLogin() {
  let $username = $('#loginUsername');
  let $labelUsername = $('#labelUsername');
  let $password = $('#loginPassword');
  let $labelPassword = $('#labelPassword');
  let isValid = true;

  if ($($username).val() === "") {
    isValid = false;
    $($labelUsername).html('Username must not be empty.');
    $($username).addClass('invalid');
  } else {
    $($labelUsername).html('Username');
    $($username).removeClass('invalid');
  }

  if ($($password).val() === "") {
    isValid = false;
    $($labelPassword).html('Password must not be empty.');
    $($password).addClass('invalid');
  } else {
    $($labelPassword).html('Password');
    $($password).removeClass('invalid');
  }

  return isValid;
}

function validateRegistration() {
  let $firstName = $('#registerFirstName');
  let $labelFirstName = $('#labelFirstName');
  let $lastName = $('#registerLastName');
  let $labelLastName = $('#labelLastName');
  let $email = $('#registerEmail');
  let $labelEmail = $('#labelEmail');
  let $username = $('#registerUsername');
  let $labelUsername = $('#labelUsername');
  let $password = $('#registerPassword');
  let $labelPassword = $('#labelPassword');
  let $passwordConf = $('#registerPasswordConf');
  let $labelPasswordConf = $('#labelPasswordConf');
  let $gender = $('#registerGender');
  let $labelGender = $('#labelGender');
  let $country = $('#registerCountry');
  let $labelCountry = $('#labelCountry');
  let isValid = true;

  if ($($firstName).val() === "") {
    isValid = false;
    $($labelFirstName).html('First name must not be empty.');
    $($firstName).addClass('invalid');
  } else {
    $($labelFirstName).html('First Name');
    $($firstName).removeClass('invalid');
  }

  if ($($lastName).val() === "") {
    isValid = false;
    $($labelLastName).html('Last name must not be empty.');
    $($lastName).addClass('invalid');
  } else {
    $($labelLastName).html('Last Name');
    $($lastName).removeClass('invalid');
  }

  if ($($email).val() === "") {
    isValid = false;
    $($labelEmail).html('Email must not be empty.');
    $($email).addClass('invalid');
  } else if ($($email).val().search(/.+\@.+/i) == -1) {
    $($labelEmail).html('Email must follow the pattern account@domain');
    $($email).addClass('invalid');
  } else {
    $($labelEmail).html('Email');
    $($email).removeClass('invalid');
  }

  if ($($username).val() === "") {
    isValid = false;
    $($labelUsername).html('Username must not be empty.');
    $($username).addClass('invalid');
  } else {
    $($labelUsername).html('Username');
    $($username).removeClass('invalid');
  }

  if ($($password).val() === "") {
    isValid = false;
    $($labelPassword).html('Password must not be empty.');
    $($password).addClass('invalid');
    $($labelPasswordConf).html('Password Confirmation');
    $($passwordConf).removeClass('invalid');
  } else if ($($password).val() != $($passwordConf).val()) {
    $($labelPasswordConf).html('Does not match password');
    $($password).removeClass('invalid');
    $($labelPassword).html('Password');
    $($passwordConf).addClass('invalid');
  } else {
    $($labelPassword).html('Password');
    $($labelPasswordConf).html('Password Confirmation');
    $($password).removeClass('invalid');
    $($passwordConf).removeClass('invalid');
  }

  if ($($gender).val() == null) {
    isValid = false;
    $($labelGender).html('A gender must be selected');
    $($labelGender).addClass('invalidSelect');
  } else {
    $($labelGender).html('Gender');
    $($labelGender).removeClass('invalidSelect');
  }

  if ($($country).val() == null) {
    isValid = false;
    $($labelCountry).html('A country must be selected');
    $($labelCountry).addClass('invalidSelect');
  } else {
    $($labelCountry).html('Country');
    $($labelCountry).removeClass('invalidSelect');
  }
  
  return isValid;
}

function tryLogin() {
  let username = $('#loginUsername').val();
  let password = $('#loginPassword').val();

  let promise = new Promise(
    function (resolve, reject) {
      $.ajax({
        url: './data/applicationLayerSeiji.php',
        type: 'GET',
        data: {
          'action': 'LOGIN',
          'username': username,
          'password': password
        },
        ContentType: 'application/json',
        dataType: 'json',
        success: function(data) {
          resolve(data);
        },
        error: function(err) {
          reject(new Error(err.responseText));
        }
      });
    }
  );

  return promise;
}

function tryRegistration() {
  let firstName = $('#registerFirstName').val();
  let lastName = $('#registerLastName').val();
  let email = $('#registerEmail').val();
  let username = $('#registerUsername').val();
  let password = $('#registerPassword').val();
  let gender = $('#registerGender').val();
  let country = $('#registerCountry').val();

  let promise = new Promise(
    function (resolve, reject) {
      $.ajax({
        url: './data/applicationLayerSeiji.php',
        type: 'POST',
        data: {
          'action': 'REGISTER',
          'firstName': firstName,
          'lastName': lastName,
          'email': email,
          'username': username,
          'password': password,
          'gender': gender,
          'country': country
        },
        ContentType: 'application/json',
        dataType: 'json',
        success: function(data) {
          resolve(data);
        },
        error: function(err) {
          reject(new Error(err.responseText));
        }
      });
    }
  );

  return promise;
}