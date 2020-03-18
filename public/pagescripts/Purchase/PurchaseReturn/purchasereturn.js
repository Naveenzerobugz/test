$(document).ready(function () {
    localStorage.clear();
    var currentDate = new Date();
    $("#txtpurchasedate").datepicker().datepicker("setDate", currentDate);
    BindddlData('#ddlcompanystate', '/master/state');
    $('.supplierdetails').hide();
    Addthead();
    typeHeadsupplier()
    LoadData()
    Close();
    typeHeadPurchaseNo()
})

function typeHeadPurchaseNo() {
    var bestPictures = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: '/purchase/purchasenolist'
    });
    $('#txtpurchaseno').typeahead(null, {
        name: 'best-pictures',
        display: 'name',
        source: bestPictures,
        highlight: true,
        width: '500px',
        templates: {
            empty: [
                `<button type="button" class="btn btn-sm btn-secondary"><i class="fa fa-plus-circle"> Add Purchase</i></button>`
            ].join('\n'),
            suggestion: Handlebars.compile('<div><strong>{{name}}</strong></div>'),
        },
    });


}

function getproductname(id) {
    $.ajax({
        url: '/master/productsdetail/',
        dataType: "json",
        type: "get",
        success: function (data) {
            productnameArray = data;
            ProductTypeheadMethod(id);
        },
        error: function (response) {
            var parsed = JSON.parse(response.responseText);
            Error_Msg(parsed.Message);
            d.resolve();
        },
        failure: function (response) {
            var parsed = JSON.parse(response.responseText);
            Error_Msg(parsed.Message);
            d.resolve();
        }
    });

}
var productnameArray = '';

function ProductTypeheadMethod(id) {

    var bestPictures = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        // prefetch: moviedetails
        local: productnameArray
    });
    $(id).typeahead(null, {
        name: 'best-pictures',
        display: 'name',
        source: bestPictures,
        templates: {
            empty: [
                `<button type="button" class="btn btn-sm btn-secondary"><i class="fa fa-plus-circle"> Add Product</i></button>`
            ].join('\n'),
            suggestion: Handlebars.compile('<div><strong>{{name}}</strong></div>')
        },

    });

}

function Rowappend() {
    var row = '';
    $("#detailsTable thead tr th").each(function () {

        switch ($(this).text()) {

            case 'S.No':
                row = row + '<th style="width:10px"><label class="sno">1</label></th>';
                break
            case 'Purchase Qty':
                row = row + '<td class="td-nopad"><input type="text" class="form-control purchaseqty" disabled="disabled"  form-control hsc"></td> ';
                break
            case 'Product':
                row = row + `<td class="td-nopad" style="width:400px">
                <div class="typeahead">
                 <input class="form-control ddl" disabled="disabled"  id="ddlproduct type="text" dir="ltr" onblur="getproductdetails(this)"  placeholder="Enter Productname">
                </div>
                <input type="hidden" class="hfpurchasedetailid"> 
                </td>`;
                break
            case 'HSN/SAC':
                row = row + '<td class="td-nopad"><input type="text" class="form-control " disabled="disabled  hsc"></td> ';
                break
            case 'Qty':
                row = row + '<td><input onblur="Cal_Amount()" type="text" class="qty numerickey form-control form-control"></input><input type="hidden" class="hfdetailsysid"></input><input class="productid" type="hidden"></input><input class="oldqty" type="hidden"></input></td>';
                break
            case 'UNIT':
                row = row + '<td  class="td-nopad" style="width:20px"><select disabled="disabled" class="ddlunit"></select></td>';
                break
            case 'Rate':
                row = row + '<td class="td-nopad"><input type="text" onblur="Cal_Amount()" disabled="disabled"  class="rate form-control form-control rate"></td>';
                break
            case 'DISCOUNT%Rs':
                row = row + '<td class="td-nopad"><input type="text" onblur="Cal_Amount()" disabled="disabled" value="0" class="form-control discountvalue form-control"></td>';
                break
            case 'Amountinclusiveexclusive':
                row = row + '<td class="td-nopad" ><input type="text"  disabled="disabled" value="0" class="amount form-control form-control"></td>';
                break
            default:
                row = row + '<td><i class="la la-trash" onclick="DeleteRow(this)" style="margin-left: 30%"></i></td>';
                break

        }

    });
    $('#detailsTable').append('<tr>' + row + '</tr>');
    for (i = 0; i < 2; i++) {
        Add_Row();

    }
    var firstrow = $("#detailsTable .trbody tr").first();
    $(firstrow).find('.typeahead').empty("");
    $(firstrow).find('.typeahead').append(`<input class="form-control ddl" onblur="getproductdetails(this)"  type="text" dir="ltr" placeholder="Enter Productname">`);
    getproductname($(firstrow).find('.ddl'))
    BindddlData($(firstrow).find('.ddlunit'), '/master/unitdropdown/')
    getproductname($('.ddl'));
    $('#detailsTable tbody tr').each(function (i, e) {
        $('.sno', this).text(i + 1);
    })

}

function Add_Row() {
    var row = $("#detailsTable .trbody tr").last().clone();
    clear(row);
    $('#detailsTable').append(row);
    return false;
}

