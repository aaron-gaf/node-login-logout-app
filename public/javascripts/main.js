$(document).ready(function() {
    var homeContentPar = document.getElementById('homeContent');
    var cookie = getCookie('userInfo');
    var isLoggedIn, username, token;
    
    var divToChange = document.getElementById('optionsRow');
    
    // handle cookie stuff
    if (cookie != '') {
        var string1 = decodeURI(cookie);
        var string2 = decodeURIComponent(string1);
        var obj = JSON.parse(string2);
        isLoggedIn = obj.isLoggedIn;
        username = obj.username;
        token = obj.token;
    }
    
    // logged in links
    var docFragLoggedIn = document.createDocumentFragment();
    var logoutLink = document.createElement('a'), deleteAccountLink = document.createElement('a');
    logoutLink.setAttribute('href', '/logout');
    logoutLink.setAttribute('class', 'button button-primary one-half column');
    logoutLink.textContent = 'Log Out';
    deleteAccountLink.setAttribute('href', '/delete');
    deleteAccountLink.setAttribute('class', 'button button-primary one-half column');
    deleteAccountLink.setAttribute('id', 'red');
    deleteAccountLink.textContent = 'Delete Account';
    docFragLoggedIn.appendChild(logoutLink);
    docFragLoggedIn.appendChild(deleteAccountLink);
    
    // logged out links
    var docFragLoggedOut = document.createDocumentFragment();
    var signupLink = document.createElement('a'), loginLink = document.createElement('a');
    signupLink.setAttribute('href', '/signup');
    signupLink.setAttribute('class', 'button button-primary one-half column');
    signupLink.textContent = 'Sign Up';
    loginLink.setAttribute('href', '/loginpage');
    loginLink.setAttribute('class', 'button button-primary one-half column');
    loginLink.textContent = 'Log In';
    docFragLoggedOut.appendChild(signupLink);
    docFragLoggedOut.appendChild(loginLink);
    
    if (isLoggedIn === undefined) {
        return;
    }
    else if (isLoggedIn) {
        homeContentPar.innerHTML = 'Welcome, ' + username;
        divToChange.innerHTML = '';
        divToChange.appendChild(docFragLoggedIn);
        return;
    } else {
        homeContentPar.innerHTML = '<strong>Welcome!</strong><br>If you don\'t have an account, sign up!<br>Otherwise, you can log in.';
        divToChange.innerHTML = '';
        divToChange.appendChild(docFragLoggedOut);
        return;
    }
});