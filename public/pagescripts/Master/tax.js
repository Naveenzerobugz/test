$(document).ready(function() {
    LoadData();
    validationuser();
    // BindddlData('#ddlrole', '/Adminpanel/roleddllist');
})

function addgst(){
 var sgst =   $('#txtsgst').val() == '' ? '0' : $('#txtsgst').val()
 var cgst =   $('#txtcgst').val() == '' ? '0' : $('#txtcgst').val()

 $('#txtigst').val(parseFloat(sgst)+parseFloat(cgst))
}
var validationuser = function() {

    $("#kt_form_3").validate({
        // define validation rules
        rules: {
            //= Client Information(step 3)
            // Billing Information
            taxname: {
                required: true
            },
            sgst: {
                required: true,
                number: true,
            },
            cgst: {
                required: true,
                number: true,
            },
            igst: {
                required: true,
                number: true,
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
                        taxname: $('#txttaxname').val(),
                        sgst: $('#txtsgst').val(),
                        cgst: $('#txtcgst').val(),
                        igst: $('#txtigst').val(),
                        description: $('#txtdescription').val(),
                    }
                    insertupdate(data, '/master/taxinstert');
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
        ajax: '/master/taxlist',
        columns: [
            // { data: 'sno', },
            { data: '_id',name: '_id' },
            { data: 'taxname', name: 'taxname' },
            { data: 'sgst', name: 'sgst' },
            { data: 'cgst', name: 'cgst' },
            { data: 'igst', name: 'igst' },
            { data: '_id', responsivePriority: -1 },
        ],
        order: [0, "desc"],
        dom: '<"top" f>rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        columnDefs: [{
                targets: -1,
                title: 'Action',
                orderable: false,
                render: function(data, type, full, meta) {

                    return `
                        <a onclick='btnedit("` + data + `")' type="button" class="btn btn-sm btn-primary btn-icon  btn-icon btn-icon-sm" title="View / Edit">
                          <i class ="la la-edit"></i></a>`;
                           
                    //       <a onclick= 'btndeleted("` + data + `")' type="button" class="btn btn-sm btn-delete-red btn-icon  btn-icon btn-icon-sm" title="Delete">
                    //   <i class ="la la-trash"></i>
                    // </a>`;
                      
                },
            },
            {
                targets: -6,
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

    editassignvalue('/master/taxedit/' + _id)

}

function assignvalue(data) {
    $('#kt_modal_4').modal('show');

    $('#hf_id').val(data._id);
    $('#txttaxname').val(data.taxname);
    $('#txtsgst').val(data.sgst);
    $('#txtcgst').val(data.cgst);
    $('#txtigst').val(data.igst)
    $('#txtdescription').val(data.description);
}

function cleardata() {
    $('#hf_id').val('');
    $('#txttaxname').val('');
    $('#txtsgst').val('');
    $('#txtcgst').val('');
    $('#txtigst').val('')
    $('#txtdescription').val('');
}

function btndeleted(_id) {

    deleterecord('/master/taxdelete/' + _id);
}

function afterdelete() {
    LoadData();
}

function afterinsertupdatefunction() {
    LoadData();
    cleardata();
}
function show()
{
    cleardata();
    $('#kt_modal_4').modal('show');
    $(".modal").on('shown.bs.modal', function () {
        $(this).find("input:visible:first").focus();
    });
}