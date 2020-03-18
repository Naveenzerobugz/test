$(document).ready(function() {
    Close()
    bidpaymode('.ddlpaymode', '/master/banklistddl');
    GetBillno()
    var currentDate = new Date();
    $("#txtpymentdate").datepicker().datepicker("setDate", currentDate);
    LoadData();
})

function Close() {
    cleardata();
    $('.list').show();
    $('.entry').hide();

    LoadData();

}

function Show() {
    localStorage.clear();
    $('.list').hide();
    $('.entry').show();
    GetBillno()
    bidpaymode('.ddlpaymode', '/master/banklistddl');
    typeHeadsupplier();
    $('.transactiondetails').hide();
    $('#kt_modal_4').modal('hide');
}

function bidpaymode(element, Url) {

    paymode = '';
    if (paymode.length == 0) {
        //ajax function for fetch data    
        $.ajax({
            type: "GET",
            url: Url,
            success: function(data) {
                paymode = data;
                console.log(data)
                var $ele = $(element);
                $ele.empty();
                // $ele.append($('<option/>').val('').text('Select'));
                $.each(paymode.data, function(i, val) {

                    $ele.append($('<option/>').val(val._id).text(val.bankname));
                })
                
            }

        })

    } else {

    }
}
function bankidpaymode(element, Url,id) {

    paymode = '';
    if (paymode.length == 0) {
        //ajax function for fetch data    
        $.ajax({
            type: "GET",
            url: Url,
            success: function(data) {
                paymode = data;
                console.log(data)
                var $ele = $(element);
                $ele.empty();
                // $ele.append($('<option/>').val('').text('Select'));
                $.each(paymode.data, function(i, val) {

                    $ele.append($('<option/>').val(val._id).text(val.bankname));
                })
                $ele.val(id)
            }

        })

    } else {

    }
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
$('#txtsupplier').bind('typeahead:select', function(ev, suggestion) {


    supplierdetails(suggestion.id)


});

function supplierdetails(id) {
    $('#hfsupplierid').val(id);
    $('.transactiondetails').show()
    $.ajax({
        type: "GET",
        url: '/balancepayment/supplierbalance/' + id,
        success: function(data) {
            $('#paymentdetails tbody ').empty();
            var row = '';
            let i = 1;
            // $('#paymentdetails tbody .trbody').empty();
            data.forEach(ele => {
                if (ele.balance > 0) {
                    row = `<tr><td><label class="sno">` + i + `</label>
                    <td><input onchange="CheckboxEvent(this)" class="chbx" type="checkbox"><input type="hidden" class="purchaseid" value=` + ele._id + `></td>
                    <td><label class="purchasedate">` + ele.purchasedate + `</label></td>
                    <td><label class="purchaseorderno">` + ele.purchaseorderno + `</label></td>
                    <td><label class="payedamount"><label></td>
                    <td><span><i class="la la-rupee"></i><span>
                    <input type="hidden" class="hfbalance" value=` + ele.balance + `></input><label class="balance">` + ele.balance + `<label></td>`;
                    $('#paymentdetails tbody').append(row);
                    i++;
                }
            });

        },
        error: function(errormessage) {
            toastr.error(errormessage.responseText);
        }
    })

}

function CheckboxEvent(ctrl) {

    if ($('#txtpaidamount').val() > 0) {
        let status = $(ctrl).is(':checked');
        let spendamount = 0;

        $('#paymentdetails tbody tr').each(function(i, e) {
            if ($('.purchaseid', this).val() != undefined && $('.purchaseid', this).val() != '') {
                if ($('.chbx', this).is(':checked') == true) {
                    spendamount = parseFloat((spendamount)) + parseFloat($('.payedamount', this).text());
                }
            }
        })


        let usedamount = parseFloat($('#txtpaidamount').val()) - parseFloat(spendamount);

        if (usedamount <= 0) {
            $(ctrl).prop('checked', false);
            swal.fire({
                "title": "",
                "text": "You Already Used  Your Amount",
                "type": "error",
                "confirmButtonClass": "btn btn-secondary",
                "onClose": function(e) {
                    console.log('on close event fired!');
                }
            });
            return false;
        }

        if ($(ctrl).is(':checked') == false) {

            if ($(ctrl).closest("tr").find(".hfid").val()) {

                $(ctrl).closest("tr").find(".balance").text(parseFloat($(ctrl).closest("tr").find(".payedamount").text()) + parseFloat($(ctrl).closest("tr").find(".hfbalance").val()));
                $(ctrl).closest("tr").find(".payedamount").text('0');
            } else {
                $(ctrl).closest("tr").find(".payedamount").text('0');
                $(ctrl).closest("tr").find(".balance").text($(ctrl).closest("tr").find(".hfbalance").val());
            }
        } else {

            if (usedamount >= $(ctrl).closest("tr").find(".hfbalance").val()) {
                $(ctrl).closest("tr").find(".payedamount").text($(ctrl).closest("tr").find(".hfbalance").val());
                $(ctrl).closest("tr").find(".balance").text('0');
            } else {
                // alert($(ctrl).closest("tr").find(".hfbalance").val())
                $(ctrl).closest("tr").find(".payedamount").text(parseFloat(usedamount).toFixed(2));
                $(ctrl).closest("tr").find(".balance").text($(ctrl).closest("tr").find(".hfbalance").val() - usedamount);

            }

        }
    } else {
        $(ctrl).prop('checked', false);
        toastr.error('Invalid Paid amount');
    }

}


function Closing_Purchase() {

    if ($('#txtpaidamount').val() > 0) {

        var paidamount = $('#txtpaidamount').val();

        let spendamount = 0;
        $('#paymentdetails tbody tr').each(function(i, e) {

            $('.payedamount', this).text('0');
            $('.balance', this).text($('.hfbalance', this).val())
            $('.chbx').prop('checked', false);
        })

        let usedamount = $('#txtpaidamount').val() - spendamount;
        if (usedamount == 0) {
            $('#paymentdetails tbody tr').each(function(i, e) {
                if ($('.balance', this).text() != '') {

                    if (parseInt(paidamount) != 0) {
                        if (parseInt($('.balance', this).text()) <= paidamount) {

                            paidamount = parseInt(paidamount) - parseInt($('.balance', this).text());
                            $('.payedamount', this).text(parseInt($('.balance', this).text()));
                            $('.balance', this).text('0')
                                // paidamount=paidamount-payedamount;
                            $('.chbx', this).prop('checked', true);
                        } else {

                            let balance = parseInt($('.balance', this).text()) - parseInt(paidamount);
                            $('.balance', this).text(balance)
                            $('.payedamount', this).text(paidamount);
                            paidamount = parseInt($('.payedamount', this).text()) - paidamount;
                            $('.chbx', this).prop('checked', true);
                        }
                    }


                }

            })
        } else {
            $('#paymentdetails tbody tr').each(function(i, e) {
                if ($('.balance', this).text() != '') {
                    // alert('data')
                    if (parseInt(usedamount) != 0) {
                        if (parseInt($('.balance', this).text()) <= usedamount) {

                            usedamount = parseInt(usedamount) - parseInt($('.balance', this).text());
                            $('.payedamount', this).text(parseInt($('.balance', this).text()));
                            $('.balance', this).text('0')
                                // paidamount=paidamount-payedamount;
                            $('.chbx', this).prop('checked', true);
                        } else {

                            let balance = parseInt($('.balance', this).text()) - parseInt(usedamount);
                            $('.balance', this).text(balance)
                            $('.payedamount', this).text(usedamount);
                            usedamount = parseInt($('.payedamount', this).text()) - usedamount;
                            $('.chbx', this).prop('checked', true);
                        }
                    }


                }

            })

        }
    } else {


        toastr.error('Invalid Paid amount');
    }


}

function save_process() {
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

            if ($('#hfsupplierid').val() == '' || $('#hfsupplierid').val() == undefined) {
                toastr.error('Invalid Supplierdetails');
                return false;
            }
            var totalrow = '';
            let sumofamount = 0;
            $('#paymentdetails tbody tr').each(function(i, e) {
                if ($('.purchaseid', this).val() != undefined && $('.purchaseid', this).val() != '') {
                    if ($('.chbx', this).is(':checked') == true) {
                        totalrow = $('.sno', this).text();
                        sumofamount = parseFloat(sumofamount) + parseFloat($('.payedamount', this).text());
                    }
                }
            })

            if (sumofamount != $('#txtpaidamount').val()) {
                toastr.error('Please match your due Amount and paid Amount')
                return false;
            }
            $('#paymentdetails tbody tr').each(function(i, e) {
                if ($('.purchaseid', this).val() != undefined && $('.purchaseid', this).val() != '') {
                    if ($('.chbx', this).is(':checked') == true) {
                        var sno = $('.sno', this).text();
                        var data = {
                            billno: $('#lblbillpaymentno').text(),
                            billdate: Converdate($('#txtpymentdate').val()),
                            trans_date: Converdate($('.purchasedate', this).text()),
                            trans_no: $('.purchaseorderno', this).text(),
                            typeid: $('#hfsupplierid').val(),
                            paidfrom: $('.paidfrom').val(),
                            referencemode: $('.referncemode').val(),
                            reference: $('#txtreference').val(),
                            paidamount: $('#txtpaidamount').val(),
                            balance: $('.balance', this).text(),
                            payment: $('.payment', this).val(),
                            trans_id: $('.purchaseid', this).val(),
                            payedamount: $('.payedamount', this).text(),
                            _id: $('.hfid', this).val()
                        }
                        $.ajax({
                            url: '/balancepayment/insert',
                            data: JSON.stringify(data),
                            type: 'post',
                            contentType: "application/json;charset=utf-8",
                            dataType: "json",
                            success: function(result) {

                                if (totalrow == sno) {
                                    //    alert('vandhu tholda')
                                    if (result.status == 'success') {
                                    
                                        cleardata()
                                        toastr.success(result.message);
                                        GetBillno()

                                    } else {

                                        toastr.error(result.message);
                                        return false;
                                    }
                                }



                            },
                            error: function(errormessage) {
                                toastr.error(errormessage.responseText);
                                return false;

                            }
                        });
                        // return false;
                    }



                }

            })

            // })

        } else if (result.dismiss === 'cancel') {
            swal.fire(
                'Cancelled',
                'Your file is safe :)',
                'error'
            )
        }
    })
}