function clear(row) {

    var sno = parseInt($(row).find('.sno').text()) + 1;
    $(row).find('.sno').text(sno);
    $(row).find('.sysid').val("");
    $(row).find('.typeahead').empty("");
    $(row).find('.typeahead').append(`<input class="form-control ddl" onblur="getproductdetails(this)"  type="text" dir="ltr" placeholder="Enter Productname">`);
    $(row).find('.hfdetailsysid').val("");
    $("td input:text", row).val("");
    $('td .lbldel', row).attr("style", "display: none;");
    $("td button[type=button]", row).val('Delete');
    $("td button[type=button]", row).attr("style", "display: block");
    $("td input[type=date]", row).val('');
    $("td input[type=time]", row).val('');
    getproductname($(row).find('.ddl'))
    $(row).find('.discountvalue').val("0");
    $(row).find('.amount').val("0");
    $(row).find('.productid').val("");
    $(row).find('.ddlunit').val("");
    BindddlData($(row).find('.ddlunit'), '/master/unitdropdown/')
}

function Addthead() {
    var amount = `Amount<select id="taxtype" class="taxtype" onchange="Cal_Amount()"><option value="inclusive">inclusive</option><option value="exclusive">exclusive</option></select>`;
    var hsn = ($("#chhsn").is(":checked") ? 1 : 0) ? `<th>HSN/SAC</th>` : '';
    var unit = ($("#chunit").is(":checked") ? true : false) ? `<th>UNIT</th>` : '';
    var discount = ($("#chdiscount").is(":checked") ? true : false) ? `<th>DISCOUNT<select id="ddldiscount" class="discount"  style="display:block;margin-left: 15px;height: 19px;"><option value="percentage">%<option><option  value="rupee">Rs<option></select></th>` : '';
   // var settings = `<a class="nav-link dropdown-toggle" data-toggle="modal" data-target="#kt_modal_4"><i class="flaticon2-gear"></i></i></a>`
   //<th>" + settings + "</th>
    var head = "<th>S.No</th><th>Product</th><th>Purchase Qty</th>" + hsn + "<th>Qty</th>" + unit + "<th>Rate</th>" + discount + "<th>" + amount + "</th>"; // add resources
    $("#detailsTable thead tr").append(head);
    Rowappend();
    Cal_Amount();
    //  BindSelect2('.ddl', '/master/productdropdown');
}

function Changetable() {
    $("#detailsTable").empty();
    $("#detailsTable").append('<thead><tr></tr></thead><tbody class="trbody"></tbody>');
    Addthead()
    $('#kt_modal_4').modal('toggle');
}

function getproductdetails(ctrl) {

    let productdetails = productnameArray.filter(element => element.name == $(ctrl).val())

    if (productdetails.length == 0 || productdetails.length == undefined || productdetails.length == '') {
        // toastr.error('product Details  not availble')
    } else if (productdetails.length == 1) {
        $(ctrl).closest('tr').find('.qty').focus();
        $(ctrl).closest('tr').find('.rate').val(productdetails[0].purchaseprice);
        $(ctrl).closest('tr').find('.hsc').val(productdetails[0].hsnorsac_code);
        $(ctrl).closest('tr').find('.productid').val(productdetails[0].id);
        $('.attributedetails').empty()
        var deatildesign = '';
        if (productdetails[0].attributes != 0) {
            $.each(productdetails[0].attributes, function (index, value) {
                switch (value.type) {
                    case 'text':
                        deatildesign = deatildesign + '<div class="row form-group"><label>' + value.attributename + '</label><input type="text" class="form-control form-control-sm" placeholder="enter ' + value.attributename + '"></div>'
                }
            });
            $('.dropdown').show();
            $('.attributedetails').append(deatildesign + "<input type='hidden' value='" + productdetails[0].id + "'>")
            // $('#kt_modal_5').modal('toggle');
        }
        if ($(ctrl).closest('tr').find('.sno').text() == $("#detailsTable tbody").find("tr").length) {
            for (i = 0; i < 3; i++) {
                Add_Row();
                //Rowappend();
            }
        }
    } else {
        toastr.error('Duplicate Product Invalid to Process')
    }
}

function Deletecolumn() {

    // $('#detailsTable th:nth-child(4),#detailsTable td:nth-child(4)').remove();
    var someRow = "<th>text1</th><th>text2</th>"; // add resources
    $("#detailsTable thead tr").append(someRow);
}

function attributedetails(ctrl) {
    $.ajax({
        url: '/master/productdetails/' + $(ctrl).closest('tr').find('.ddl').val(),
        dataType: "json",
        type: "get",
        success: function (data) {
            $('.productdetail').empty()
            var deatildesign = '';
            if (data.data[0].attributes) {
                $.each(data.data[0].attributes, function (index, value) {
                    switch (value.type) {
                        case 'text':
                            deatildesign = deatildesign + '<div class="row form-group"><label>' + value.attributename + '</label><input type="text" class="form-control form-control-sm" placeholder="enter ' + value.attributename + '"></div>'
                    }
                });
                $(ctrl).closest('tr').find('.ddl').append(deatildesign)
                $('#kt_modal_5').modal('toggle');
            } else {
                toastr.errormessage('there no attribute');
            }
        },
        error: function (response) {
            var parsed = JSON.parse(response.responseText);
            Error_Msg(parsed.Message);
            d.resolve();
        },
        failure: function (response) {
            var parsed = JSON.parse(response.responseText);
            Error_Msg(parsed.Message);
            d.resolve();
        }
    });




}

