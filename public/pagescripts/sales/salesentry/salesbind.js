//#region  invoice no genarate
function getsalesno() {
    $.ajax({
        type: "GET",
        url: '/sales/invoiceno',
        success: function (data) {
            $('.lblinvoiceno').html(data.billno)
            $('#hfinvoiceno').val(data.billno)
        },
        error: function (errormessage) {
            toastr.error(errormessage.responseText);
        }
    })
    return false
}
//#endregion

//#region customer typehead process

function typeHeadcustomer() {
  
    var bestPictures = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: '/master/customerdopdown'
    });
    $('#txtcustomer').typeahead(null, {
        name: 'best-pictures',
        display: 'name',
        source: bestPictures,
        highlight: true,
        width: '500px',
        templates: {
            empty: [
                `<button type="button"  onclick="showcustomer()" class="btn btn-sm btn-secondary"><i class="fa fa-plus-circle"> Add Customer</i></button>`
            ].join('\n'),
            suggestion: Handlebars.compile('<div><strong>{{name}}</strong></div>'),
        },
    });
}

$('#txtcustomer').bind('typeahead:select', function (ev, suggestion) {
   
    $('#txtgstno').val(suggestion.gstin);
    $('#ddlcompanystate').val(suggestion.billingstate);
    $('#hfcustomerid').val(suggestion.id);
    if(suggestion.gstin){
        $('.supplierdetails').show();
    }
    $('#hfcustomername').val(suggestion.name);
    $('#hfcustomertype').val(suggestion.customertype);
    $('#hfemail').val(suggestion.email);
    $('#hfshippingaddress').val(suggestion.shippingaddress);
    $('#hfbillingaddress').val(suggestion.billingaddress);
    $('#hfgstin').val(suggestion.gstin);
    $('#hfgsttype').val(suggestion.gsttype);
    $('#hfgstno').val(suggestion.gstno);
    console.log(suggestion.paymentterms)
    $('#ddlduedays').val(suggestion.paymentterms)
    Cal_Duedate();
    
});
//#endregion

//#region delete and edit process
function btndeletesales(id) {
    deletedata('/sales/delete/' + id)
}
function afterdelete() {
    LoadData()
}
function btneditsales(id) {
    editassignvalue('/sales/edit/' + id)
}
function assignvalue(data) {
    localStorage.clear();
    getproductname('');
    console.log(data)
    $('.list').hide();
    $('.entry').show();
    $('#hf_id').val(data[0]._id);
    $('#txtinvoicedate').val(data[0].invoicedate);

    $('#ddlduedays').val(data[0].creditdays);
    Cal_Duedate();
    // $('#txtduedate').val(data[0].purchasedate)
    $('#txttotal').text(data[0].total)
    $('#txtreference').val(data[0].reference)
    $('#txtcustomer').typeahead('val', data[0].customer.name);


    $('.supplierdetails').show();
    $('#hfcustomerid').val(data[0].customerid);
    $('#txtgstno').val(data[0].customer.gstin);
    $('#ddlcompanystate').val(data[0].customer.billingstate);
    $('#hfinvoiceno').text(data[0].invoiceno);
    $('.lblinvoiceno').text(data[0].invoiceno);
    $('#ddlsalesrep').val(data[0].salesrep);

    $('#hfcustomername').val( data[0].customer.name);
    $('#hfcustomertype').val( data[0].customer.customertype);
    $('#hfemail').val( data[0].customer.email);
    $('#hfshippingaddress').val( data[0].customer.shippingaddress);
    $('#hfbillingaddress').val( data[0].customer.billingaddress);
    $('#hfgstin').val( data[0].customer.gstin);
    $('#hfgsttype').val( data[0].customer.gsttype);
    $('#hfgstno').val( data[0].customer.gstno);

    $.each(data[0].invoiceDetail, function (j, v) {
        if (j <= 2) {
            $('#detailsTable tbody tr').each(function (i, e) {
                if (j == i) {
                    let productdetails = productnameArray.filter(element => element.id == v.productid);

                    $('.ddl', this).val(productdetails[0].name);
                    $('.productid', this).val(v.productid);
                    $('.qty', this).val(v.qty);
                    $('.hfqty', this).val(v.qty);
                    $('.availableqty', this).val(productdetails[0].availbleqty);
                    $('.rate', this).val(v.rate);
                    $('.discount', this).val(v.discount);
                    $('.amount', this).val(v.amount);
                    $('.hfdetailsysid', this).val(v._id);
                }
            })
        }
        else {
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
            getproductname($(row).find('.ddl'))
            $(row).find('.ddl').val(productdetails[0].name);
            $(row).find('.qty').val(v.qty);
            $(row).find('.hfqty').val(v.qty);
            $(row).find('.availableqty').val(productdetails[0].availbleqty);
            $(row).find('.rate').val(v.rate);
            $(row).find('.discountvalue').val(v.discount);
            $(row).find('.amount').val(v.amount);
            $(row).find('.productid').val(v.productid);
            $(row).find('.detailsysid').val(v._id);
            $('#detailsTable').append(row);
        }



    })
    Cal_Amount();
}
//#endregion


