$(document).ready(() => {
    KTContactsAdd2.init();
    LoadData();
    hide();
})

var KTContactsAdd2 = function() {

    // Base elements
    var wizardEl;
    var formEl;
    var validator;
    var wizard;
    var avatar;

    // Private functions
    var initWizard = function() {
        // Initialize form wizard
        wizard = new KTWizard('kt_contacts_add1', {
            startStep: 1, // initial active step number
            clickableSteps: true // allow step clicking
        });

        // Validation before going to next page
        wizard.on('beforeNext', function(wizardObj) {
            if (validator.form() !== true) {
                wizardObj.stop(); // don't go to the next step
            }
        })

        // Change event
        wizard.on('change', function(wizard) {
            KTUtil.scrollTop();
        });
    }

    var initValidation = function() {
        validator = formEl.validate({
            // Validate only visible fields
            ignore: ":hidden",

            // Validation rules
            rules: {
                // Step 1

                companyname: {
                    required: true
                },
                gstno: {
                    required: true
                },
                panno: {
                    required: true
                },
                address: {
                    required: true
                },
                panno: {
                    required: true
                },
                pincode: {
                    required: true,
                    number: true,
                    minlength: 6,
                    maxlength: 6
                },
                // city: {
                // 	required: true
                // },
                // state:{
                //     required: true
                // },
                telephoneno: {
                    required: true
                },
                mobile: {
                    required: true,
                    number: true,
                    minlength: 10,
                    maxlength: 10
                },
                email: {
                    required: true,
                    email: true
                },
                billcode: {
                    required: true
                },
                creditdays: {
                    required: true
                },
                bankname: {
                    required: true
                },
                branchname: {
                    required: true
                },
                accountholdername: {
                    required: true
                },
                accountnumber: {
                    required: true
                },
                ifsc_code: {
                    required: true
                },

            },

            // Display error
            invalidHandler: function(event, validator) {
                KTUtil.scrollTop();

                swal.fire({
                    "title": "",
                    "text": "There are some errors in your submission. Please correct them.",
                    "type": "error",
                    "buttonStyling": false,
                    "confirmButtonClass": "btn btn-brand btn-sm btn-bold"
                });
            },

            // Submit valid form
            submitHandler: function(form) {

            }
        });
    }

    var initSubmit = function() {
        var btn = formEl.find('[data-ktwizard-type="action-submit"]');

        btn.on('click', function(e) {
            e.preventDefault();

            if (validator.form()) {
                // See: src\js\framework\base\app.js
                KTApp.progress(btn);
                swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be save this file!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, Save it!',
                    cancelButtonText: 'No, cancel!',
                    reverseButtons: true
                }).then(function(result) {
                    if (result.value) {
                        var data = new FormData();

                        var url = '';
                        if ($('#hfsysid').val() != '' && $('#hfsysid').val() != null) {
                            url = '/Adminpanel/branchupdate';
                            data.append("_id", $('#hfsysid').val());
                            var file = $("#imguploader")[0].files[0];
                            var file2 = $("#iumobileheader")[0].files[0];
                            //var file3 = $("#ulreportlogo")[0].files[0];
                            if (file == undefined) {
                                data.append('images', undefined);
                                data.append('file1', 'nofile');
                            } else {
                                data.append('images', file, CurrentDatetime() + file.name);
                                data.append('file1', 'file');
                            }

                            if (file2 == undefined) {
                                data.append('iumobileheader', undefined);
                                data.append('file2', 'nofile');
                            } else {
                                data.append('iumobileheader', file2, CurrentDatetime() + file2.name);
                                data.append('file2', 'file');
                            }

                            if (file3 == undefined) {
                                data.append('ulreportlogo', undefined);
                                data.append('file3', 'nofile');
                            } else {
                                data.append('ulreportlogo', file3, CurrentDatetime() + file3.name);
                                data.append('file3', 'file');
                            }

                        } else {
                            url = '/Adminpanel/branchinsert'
                            var file = $("#imguploader")[0].files[0];
                            var file2 = $("#iumobileheader")[0].files[0];
                            var file3 = $("#ulreportlogo")[0].files[0];
                            data.append('images', file, CurrentDatetime() + file.name);
                            data.append('iumobileheader', file2, CurrentDatetime() + file2.name);
                            data.append('ulreportlogo', file3, CurrentDatetime() + file3.name);
                        }

                        data.append('companyname', $('#txtcompanyname').val());
                        data.append('gstno', $('#txtgstno').val());
                        data.append('panno', $('#txtpanno').val());
                        data.append('address', $('#txtaddress').val());
                        data.append('pincode', $('#txtpincode').val());
                        data.append('city', $('#ddlcity').val());
                        data.append('state', $('#ddlstate').val());
                        data.append('telephoneno', $('#txttelephoneno').val());
                        data.append('mobile', $('#txtmobileno').val());
                        data.append('email', $('#txtemail').val());
                        data.append('bankname', $('#txtbankname').val());
                        data.append('branchname', $('#txtbranchname').val());
                        data.append('accountholdername', $('#txtaccountname').val());
                        data.append('accountnumber', $('#txtaccountnumber').val());
                        data.append('ifsccode', $('#txtifscno').val());
                        data.append('billcode', $('#txtbillcode').val());
                        data.append('creditdays', $('#txtcreditdays').val());

                        $.ajax({
                            type: 'post',
                            url: url,
                            data: data,
                            contentType: false,
                            processData: false,
                            success: function(result) {
                                if (result.status == 'success') {
                                    toastr.success(result.message);
                                    LoadData();
                                    cleardata();
                                } else {
                                    if (result.Message == '' || result.Message == null) {
                                        toastr.error('Something Went wrong');
                                    } else {
                                        toastr.error(result.Message);
                                    }
                                }
                            },
                            error: function(errormessage) {
                                toastr.error(errormessage.responseText);
                            }
                        });
                        return false;
                    } else if (result.dismiss === 'cancel') {
                        swal.fire(
                            'Cancelled',
                            'Your imaginary file is safe :)',
                            'error'
                        )
                    }
                })

            }
        });
    }

    var initAvatar = function() {

        avatar = new KTAvatar('kt_contacts_add_avatar');
    }
    var initAvatar2 = function() {

        avatar = new KTAvatar('kt_contacts_add_avatar1');
    }
    var initAvatar3 = function() {

        avatar = new KTAvatar('kt_contacts_add_avatar2');
    }

    return {
        // public functions
        init: function() {
            formEl = $('#kt_contacts_add_form2');

            initWizard();
            initValidation();
            initSubmit();
            initAvatar();
            initAvatar2();
            initAvatar3();
        }
    };
}();

