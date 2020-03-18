$(document).ready(function() {
    LoadData();
    validationuser();
    // BindddlData('#ddlrole', '/Adminpanel/roleddllist');
    $('#txtdepartmentname').focus();
})
var validationuser = function() {

    $("#kt_form_3").validate({
        // define validation rules
        rules: {
            //= Client Information(step 3)
            // Billing Information
            departmentname: {
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
                        deptname: $('#txtdepartmentname').val(),
                        description: $('#txtdescription').val(),
                    }
                    insertupdate(data, '/master/deptinstert');
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
        ajax: '/master/deptlist',
        columns: [
            { data: '_id',name: '_id' },
            { data: 'deptname', name: 'deptname' },
            { data: 'description', name: 'description' },
            { data: '_id', responsivePriority: -1 },
        ],
        order: [0, "desc"],
        dom: '<"top"f>rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        columnDefs: [{
                targets: -1,
                title: 'Action',
                orderable: false,
                render: function(data, type, full, meta) {

                    return `
                        <a onclick='btnedit("` + data + `")' type="button" class="btn btn-sm btn-primary btn-icon  btn-icon btn-icon-sm" title="View / Edit">
                          <i class ="la la-edit"></i>
                        </a>
                              <a onclick= 'btndeleted("` + data + `")' type="button" class="btn btn-sm btn-delete-red btn-icon  btn-icon btn-icon-sm" title="Delete">
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

}

function btnedit(_id) {

    editassignvalue('/master/deptedit/' + _id)

}

function assignvalue(data) {
    $('#kt_modal_4').modal('show');

    $('#hf_id').val(data._id);
    $('#txtdepartmentname').val(data.deptname);
    $('#txtdescription').val(data.description);
}

function cleardata() {
    $('#hf_id').val('');
    $('#hf_id').val('');
    $('#txtdepartmentname').val('');
    $('#txtdescription').val('');
}

function btndeleted(_id) {

    deleterecord('/master/deptdelete/' + _id);
}

function afterdelete() {
    LoadData();
}

function afterinsertupdatefunction() {
    LoadData();
    cleardata();
}