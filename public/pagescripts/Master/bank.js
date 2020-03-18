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
            BankName: {
                required: true
            },
            BranchName: {
                required: true
            },
            AccountNo: {
                required: true,
                number: true,
                min:9
            },
            IFSCCode: {
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
                        bankname: $('#txtbankname').val(),
                        branchname: $('#txtbranchname').val(),
                        accountno: $('#txtaccountno').val(),
                        ifsc_code: $('#txtifcscode').val(),
                        openingbalance: $('#txtopeningbalance').val(),
                        description: $('#txtdescription').val(),
                        address: $('#txtaddress').val()

                    }

                    insertupdate(data, '/master/bankinstert');


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
        ajax: '/master/banklist',
        columns: [
             { data: '_id',name: '_id' },
            { data: 'bankname', name: 'bankname' },
            { data: 'branchname', name: 'branchname' },
            { data: 'ifsc_code', name: 'ifsc_code' },
            { data: 'accountno', name: 'accountno' },
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
                        <button onclick='btnedit("` + data + `")'  type="button" class="btn btn-sm btn-primary btn-icon  btn-icon btn-icon-sm" data-skin="dark" data-toggle="kt-tooltip" data-placement="top" title="View / Edit">
                          <i class ="la la-edit"></i>
                        </button>
                              <a onclick= 'btndeleted("` + data + `")'  type="button" class="btn btn-sm btn-delete-red btn-icon  btn-icon btn-icon-sm" title="Delete" >
                          <i class ="la la-trash"></i>
                        </a>`;
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
    // table.on( 'order.dt search.dt', function () {
    //     t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
    //         cell.innerHTML = i+1;
    //     } );
    // } ).draw();
}

function btnedit(_id) {

    editassignvalue('/master/bankedit/' + _id)
    $('#kt_modal_4').modal('show');
}

function assignvalue(data) {

    $('#txtbankname').val(data.bankname);
    $('#txtbranchname').val(data.branchname);
    $('#txtaccountno').val(data.accountno);
    $('#txtifcscode').val(data.ifsc_code);
    $('#txtopeningbalance').val(data.openingbalance);
    $('#txtdescription').val(data.description);
    $('#txtaddress').val(data.address);
    $('#hf_id').val(data._id);
}

function cleardata() {
    $('#txtbankname').val('');
    $('#txtbranchname').val('');
    $('#txtaccountno').val('');
    $('#txtifcscode').val('');
    $('#txtopeningbalance').val('');
    $('#txtdescription').val('');
    $('#txtaddress').val('');
    $('#hf_id').val('');
}

function btndeleted(_id) {

    deletedata('/master/bankdelete/' + _id);
}

function afterdelete() {
    LoadData();
}

function afterinsertupdatefunction() {
    LoadData();
    cleardata();
    $('#kt_modal_4').modal('hide');
}
function show()
{
   
    $('#kt_modal_4').modal('show');
    cleardata();
    $(".modal").on('shown.bs.modal', function () {
        $(this).find("input:visible:first").focus();
    });
}