function supplierdetails(supplierid) {
    // Deletecolumn();

    $.ajax({
        type: "GET",
        url: '/master/suplist/' + supplierid,
        success: function (data) {

            $('.supplierdetails').show();
            $('#txtgstno').val(data.gstin);
            $('#ddlcompanystate').val(data.shippingstate);
            // $('#txtgstno').attr("disabled","disabled");
            // $('#ddlcompanystate').attr("disabled","disabled");
            $('#hfsupplierid').val(supplierid);
            $('#hfsuppliername').val(data.name);
            $('#hfsuppliertype').val(data.customertype);
            $('#hfemail').val(data.email);
            $('#hfshippingaddress').val(data.shippingaddress);
            $('#hfbillingaddress').val(data.billingaddress);
            $('#hfgstin').val(data.gstin);
            $('#hfgsttype').val(data.gsttype);
        },
        error: function (errormessage) {
            toastr.error(errormessage.responseText);
        }
    })
    return false
}

function typeHeadsupplier() {
    var bestPictures = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: '/master/supplierdopdown'
    });
    $('#txtsupplier').typeahead(null, {
        name: 'best-pictures',
        display: 'name',
        source: bestPictures,
        highlight: true,
        width: '500px',
        templates: {
            empty: [
                `<button type="button" class="btn btn-sm btn-secondary"><i class="fa fa-plus-circle"> Add Supplier</i></button>`
            ].join('\n'),
            suggestion: Handlebars.compile('<div><strong>{{name}}</strong></div>'),
        },
    });


}

$('#txtpurchaseno').bind('typeahead:select', function (ev, suggestion) {

    Fn_Getpurchaseno_based_detail(suggestion.id);

});
$('#txtsupplier').bind('typeahead:select', function (ev, suggestion) {

    supplierdetails(suggestion.id);

});
var Gstdetail = [];

