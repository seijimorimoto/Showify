// AJAX GET request executed when the page loads to check if there is already an active session. If
// so, displays the complete navbar at the top. Otherwise, just displays the logo at the top.
$.ajax({
  url: './data/applicationLayerSeiji.php',
  type: 'GET',
  data: { 'action': 'CHECK_SESSION_EXISTS' },
  ContentType: 'application/json',
  dataType: 'json',
  success: function(data) {
    let $navBar = $('.navRow');
    let navBarContent =
      `<div class="col s12 m5 l2 center">
         <a href="#" data-target="mobile-nav" class="sidenav-trigger left"><i class="material-icons">menu</i></a>
         <a href="./home.html"><img class="logo clickable" src="img/logo.png" alt="Showify logo"></a>
       </div>
         <div class="s12 col m7 l5">
           <form class="search-input">
             <div class="input-field">
               <input id="search" type="search" required>
               <label class="label-icon" for="search"><i class="material-icons">search</i></label>
             </div>
           </form>
         </div>
       <div class="col l5 hide-on-med-and-down">
         <ul class="right">
           <li><a href="./followedShows.html"><i class="material-icons left">star</i>Followed Shows</a></li>
           <li><a href="./profile.html"><i class="material-icons left">person</i>Profile</a></li>
           <li><a class="logout" href="#"><i class="material-icons left">exit_to_app</i>Logout</a></li>
         </ul>
       </div>`;
    $navBar.html(navBarContent);
  },
  error: function(err) {
    // An "error" in this context just means that a session does not exist; and therefore we only
    // need to render the navbar without session specific content.
    let $navBar = $('.navRow');
    let navBarContent =
      `<div class="center">
         <a href="./index.html"><img class="logo clickable" src="img/logo.png" alt="Showify logo"></a>
       </div>`;
    $navBar.html(navBarContent);
  }
});