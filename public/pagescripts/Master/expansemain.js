$(document).ready(function() {
    var curdate = new Date();
    var year = curdate.getFullYear();
    var month = curdate.getMonth();
    var firstDay = new Date(year, month, 1);

    firstaddrow();
    LoadData();

    validationexpanse();
    validationexpansemaster();
    bidpaymode('.ddlpaymode', '/master/banklistddl');
    $('.entry').hide();

    var cuDate = new Date();
    $(".kt_datepicker_1").datepicker("setDate", cuDate);
    LoadData();
})
var expansearr = [];
var paymode = [];
var sno = 1;

function showlist() {
    clearcontrol();
    if ($('.btnaddnew').html() == 'Add New') {
        $('.list').hide();
        $('.entry').show();
        $('.btnaddnew').html('Go Back');
    } else {
        $('.entry').hide();
        $('.list').show();
        $('.btnaddnew').html('Add New');
    }
}

function clearcontrol() {
    sno = 1;
    $('#hf_id').val('');
    var cuDate = new Date();
    $(".kt_datepicker_1").datepicker("setDate", cuDate);
    // $('.ddlpaymode').html('');
    $('.ddlrefrensemode').val('cash');
    $('.txtrefrensedesc').val('');
    $('.txtdescription').val('');
    $('.lbltotalamt').html(0.00);
    $("#gvdetail .tblbody tr").remove();
    firstaddrow();

}

function btnedit(_id) {

    editassignvalue('/master/expensemain/' + _id)

}

