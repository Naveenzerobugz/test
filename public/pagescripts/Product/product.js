$(document).ready(() => {
    BindddlData('#ddlcategories', '/master/categoryddllist');
    BindddlData('#ddlattributescategory', '/master/categoryddllist');
    $('.dropdownvalues').hide()
    BindddlData('#ddltax', '/master/taxdropdown');
    BindddlData('#ddlunit', '/master/unitdropdown/')
    validationproduct();
    ProductLoadData();
    list();
    validationattributes();

})
var validationproduct = function() {

    $("#kt_form_3").validate({
        // define validation rules
        rules: {
            productname: {
                required: true
            },
            itemcode: {
                required: true
            },
            saleprice: {
                required: true,
                number: true,
            },
            // purchaseprice: {
            //     required: true,
            //     number: true,
            // },
            // mrp: {
            //     required: true,
            //     number: true,
            // },
            tax: {
                required: true,

            },
            hsn_sac_code: {
                required: true,
            },
            categories: {
                required: true,
            },
            subcategories: {
                required: true,
            },
            hsn_sac_code: {
                required: true,
            },
            // minimumstock: {
            //     required: true,
            //     number: true,
            // },
            // openingstock: {
            //     required: true,
            //     number: true,
            // },


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

                    if ($("input[name='radio2']:checked").val() == "goods") {
                        if ($('#txtpurchaseprice').val() == '') {
                            toastr.error('Invalid purchase price')
                            return false;
                        }
                        if ($('#txtmrp').val() == '') {
                            toastr.error('Invalid MRP price')
                            return false;
                        }
                        if (parseInt($('#txtpurchaseprice').val()) > parseInt($('#txtsaleprice').val())) {
                            toastr.error('sales price  must greater than purchase price')
                            return false;
                        }
                        if (parseInt($('#txtsaleprice').val()) > parseInt($('#txtmrp').val())) {
                            toastr.error('MRP price  must greater than sale price')
                            return false;
                        }
                    }



                    var data = {
                        _id: $('#hf_id').val(),
                        productname: $('#txtproductname').val(),
                        itemcode: $('#txtitemcode').val(),
                        unitid: $('#ddlunit').val(),
                        type: $("input[name='radio2']:checked").val(),
                        // taxinclusive:$('#chbxtaxinclusive').val(),
                        salesprice: $('#txtsaleprice').val(),
                        purchaseprice: $('#txtpurchaseprice').val(),
                        mrp: $('#txtmrp').val(),
                        taxid: $('#ddltax').val(),
                        hsnorsac_code: $('#txthsn_sac_code').val(),
                        categoryid: $('#ddlcategories').val(),
                        subcategoryid: $('#ddlsubcategories').val(),
                        minimumstock: $('#txtminimumstock').val(),
                        openingstock: $('#txtopeningstock').val(),
                    }
                    $.ajax({
                        url: '/master/productinstert',
                        data: JSON.stringify(data),
                        type: 'post',
                        contentType: "application/json;charset=utf-8",
                        dataType: "json",
                        success: function(result) {
                            if (result.status == 'success') {
                                toastr.success(result.message);
                                ProductLoadData();
                                productcleardata();
                                list();
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


function ProductLoadData() {
    $('#gvproductlist').dataTable().fnDestroy();
    var table = $('#gvproductlist');
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
        ajax: '/master/produtlist',
        columns: [
            { data: '_id',name: '_id' },
            { data: 'productname', name: 'productname' },
            { data: 'itemcode', name: 'itemcode' },
            { data: 'type', name: 'type' },
            { data: 'openingstock', name: 'openingstock' },
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
                        <a onclick='btneditproduct("` + data + `")' type="button" class="btn btn-sm btn-primary btn-icon  btn-icon btn-icon-sm" title="View / Edit">
                          <i class ="la la-edit"></i>
                        </a>
                              <a onclick= 'btndeletedproduct("` + data + `")' type="button" class="btn btn-sm btn-delete-red btn-icon  btn-icon btn-icon-sm" title="Delete">
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

function btneditproduct(_id) {
    try {
        $.ajax({
            url: '/master/productedit/' + _id,

            dataType: "json",
            type: "get",
            contentType: "application/json; charset=utf-8",
            success: function(data) {

                $('.list').hide();
                $('.entry').show();
                $('#hf_id').val(data._id);
                $('#txtproductname').val(data.productname)
                $('#txtitemcode').val(data.itemcode)
                var $radios = $('input:radio[name=radio2]');
                $radios.filter('[value=' + data.type + ']').prop('checked', true);
                $('#txtsaleprice').val(data.salesprice)
                $('#txtpurchaseprice').val(data.purchaseprice)
                $('#txtmrp').val(data.mrp)
                $('#ddltax').val(data.taxid)
                $('#txthsn_sac_code').val(data.hsnorsac_code)
                $('#ddlcategories').val(data.categoryid)
                BindddlDataele('#ddlunit', '/master/unitdropdown/', data.unitid);
                BindddlDataele('#ddlsubcategories', '/master/subcategoryddllist/' + $('#ddlcategories').val(), data.subcategoryid);
                // $('#ddlsubcategories').val(data.subcategoryid)
                $('#txtminimumstock').val(data.minimumstock)
                $('#txtopeningstock').val(data.openingstock)
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



function productcleardata() {
   
    $('#hf_id').val('');
    $('#txtproductname').val('');
    $('#txtitemcode').val('');
    $('#ddlunit').val('')
    $("input[name='radio2']:checked").val('goods')
    $('#chbxtaxinclusive').val('false')
    $('#txtsaleprice').val('')
    $('#txtpurchaseprice').val('')
    $('#txtmrp').val('')
    $('#ddltax').val('')
    $('#txthsn_sac_code').val('')
    $('#ddlcategories').val('')
    $('#ddlsubcategories').val('')
    $('#txtminimumstock').val('')
    $('#txtopeningstock').val('')
}

function btndeletedproduct(_id) {
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
                    url: '/master/productdelete/' + _id,
                    type: "post",
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    success: function(result) {
                        console.log(result)
                        if (result.status == 'success') {

                            toastr.success(result.message);

                            ProductLoadData()

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



function show() {
    $('.list').hide();
    $('.entry').show();
}

function list() {
    productcleardata();
    $('.entry').hide();
    $('.list').show();
}

function bindsubcategory() {
    BindddlData('#ddlsubcategories', '/master/subcategoryddllist/' + $('#ddlcategories').val());

}