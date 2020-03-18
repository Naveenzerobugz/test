$(document).ready(function() {

    LoadData();
    validationuser();
    // BindddlData('#ddlrole', '/Adminpanel/roleddllist');
})

var validationuser = function() {

    $("#kt_form_3").validate({
        // define validation rules
        rules: {
            //= Client Information(step 3)
            // Billing Information
            unit: {
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
                            unitname: $('#txtunitname').val(),
                            description: $('#txtdescription').val(),
                        }
                        // alert($('#txtunitname').val());
                    insertupdate(data, '/master/unitinsert');



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

function LoadData() {
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
        ajax: '/master/unitlist',
        columns: [
            { data: '', name: '' },
            { data: 'unitname', name: 'unitname' },
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
                        <a onclick='btnedit("` + data + `")' class ="btn btn-sm btn-clean btn-icon btn-icon-md" title="View">
                          <i class ="la la-edit"></i>
                        </a>
                              <a onclick= 'btndeleted("` + data + `")' class ="btn btn-sm btn-clean btn-icon btn-icon-md" title="delete">
                          <i class ="la la-trash"></i>
                        </a>`;
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

function btnedit(_id) {

    editassignvalue('/master/unitedit/' + _id)

}

function assignvalue(data) {
    $('#txtunitname').val(data.unitname),
        //  $('#txtcategory').val(data.category);
        $('#hf_id').val(data._id);
    $('#txtdescription').val(data.description);

}

function cleardata() {
    $('#txtunitname').val('');
    $('#hf_id').val('');
    $('#txtdescription').val('');
}

function btndeleted(_id) {

    deleterecord('/master/unitdelete/' + _id);
}

function afterdelete() {
    LoadData();
}

function afterinsertupdatefunction() {
    LoadData();
    cleardata();
}