function assignvalue(data) {
   
    $('#hf_id').val(data[0]._id);
    $('.txtentrydate').val(data[0].entrydate);
    $('.ddlpaymode').val(data[0].paymode);
    $('.ddlrefrensemode').val(data[0].refrensemode);
    $('.txtrefrensedesc').val(data[0].refrensedesc);
    $('.txtdescription').val(data[0].description);
    $('.lbltotalamt').html(data[0].totalamt);
    $("#gvdetail .tblbody tr").remove();
    
    data[0].expensedetail.map(function(val) {
        var defaultrow = `
      <tr class="form-group">  
      <td>
         <div class="typehead">
            <input  value="` + val.expanse[0].expansename + `" class="form-control txtexpanse dark-border bg-white" onblur="getxpensedetails(this)"    onkeypress="getxpensedetails(this)"  type="text" dir="ltr" >
            <input id="hfexpanseid" value="` + val.expanse[0]._id + `"  type="hidden" >
            <input id="hfdetailsid" value="` + val._id + `"  type="hidden" >
            <input id="sno" value="` + sno + `"  type="hidden" >
         </div>     
      </td>
      <td>
          <input type="text" value="` + val.expensedesc + `" name="expansedesc" class="txtexpansedesc form-control ">
      </td>
      <td>
          <input type="text" value="` + val.amount + `" name="amount" 
          style="background-color: lightgrey !important;" 
          onblur="addrow(this)" class="txtamount form-control ">
      </td>
      <td>
      <a onClick="removerow(this)" class ="btn btn-sm btn-clean btn-icon btn-icon-md" title="delete">
         <i class ="la la-trash"></i>
      </a>       
      </td>
   </tr>`;

        $('.tblbody').append(defaultrow);
        sno = sno + 1;
    });
    // var countd = 0;

    // var exp = [];
    // data[0].expensedetail.map(function(val) {
    //     exp = data[countd].expanse;
        
       
    //     countd = countd + 1
    //         // var rowCount = $('#gvdetail tbody tr').length;     
    //         // var row = $("#gvdetail tbody").find('tr:gt(' + (rowCount - 2) + ')');
    //         // getexpanse('.txtexpanse', row, '2ndrow');
    // });
    getexpanse('.txtexpanse', '', '1strow');
    $('.list').hide();
    $('.entry').show();
    $('.btnaddnew').html('Go Back');
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
var validationexpanse = function() {

    $("#kt_form_3").validate({
        // define validation rules
        rules: {
            entrydate: {
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
                    try {
                        var data = new FormData();
                        var file = $("#uploadfile")[0].files[0];

                        var detail = [];

                        $('#gvdetail tbody tr').each(function(index, ele) {


                            if ($('#hfexpanseid', this).val() != '') {

                                var expansedetails = {
                                    expanseid: $('#hfexpanseid', this).val(),
                                    expesename: $('.txtexpanse', this).val(),
                                    expensedesc: $('.txtexpansedesc', this).val(),
                                    amount: $('.txtamount', this).val(),
                                    // _id: $('#hfdetailsid', this).val(),
                                }
                                detail.push(expansedetails);

                            }
                            if (detail == '') {
                                throw new Error('Enter valid expense')
                            }
                        })
                        data.append("id", $('#hf_id').val());
                        data.append("entrydate", Converdate($('.txtentrydate').val()));
                        data.append("entrydatenormal", $('.txtentrydate').val());
                        data.append("paymode", $('.ddlpaymode').val());
                        data.append("refrensemode", $('.ddlrefrensemode').val());
                        data.append("refrensedesc", $('.txtrefrensedesc').val());
                        data.append("description", $('.txtdescription').val());
                        data.append("totalamt", $('.lbltotalamt').html());
                        data.append("uploadfile", file);
                        data.append("expansedetail", JSON.stringify(detail));

                        $.ajax({
                            type: 'post',
                            url: '/master/expensemain',
                            data: data,
                            contentType: false,
                            processData: false,
                            success: function(result) {
                                if (result.status == 'success') {
                                    toastr.success(result.message);
                                    LoadData();
                                    clearcontrol();
                                    showlist();
                                } else {
                                    if (result.Message == '' || result.Message == null) {
                                        toastr.error('Something Went wrong');
                                    } else {
                                        toastr.error(result.Message);
                                    }
                                }
                            },
                            error: function(errormessage) {
                                toastr.error(errormessage.responseText);
                            }
                        });
                    } catch (err) {
                        toastr.error(err)
                    }
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

function addrow(ctrl) {

    var currentrow = $(ctrl).closest('tr').find('#sno').val();
    var lastrow = $('#gvdetail tr').length;
    //  alert('curretrow = ' + currentrow+ ' last row = '+lastrow + ' '+sno)

    if (lastrow == currentrow) {

        if ($(ctrl).closest('tr').find('#hfexpanseid').val() != '') {
            sno = sno + 1

            CalTotal();
            var defaultrow = `
            <tr class="form-group">  
            <td>
               <div class="typehead">
                  <input class="form-control txtexpanse dark-border bg-white" onkeypress="getxpensedetails(this)"  type="text" dir="ltr" >
                  <input id="hfexpanseid"  type="hidden" >
                  <input id="hfdetailsid"  type="hidden" >
                  <input id="sno" value="` + sno + `"  type="hidden" >
               </div>     
            </td>
            <td>
               <input type="text" name="expansedesc" class="txtexpansedesc form-control ">
            </td>
            <td>
               <input type="text" name="amount" value="0.00" onblur="addrow(this)"   
               style="background-color: lightgrey !important;" 
               class="txtamount  form-control ">
               <input class="hfrow" value="1"  type="hidden" >
            </td>
            <td>
            <a onClick="removerow(this)" class ="btn btn-sm btn-clean btn-icon btn-icon-md" title="delete">
               <i class ="la la-trash"></i>
            </a>       
            </td>
            </tr>`;
            $('.tblbody').append(defaultrow)

            var rowCount = $('#gvdetail tbody tr').length;
            let c = parseInt(rowCount - 1)
            var row = $("#gvdetail tbody").find('tr:gt(' + (rowCount - 2) + ')');
            // var row1 = $("#gvdetail tbody").find('tr:gt(' + (rowCount - 1) + ')');

            getexpanse('.txtexpanse', row, '2ndrow');

            // $(row1).find('.hfrow').val("");
            // $(row).find('.hfrow').addClass("1");
            $(row).find('.txtexpanse').focus();
            // $('#gvdetail tr:last .txtamount').blur(function(){
            //    if ($('#gvdetail tbody tr').find('.hfrow')=='1') {
            //       alert()
            //    addrow();
            //    }

            // })

        } else {
            toastr.error('please add valid expense');
        }

    }
}

function removerow(ctrl) {
    var rowCount = $('#gvdetail tr').length;
    if (rowCount > 2) {
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
            console.log(dismiss.dismiss)
            if (dismiss.dismiss == 'cancel') {
                swal.fire(
                    'Cancelled',
                    'Your file is safe :)',
                    'error'
                )
            } else {
                $(ctrl).closest('tr').remove();
            }
        })

    } else {
        swal.fire(
            'Sorry',
            'You cannot delete this row !',
            'warning'
        )
    }
}



function getexpanse(id, row, type) {

    $.ajax({
        url: '/master/expanseddl',
        dataType: "json",
        type: "get",
        success: function(data) {
            expansearr = data;
            expenseTypeheadMethod(id, row, type);
        },
        error: function(response) {
            var parsed = JSON.parse(response.responseText);
            Error_Msg(parsed.Message);
            d.resolve();
        },
        failure: function(response) {
            var parsed = JSON.parse(response.responseText);
            Error_Msg(parsed.Message);
            d.resolve();
        }
    });

}

function expenseTypeheadMethod(id, row, type) {
    if (type == '1strow') {
        var bestPictures = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            // prefetch: moviedetails
            local: expansearr
        });
        $(id).typeahead(null, {
            name: 'best-pictures',
            display: 'name',
            source: bestPictures,
            templates: {
                empty: [
                    `<button type="button" onclick="showexpense(this)" class="btn btn-sm btn-secondary"><i class="fa fa-plus-circle"> Add Product</i></button>`
                ].join('\n'),
                suggestion: Handlebars.compile('<div><strong>{{name}}</strong></div>')
            },

        });
    } else {
        var bestPictures = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            // prefetch: moviedetails
            local: expansearr
        });
        $(row).find(id).typeahead(null, {
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

}

function getxpensedetails(ctrl) {
    // let expensedetail = expansearr.filter(element => element.name == $(ctrl).val())
    // if (expensedetail.length == 0 || expensedetail.length == undefined || expensedetail.length == '') {
    //    // toastr.error('product Details  not availble')
    // }
    // else if (expensedetail.length == 1) {

    // } else {
    //      toastr.error('Duplicate Expanse Invalid to Process')
    //  }
    console.log(ctrl)
    $(ctrl).closest('tr').find('.txtexpanse').bind('typeahead:select', function(ev, suggestion) {

        // $(ctrl).closest('tr').find('.txtamount').focus();
        $(ctrl).closest('tr').find('#hfexpanseid').val(suggestion.id);
        //  alert($(ctrl).closest('tr').find('#hfexpanseid').val());
    });
}

function CalTotal() {
    let total = 0;
    $('#gvdetail .tblbody tr').each(function(i, ele) {

        if ($('#hfexpanseid', this).val() != '') {
            total = parseFloat(total) + parseFloat($('.txtamount', this).val());
        }
    });
    $('.lbltotalamt').text(parseFloat(total).toFixed(2));
}


function LoadData() {
    try {
        if ( Convertfdate($('#txtfdate').val()) > Converttdate($('#txttdate').val()) ) {
            throw new Error('From Date Should Be less than TO date');
        }else if (Converttdate($('#txttdate').val()) < Convertfdate($('#txtfdate').val())) {
            throw new Error('From Date Should Be Greater than TO date');
        }
        var fillterdata = {
            fdate: Convertfdate($('#txtfdate').val()),
            tdate: Converttdate($('#txttdate').val()),
        }
    
    
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
                url: '/master/expensemainlist',
                data: fillterdata,
                type: "POST",
                datatype: "json",
            },
            columns: [
                //{ data: 'sno', },
                //   { data: 'profilepic' },
                { data: 'entrydate', name: 'entrydate' },
                { data: 'bankdetail' },
                { data: 'refrensemode', name: 'refrensemode' },
                { data: 'refrensedesc', name: 'refrensedesc' },
                { data: 'totalamt', name: 'totalamt' },
                { data: '_id', responsivePriority: -1 },
            ],
            order: [0, "desc"],
            dom: '<"top">rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
            columnDefs: [{
                    targets: -1,
                    title: 'Action',
                    orderable: false,
                    render: function(data, type, full, meta) {
    
                        return `
                           <a onclick='btnedit("` + data + `")' type="button" class="btn btn-sm btn-primary btn-icon  btn-icon btn-icon-sm" title="View / Edit">
                             <i class ="la la-edit"></i>
                           </a>
                                 <a onclick= 'btndeleted("` + data + `")' class="btn btn-sm btn-delete-red btn-icon  btn-icon btn-icon-sm" title="Delete">
                             <i class ="la la-trash"></i>
                           </a>`;
                    },
                },
                {
                    targets: -5,
                    title: 'Payment Through',
                    orderable: false,
                    render: function(data, type, full, meta) {
                        return data.bankname;
                    },
                }
            ],
        });
    } catch (error) {
        toastr.error(error)
    }
    
   

}

function btndeleted(id) {
    deleterecord('/master/expensemain/' + id);
}

function afterdelete() {
    LoadData();
}