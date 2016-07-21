$(document).ready(function() {
    var password1 = $('#password');
    var password2 = $('#passwordConfirmation');
    var form = $('#addUserForm');
    var allowSubmit = false;
    
    var passwordsMatch = function() {
        if (password1.val() === password2.val()) {
            return true;
        } else {
            return false;
        }
    };
    
    password2.keyup(function() {
        allowSubmit = passwordsMatch();
    });
    
    form.submit(function(e) {
        if (allowSubmit == false) {
            alert('Your passwords must match to create your account!');
            return false;
        }
    });
});