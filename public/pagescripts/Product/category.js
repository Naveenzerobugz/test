$(document).ready(function() {

    CategoryLoadData();
    validationcategory();
    // BindddlData('#ddlrole', '/Adminpanel/roleddllist');
})

var validationcategory = function() {

    $("#kt_form_category").validate({
        // define validation rules
        rules: {
            //= Client Information(step 3)
            // Billing Information
            Category: {
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
                    var data = {
                        _id: $('#hf_id').val(),
                        category: $('#txtcategory').val(),
                        description: $('#txtdescription').val(),
                    }
                    $.ajax({
                        url: '/master/Categoryinsert',
                        data: JSON.stringify(data),
                        type: 'post',
                        contentType: "application/json;charset=utf-8",
                        dataType: "json",
                        success: function(result) {
                            if (result.status == 'success') {
                                toastr.success(result.message);
                                CategoryLoadData();
                                BindddlData('#ddlcategories', '/master/categoryddllist');
                                BindddlData('#ddlcategory', '/master/categoryddllist');
                                BindddlData('#ddlattributescategory','/master/categoryddllist');
                                category_cleardata();
                            } else {
                                toastr.error(result.message);
                            }
                        },
                        error: function(errormessage) {
                            toastr.error(errormessage.responseText);
                        }
                    });
                    return false
                      



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

function CategoryLoadData() {
    $('#gvlist').dataTable().fnDestroy();
    var table = $('#gvlist');
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
        ajax: '/master/Categorylist',
        columns: [
            { data: '_id',name: '_id' },
            { data: 'category', name: 'category' },
            { data: 'description', name: 'description' },
            { data: '_id', responsivePriority: -1 },
        ],
        order: [0, "desc"],
        // dom: '<"top" f>rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        columnDefs: [{
                targets: -1,
                title: 'Action',
                orderable: false,
                render: function(data, type, full, meta) {

                    return `
                        <a onclick='btncategory_edit("` + data + `")'  type="button" class="btn btn-sm btn-primary btn-icon  btn-icon btn-icon-sm" title="View / Edit">
                          <i class ="la la-edit"></i>
                        </a>
                              <a onclick= 'btncategory_deleted("` + data + `")' type="button" class="btn btn-sm btn-delete-red btn-icon  btn-icon btn-icon-sm" title="Delete" >
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

function btncategory_edit(_id) {


    $.ajax({
        url: '/master/Categoryedit/' + _id,

        dataType: "json",
        type: "get",
        contentType: "application/json; charset=utf-8",
        success: function(data) {

            $('#txtcategory').val(data.category);
            $('#hf_id').val(data._id);
            $('#txtdescription').val(data.description);
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

}



function category_cleardata() {
    $('#txtcategory').val('');
    $('#hf_id').val('');
    $('#txtdescription').val('');
}

function btncategory_deleted(_id) {


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
            }     else if (one == {"value":true}) {
                $.ajax({
                    url: '/master/Categorydelete/' + _id,
                    type: "post",
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    success: function(result) {

                        if (result.status == 'Success') {

                            toastr.success(result.message);

                            CategoryLoadData();

                        } else {
                            toastr.error(result.message);
                        }
                    },
                    error: function(errormessage) {
                        toastr.error(errormessage.responseText);
                    }
                });
            }
        }

    )
}