function Cal_Amount() {
    Gstdetail = [];
    let gst18 = '';
    let gst5 = '';
    let gst24 = '';
    var discount, taxtype = '';
    var taxdesign5gst = '',
        taxdesign12gst = '',
        taxdesign18gst = '',
        taxdesign28gst = '';
    var taxamount5gst = 0,
        taxamount12gst = 0,
        taxamount18gst = 0,
        taxamount28gst = 0,
        taxtotalamount = 0,
        total = 0;

    $('.gstdetails').empty();
    $("table.table-bordered thead tr th ").each(function () {
        switch ($(this).text()) {
            case 'DISCOUNT%Rs':
                discount = $('.discount').val();
                break
            case 'Amountinclusiveexclusive':
               
                taxtype = $('.taxtype').val();
                break
        }
    })

    $('#detailsTable tbody tr').each(function (i, ele) {

        if ($('.productid', this).val() != '') {

            if (parseInt($('.purchaseqty', this).val()) >= parseInt($('.qty', this).val())) {
                if (discount != undefined) {

                    if (discount == 'percentage') {
                        if ($('.discountvalue', this).val() <= 100) {
                            if ($('.rate', this).val() != '' && $('.qty', this).val() != '') {

                                $('.amount', this).val(parseFloat($('.rate', this).val()) * parseFloat($('.qty', this).val()))
                                $('.amount', this).val(parseFloat($('.amount', this).val()) - (($('.discountvalue', this).val() / 100) * $('.amount', this).val()))
                            }
                        } else {
                            $('.discountvalue', this).val('0')
                            toastr.error('discount percentage should be less or equal than 100')
                            return false;
                        }

                    } else {
                        $('.amount', this).val(parseFloat($('.rate', this).val()) * parseFloat($('.qty', this).val()))
                        $('.amount', this).val(parseFloat($('.amount', this).val()) - (parseFloat($('.discountvalue', this).val())))
                    }
                } else {
                    if ($('.rate', this).val() != '' && $('.qty', this).val() != '') {

                        $('.amount', this).val(parseFloat($('.rate', this).val()) * parseFloat($('.qty', this).val()))

                    }
                }
            } else {
                toastr.error('invalid qty unable to process');
                return false;
            }

            //tax design
            var taxdetail = productnameArray.filter(ele => ele.id == $('.productid', this).val());
            let amount;

            taxdetail[0].tax.forEach(element => {
                if (taxtype == 'inclusive') {
                    switch (element.taxname) {
                        case "GST 18%":
                            taxdesign18gst = '';
                            taxamount18gst = taxamount18gst + parseFloat($('.amount', this).val()) * parseFloat(element.sgst + element.cgst) / (100 + parseFloat(element.sgst + element.cgst));
                            //  taxamount18gst=taxamount;
                            amount = taxamount18gst / 2;
                            taxdesign18gst = `</br><label>SGST ` + element.sgst + ` % :</label><label style="margin-left:10px"> ` + parseFloat(amount).toFixed(2) + `</label>`
                            taxdesign18gst = taxdesign18gst + `</br><label>CGST ` + element.cgst + ` % :</label><label style="margin-left:10px"> ` + parseFloat(amount).toFixed(2) + `</label>`
                            break
                        case "GST 28%":
                            taxdesign28gst = '';
                            taxamount28gst = taxamount28gst + parseFloat($('.amount', this).val()) * parseFloat(element.sgst + element.cgst) / (100 + parseFloat(element.sgst + element.cgst));
                            // taxamount28gst=taxamount;
                            amount = taxamount28gst / 2;
                            taxdesign28gst = `</br><label>SGST ` + element.sgst + ` % :</label><label style="margin-left:10px"> ` + parseFloat(amount).toFixed(2) + `</label>`
                            taxdesign28gst = taxdesign28gst + `</br><label>CGST ` + element.cgst + ` % :</label><label style="margin-left:10px"> ` + parseFloat(amount).toFixed(2) + `</label>`
                            break
                        case "GST 5%":
                            taxdesign5gst = '';
                            taxamount5gst = taxamount5gst + parseFloat($('.amount', this).val()) * parseFloat(element.sgst + element.cgst) / (100 + parseFloat(element.sgst + element.cgst));
                            // taxamount5gst=taxamount;
                            amount = taxamount5gst / 2;
                            taxdesign5gst = `</br><label>SGST ` + element.sgst + ` % :</label><label style="margin-left:10px"> ` + parseFloat(amount).toFixed(2) + `</label>`
                            taxdesign5gst = taxdesign5gst + `</br><label>CGST ` + element.cgst + ` % :</label><label style="margin-left:10px"> ` + parseFloat(amount).toFixed(2) + `</label>`
                            break
                        case "GST 12%":
                            taxdesign12gst = '';
                            taxamount12gst = taxamount12gst + parseFloat($('.amount', this).val()) * parseFloat(element.sgst + element.cgst) / (100 + parseFloat(element.sgst + element.cgst));
                            // taxamount12gst=taxamount12gst;
                            amount = taxamount12gst / 2;
                            taxdesign12gst = `</br><label>SGST ` + element.sgst + ` % :</label><label style="margin-left:10px"> ` + parseFloat(amount).toFixed(2) + `</label>`
                            taxdesign12gst = taxdesign12gst + `</br><label>CGST ` + element.cgst + ` % :</label><label style="margin-left:10px"> ` + parseFloat(amount).toFixed(2) + `</label>`
                            break
                    }
                } else {
                    switch (element.taxname) {
                        case "GST 18%":
                            taxdesign18gst = '';
                            taxamount18gst = taxamount18gst + (parseFloat($('.amount', this).val()) * parseFloat(element.sgst + element.cgst) / 100);
                            //  taxamount18gst=taxamount;
                            amount = taxamount18gst / 2;
                            taxdesign18gst = `</br><label>SGST ` + element.sgst + ` % :</label><label style="margin-left:10px"> ` + parseFloat(amount).toFixed(2) + `</label>`
                            taxdesign18gst = taxdesign18gst + `</br><label>CGST ` + element.cgst + ` % :</label><label style="margin-left:10px"> ` + parseFloat(amount).toFixed(2) + `</label>`
                            break
                        case "GST 28%":
                            taxdesign28gst = '';
                            taxamount28gst = taxamount28gst + (parseFloat($('.amount', this).val()) * parseFloat(element.sgst + element.cgst) / 100);
                            // taxamount28gst=taxamount;
                            amount = taxamount28gst / 2;
                            taxdesign28gst = `</br><label>SGST ` + element.sgst + ` % :</label><label style="margin-left:10px"> ` + parseFloat(amount).toFixed(2) + `</label>`
                            taxdesign28gst = taxdesign28gst + `</br><label>CGST ` + element.cgst + ` % :</label><label style="margin-left:10px"> ` + parseFloat(amount).toFixed(2) + `</label>`
                            break
                        case "GST 5%":
                            taxdesign5gst = '';
                            taxamount5gst = taxamount5gst + (parseFloat($('.amount', this).val()) * parseFloat(element.sgst + element.cgst) / 100);
                            // taxamount5gst=taxamount;
                            amount = taxamount5gst / 2;
                            taxdesign5gst = `</br><label>SGST ` + element.sgst + ` % :</label><label style="margin-left:10px"> ` + parseFloat(amount).toFixed(2) + `</label>`
                            taxdesign5gst = taxdesign5gst + `</br><label>CGST ` + element.cgst + ` % :</label><label style="margin-left:10px"> ` + parseFloat(amount).toFixed(2) + `</label>`
                            break
                        case "GST 12%":
                            taxdesign12gst = '';
                            taxamount12gst = taxamount12gst + (parseFloat($('.amount', this).val()) * parseFloat(element.sgst + element.cgst) / 100);
                            // taxamount12gst=taxamount12gst;
                            amount = taxamount12gst / 2;
                            taxdesign12gst = `</br><label>SGST ` + element.sgst + ` % :</label><label style="margin-left:10px"> ` + parseFloat(amount).toFixed(2) + `</label>`
                            taxdesign12gst = taxdesign12gst + `</br><label>CGST ` + element.cgst + ` % :</label><label style="margin-left:10px"> ` + parseFloat(amount).toFixed(2) + `</label>`
                            break
                    }

                }


            })
            total = parseFloat(total) + parseFloat($('.amount', this).val());
        }
    })

    $('.gstdetails').append(taxdesign5gst + taxdesign12gst + taxdesign18gst + taxdesign28gst);
    if (taxamount18gst != '' && taxamount18gst != 0) {


        let gst18 = '';

        gst18 = {
            name: 'gst18',
            percentage: '9',
            sgst: parseFloat(taxamount18gst / 2).toFixed(2),
            cgst: parseFloat(taxamount18gst / 2).toFixed(2)
            // name: 'gst18',
            // 'sgst 9%': parseFloat(taxamount18gst / 2).toFixed(2),
            // 'cgst 9%': parseFloat(taxamount18gst / 2).toFixed(2)
        }



        Gstdetail.push(gst18)

    }
    if (taxamount5gst != '' && taxamount5gst != 0) {
        let gst5 = '';

        gst5 = {
            name: 'gst5',
            percentage: '2.5',
            sgst: parseFloat(taxamount5gst / 2).toFixed(2),
            cgst: parseFloat(taxamount5gst / 2).toFixed(2)
            // name: 'gst5',
            // 'sgst 2.5%': parseFloat(taxamount5gst / 2).toFixed(2),
            // 'cgst 2.5%': parseFloat(taxamount5gst / 2).toFixed(2)
        }


        Gstdetail.push(gst5)
    }
    if (taxamount28gst != '' && taxamount28gst != 0) {
        let gst28 = '';

        gst28 =
        {
            name: 'gst28',
            percentage: '14',
            sgst: parseFloat(taxamount28gst / 2).toFixed(2),
            cgst: parseFloat(taxamount28gst / 2).toFixed(2)
            // name: 'gst28',
            // 'sgst 14%': parseFloat(taxamount28gst / 2).toFixed(2),
            // 'cgst 14%': parseFloat(taxamount28gst / 2).toFixed(2)
        }


        Gstdetail.push(gst28)
    }
    if (taxamount12gst != '' && taxamount12gst != 0) {
        let gst12 = '';

        gst12 =
        {

            name: 'gst12',
            percentage: '6',
            sgst: parseFloat(taxamount12gst / 2).toFixed(2),
            cgst: parseFloat(taxamount12gst / 2).toFixed(2)


        }



        Gstdetail.push(gst12)

    }

    $('#subtotal').text(parseFloat(total).toFixed(2));
    
    if (taxtype == 'inclusive') {
        $('#txtactualtotal').val(parseFloat(total).toFixed(2))
        $('#txttotal').text(parseFloat(total).toFixed(2))
    } else {
       
        let sum = total + taxamount5gst + taxamount12gst + taxamount18gst + taxamount28gst;
        $('#txtactualtotal').val(parseFloat(sum).toFixed(2));
        $('#txttotal').text(parseFloat(sum).toFixed(2));
        
    }


}
var OldPuchaseDetail = [];

