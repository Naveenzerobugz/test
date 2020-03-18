$(document).ready(function () {
    
    userupdatefn();
    
})
var userupdatefn = function () {
    $("#userform").validate({
        // define validation rules
        rules: {
            //= Client Information(step 3)
            // Billing Information
            name: {
                required: true
            },
            mobile: {
                required: true,
                number: true,
                minlength: 10,
                maxlength: 10
            },
            currentpass: {
                required: true
            },

        },
        //display error alert on form submit
        invalidHandler: function (event, validator) {
            swal.fire({
                "title": "",
                "text": "There are some errors in your submission. Please correct them.",
                "type": "error",
                "confirmButtonClass": "btn btn-secondary",
                "onClose": function (e) {
                    console.log('on close event fired!');
                }
            });

            event.preventDefault();
        },

        submitHandler: function (form) {
            swal.fire({
                title: 'Are you sure?',
                text: "You won't be save this file!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Save it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then(function (result) {
                if (result.value) {
                   
                    try {
                        if ($('#txtnewpass').val()!=='' && ($('#txtnewpass').val() !== $('#txtconfirmpass').val())) {
                            throw new console.error('Password does not match');
                        }

                        var data = new FormData();
                        var file = $("#imguserpic")[0].files[0];
                        data.append("_id", localStorage.usr);
                        data.append("name", $('#txtname').val());
                        data.append("mobile", $('#txtmobile').val());
                        data.append("email", $('#txtemail').val());
                        data.append("currentpassword", $('#txtcurrentpass').val());
                        data.append("password", $('#txtnewpass').val());
                        if (file === undefined)
                            data.append("profilepic", $('#showimg').attr('src'));
                        else
                            data.append("profilepic", file, CurrentDatetime() + file.name);
                           
                        $.ajax({
                            type: 'post',
                            url: '/Adminpanel/userupdate',
                            data: data,
                            contentType: false,
                            processData: false,
                            success: function (result) {
                                if (result.status == 'success') {
                                    toastr.success(result.message);
                                    cleardata();
                                    $('#usermodal').modal('hide');

                                }
                                else {
                                    if (result.Message == '' || result.Message == null) {
                                        toastr.error('Something Went wrong');
                                    }
                                    else {
                                        toastr.error(result.Message);
                                    }
                                }
                            },
                            error: function (errormessage) {
                                toastr.error(errormessage.responseText);
                            }
                        });
                    } catch (error) {
                        toastr.error(error.message);
                    }
                } else if (result.dismiss === 'cancel') {
                    swal.fire(
                        'Cancelled',
                        'Your file is safe :)',
                        'error'
                    )
                }
            })

            return false;
        }
    });
}
function cleardata() {
    $('#txtname').val('')
    $('#txtmobile').val('')
    $('#txtemail').val('')
    $('#txtcurrentpass').val('')
    $('#txtnewpass').val('')
    $('#txtconfirmpass').val('')
    $('#showimg').attr('src', '/appfiles/CompanyImages/default.png');
}

function openusermodal() {
    
    try {
        $.ajax({
            url: '/Adminpanel/userlist/' + localStorage.usr,
            // data: "{ 'Sysid': '" + sys_id + "'}",
            dataType: "json",
            type: "get",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $('#txtname').val(data[0].name)
                $('#txtmobile').val(data[0].mobile)
                $('#txtemail').val(data[0].email)               
                $('#showimg').attr('src', data[0].profilepic);
                $('#usermodal').modal('show')
            },
            error: function (response) {
                var parsed = JSON.parse(response.responseText);
                Error_Msg(parsed.Message);
                d.resolve();
            },
            failure: function (response) {
                var parsed = JSON.parse(response.responseText);
                Error_Msg(parsed.Message);
                d.resolve();
            }
        });
    } catch (e) {

    }
}
