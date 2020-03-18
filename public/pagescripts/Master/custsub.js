$(document).ready(function() {
    $('.gst').hide();
    $('.btnaddnew').html('Add New');
    $('.custentry').hide();
    BindddlData('#ddlbillingstate', '/master/state');
    BindddlData('#ddshipingstate', '/master/state');
    BindddlDatadefault('#ddlpaymentterms', '/master/paymentterms');
    BindddlDatadefault('#ddlcustomertype', '/master/customertype');
    BindddlDatadefault('#ddlgsttype', '/master/gsttype');
    LoadData();
})

function pagechange() {
    clearcntrols();
    LoadData();
}
var btntype = '';

function save(btn) {

    try {
        //validation over there
        if (($('#txtname').val() == '') || ($('#txtmobile').val() == '')) {
            throw new Error('Please Enter the mandatory fields');
        }
        if ($('#cbgst').prop("checked") == true) {
            if (($('#txtgstin').val() == '') || ($('#ddlbillingstate').val() == '')) {
                throw new Error('GSTIN and State Field Must ');
            }
            if ($('#ddlgsttype').val() == 'UnregisteresBusiness') {
                throw new Error('Please select GST Type ');
            }
        }
        //now insert process going here
        btntype = btn;

        var gst = '';
        if ($('#txtcompany').val() == '') {
            gst = 'Consumer';
        } else if ($('#txtcompany').val() == '') {
            gst = 'UnregisteresBusiness';
        } else {
            gst = $('#ddlgsttype').val();
        }
        var data = {
            id: $('#hf_id').val(),
            pagetype: $('#pagetype').val(),
            name: $('#txtname').val(),
            mobile: $('#txtmobile').val(),
            openingbalance: $('#txtopeningbal').val(),
            paymentterms: $('#ddlpaymentterms').val(),
            customertype: $('#ddlcustomertype').val(),
            companyname: $('#txtcompany').val(),
            email: $('#txtemail').val(),
            others: $('#txtothers').val(),
            description: $('#txtdescription').val(),
            gsttype: gst,
            gstin: $('#txtgstin').val(),
            panno: $('#txtpanno').val(),
            billingaddress: $('#txtbillingaddress').val(),
            billingstate: $('#ddlbillingstate').val(),
            billingpincode: $('#txtbillingpincode').val(),
            shippingaddress: $('#txtshippingaddress').val(),
            shippingstate: $('#ddshipingstate').val(),
            shippingpincode: $('#txtshippingpincode').val(),
        }
        console.log(data)
        insertupdate(data, '/master/custsup')
    } catch (err) {
        toastr.error(err)
    }
}