function GetBillno() {
    $.ajax({
        type: "GET",
        url: '/balancepayment/billno',
        success: function(data) {
            $('#lblbillpaymentno').text('BP' + data.billno)
        },
        error: function(errormessage) {
            toastr.error(errormessage.responseText);
        }
    })
    return false
}

function cleardata() {
    $('#txtpaidamount').val('0');
    $('#paymentdetails tbody ').empty();
    $('#lblbillpaymentno').text('');
    var currentDate = new Date();
    $("#txtpymentdate").datepicker().datepicker("setDate", currentDate);
    $('#hfsupplierid').val('')
    $('.paidfrom').val('')
    $('.referncemode').val('')
    $('#txtreference').val('')
    $('.transactiondetails').hide()
    $('#txtsupplier').val('');
    $('#txtsupplier').removeAttr('disabled')
    localStorage.clear();
    bidpaymode('.ddlpaymode', '/master/banklistddl');
    typeHeadsupplier()
}

function LoadData() {
    $('#gvbillpayemntlist').dataTable().fnDestroy();
    var table = $('#gvbillpayemntlist');
    
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
        ajax: '/balancepayment/list',
        columns: [
            // { data: 'sno', },
            { data: '_id', responsivePriority: -7 },
            { data: '_id', responsivePriority: -6 },
            { data: '_id', responsivePriority: -5 },
            { data: '_id', responsivePriority: -4 },
            { data: '_id', responsivePriority: -3 },
            { data: '_id', responsivePriority: -2 },

            // { data: 'openingstock', name: 'openingstock' },
            { data: '_id', responsivePriority: -1 },
        ],
        order: [0, "desc"],
        dom: '<"top" f>rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        columnDefs: [
            {
                targets: -1,
                title: 'Action',
                orderable: false,
                render: function(data, type, full, meta) {
                    let notdelete=`
                    <a onclick='btnedit("` + data.billno + `")' type="button" class="btn btn-sm btn-primary btn-icon  btn-icon btn-icon-sm" title="View / Edit">
                      <i class ="la la-edit ic-white"></i>
                    </a>
                          <a onclick= 'btndelete("` + data.suppliername+'/'+data.billno+'/'+data.paidamount + `")' type="button" class="btn btn-sm btn-delete-red btn-icon  btn-icon btn-icon-sm" title="Delete">
                      <i class ="la la-trash ic-white"></i>
                    </a>`;
                    let deletedata=`
                    <a onclick='btndeleted("` + data.billno + `")' type="button" class="btn btn-sm btn-primary btn-icon  btn-icon btn-icon-sm" title="View / Edit">
                      <i class ="fa flaticon-eye"></i>
                    </a>
                         `;
                   
                    let design=data.isdeleted==0?notdelete:deletedata;
                    return design
                },
            },
            {
                targets: -2,
                title: 'Paid Amount',
                orderable: false,
                render: function(data, type, full, meta) {
                    let design=data.isdeleted==0?`<label>`+data.paidamount+`</label>`: `<strike>`+data.paidamount+`</strike>`;
                   
                    return design;
                  
                  
                },
            },
            {
                targets: -3,
           
                orderable: false,
                render: function(data, type, full, meta) {
                    let design=data.isdeleted==0?`<label>`+data.referencemode+`</label>`: `<strike>`+data.referencemode+`</strike>`;
                    return design;
                },
                
            },
            
            {
                targets: -4,
           
                orderable: false,
                render: function(data, type, full, meta) {
                    let design=data.isdeleted==0?`<label>`+data.paymentthrough+`</label>`: `<strike>`+data.paymentthrough+`</strike>`;
                    return design;
                },
                
            },
            {
                targets: -5,
                orderable: false,
                render: function(data, type, full, meta) {
                    let design=data.isdeleted==0?`<label>`+data.suppliername+`</label>`: `<strike>`+data.suppliername+`</strike>`;
                    return design;
                },
                
            },
            {
                targets: -6,
                orderable: false,
                render: function(data, type, full, meta) {
                    let design=data.isdeleted==0?`<label>`+data.billno+`</label>`: `<strike>`+data.billno+`</strike>`;
                    return design;
                },
            },
            {
                targets: -7,
              
                orderable: false,
                render: function(data, type, full, meta) {
                     
                      let design=data.isdeleted==0?`<label>`+data.billdate+`</label>`: `<strike>`+data.billdate+`</strike>`;
                   
                        return design;
                    
                },
                
            },
        ],
    }
    );
    // table.on( 'order.dt search.dt', function () {
    //     t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
    //         cell.innerHTML = i+1;
    //     } );
    // } ).draw();
}

