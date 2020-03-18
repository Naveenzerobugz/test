$(document).ready(function () {
    localStorage.clear();
    getsalesreturnno();
    typeHeadcustomer();
    BindddlData('#ddlcompanystate', '/master/state');
    BindddlData('#ddlsalesrep', '/master/employeeddl');
    $('.supplierdetails').hide();
    Addthead();
   // Cal_Duedate()
    LoadData()
    Close();
    SalesNo();
    
})

function Cal_Duedate()
{
    if($('#ddlduedays').val() !='Custom')
    {
        var currentDate = new Date();
        $("#txtduedate").datepicker().datepicker("setDate",addDays(currentDate,$('#ddlduedays').val()));
    }
    else
    {
        var currentDate = new Date();
        $("#txtduedate").val('');
        
    }
    $("#txtinvoicedate").datepicker().datepicker("setDate",currentDate);
   
}
function addDays(theDate, days) {
    return new Date(theDate.getTime() + days*24*60*60*1000);
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
            case 'Product':
                row = row + `<td class="td-nopad" style="width:400px">
                <div class="typeahead">
                 <input class="form-control ddl disabled="disabled"" id="ddlproduct type="text" dir="ltr" onblur="getproductdetails(this)"  placeholder="Enter Productname">
                </div>
                <input type="hidden" class="hfinvoicedetail_id"></input>
                </td>`;
                break
            case 'Sale Qty':
                    row = row + '<td class="td-nopad"><input type="text" disabled="disabled" class=" form-control  form-control saleqty">  ';
                    break
            case 'HSN/SAC':
                row = row + '<td class="td-nopad"><input type="text" disabled="disabled" class="form-control  form-control hsc">  ';
                break
            // case 'AvailableQty':
            //     row = row + '<td><input disabled="disabled" type="text" class="availableqty form-control form-control"></input><input type="hidden" class="hfdetailsysid"></input><input class="productid" type="hidden"></input></td>';
            //     break
            case 'Qty':
                row = row + '<td><input onblur="Cal_Amount()" type="text" class="numerickey qty form-control form-control"></input><input type="hidden" class="hfdetailsysid"></input><input class="productid" type="hidden"></input></td>';
                break
            case 'UNIT':
                row = row + '<td  class="td-nopad" style="width:20px"><select class="form-control form-control ddlunit"><option>Nos</option><option>box</option></select></td>';
                break
            case 'Rate':
                row = row + '<td class="td-nopad"><input type="text" disabled="disabled" class="rate form-control form-control rate"></td>';
                break
            case 'DISCOUNT%Rs':
                row = row + '<td class="td-nopad"><input type="text"  onblur="Cal_Amount()" value="0" class="form-control discountvalue form-control"></td>';
                break
            case 'Amountinclusiveexclusive':
                row = row + '<td class="td-nopad" ><input type="text"   value="0" class="amount form-control form-control"></td>';
                break
            default:
                row = row + '<td></td>';
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
}
function Addthead() {
    var amount=`Amount<select class="form-control kt-selectpicker taxtype" tabindex="-98" aria-label="Small" aria-describedby="inputGroup-sizing-sm" onchange="Cal_Amount()"><option value="inclusive">inclusive</option><option value="exclusive">exclusive</option></select>`;
    var hsn = ($("#chhsn").is(":checked") ? 1 : 0) ? `<th>HSN/SAC</th>` : '';
    var unit = ($("#chunit").is(":checked") ? true : false) ? `<th>UNIT</th>` : '';
    var discount = ($("#chdiscount").is(":checked") ? true : false) ? `<th>DISCOUNT<select id="ddldiscount" class="discount"  ><option value="percentage">%<option><option  value="rupee">Rs<option></select></th>` : '';
    var settings = `<a class="nav-link dropdown-toggle" data-toggle="modal" data-target="#kt_modal_4"><i class="flaticon2-gear"></i></i></a>`
    var head = "<th>S.No</th><th>Product</th><th>Sale Qty</th>" + hsn + "<th>Qty</th>" + unit + "<th>Rate</th>" + discount + "<th>"+amount+"</th><th>" + settings + "</th>"; // add resources
    $("#detailsTable thead tr").append(head);
    Rowappend();
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
    }
    else if (productdetails.length == 1) {
        $(ctrl).closest('tr').find('.qty').focus();
        $(ctrl).closest('tr').find('.availableqty').val(productdetails[0].availbleqty);
        $(ctrl).closest('tr').find('.qty').val(1);
        $(ctrl).closest('tr').find('.rate').val(productdetails[0].salesprice);
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
            }
        }
    }
    else {
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
            }
            else {
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
var Gstdetail = [];
function Cal_Amount()
{
    Gstdetail = [];
    var discount,taxtype='';
    var taxdesign5gst='',taxdesign12gst='',taxdesign18gst='',taxdesign28gst='';
    var taxamount5gst=0,taxamount12gst=0,taxamount18gst=0,taxamount28gst=0,taxtotalamount=0,total=0;

    $('.gstdetails').empty();
    $("table.table-bordered thead tr th ").each(function () {
        switch ($(this).text()) {
        case 'DISCOUNT%Rs':
            discount= $('.discount').val();
            break
        case 'Amountinclusiveexclusive':
            taxtype=$('.taxtype').val();   
            break       
        }
    })
       $('#detailsTable tbody tr').each(function (i, ele) {
       
        if($('.productid', this).val() !='')
        {
            if(parseInt($('.saleqty',this).val()) >= parseInt( $('.qty',this).val()))
            {
                if(discount != undefined)
                {
                  
                    if(discount=='percentage')
                    {
                        if($('.discountvalue',this).val()<=100)
                        {
                            if($('.rate',this).val() !='' && $('.qty',this).val() !='')
                            {
                                
                                $('.amount',this).val(parseFloat($('.rate',this).val()) *parseFloat($('.qty',this).val()))
                                $('.amount',this).val(parseFloat($('.amount',this).val())-(($('.discountvalue',this).val()/100)* $('.amount',this).val()))
                            }
                        }
                        else
                        {
                            $('.discountvalue',this).val('0')
                            toastr.error('discount percentage should be less or equal than 100')
                            return false;
                        }
                        
                    }
                    else
                    {
                        $('.amount',this).val(parseFloat($('.rate',this).val()) *parseFloat($('.qty',this).val()))
                        $('.amount',this).val(parseFloat($('.amount',this).val())-(parseFloat($('.discountvalue',this).val())))
                    }
                }
                else
                {
                    if($('.rate',this).val() !='' && $('.qty',this).val() !='')
                    {
                        
                       $('.amount',this).val(parseFloat($('.rate',this).val()) *parseFloat($('.qty',this).val()))
                      
                    }
                }
            }
            else
            {
                toastr.error('invalid qty unable to process');
                return false;
            }
        //tax design
        var taxdetail= productnameArray.filter(ele=>ele.id==$('.productid',this).val());
        let amount;
    
        taxdetail[0].tax.forEach(element=>{
            if(taxtype=='inclusive')
            {
                switch(element.taxname)
                {
                    case "GST 18%":
                        taxdesign18gst='';
                        taxamount18gst=taxamount18gst+parseFloat($('.amount',this).val())  * parseFloat(element.sgst+element.cgst) / (100+parseFloat(element.sgst+element.cgst));
                      //  taxamount18gst=taxamount;
                        amount=taxamount18gst/2;
                        taxdesign18gst=`</br><label>SGST `+element.sgst+` % :</label><label style="margin-left:10px"> `+parseFloat(amount).toFixed(2)+`</label>`
                        taxdesign18gst=taxdesign18gst+`</br><label>CGST `+element.cgst+` % :</label><label style="margin-left:10px"> `+parseFloat(amount).toFixed(2) +`</label>` 
                    break
                    case "GST 28%":
                        taxdesign28gst='';
                          taxamount28gst=taxamount28gst+parseFloat($('.amount',this).val())  * parseFloat(element.sgst+element.cgst) / (100+parseFloat(element.sgst+element.cgst));
                       // taxamount28gst=taxamount;
                        amount=taxamount28gst/2;
                        taxdesign28gst=`</br><label>SGST `+element.sgst+` % :</label><label style="margin-left:10px"> `+parseFloat(amount).toFixed(2)+`</label>`
                        taxdesign28gst=taxdesign28gst+`</br><label>CGST `+element.cgst+` % :</label><label style="margin-left:10px"> `+parseFloat(amount).toFixed(2) +`</label>` 
                    break
                    case "GST 5%":
                        taxdesign5gst='';
                          taxamount5gst=taxamount5gst+parseFloat($('.amount',this).val())  * parseFloat(element.sgst+element.cgst) / (100+parseFloat(element.sgst+element.cgst));
                       // taxamount5gst=taxamount;
                        amount=taxamount5gst/2;
                        taxdesign5gst=`</br><label>SGST `+element.sgst+` % :</label><label style="margin-left:10px"> `+parseFloat(amount).toFixed(2)+`</label>`
                        taxdesign5gst=taxdesign5gst+`</br><label>CGST `+element.cgst+` % :</label><label style="margin-left:10px"> `+parseFloat(amount).toFixed(2) +`</label>` 
                    break
                    case "GST 12%":
                        taxdesign12gst='';
                          taxamount12gst=taxamount12gst+parseFloat($('.amount',this).val())  * parseFloat(element.sgst+element.cgst) / (100+parseFloat(element.sgst+element.cgst));
                       // taxamount12gst=taxamount12gst;
                        amount=taxamount12gst/2;
                        taxdesign12gst=`</br><label>SGST `+element.sgst+` % :</label><label style="margin-left:10px"> `+parseFloat(amount).toFixed(2)+`</label>`
                        taxdesign12gst=taxdesign12gst+`</br><label>CGST `+element.cgst+` % :</label><label style="margin-left:10px"> `+parseFloat(amount).toFixed(2) +`</label>` 
                    break
                }
            }
            else
            {
                switch(element.taxname)
                {
                    case "GST 18%":
                        taxdesign18gst='';
                        taxamount18gst=taxamount18gst+(parseFloat($('.amount',this).val())  * parseFloat(element.sgst+element.cgst)/100);
                      //  taxamount18gst=taxamount;
                        amount=taxamount18gst/2;
                        taxdesign18gst=`</br><label>SGST `+element.sgst+` % :</label><label style="margin-left:10px"> `+parseFloat(amount).toFixed(2)+`</label>`
                        taxdesign18gst=taxdesign18gst+`</br><label>CGST `+element.cgst+` % :</label><label style="margin-left:10px"> `+parseFloat(amount).toFixed(2) +`</label>` 
                    break
                    case "GST 28%":
                        taxdesign28gst='';
                          taxamount28gst=taxamount28gst+(parseFloat($('.amount',this).val())  * parseFloat(element.sgst+element.cgst)/100);
                       // taxamount28gst=taxamount;
                        amount=taxamount28gst/2;
                        taxdesign28gst=`</br><label>SGST `+element.sgst+` % :</label><label style="margin-left:10px"> `+parseFloat(amount).toFixed(2)+`</label>`
                        taxdesign28gst=taxdesign28gst+`</br><label>CGST `+element.cgst+` % :</label><label style="margin-left:10px"> `+parseFloat(amount).toFixed(2) +`</label>` 
                    break
                    case "GST 5%":
                        taxdesign5gst='';
                          taxamount5gst=taxamount5gst+(parseFloat($('.amount',this).val())  * parseFloat(element.sgst+element.cgst)/100);
                       // taxamount5gst=taxamount;
                        amount=taxamount5gst/2;
                        taxdesign5gst=`</br><label>SGST `+element.sgst+` % :</label><label style="margin-left:10px"> `+parseFloat(amount).toFixed(2)+`</label>`
                        taxdesign5gst=taxdesign5gst+`</br><label>CGST `+element.cgst+` % :</label><label style="margin-left:10px"> `+parseFloat(amount).toFixed(2) +`</label>` 
                    break
                    case "GST 12%":
                        taxdesign12gst='';
                          taxamount12gst=taxamount12gst+(parseFloat($('.amount',this).val())  * parseFloat(element.sgst+element.cgst)/100);
                       // taxamount12gst=taxamount12gst;
                        amount=taxamount12gst/2;
                        taxdesign12gst=`</br><label>SGST `+element.sgst+` % :</label><label style="margin-left:10px"> `+parseFloat(amount).toFixed(2)+`</label>`
                        taxdesign12gst=taxdesign12gst+`</br><label>CGST `+element.cgst+` % :</label><label style="margin-left:10px"> `+parseFloat(amount).toFixed(2) +`</label>` 
                    break
                }
               
            }
              
               
        })
        total=parseFloat(total) + parseFloat($('.amount', this).val());
        }
    })
  
    $('.gstdetails').append(taxdesign5gst+taxdesign12gst+taxdesign18gst+taxdesign28gst);
    if (taxamount18gst != '' && taxamount18gst != 0) {


        let gst18 = '';

        gst18 = {
            name:  'gst18',
            percentage: '9',
            sgst:parseFloat(taxamount18gst / 2).toFixed(2),
            cgst:parseFloat(taxamount18gst / 2).toFixed(2)
            // name: 'gst18',
            // 'sgst 9%': parseFloat(taxamount18gst / 2).toFixed(2),
            // 'cgst 9%': parseFloat(taxamount18gst / 2).toFixed(2)
        }



        Gstdetail.push(gst18)

    }
    if (taxamount5gst != '' && taxamount5gst != 0) {
        let gst5 = '';

        gst5 = {    
            name:  'gst5',
            percentage: '2.5',
            sgst:parseFloat(taxamount5gst / 2).toFixed(2),
            cgst:parseFloat(taxamount5gst / 2).toFixed(2)
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
            name:  'gst28',
            percentage: '14',
            sgst:parseFloat(taxamount28gst / 2).toFixed(2),
            cgst:parseFloat(taxamount28gst / 2).toFixed(2)
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
            sgst:parseFloat(taxamount12gst / 2).toFixed(2),
            cgst:parseFloat(taxamount12gst / 2).toFixed(2)

            
        }



        Gstdetail.push(gst12)

    }

    $('#subtotal').text(parseFloat(total).toFixed(2));
    if(taxtype=='inclusive')
    {
        $('#txttotal').text(parseFloat(total).toFixed(2))
    }
    else
    {
        let sum=total+taxamount5gst+taxamount12gst+taxamount18gst+taxamount28gst;
        $('#txttotal').text(parseFloat(sum).toFixed(2));
    }
   

}
// let OldinvoiceDetail=[];
function save_process()
{
    // let invoiceDetail=[];
    let invoiceReturnDetail=[];
    if($('#hfcustomerid').val()=='')
    {
        toastr.error('Invalid Customer Deatils  Unable to Process');
        return false;
    }
    if($('#ddlsalesrep').val()=='0')
    {
        toastr.error('Please select sales.rep');
        return false;
    }
   
    $('#detailsTable tbody tr').each(function (i,e){
        // if ($('.qty',this).val()>$('.availableqty',this).val()) {
        //     toastr.error('Please Check and give Valid Input');
        //     return false;
        // }
        if($('.productid',this).val() !='')
        {
            
            let invoiceReturn={
            productid:$('.productid',this).val(),
            qty:$('.qty',this).val(),
            rate:$('.rate',this).val(),
            discount:$('.discount',this).val(),
            amount:$('.amount',this).val(),
            purchasedetail_id:$('.hfinvoicedetail_id',this).val(),
            saleqty:$('.saleqty').val()
            };

            if($('.hfinvoicedetail_id',this).val() !=''){
                invoiceReturn.invoicedetail_id=$('.hfinvoicedetail_id',this).val()
            }
           
            if($('.unit',this).val() !=undefined)
            {
                invoiceReturn.unitid=$('.unitid').val()
            }
            if($('.discountvalue',this).val() !=undefined)
            {
                invoiceReturn.discount=$('.discountvalue',this).val()
            }

            invoiceReturnDetail.push(invoiceReturn);

            // let sumofqty= OldinvoiceDetail.map(ele=>{
            //     if(ele._id=$('.hfinvoicedetail_id',this).val())
            //     {
            //         return ele.qty-$('.qty',this).val();
            //     }
            //    })
            //    alert(sumofqty);
            //  let detail={
            //     productid:$('.productid',this).val(),
            //     qty:parseInt(sumofqty),
            //     rate:$('.rate',this).val(),
            //     discount:$('.discount',this).val(),
            //     amount:$('.amount',this).val()
            // }
            // if($('.hfdetailsysid',this).val() !=''){
            //     detail._id=$('.hfdetailsysid',this).val()
            // }
            // if($('.unit',this).val() !=undefined)
            // {
            //    detail.unitid=$('.unitid').val()
            // }
            // if($('.discountvalue',this).val() !=undefined)
            // {
            //    detail.discount=$('.discountvalue',this).val()
            // }
            // invoiceDetail.push(detail);
        }
    })
    if(invoiceReturnDetail.length==0)
    {
        toastr.error('Inavalid invoice Deatil Unable to Process');
        return false;
    }
   

    var data={
        _id:$('#hf_id').val(),
        sale_id:$('#hfsale_id').val(),
        invoicereturnno:$('#hfinvoiceno').val(),
        invoiceno:$('#txtinvoiceno').val(),
        invoicedate:Converdate($('#txtinvoicedate').val()),
      //  reference:$('#txtreference').val(),
        customerid:$('#hfcustomerid').val(),
       // invoiceDetail:invoiceDetail,
        invoiceReturnDetail:invoiceReturnDetail,
        gstdetail: Gstdetail,
        subtotal:$('#subtotal').text(),
        salesrep:$('#ddlsalesrep').val(),
        roundoff:10,
        total:$('#txttotal').text(),
        hsncolumn:$("#chhsn").is(":checked") ? 1 : 0,
        unitcolumn:$("#chunit").is(":checked") ? 1 : 0,
        discountcolumn:$("#chdiscount").is(":checked") ? 1 : 0,
        discountype:$("#ddldiscount").val(),
        taxtype:$("#taxtype").val(),
    }
    insertupdate(data,'/salesreturn/insertupdate');
   // alert($('#hfsupplierid').val())
   
}
function afterinsertupdatefunction(result)
{
    getsalesreturnno();
    cleardata();
  
  
}
function LoadData() {
    $('#gvsaleslist').dataTable().fnDestroy();
    var table = $('#gvsaleslist');
    //let sno=0;
    // begin first table
    table.DataTable({
        responsive: true,
        searchDelay: 500,
        processing: true,
        serverSide: true,
        pageLength: 5,
        lengthMenu: [[5, 10, 25, 50, 100], [5, 10, 25, 50, 100]],
        ajax: '/salesreturn/list',
        columns: [
           // { data: 'sno', },
           { data: 'customer.name', name: 'customer' },
            { data: 'invoicedate', name: 'invoicedate' },
            { data: 'invoicereturn_no', name: 'invoicereturn_no' },
           
            { data: 'returndate', name: 'returndate' },
           
           // { data: 'openingstock', name: 'openingstock' },
            { data: '_id', responsivePriority: -1 },
        ],
        order: [0, "desc"],
        dom: '<"top" f>rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        columnDefs: [
            {
                targets: -1,
                title: 'Actions',
                orderable: false,
                render: function (data, type, full, meta) {
                    return `<div class="btn-group ptb-5">
                    <button type="button" class="btn btn-sm btn-outline-success">
                        Print
                    </button>
                    <button type="button"
                        class="btn btn-sm btn-outline-success dropdown-toggle dropdown-toggle-split"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="sr-only">Print</span>
                    </button>
                    <div class="dropdown-menu" style="">
                        <a class="dropdown-item" onclick='btndeletesalesreturn("`+ data + `")'>Delete</a>
                        <a class="dropdown-item" onclick='btneditinvoicereturn("`+ data + `")'>Edit Invoice Return</a>
                    </div>
                    </div>`;                   
                },
            },
           
          
        ],
    });
   
}
function Close() {
    // cleardata();
    $('.list').show();
    $('.entry').hide();

    LoadData();
}
function Show() {

    $('.list').hide();
    $('.entry').show();
    $('#kt_modal_4').modal('toggle');
    getsalesreturnno()
   
   
}
function saveexit()
{
    save_process();
    Close();
}
function cleardata()
{
    $('#hf_id').val('');
    
    $('#txtinvoicedate').val(''); 
    Cal_Duedate();
    $('#txttotal').text("0")
    $('#txtcustomer').typeahead('val', '');
    $('#hfcustomerid').val("");
   // $('#txtreference').val("");
    $("#detailsTable tbody").find("tr:gt(2)").remove();
    $('#detailsTable tbody tr').each(function (i,e){
        $('.ddl',this).val('')
        $('.qty',this).val('');
        $('.rate',this).val('');
        $('.discount',this).val('');
        $('.amount',this).val('');
        $('.hfdetailsysid',this).val('');
    })
    $('.supplierdetails').hide();
    $('.gstdetails').empty();
   
}
function SalesNo()
{
    var bestPictures = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: '/sales/invoicenolist'
    });
    $('#txtinvoiceno').typeahead(null, {
        name: 'best-pictures',
        display: 'name',
        source: bestPictures,
        highlight: true,
        width: '500px',
        templates: {
            empty: [
                `<button type="button" class="btn btn-sm btn-secondary"><i class="fa fa-plus-circle"> Add Invoice</i></button>`
            ].join('\n'),
            suggestion: Handlebars.compile('<div><strong>{{name}}</strong></div>'),
        },
    });
}
$('#txtinvoiceno').bind('typeahead:select', function (ev, suggestion) {
    saledetails(suggestion.id);
   
   
});
function saledetails(id)
{
    $.ajax({
        url: '/sales/invoiceno/' + id,
        dataType: "json",
        type: "get",
        success: function (data) {
            $('.supplierdetails').show();
                    if(data[0].discountcolumn==1)
                    {

                        $('#chdiscount').prop('checked', true);
                    }
                    if(data[0].unitcolumn==1)
                    {
                    
                        $('#chunit').prop('checked', true);
                    }
                
                    if(data[0].hsncolumn==1)
                    {
                        $('#chhsn').prop('checked', true);
                    }
                    $('#txtgstno').val(data[0].customer.gstin);
                    $('#ddlcompanystate').val(data[0].customer.billingstate);
                    $('#hfcustomerid').val(data[0].customerid);
                // $('#hf_id').val(suggestion.id);
                    
                    $('#hfsale_id').val(id);
                    $('#txtinvoicedate').val(data[0].invoicedate);

                
                // $('#txtduedate').val(data[0].purchasedate)
                    $('#txttotal').text(data[0].total)
                    //$('#txtreference').val(data[0].reference)
                    $('#txtcustomer').typeahead('val', data[0].customer.name);
                    $('.supplierdetails').show();
                
                    $('#txtgstno').val(data[0].customer.gstin);
                    $('#ddlcompanystate').val(data[0].customer.billingstate);

                    // $('#hfinvoiceno').text(suggestion.invoiceno);
                    // $('.lblinvoiceno').text(suggestion.invoiceno);
                    $('#ddlsalesrep').val(data[0].salesrep);

                    OldinvoiceDetail=data[0].invoiceDetail;
                
                    $.each(data[0].invoiceDetail, function (j, v) {
                    if(j<=2)
                    {
                        $('#detailsTable tbody tr').each(function (i,e){
                            if(j==i)
                            {
                            let productdetails=productnameArray.filter(element => element.id ==v.productid);
                            
                                $('.ddl',this).val(productdetails[0].name).attr("disabled", "disabled"); 
                                $('.productid',this).val(v.productid);
                                $('.qty',this).val(v.qty);
                                $('.rate',this).val(v.rate);
                                $('.discount',this).val(v.discount);
                                $('.amount',this).val(v.amount);
                                $('.saleqty',this).val(v.qty);
                            // $('.hfdetailsysid',this).val(v._id);
                                $('.hfinvoicedetail_id',this).val(v._id);
                                
                            }
                        })
                    }
                    else
                    {
                        let productdetails=productnameArray.filter(element => element.id ==v.productid); 
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
                        $(row).find('.ddl').val(productdetails[0].name).attr("disabled", "disabled"); 
                        $(row).find('.qty').val(v.qty) ;
                        $(row).find('.rate').val(v.rate) ;
                        $(row).find('.discountvalue').val(v.discount);
                        $(row).find('.amount').val(v.amount);
                        $(row).find('.productid').val(v.productid);

                       $(row).find('.saleqty').val(v.qty);
                      $(row).find('.hfinvoicedetail_id').val(v._id);
                        
                        $('#detailsTable').append(row);
                    }
                    
                    })
                    Cal_Amount();
                   // Disabled_Field()
                
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
        })
  
   
    
}
function Disabled_Field()
{
        $('#ddlcompanystate').attr("disabled", "disabled"); 
        $("#txtgstno").attr("disabled", "disabled"); 
        $('#txtinvoicedate').attr("disabled", "disabled"); 
        $('#txtinvoiceno').attr("disabled", "disabled"); 
        $('#txttotal').attr("disabled", "disabled"); 
       // $('#txtreference').attr("disabled", "disabled"); 
        $('#txtcustomer').attr("disabled", "disabled"); 
        $('.supplierdetails').show();
        $('#txtgstno').attr("disabled", "disabled"); ;
        $('#ddlcompanystate').attr("disabled", "disabled"); 
        $('#ddlsalesrep').attr("disabled", "disabled"); 

      
}
function getsalesreturnno() {
    $.ajax({
        type: "GET",
        url: '/salesreturn/salesretrunno',
        success: function (data) {
            $('.lblinvoicereturn_no').html('IVR'+data.billno)
           
            $('#hfinvoiceno').val(data.billno)
        },
        error: function (errormessage) {
            toastr.error(errormessage.responseText);
        }
    })
    return false
}
function btneditinvoicereturn(id)
{
    editassignvalue('/sales/return/' + id)
}
