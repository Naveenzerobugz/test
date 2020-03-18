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
    typeHeadcustomer()
    $('.transactiondetails').hide()
    $('.referncemode').val('Cash');

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
                $(element).val('5e4e20b8369a043bcc48e9eb');
            }

        })

    } else {

    }
}

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
                `<button type="button" class="btn btn-sm btn-secondary"><i class="fa fa-plus-circle"> Add Supplier</i></button>`
            ].join('\n'),
            suggestion: Handlebars.compile('<div><strong>{{name}}</strong></div>'),
        },
    });
}

$('#txtcustomer').bind('typeahead:select', function(ev, suggestion) {

    customerPendingdetails(suggestion.id);
    $('#hfcustomerid').val(suggestion.id);

});

function customerPendingdetails(id) {
    $('#hfcustomerid').val(id);
    $('.transactiondetails').show()
    $.ajax({
        type: "GET",
        url: '/receipt/customerbalance/' + id,
        success: function(data) {

            var row = '';
            let i = 1;
            $('#paymentdetails tbody').empty();
            data.forEach(ele => {
                if (ele.balance > 0) {
                    row = `<tr><td><label class="sno">` + i + `</label><td>
                    <input class="chbx" onchange="CheckboxEvent(this)" type="checkbox"><input type="hidden" class="sale_id" value=` + ele._id + `></td>
                    <td><label class="invoicedate">` + ele.invoicedate + `</label></td>
                    <td><label class="invoiceno">` + ele.invoiceno + `</label></td>
                    <td><label class="payedamount"><label></td>
                    <td><span><i class="la la-rupee"></i><span>
                    <input type="hidden" class="hfbalance" value=` + ele.balance + `></input>
                    <label class="balance">` + ele.balance + `<label></td>`;
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
            if ($('.sale_id', this).val() != undefined && $('.sale_id', this).val() != '') {
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

                $(ctrl).closest("tr").find(".balance").text(parseFloat($(ctrl).closest("tr").find(".hfpayedamount").val()) + parseFloat($(ctrl).closest("tr").find(".hfbalance").val()));
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

            if ($('#hfcustomerid').val() == '' || $('#hfcustomerid').val() == undefined) {
                toastr.error('Invalid Supplierdetails');
                return false;
            }
            var totalrow = '';
            let sumofamount = 0;
            $('#paymentdetails tbody tr').each(function(i, e) {
                if ($('.sale_id', this).val() != undefined && $('.sale_id', this).val() != '') {
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
                if ($('.sale_id', this).val() != undefined && $('.sale_id', this).val() != '') {
                    if ($('.chbx', this).is(':checked') == true) {
                        var sno = $('.sno', this).text();
                        var data = {
                            billno: $('#lblreceiptno').text(),
                            billdate: Converdate($('#txtreceiptdate').val()),
                            typeid: $('#hfcustomerid').val(),
                            paidfrom: $('.paidfrom').val(),
                            referencemode: $('.referncemode').val(),
                            reference: $('#txtreference').val(),
                            paidamount: $('#txtpaidamount').val(),
                            trans_no: $('.invoiceno', this).text(),
                            trans_date: Converdate($('.invoicedate', this).text()),
                            trans_id: $('.sale_id', this).val(),
                            balance: $('.balance', this).text(),
                            payedamount: $('.payedamount', this).text(),
                            _id: $('.hfid', this).val()
                        }
                        $.ajax({
                            url: '/receipt/insertupdate',
                            data: JSON.stringify(data),
                            type: 'post',
                            contentType: "application/json;charset=utf-8",
                            dataType: "json",
                            success: function(result) {

                                if (totalrow == sno) {
                                    //    alert('vandhu tholda')
                                    if (result.status == 'success') {
                                        $('#txtpaidamount').removeAttr("disabled");
                                        cleardata()
                                        toastr.success(result.message);

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
        url: '/receipt/receiptno',
        success: function(data) {
            $('#lblreceiptno').text('RE' + data.billno)
        },
        error: function(errormessage) {
            toastr.error(errormessage.responseText);
        }
    })
    return false
}

function cleardata() {


    GetBillno();

    $('#paymentdetails tbody ').empty();

    var currentDate = new Date();
    $("#txtreceiptdate").datepicker().datepicker("setDate", currentDate);
    $('#txtcustomer').val('');
    $('#hfcustomerid').val('')
    $('.paidfrom').val('')
    $('.referncemode').val('Cash')
    $('#txtreference').val('')
    $('#txtpaidamount').val('')
    $('.transactiondetails').hide()
    $('#txtcustomer').removeAttr('disabled')
    localStorage.clear();
    bidpaymode('.ddlpaymode', '/master/banklistddl');
    typeHeadcustomer()

}

function LoadData() {
    $('#gvreceiptlist').dataTable().fnDestroy();
    var table = $('#gvreceiptlist');
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
        ajax: '/receipt/list',
        columns: [
            // { data: 'sno', },
            { data: 'receiptdate', name: 'receiptdate' },
            { data: 'receiptno', name: 'receiptno' },
            { data: 'customername', name: 'customername' },
            { data: 'method', name: 'method' },
            { data: 'referencemode', name: 'referencemode' },
            { data: 'paidamount', name: 'paidamount' },
            // { data: 'openingstock', name: 'openingstock' },
            { data: 'receiptno', responsivePriority: -1 },
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
                          <i class ="la la-edit ic-white"></i>
                        </a>
                              <a onclick= 'btndelete("` + data + `")' type="button" class="btn btn-sm btn-delete-red btn-icon  btn-icon btn-icon-sm" title="Delete">
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

function btnedit(receiptno) {
    editassignvalue('/receipt/edit/' + receiptno)
}

function assignvalue(data) {
    $('.list').hide();
    $('.entry').show();
    $('#lblreceiptno').text(data[0].receiptno);
    $('#txtcustomer').val(data[0].customers[0].name)
    $('#txtreceiptdate').val(data[0].receiptdate);
    $('#hfcustomerid').val(data[0].customerid);
    $('.paidfrom').val(data[0].paidfrom);
    $('.referncemode').val(data[0].referencemode);
    $('#txtreference').val(data[0].reference);
    $('#txtpaidamount').val(data[0].paidamount);
    $('.transactiondetails').show()
    $('#paymentdetails tbody tr').empty();
    var rowdesign = '';
    let i = 1;
    data.forEach((ele) => {

            rowdesign = `<tr><td><label class="sno">` + i + `</label><td>
        <input type="hidden" class="hfid" value=` + ele._id + `></input>
        <input class="chbx" onchange="CheckboxEvent(this)" type="checkbox" checked>
        <input type="hidden" class="sale_id" value=` + ele.sale_id + `></td>
        <td><label class="invoicedate">` + ele.invoicedate + `</label></td>
        <td><label class="invoiceno">` + ele.invoiceno + `</label></td>
        <td> <input type="hidden" class="hfpayedamount" value=` + ele.payedamount + ` +></input><label class="payedamount">` + ele.payedamount + `<label></td>
        <td><span><i class="la la-rupee"></i><span>  <input type="hidden" class="hfbalance" value=` + ele.balance + ` +></input><label class="balance">` + ele.balance + `<label></td>`;
            $('#paymentdetails tbody').append(rowdesign);
            i++;
        })
        // $('#txtcustomer').attr('disabled', 'disabled')
        // $('#txtpaidamount').attr('disabled', 'disabled')


}

function btndelete(receiptno) {
    deletedata('/receipt/delete/' + receiptno)
}

function afterdelete() {
    LoadData();
}