function btnedit(billno) {
    editassignvalue('/balancepayment/edit/' + billno)
}
function assignvalue(data) {
    $('.list').hide();
    $('.entry').show();
    $('#kt_modal_4').modal('hide');
    $('#txtsupplier').val(data[0].Supplier[0].name)
    $('#lblbillpaymentno').text(data[0].billpaymentno);
    $('#txtpymentdate').val(data[0].billpaymentdate);
    $('#hfsupplierid').val(data[0].supplierid);
    $('.paidfrom').val(data[0].paidfrom);
    $('.referncemode').val(data[0].referencemode);
    $('#txtreference').val(data[0].reference);
    $('#txtpaidamount').val(data[0].paidamount);
    $('.transactiondetails').show()
    $('#paymentdetails tbody tr').empty();
    var rowdesign = '';
    let i = 1;
    data.forEach((ele) => {
        let balance = parseFloat(ele.balance) + parseFloat(ele.payedamount);
        rowdesign = `<tr><td><label class="sno">` + i + `</label><td>
        <input type="hidden" class="hfid" value=` + ele._id + `></input>
        <input class="chbx" onchange="CheckboxEvent(this)"  type="checkbox" checked>
        <input type="hidden" class="purchaseid" value=` + ele.purchase_id + `></td>
        <td><label class="purchasedate">` + ele.purchasedate + `</label></td>
        <td><label class="purchaseorderno">` + ele.purchaseno + `</label></td>
        <td><input type="hidden" class="hfpayedamount" value=` + ele.payedamount + ` + ><label class="payedamount">` + ele.payedamount + `<label></td>
        <td><span><i class="la la-rupee"></i><span>
        <input type="hidden" class="hfbalance" value=` + balance + ` +></input><label class="balance">` + ele.balance + `<label></td>`;
        $('#paymentdetails tbody').append(rowdesign);
        i++;
    })
    $('#txtsupplier').attr('disabled', 'disabled')


}
function btndelete(data) {
    let data2 = data.split("/");
    $('#kt_modal_4').modal('show');
    $('#hf_billno').val(data2[1])
    $('#lblsuppliertext').text(data2[0]);
    $('#lblbillno').text(data2[1]);
    $('#lblpaidamount').text(data2[2]);
}
function btndeleted(billno)
{
    $.ajax({
        url: ' /balancepayment/findcancelperson/'+billno,
        dataType: "json",
        type: "get",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
           
            $('#previewdetails').modal('show');
            $('#txt_previewname').val(data[data.length-1].name);
            $('#txt_previewdate').val(data[data.length-1].date);
            $('#txt_previewnote').val(data[data.length-1].note);
            $('#txt_preview_supplier').val(data[0].Supplier[0].name)
            $('#lbl_preview_billpaymentno').text(data[0].billpaymentno);
            $('#txt_preview_pymentdate').val(data[0].billpaymentdate);
            bankidpaymode($('.ddl_preview_paymode'),'/master/banklistddl',data[0].paidfrom)
            $('.preview_referncemode').val(data[0].referencemode);
            $('#txt_preview_reference').val(data[0].reference);
            $('#txt_preview_paidamount').val(data[0].paidamount);
            $('.transactiondetails').show()
            $('#preview_paymentdetails tbody tr').empty();
            var rowdesign = '';
            let i = 1;
            data.forEach((ele) => {
                if(ele.purchaseno)
                {
                    let balance = parseFloat(ele.balance) + parseFloat(ele.payedamount);
                    rowdesign = `<tr><td><label class="sno">` + i + `</label><td>
                    <input type="hidden" class="hfid" value=` + ele._id + `></input>
                    <input class="chbx" disabled="disabled"  type="checkbox" checked>
                    <input type="hidden" class="purchaseid" value=` + ele.purchase_id + `></td>
                    <td><label class="purchasedate">` + ele.purchasedate + `</label></td>
                    <td><label class="purchaseorderno">` + ele.purchaseno + `</label></td>
                    <td><input type="hidden" class="hfpayedamount" value=` + ele.payedamount + ` + ><label class="payedamount">` + ele.payedamount + `<label></td>
                    <td><span><i class="la la-rupee"></i><span>
                    <input type="hidden" class="hfbalance" value=` + balance + ` +></input><label class="balance">` + ele.balance + `<label></td>`;
                    $('#preview_paymentdetails tbody').append(rowdesign);
                    i++;
                }
               
            })
          
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
function savenote()
{
       if($('#txtnote').val()!='')
        {
            data={
                billno:$('#hf_billno').val(),
                note:$('#txtnote').val()
            }
            $.ajax({
                url: '/balancepayment/delete/',
                data: JSON.stringify(data),
                type: 'post',
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (result) {
                    if (result.status == 'success') {
                        toastr.success(result.message);
                        LoadData();
                        $('#txtnote').val('');
                        $('#hf_billno').val('');
                        $('#kt_modal_4').modal('hide');
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
           
        }
        else
        {
            toastr.error('Invalid Note Unable To Delete')
        }
}