function save_process() {
    //    let PurchaseDetail=[];
    let purchaseRetrunDetail = [];
    let SupplierDetail = [];
    if ($('#hfsupplierid').val() == '') {
        toastr.error('Invalid Supplier Deatils  Unable to Process');
        return false;
    }
    if (parseInt($('#txttotal').text()) <= 0) {
        toastr.error('Inavalid  Deatil Unable to Process');
        return false;
    }
    let supplier_details = {
        suppliername: $('#hfsuppliername').val(),
        suppliertype: $('#hfsuppliertype').val(),
        email: $('#hfemail').val(),
        shippingaddress: $('#hfshippingaddress').val(),
        billingaddress: $('#hfbillingaddress').val(),
        gstin: $('#hfgstin').val(),
        gsttype: $('#hfgsttype').val(),
        gstno: $('#txtgstno').val()
    }
    SupplierDetail.push(supplier_details)


    $('#detailsTable tbody tr').each(function (i, e) {
        if ($('.productid', this).val() != '') {
            //    let sumofqty= OldPuchaseDetail.map(ele=>{
            //     if(ele._id=$('.hfpurchasedetailid',this).val())
            //     {
            //         return ele.qty-$('.qty',this).val();
            //     }
            //    })
            //    alert(sumofqty)

            let purchaseReturn = {
                productid: $('.productid', this).val(),
                qty: $('.qty', this).val(),
                rate: $('.rate', this).val(),
                discount: $('.discount', this).val(),
                amount: $('.amount', this).val(),
                purchasedetail_id: $('.hfpurchasedetailid', this).val(),
                purchaseqty: $('.purchaseqty', this).val()
            };
            if ($('.hfdetailsysid', this).val() != '') {
                purchaseReturn._id = $('.hfdetailsysid', this).val()
            }
            if ($('.ddlunit', this).val() != undefined) {
                purchaseReturn.unitid = $('.ddlunit', this).val()
            }
            if ($('.discountvalue', this).val() != undefined) {
                purchaseReturn.discount = $('.discountvalue', this).val()
            }
            if ($('.hsc', this).val() != undefined) {

                purchaseReturn.hsn = $('.hsc', this).val()
            }
          
            purchaseRetrunDetail.push(purchaseReturn);
        }
    })
    if (purchaseRetrunDetail.length == 0) {
        toastr.error('Inavalid Purchase Deatil Unable to Process');
        return false;
    }

    var data = {
        _id: $('#hf_id').val(),
        purchase_id: $('#hfpurchaseid').val(),
        purchasereturnno: $('#lblpurchaseretrun_no').text(),
        purchasedate: Converdate($('#txtpurchasedate').val()),
        reference: $('#txtreference').val(),
        supplierid: $('#hfsupplierid').val(),
        SupplierDetail: SupplierDetail,
        purchaseRetrunDetail: purchaseRetrunDetail,
        subtotal: $('#subtotal').text(),

        roundofftype: $('#ddlroundofftype').val(),
        roundoff: $('#txtrounoffvalue').val(),
        actualtotal: $('#txtactualtotal').val(),

        total: $('#txttotal').text(),
        hsncolumn: $("#chhsn").is(":checked") ? 1 : 0,
        unitcolumn: $("#chunit").is(":checked") ? 1 : 0,
        discountcolumn: $("#chdiscount").is(":checked") ? 1 : 0,
        discountype: $("#ddldiscount").val(),
        taxtype: $("#taxtype").val(),
        gstdetail: Gstdetail,
    }
    insertupdate(data, '/purchasereturn/insertupdate');


}

