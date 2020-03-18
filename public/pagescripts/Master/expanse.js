$(document).ready(function() {
    validationexpanse();
    LoadData();
})

var validationexpanse = function() {

    $("#kt_form_3").validate({
        // define validation rules
        rules: {
            //= Client Information(step 3)
            // Billing Information
            expanse: {
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
                        id: $('#hf_id').val(),
                        expansename: $('#txtexpanse').val(),
                        description: $('#txtdescription').val(),
                    }
                    insertupdate(data, '/master/expanse');
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

function afterinsertupdatefunction() {
    LoadData();
    cleardata();
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
        ajax: {
            url: '/master/expanselist',
            // data: data,
            type: "POST",
        },
        columns: [
            // { data: '', },
            { data: 'expansename', name: 'expansename' },
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
                        <a onclick='btnedit("` + data + `")' type="button" class="btn btn-sm btn-primary btn-icon  btn-icon btn-icon-sm" title="View / Edit">
                          <i class ="la la-edit"></i>
                        </a>
                              <a onclick= 'btndeleted("` + data + `")' type="button" class="btn btn-sm btn-delete-red btn-icon  btn-icon btn-icon-sm" title="Delete">
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

function cleardata() {
    $('#txtexpanse').val('');
    $('#hf_id').val('');
    $('#txtdescription').val('');
}

function btnedit(id) {

    editassignvalue('/master/expanse/' + id)

}

function assignvalue(data) {

    $('#txtexpanse').val(data.expansename);
    $('#hf_id').val(data._id);
    $('#txtdescription').val(data.description);

}

function btndeleted(_id) {

    deletedata('/master/expansedelete/' + _id);
}

function afterdelete() {
    LoadData();
}