function LoadData() {
    $('#gvlist').dataTable().fnDestroy();
    var table = $('#gvlist');

    // begin first table
    table.DataTable({
        responsive: true,
        searchDelay: 500,

        processing: true,
        serverSide: false,
        ajax: '/Adminpanel/branchlist',

        columns: [
            { data: '_id', name: '_id' },
            { data: 'companyname', name: 'companyname' },
            { data: 'gstno', name: 'gstno' },
            { data: 'panno', name: 'panno' },
            { data: 'mobile', name: 'mobile' },
            { data: '_id', responsivePriority: -1 },
        ],
        order: [1, "desc"],
        dom: '<"top" f>rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        columnDefs: [{
            targets: -1,
            title: 'Action',
            orderable: false,
            render: function(data, type, full, meta) {
                return `                      
                        <a onclick='btnedit("` + data + `")' class ="btn btn-sm btn-clean btn-icon btn-icon-md" title="View">
                          <i class ="la la-edit"></i>
                        </a>
                              <a onclick= 'btndeleted("` + data + `")' class ="btn btn-sm btn-clean btn-icon btn-icon-md" title="delete">
                          <i class ="la la-bitbucket-square"></i>
                        </a>`;
            },
        }],
    });
    oTable = $(table).DataTable();
}

function btnedit(id) {
    editassignvalue('/adminpanel/branchedit/' + id)
}

function assignvalue(Item) {
    $('.entry').show();
    $('.list').hide();
    $('#hfsysid').val(Item[0]._id);
    $('#txtcompanyname').val(Item[0].companyname);
    $('#txtgstno').val(Item[0].gstno);
    $('#txtpanno').val(Item[0].panno);
    $('#txtaddress').val(Item[0].address);
    $('#txtpincode').val(Item[0].pincode);
    $('#ddlcity').val(Item[0].city);
    $('#ddlstate').val(Item[0].state);
    $('#txttelephoneno').val(Item[0].telephoneno);
    $('#txtmobileno').val(Item[0].mobile);
    $('#txtcreditdays').val(Item[0].creditdays);
    $('#txtemail').val(Item[0].email);
    $('#txtbankname').val(Item[0].bankname);
    $('#txtbranchname').val(Item[0].branchname);
    $('#txtaccountname').val(Item[0].accountholdername);
    $('#txtaccountnumber').val(Item[0].accountnumber);
    $('#txtifscno').val(Item[0].ifsccode);
    $('#txtbillcode').val(Item[0].billcode);
    $('#imagePreview').attr('src', Item[0].companyweblogo);
    $('#ipmobileheader').attr('src', Item[0].companymobilelogo);
    $('#ipreportlogo').attr('src', Item[0].companyreportlogo);
}

function btndeleted(id) {
    deletedata('/adminpanel/branchdelete/' + id);
}

function ShowImagePreview(imageUploader, previewImage) {

    if (imageUploader.files && imageUploader.files[0]) {

        var reader = new FileReader();
        reader.onload = function(e) {

            $(previewImage).attr('src', e.target.result);
        }
        reader.readAsDataURL(imageUploader.files[0]);
    }

}

function cleardata() {
    $('.entry').show();
    $('.list').hide();
    $('#hfsysid').val('');
    $('#txtcompanyname').val('');
    $('#txtgstno').val('');
    $('#txtpanno').val('');
    $('#txtaddress').val('');
    $('#txtpincode').val('');
    $('#ddlcity').val('');
    $('#ddlstate').val('');
    $('#txttelephoneno').val('');
    $('#txtmobileno').val('');
    $('#txtcreditdays').val('');
    $('#txtemail').val('');
    $('#txtbankname').val('');
    $('#txtbranchname').val('');
    $('#txtaccountname').val('');
    $('#txtaccountnumber').val('');
    $('#txtifscno').val('');
    $('#txtbillcode').val('');
    $('#imagePreview').attr('src', '/appfiles/CompanyImages/default.png');
    $('#ipmobileheader').attr('src', '/appfiles/CompanyImages/default.png');
    $('#ipreportlogo').attr('src', '/appfiles/CompanyImages/default.png');
}

function show() {
    cleardata();
}

function hide() {
    $('.entry').hide();
    $('.list').show();

}