function btnprint(id) {

    $.ajax({
        url: '/sales/invoicebill/'+id,
        // data: JSON.q(fieldvalue),
        type: 'post',
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (res) {
            console.log(res)
                $('.lblinvoiceno').html(res.invoice[0].invoiceno);
                $('.lblcompanyname').html(res.company.companyname);
                $('.lbladdress').html(res.company.address);
                $('.lblpincode').html(res.company.city + '-' + res.company.pincode);
                $('.lblinvoicedate').html(res.invoice[0].invoicedate);
                $('.lblinvoiceto').html(res.invoice[0].customer[0].billingaddress);
                var discount = 0;
                res.invoice.forEach((val) => {
                    var rowspan = `<tr>
                    <td>`+ val.invoiceDetail.productdetail[0].productname + `</td>
                    <td>`+ val.invoiceDetail.qty + `</td>
                    <td>Rs.`+ val.invoiceDetail.rate + `/-</td>
                    <td class="kt-font-danger kt-font-lg"> Rs.`+ val.invoiceDetail.amount + `/-</td>`;
                    $('.tbody').append(rowspan);
                    discount = discount + val.invoiceDetail.discount;
                })
                $('.lbldiscount').html(discount);
                $('.lbltotalamount').html(res.invoice[0].total);


                $('.list').hide();
                $('.entry').hide();
                $('.printTable').show();
          
        },
        error: function (errormessage) {
            toastr.error(errormessage.responseText);
        }
    });
    return false


}
function goback(){
    $(".tbody tr").remove();
    $('.printTable').hide();
    $('.list').show();    
    LoadData();
    getsalesno();
}

function showcustomer(){
    $('#customermadal').modal('show');
}
var validationcustomer= function () {
   
    $("#formcustsub").validate({
        // define validation rules
        rules: {
            name: {
                required: true
            },
            mobile: {
                required: true
            },
        },
        //display error alert on form submit
        invalidHandler: function (event, validator) {
            swal.fire({
                "title": "",
                "text": "There are some errors in your submission. Please correct them.",
                "type": "error",
                "confirmButtonClass": "btn btn-secondary",
                "onClose": function (e) {
                    console.log('on close event fired!');
                }
            });

            event.preventDefault();
        },

        submitHandler: function (form) {
            swal.fire({
                title: 'Are you sure?',
                text: "You won't be save this file!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Save it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then(function (result) {
                if (result.value) {
                    var data={
                        name: $('#txtname').val(),
                        mobile:$('#txtmobile').val(),
                        pagetype:"customer",
                        id:"",
                    };
                    $.ajax({
                        url: '/master/custsup',
                        data: JSON.stringify(data),
                        type: 'post',
                        contentType: "application/json;charset=utf-8",
                        dataType: "json",
                        success: function (result) {
                            if (result.status == 'success') {
                                toastr.success(result.message);
                                 $('#txtname').val(''),
                                 $('#txtmobile').val(''),
                                 $('#txtcustomer').val(result.data.name),
                                 $('#hfcustomerid').val(result.data._id),
                                 $('#customermadal').modal('hide');
                            }
                            else {
                                toastr.error(result.message);
                           }
                        },
                        error: function (errormessage) {
                            toastr.error(errormessage.responseText);
                        }
                    });
                    return false
                    
                } else if (result.dismiss === 'cancel') {
                    swal.fire(
                        'Cancelled',
                        'Your data is safe :)',
                        'error'
                    )
                }
            })
        }
    });
}