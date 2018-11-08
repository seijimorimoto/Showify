$('#loginBtn').on('click', function() {
  swal({
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
            <label for="loginUsername">Username</label>
          </div>
          <div class="input-field col s12">
            <i class="material-icons prefix">lock</i>
            <input id="loginPassword" type="password" class="validate">
            <label for="loginPassword">Password</label>
          </div>
        </div>
      </form>
    </div>
    `,
    showCancelButton: true,
    title: 'Login',
    type: 'info'
  });
});

$('#registerBtn').on('click', function() {
  swal({
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
            <input id="registerFirstName" type="text" class="validate">
            <label for="registerFirstName">First Name</label>
          </div>
          <div class="input-field col s12 m6">
            <input id="registerLastName" type="text" class="validate">
            <label for="registerLastName">Last Name</label>
          </div>
          <div class="input-field col s12">
            <input id="registerEmail" type="email" class="validate">
            <label for="registerEmail">Email</label>
          </div>
          <div class="input-field col s12">
            <input id="registerUsername" type="text" class="validate">
            <label for="registerUsername">Username</label>
          </div>
          <div class="input-field col s12 m6">
            <input id="registerPassword" type="password" class="validate">
            <label for="registerPassword">Password</label>
          </div>
          <div class="input-field col s12 m6">
            <input id="registerPasswordConf" type="password" class="validate">
            <label for="registerPasswordConf">Password Confirmation</label>
          </div>
          <div class="input-field col s12 m6">
            <select id="registerGender">
              <option value="" disabled selected>Choose an option</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <label>Gender</label>
          </div>
          <div class="input-field col s12 m6">
            <select id="registerCountry">
              <option value="" disabled selected>Choose an option</option>
            </select>
            <label>Country</label>
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
          console.log($countrySelect);
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
    showCancelButton: true,
    title: 'Registration',
    type: 'info'
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