function afterinsertupdatefunction() {
    if (btntype == 'save') {
        clearcntrols();
        LoadData();
    }
}
function focusaftertab(type){
    if(type=='customertype'){
        $('#txtcompany').focus()
    }else if(type=='addrestype'){
        $('#txtbillingaddress').focus()
    }
}
function clearcntrols() {
    $('#hf_id').val('');

    $('#txtname').val('');
    $('#txtmobile').val('');
    $('#txtopeningbal').val('0.00');
    $('#ddlpaymentterms').val('0');

    if ($('#pagetype').val() == 'supllier') {
        $("#ddlcustomertype").append("<option value='Supplier'>Supplier</option>");
        $('#ddlcustomertype').val('Supplier');
        $("#ddlcustomertype option[value='Customer']").remove();
        $('.customertype').hide();
    } else {
        $('.customertype').show();
        if ($('#ddlcustomertype').val() != 'Customer') {
            $("#ddlcustomertype").append("<option value='Customer'>Customer</option>");
            $("#ddlcustomertype option[value='Supplier']").remove();
        }
        $('#ddlcustomertype').val('Customer');
    }

    $('#txtcompany').val('');
    $('#txtemail').val('');
    $('#txtothers').val('');
    $('#txtdescription').val('');
    $('#ddlgsttype').val('UnregisteresBusiness');
    $('#txtgstin').val('');
    $('#txtpanno').val('');
    $('#txtbillingaddress').val('');
    $('#ddlbillingstate').val('');
    $('#txtbillingpincode').val('');
    $('#txtshippingaddress').val('');
    $('#ddshipingstate').val('');
    $('#txtshippingpincode').val('');
    $("#pagetype").removeAttr("disabled");
}
//#region load data 
function LoadData() {
    $('#gvlist').dataTable().fnDestroy();
    var table = $('#gvlist');
    var data = {
            pagetype: $('#pagetype').val(),
        }
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
            url: '/master/custsuplist',
            data: data,
            type: "POST",
        },
        columns: [
            { data: '_id',name: '_id' },
            { data: 'name', name: 'name' },
            { data: 'mobile', name: 'mobile' },
            { data: 'openingbalance', name: 'openingbalance' },
            { data: 'paymentterms', name: 'paymentterms' },
            { data: 'customertype', name: 'customertype' },
            { data: 'companyname', name: 'companyname' },
            { data: 'billingstate', name: 'billingstate' },
            { data: '_id', responsivePriority: -1 },
        ],
        // dom: '<"top">rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
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
            targets: -9,
            title: 'Sno',
            orderable: true,
            render: function(data, type, full, meta) {

                return meta.row + meta.settings._iDisplayStart + 1;
            },
        },

    ],
    });
}
//#endregion
//#region eidt || delete 
function btnedit(id) {
    $("#pagetype").attr("disabled", "disabled");
    var uri = '';
    if ($('#pagetype').val() == 'customer') {
        var uri = '/master/custlist/' + id;
    } else {
        var uri = '/master/suplist/' + id;
    }

    try {
        $.ajax({
            url: uri,
            dataType: "json",
            type: "get",
            contentType: "application/json; charset=utf-8",
            success: function(data) {
                console.log(data)
                $('#hf_id').val(data._id);
                $('#txtname').val(data.name);
                $('#txtmobile').val(data.mobile);
                $('#txtopeningbal').val(data.openingbalance);
                $('#ddlpaymentterms').val(data.paymentterms);
                $('#ddlcustomertype').val(data.customertype);
                $('#txtcompany').val(data.companyname);
                $('#txtemail').val(data.email);
                $('#txtothers').val(data.others);
                $('#txtdescription').val(data.description);
                $('#ddlgsttype').val(data.gsttype);
                $('#txtgstin').val(data.gstin);
                $('#txtpanno').val(data.panno);
                $('#txtbillingaddress').val(data.billingaddress);
                $('#ddlbillingstate').val(data.billingstate);
                $('#txtbillingpincode').val(data.billingpincode);
                $('#txtshippingaddress').val(data.shippingaddress);
                $('#ddshipingstate').val(data.shippingstate);
                $('#txtshippingpincode').val(data.shippingpincode);
                $('.custlist').hide();
                $('.custentry').show();
                $('.btnaddnew').html('Go back')
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
        toastr.error(e.Message);
    }
}

function btndeleted(id) {
    swal.fire({
        title: "Please Confirm?",
        text: 'Are you sure Do you want delete from List..!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success btn-sm',
        cancelButtonClass: 'btn btn-danger btn-sm',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: "No, cancel it!",

    }).then(function(dismiss) {
        var one = JSON.stringify(dismiss);
        if (one == '{"dismiss":"cancel"}') {
            swal(
                'Cancelled',
                'Your  file is safe :)',
                'error'
            )
        } else {
            var fieldvalue = {
                id: id,
                pagetype: $('#pagetype').val(),
            }
            $.ajax({
                url: '/master/custsubdelete',
                data: JSON.stringify(fieldvalue),
                type: 'post',
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function(result) {
                    console.log(result)
                    if (result.status == 'success') {

                        toastr.success(result.message);
                        LoadData();

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
    return false
}
//#endregion
//#region design elements
function fngst() {
    if ($('#cbgst').prop("checked") == true) {
        $('.gst').show();
        $('#ddlgsttype').val('Regular');
        $('#txtgstin').focus();
    } else {
        $('.gst').hide();
        if ($('#txtcompany').val() == '') {
            $('#ddlgsttype').val('Consumer')
        } else {
            $('#ddlgsttype').val('UnregisteresBusiness')
        }
        $('#txtcompany').focus();
    }
    
}

function fnshipping() {
    if ($('#cbshipping').prop("checked") == true) {
        $(".disable").attr("disabled", "disabled");
        $('#txtshippingaddress').val($('#txtbillingaddress').val());
        $('#ddshipingstate').val($('#ddlbillingstate').val());
        $('#txtshippingpincode').val($('#txtbillingpincode').val());
        // $('.shipping').hide();
    } else {
        $(".disable").removeAttr("disabled");
        $('#txtshippingaddress').val('');
        $('#ddshipingstate').val('');
        $('#txtshippingpincode').val('');
        //   $('.shipping').show();
    }
}

function fnaddnew() {
    if ($('.btnaddnew').html() == 'Add New') {
        $('.custlist').hide();
        $('.custentry').show();
        $('.btnaddnew').html('Go back')
    } else {
        $('.custentry').hide();
        $('.custlist').show();
        $('.btnaddnew').html('Add New')
        clearcntrols()
    }
    LoadData();
}
//#endregion