function afterinsertupdatefunction(result) {
    Fn_GetpurchaseReturn_No();
    cleardata();


}

function LoadData() {
    $('#gvpurchaselist').dataTable().fnDestroy();
    var table = $('#gvpurchaselist');
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
        ajax: '/purchasereturn/list',
        columns: [
            // { data: 'sno', },
            { data: 'Supplier.name', name: 'type' },
            { data: 'purchasedate', name: 'productname' },
            { data: 'purchasereturnno', name: 'purchasereturnno' },

            { data: 'returndate', name: 'returndate' },

            // { data: 'openingstock', name: 'openingstock' },
            { data: '_id', responsivePriority: -1 },
        ],
        order: [0, "desc"],
        dom: '<"top" f>rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        columnDefs: [{
            targets: -1,
            title: 'Action',
            orderable: false,
            render: function (data, type, full, meta) {

                return `

                        <a onclick='btneditpurchase("` + data + `")' type="button" class="btn btn-sm btn-primary btn-icon  btn-icon btn-icon-sm" title="View / Edit">
                          <i class ="la la-edit ic-white"></i>
                        </a>
                              <a onclick= 'btndeletepurchase("` + data + `")' type="button" class="btn btn-sm btn-delete-red btn-icon  btn-icon btn-icon-sm" title="Delete">

                          <i class ="la la-trash ic-white"></i>
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

function btneditpurchase(id) {

    editassignvalue('/purchasereturn/edit/' + id)
}

function assignvalue(data) {
    $('.list').hide();
    $('.entry').show();

    if (data[0].discountcolumn == 1) {

        $('#chdiscount').prop('checked', true);
    }
    if (data[0].unitcolumn == 1) {

        $('#chunit').prop('checked', true);
    }
    if (data[0].hsncolumn == 1) {
        $('#chhsn').prop('checked', true);
    }
    $("#detailsTable thead tr").empty('');
    $("#detailsTable tbody").empty('');
    Addthead();

    $("#ddldiscount").val(data[0].discountype);
    $("#taxtype").val(data[0].taxtype);

    $('#hf_id').val(data[0]._id);
    $('#hfpurchaseid').val(data[0].purchase_id);
    $('#txtpurchasedate').val(data[0].purchasedate);
    $('#ddlduedays').val(data[0].creditdays);
    //Cal_Duedate();
    $('#txttotal').text(data[0].total)
    $('#txtreference').val(data[0].reference)

    $('#txtsupplier').typeahead('val', data[0].Supplier.name);
    $('.supplierdetails').show();
    $('#txtgstno').val(data[0].Supplier.gstin);
    $('#ddlcompanystate').val(data[0].Supplier.billingstate);
    $('#hfsupplierid').val(data[0].supplierid);
    $('#lblpurchaseretrun_no').text(data[0].purchasereturnno)
    $('#txtpurchaseno').val(data[0].purchases[0].purchaseorderno)

    $('#hfsuppliername').val(data[0].Supplier.suppliername);
    $('#hfsuppliertype').val(data[0].Supplier.customertype);
    $('#hfemail').val(data[0].Supplier.email);
    $('#hfshippingaddress').val(data[0].Supplier.shippingaddress);
    $('#hfbillingaddress').val(data[0].Supplier.billingaddress);
    $('#hfgstin').val(data[0].Supplier.gstin);
    $('#hfgsttype').val(data[0].Supplier.gsttype);

    $.each(data[0].purchaseRetrunDetail, function (j, v) {
        if (j <= 2) {
            $('#detailsTable tbody tr').each(function (i, e) {
                if (j == i) {

                    let productdetails = productnameArray.filter(element => element.id == v.productid);
                    $('.ddl', this).val(productdetails[0].name);
                    $('.productid', this).val(v.productid);
                    $('.qty', this).val(v.qty);
                    $('.rate', this).val(v.rate);
                    $('.amount', this).val(v.amount);
                    $('.hfdetailsysid', this).val(v._id);
                    $('.hfpurchasedetailid', this).val(v.purchasedetail_id);
                    $('.purchaseqty', this).val(v.purchaseqty)
                    $('.discountvalue', this).val(v.discount);
                    BindddlDataele($('.ddlunit', this), '/master/unitdropdown/', v.unitid)
                    $('.hsc', this).val(v.hsn);
                }
            })
        } else {

            let productdetails = productnameArray.filter(element => element.id == v.productid);
            var row = $("#detailsTable .trbody tr").last().clone();
            var sno = parseInt($(row).find('.sno').text()) + 1;
            $(row).find('.sno').text(sno);

            $(row).find('.typeahead').empty("");
            $(row).find('.typeahead').append(`<input class="form-control ddl" onblur="getproductdetails(this)"  type="text" dir="ltr" placeholder="Enter Productname">`);
            $(row).find('.hfdetailsysid').val("");
            $("td input:text", row).val("");
            $('td .lbldel', row).attr("style", "display: none;");
            $("td button[type=button]", row).val('Delete');
            $("td button[type=button]", row).attr("style", "display: block");
            $(row).find('.discountvalue').val("0");
            $(row).find('.amount').val("0");
            $(row).find('.productid').val("");
            $(row).find('.ddlunit').val("");
            BindddlData($(row).find('.ddlunit'), '/master/unitdropdown/')
            getproductname($(row).find('.ddl'))

            $(row).find('.ddl').val(productdetails[0].name);
            $(row).find('.qty').val(v.qty);
            $(row).find('.rate').val(v.rate);
            $(row).find('.discountvalue').val(v.discount);
            $(row).find('.amount').val(v.amount);
            $(row).find('.productid').val(v.productid);
            $(row).find('.detailsysid').val(v._id);
            $(row).find('.purchaseqty').val(v.purchaseqty);
            $(row).find('.hfpurchasedetailid', this).val(v.purchasedetail_id);
            $(row).find('.discountvalue', this).val(v.discount);
            BindddlDataele($('.ddlunit', this), '/master/unitdropdown/', v.unitid)
            $(row).find('.hsc', this).val(v.hsn);

            $('#detailsTable').append(row);
        }
    })
    Cal_Amount();
}

function btndeletepurchase(id) {

    deletedata('/purchasereturn/delete/' + id)
}

function afterdelete() {

    LoadData()
}

function Close() {
    cleardata();
    $('.list').show();
    $('.entry').hide();

    LoadData();

}

function Show() {

    $('.list').hide();
    $('.entry').show();
    $('#kt_modal_4').modal('toggle');
    Fn_GetpurchaseReturn_No()
    typeHeadPurchaseNo()

}

function saveexit() {
    save_process();
    Close();
}

function cleardata() {
    $('#hf_id').val('');
    // $('#ddlduedays').val('7');
    // Cal_Duedate();
    $('#txttotal').text("0");
    $('#subtotal').text("0");
    $('#txtsupplier').typeahead('val', '');
    $('#hfsupplierid').val("");
    $('#txtreference').val("");
    $("#detailsTable tbody").find("tr:gt(2)").remove();
    $('#detailsTable tbody tr').each(function (i, e) {
        $('.ddl', this).val('')
        $('.qty', this).val('');
        $('.rate', this).val('');
        $('.rate', this).val('');
        $('.amount', this).val('');
        $('.purchaseqty', this).val('0');
        $('.hfdetailsysid', this).val('');
        $('.hfpurchasedetailid', this).val('');
        $('.ddlunit', this).val('0');
        $('.discountvalue', this).val('0');
        $('.hsc', this).val('');
    })
    $('.supplierdetails').hide();
    $('.gstdetails').empty();
    $('#ddlroundofftype').val('plus');
    $('#txtrounoffvalue').val('0')
    $('#txtactualtotal').val('0')
}

function Fn_GetpurchaseReturn_No() {
    $.ajax({
        type: "GET",
        url: '/purchasereturn/purchasereturnno',
        success: function (data) {

            $('#lblpurchaseretrun_no').text('PR' + data.billno)
        },
        error: function (errormessage) {
            toastr.error(errormessage.responseText);
        }
    })
    return false
}

function DeleteRow(ctrl) {
    var currentRow = $(ctrl).closest("tr");

    if (parseInt($(currentRow).find('.sno').text()) <= 3) {
        $(currentRow).find('.typeahead').empty("");
        $(currentRow).find('.typeahead').append(`<input class="form-control ddl" onblur="getproductdetails(this)"  type="text" dir="ltr" placeholder="Enter Productname">`);
        $(currentRow).find('.hfdetailsysid').val("");
        $("td input:text", $(currentRow)).val("");
        $('td .lbldel', $(currentRow)).attr("style", "display: none;");
        $("td button[type=button]", $(currentRow)).val('Delete');
        $("td button[type=button]", $(currentRow)).attr("style", "display: block");
        $("td input[type=date]", $(currentRow)).val('');
        $("td input[type=time]", $(currentRow)).val('');
        getproductname($(currentRow).find('.ddl'))
        $(currentRow).find('.discountvalue').val("0");
        $(currentRow).find('.amount').val("0");
        $(currentRow).find('.productid').val("");
        $(currentRow).find('.ddlunit').val("");
        BindddlData($(currentRow).find('.ddlunit'), '/master/unitdropdown/')
    } else {

        $(ctrl).closest('tr').remove();
        $('#detailsTable tbody tr').each(function (i, e) {


            $('.sno', this).text(i + 1);
        })

    }
    Cal_Amount();
}

function Fn_OverallDiscount_Cal() {
    $('#txttotal').text(parseFloat($('#txttotal').text() - $('#txtoveralldiscount').val()).toFixed(2))
}

function Fn_Getpurchaseno_based_detail(id) {
    $.ajax({
        url: '/purchasereturn/purchasedetails/' + id,
        dataType: "json",
        type: "get",

        success: function (data) {
            $('.list').hide();
            $('.entry').show();
            if (data[0].discountcolumn == 1) {

                $('#chdiscount').prop('checked', true);
            }
            if (data[0].unitcolumn == 1) {

                $('#chunit').prop('checked', true);
            }
            if (data[0].hsncolumn == 1) {
                $('#chhsn').prop('checked', true);
            }
            $("#detailsTable thead tr").empty('');
            $("#detailsTable tbody").empty('');
            Addthead();

            $("#ddldiscount").val(data[0].discountype);
            $("#taxtype").val(data[0].taxtype);
            $("#taxtype").attr("disabled","disabled");
            $('#hfpurchaseid').val(data[0]._id);
            $('#txtpurchasedate').val(data[0].purchasedate);
            $('#ddlduedays').val(data[0].creditdays);
            //Cal_Duedate();
            $('#txttotal').text(data[0].total)
            $('#txtreference').val(data[0].reference)

            $('#txtsupplier').typeahead('val', data[0].Supplier.name);
            $('.supplierdetails').show();
            $('#txtgstno').val(data[0].Supplier.gstin);
            $('#ddlcompanystate').val(data[0].Supplier.billingstate);
            $('#hfsupplierid').val(data[0].supplierid);
            //  $('#lblpurchaseno').text(data[0].purchaseorderno)
            OldPuchaseDetail = data[0].purchaseDetail;

            $.each(data[0].purchaseDetail, function (j, v) {
                if (j <= 2) {
                    $('#detailsTable tbody tr').each(function (i, e) {
                        if (j == i) {

                            let productdetails = productnameArray.filter(element => element.id == v.productid);
                            $('.ddl', this).val(productdetails[0].name);
                            $('.productid', this).val(v.productid);
                            $('.purchaseqty', this).val(v.qty);
                            $('.qty', this).val(v.qty);
                            $('.rate', this).val(v.rate);
                            $('.amount', this).val(v.amount);
                            // $('.hfdetailsysid',this).val(v._id);
                            $('.hfpurchasedetailid', this).val(v._id);
                            $('.discountvalue', this).val(v.discount);
                            BindddlDataele($('.ddlunit', this), '/master/unitdropdown/', v.unitid)
                            $('.hsc', this).val(v.hsn);
                        }
                    })
                } else {

                    let productdetails = productnameArray.filter(element => element.id == v.productid);
                    var row = $("#detailsTable .trbody tr").last().clone();
                    var sno = parseInt($(row).find('.sno').text()) + 1;
                    $(row).find('.sno').text(sno);

                    $(row).find('.typeahead').empty("");
                    $(row).find('.typeahead').append(`<input class="form-control ddl" onblur="getproductdetails(this)"  type="text" dir="ltr" placeholder="Enter Productname">`);
                    $(row).find('.hfdetailsysid').val("");
                    $("td input:text", row).val("");
                    $('td .lbldel', row).attr("style", "display: none;");
                    $("td button[type=button]", row).val('Delete');
                    $("td button[type=button]", row).attr("style", "display: block");
                    $(row).find('.discountvalue').val("0");
                    $(row).find('.amount').val("0");
                    $(row).find('.productid').val("");
                    $(row).find('.ddlunit').val("");
                    BindddlData($(row).find('.ddlunit'), '/master/unitdropdown/')
                    getproductname($(row).find('.ddl'))

                    $(row).find('.ddl').val(productdetails[0].name);
                    $(row).find('.qty').val(v.qty);
                    $(row).find('.rate').val(v.rate);
                    $(row).find('.discountvalue').val(v.discount);
                    $(row).find('.amount').val(v.amount);
                    $(row).find('.productid').val(v.productid);
                    $(row).find('.purchaseqty').val(v.qty);

                    // $(row).find('.detailsysid').val(v._id);
                    $('.hfpurchasedetailid', this).val(v._id);
                    $(row).find('.discountvalue', this).val(v.discount);
                    BindddlDataele($('.ddlunit', this), '/master/unitdropdown/', v.unitid)
                    $(row).find('.hsc', this).val(v.hsn);

                    $('#detailsTable').append(row);
                }
            })
            Cal_Amount();

        },
        error: function (response) {

            var parsed = JSON.parse(response.responseText);
            toastr.error(parsed.Message);
            // d.resolve();
        },
        failure: function (response) {
            var parsed = JSON.parse(response.responseText);
            toastr.error(parsed.Message);

            //d.resolve();
        }
    });
}

function Cal_Roundoff() {
    if ($('#ddlroundofftype').val() == "plus") {
        let nettotal = parseFloat($('#txtactualtotal').val()) + parseFloat($('#txtrounoffvalue').val())
        $('#txttotal').text(parseFloat(nettotal).toFixed(2))
    } else {
        let nettotal = parseFloat($('#txtactualtotal').val()) - parseFloat($('#txtrounoffvalue').val())
        $('#txttotal').text(parseFloat(nettotal).toFixed(2))
    }

}