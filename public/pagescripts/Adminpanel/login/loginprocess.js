


// Class Definition
var KTLoginV1 = function () {
	var login = $('#kt_login');

	var showErrorMsg = function(form, type, msg) {
        var alert = $('<div class="alert alert-bold alert-solid-' + type + ' alert-dismissible" role="alert">\
			<div class="alert-text">'+msg+'</div>\
			<div class="alert-close">\
                <i class="flaticon2-cross kt-icon-sm" data-dismiss="alert"></i>\
            </div>\
		</div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        KTUtil.animateClass(alert[0], 'fadeIn animated');
    }
  

	
	// Private Functions
	var handleSignInFormSubmit = function () {
		$('#kt_login_signin_submit').click(function (e) {
			e.preventDefault();
         
			var btn = $(this);
			var form = $('#kt_login_form');

			form.validate({
				rules: {
					username: {
						required: true
					},
					password: {
						required: true
                    },
                    companyname:{
                        required:true
                    }
				}
			});

			if (!form.valid()) {
				return;
			}

			KTApp.progress(btn[0]);

			setTimeout(function () {
				KTApp.unprogress(btn[0]);
			}, 2000);
        
			var params={
				uname:$('#txtusername').val(),
				pass:$('#txtpassword').val(),
				company:$('#txtcompanyname').val(),
			}    
			$.ajax({
				url: '/adminlogin/login',
				type: 'POST',
				data: JSON.stringify(params) ,
				contentType: 'application/json; charset=utf-8',
				success: function (res) {
					
					if(res.status == 'success'){
					   console.log(res)
						localStorage.usr=res.data1._id;
						localStorage.Name=res.data1.name;
						localStorage.profilepic=res.data1.profilepic;                
					    window.location.href=res.url;

					}else{
						toastr.error(message);
					}
				   
				},
				error: function (errormessage) {
					
					toastr.error(errormessage.responseText);
				}
				
			}); 
			return false;  
      
		});
	}

	// Public Functions
	return {
		// public functions
		init: function () {
			handleSignInFormSubmit();
		}
	};
}();

// Class Initialization
$(document).ready(function () {
	KTLoginV1.init();
});

