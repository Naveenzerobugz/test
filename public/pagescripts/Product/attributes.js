$(document).ready(() => {
    BindddlData('#ddlattributescategory', '/master/categoryddllist');
    $('.dropdownvalues').hide()
    validationattributes();
    LoadAttributeData();
})
var validationattributes = function() {

    $("#kt_form_4").validate({
        // define validation rules
        rules: {
            //= Client Information(step 3)
            // Billing Information
            attributename: {
                required: true
            },



        },
        //display error alert on form submit
        invalidHandler: function(event, validator) {
            swal.fire({
                "title": "",
                "text": "There are some errors in your submission. Please correct them.",
                "type": "error",
                "confirmButtonClass": "btn btn-secondary",
                "onClose": function(e) {
                    console.log('on close event fired!');
                }
            });

            event.preventDefault();
        },

        submitHandler: function(form) {
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
                    //  alert($('#kt_tagify_1').val())
                    var data = {
                        attributename: $('#txtattributename').val(),
                        type: $('#ddltype').val(),
                        categoryid: $('#ddlattributescategory').val(),
                        _id: $('#hf_id').val()
                            // dropdownvalue: $('#kt_tagify_1').val()
                    }
                    insertupdateattribute(data, '/master/attributeinsert');

                } else if (result.dismiss === 'cancel') {
                    swal.fire(
                        'Cancelled',
                        'Your file is safe :)',
                        'error'
                    )
                }
            })


        }
    });
}

function LoadAttributeData() {
    $('#gvattributelist').dataTable().fnDestroy();
    var table = $('#gvattributelist');
    //let sno=0;
    // begin first table
    table.DataTable({
        responsive: true,
        searchDelay: 500,
        processing: true,
        serverSide: true,
        pageLength: 5,
        lengthMenu: [
            [5, 10, 25, 50, 100],
            [5, 10, 25, 50, 100]
        ],
        ajax: '/master/attributelist',
        columns: [
            // { data: 'sno', },
            { data: '_id',name: '_id' },
            { data: 'attributename', name: 'attributename' },
            { data: 'type', name: 'type' },
            { data: '_id', responsivePriority: -1 },
        ],
        order: [0, "asc"],
        dom: '<"top" f>rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        columnDefs: [{
                targets: -1,
                title: 'Action',
                orderable: false,
                render: function(data, type, full, meta) {

                    return `
                        <a onclick='btnAttribute_edit("` + data + `")' class ="btn btn-sm btn-primary btn-icon  btn-icon btn-icon-sm" title="View">
                          <i class ="la la-edit"></i>
                        </a>
                              <a onclick= 'btnAttribute_deleted("` + data + `")' class ="btn btn-sm btn-delete-red btn-icon  btn-icon btn-icon-sm" title="delete">
                          <i class ="la la-trash"></i>
                        </a>`;
                },
            },
            {
                targets: -4,
                title: 'Sno',
                orderable: true,
                render: function(data, type, full, meta) {
    
                    return meta.row + meta.settings._iDisplayStart + 1;
                },
            },
        ],
    });
    // table.on( 'order.dt search.dt', function () {
    //     t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
    //         cell.innerHTML = i+1;
    //     } );
    // } ).draw();
}

function attributecleardata() {
    $('#txtattributename').val('');
    $('#ddlattributescategory').val('0');
    $('#hf_id').val('');
    $('#kt_modal_4').modal('toggle');
    // $('#kt_modal_4').hide()

}

function typebaseddropdownshow() {
    if ($('#ddltype').val() == 'DropDown') {
        $('.dropdownvalues').show();
    } else {
        $('.dropdownvalues').hide();
    }

}

function insertupdateattribute(fieldvalue, url) {

    $.ajax({
        url: url,
        data: JSON.stringify(fieldvalue),
        type: 'post',
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function(result) {
            if (result.status == 'success') {
                toastr.success(result.message);
                LoadAttributeData();
                $('#txtattributename').val('');
                $('#ddlattributescategory').val('0');
                $('#hf_id').val('');
                //  afterinsertupdatefunction();
            } else {
                toastr.error(result.message);
            }
        },
        error: function(errormessage) {
            toastr.error(errormessage.responseText);
        }
    });
    return false
}

function btnAttribute_edit(_id) {
    try {
        $.ajax({
            url: '/master/attributeedit/' + _id,
            dataType: "json",
            type: "get",
            contentType: "application/json; charset=utf-8",
            success: function(data) {
                $('#kt_modal_4').modal('toggle');
                //  $('.dropdownvalues').show()
                $('#hf_id').val(data._id);
                $('#txtattributename').val(data.attributename)
                $('#ddltype').val(data.type)
                    // $.each(data.dropdownvalue, function(index, value) {
                    //     $('#kt_tagify_1').tagify.on('add', 'naveen');
                    // });
                $('#ddlattributescategory').val(data.categoryid)
                    // $('#kt_tagify_1').val(data.dropdownvalue)
            },
            error: function(response) {
                var parsed = JSON.parse(response.responseText);
                toastr.error(parsed.Message);
                d.resolve();
            },
            failure: function(response) {
                var parsed = JSON.parse(response.responseText);
                toastr.error(parsed.Message);
                d.resolve();
            }
        });
    } catch (e) {

    }


}

function btnAttribute_deleted(_id) {
    swal.fire({
        title: "Please Confirm?",
        text: 'Are you sure Do you want delete from List..!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-secondary',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: "No, cancel it!",

    }).then(function(dismiss) {
        var one = JSON.stringify(dismiss);
        if (one == '{"dismiss":"cancel"}') {
            swal.fire(
                'Cancelled',
                'Your  file is safe :)',
                'error'
            )
        }   
          else if (one == {"value":true}) {
            $.ajax({
                url: '/master/attributedelete/' + _id,
                type: "post",
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                success: function(result) {
                    console.log(result)
                    if (result.status == 'success') {

                        toastr.success(result.message);

                        LoadAttributeData();

                    } else {
                        toastr.error(result.message);
                    }
                },
                error: function(errormessage) {
                    toastr.error(errormessage.responseText);
                }
            });
        }
    })
}