const $ = $;
const API = 'http://localhost:3000';

$(init);

function init() {
  if(getToken()){
    loggedInState();
  } else {
    loggedOutState();
  }
  $('body').on('click', '.logout', logout);
  $('body').on('click', '.userslogin', usersLogin);
  $('body').on('click', '.usersNew', usersNew);

  $('body').on('submit', '.usersCreate', usersCreate);
  $('body').on('submit', '.usersloginform', usersloginResponse);
  $('body').on('submit', '.usersUpdateForm', usersUpdateResponse);
  $('body').on('submit', '.usersUpdatePasswordForm', usersUpdateResponse);
}


function loggedInState(user){
  $('#button1').addClass('userindex').removeClass('userslogin');
  $('#button2').addClass('logout').removeClass('usersNew').html('Log out');
  if(!user){ //When the user was logged and the page is refreshed
    getUserInfo((output) =>{
      $('#button1').html(output.username);
      getProfile(output._id);
    });
  }else{ //when the user has just loggined
    $('#button1').html(user.username);
    getProfile(user._id);
  }
}

function getProfile(id){
  $.ajax({
    url: `${API}/users/${id}`,
    beforeSend: (xhr) => {
      setRequestHeader(xhr);
    }
  }).done((data) => {
    $('#container').html(`
      <form method="put" action="${API}/users/${data._id}" class="usersUpdateForm">
        <div class="modal-header">
          <h4 class="modal-title">Update Your Email</h4>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="user_email">Email</label>
            <input class="form-control" type="text" name="user[email]" id="user_email" value="${data.email}" placeholder="Email">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          <button type="submit" class="btn btn-primary">Save</button>
        </div>
      </form>
      <form method="put" action="${API}/users/newpassword/${data._id}" class="usersUpdatePasswordForm">
        <div class="modal-header">
          <h4 class="modal-title">Update Your Password</h4>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="user_newPassword">New Password</label>
            <input class="form-control" type="password" name="user[newPassword]" id="user_newPassword" placeholder="New Password">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          <button type="submit" class="btn btn-primary">Save</button>
        </div>
      </form>`);
  });
}

function loggedOutState(){
  $('#button1').addClass('userslogin').removeClass('userindex').html('Login');
  $('#button2').addClass('usersNew').removeClass('logout').html('Sign up');
}

function logout(e){
  e.preventDefault();
  $('#container').html('');
  removeToken();
  loggedOutState();
}

function usersNew(e){
  if (e) e.preventDefault();

  $('.modal-content').html(`
    <form method="post" action="${API}/register" class="usersCreate">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Welcome to Green Points</h4>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="user_name">Name</label>
          <input class="form-control" type="text" name="user[username]" id="user_name" placeholder="Name">
        </div>
        <div class="form-group">
          <label for="user_email">Email</label>
          <input class="form-control" type="text" name="user[email]" id="user_email" placeholder="Email">
        </div>
        <div class="form-group">
          <label for="user_password">Password</label>
          <input class="form-control" type="password" name="user[password]" id="user_password" placeholder="Password">
        </div>
        <div class="form-group">
          <label for="user_passwordConfirmation">Repeat password</label>
          <input class="form-control" type="password" name="user[passwordConfirmation]" id="user_passwordConfirmation" placeholder="Repeat Password">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>`);

  $('.modal').modal('show');
}

function usersCreate(e){
  if (e) e.preventDefault();
  $.ajax({
    url: $(this).attr('action'),
    type: $(this).attr('method'),
    data: $(this).serialize()
  }).done(() => {
    $('.modal').modal('hide');
  });
}

function usersLogin(e){
  if (e) e.preventDefault();
  $('.modal-content').html(`
    <form method="post" action="${API}/login" class="usersloginform">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Login</h4>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="user_email">Email</label>
          <input class="form-control" type="text" name="user[email]" id="user_email" placeholder="Email">
        </div>
        <div class="form-group">
          <label for="user_password">Password</label>
          <input class="form-control" type="password" name="user[password]" id="user_password" placeholder="Password">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>`);

  $('.modal').modal('show');
}

function usersloginResponse(e){
  if (e) e.preventDefault();
  $.ajax({
    url: $(this).attr('action'),
    type: $(this).attr('method'),
    data: $(this).serialize()
  }).done((data) => {
    $('.modal').modal('hide');
    if (data.token) { // token returned by the user's controllers
      setToken(data.token); //store the token in the browser
      loggedInState(data.user);
    }
  });
}
function usersUpdateResponse(e){
  if (e) e.preventDefault();
  $.ajax({
    url: $(this).attr('action'),
    type: $(this).attr('method'),
    data: $(this).serialize()
  }).done((data) => {
    showToast();
  });
}

function showToast() {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar")

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function setRequestHeader(xhr) {
  return xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);
}

function setToken(token){
  return window.localStorage.setItem('token', token);
}

function removeToken(){
  return window.localStorage.clear();
}

function getToken(){
  return window.localStorage.getItem('token');
}


function getUserInfo(callback){
  $.ajax({
    url: `http://localhost:3000/users/token`,
    beforeSend: (xhr) => {
      setRequestHeader(xhr);
    }
  }).done((data) => {
    callback(data);
  });
};
