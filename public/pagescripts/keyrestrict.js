function isnumeric(e) {
    var regex = new RegExp("[0-9]");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }
}

function isalphaspace(e) {
    var regex = new RegExp("^[a-zA-Z .]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }
}
function isNumber(evt, element) {

    var charCode = (evt.which) ? evt.which : event.keyCode

    if (
        (charCode != 45 || $(element).val().indexOf('-') != -1) &&      // “-” CHECK MINUS, AND ONLY ONE.
        (charCode != 46 || $(element).val().indexOf('.') != -1) &&      // “.” CHECK DOT, AND ONLY ONE.
        (charCode < 48 || charCode > 57))
        return false;

    return true;
}


$('.groupOfTexbox').keypress(function (event) {
    return isNumber(event, this)
});

$(document).ready(function () {
    $('.alphaspacekey').keypress(function (event) {
        return isalphaspace(event)
    });
    $('.numerickey').keypress(function (event) {
        return isnumeric(event)
    });
    $('.decimal').keypress(function (event) {
        return isNumber(event,this)
    });
});