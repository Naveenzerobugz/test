

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
                `<button type="button" class="btn btn-sm btn-secondary">No Customer Found</button>`
            ].join('\n'),
            suggestion: Handlebars.compile('<div><strong>{{name}}</strong></div>'),
        },
    });
}

$('#txtcustomer').bind('typeahead:select', function (ev, suggestion) {
    $('.supplierdetails').show();
    $('#txtgstno').val(suggestion.gstin);
    $('#ddlcompanystate').val(suggestion.billingstate);
    $('#hfcustomerid').val(suggestion.id);

});
//#endregion

function btndeletesalesreturn(id)
{
    alert(id)
    deletedata('/sales/returndelete/' + id)
}
function afterdelete()
{
    LoadData()
}

function assignvalue(data) {
    
    $('.list').hide()
    $('.entry').show()
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
     $('#hf_id').val(data[0]._id);
    
    $('#hfsale_id').val(data[0].sale_id);
    $('#txtinvoicedate').val(data[0].invoicedate);

    
    // $('#txtduedate').val(data[0].purchasedate)
    $('#txttotal').text(data[0].total)
    $('#txtreference').val(data[0].reference)
    $('#txtcustomer').typeahead('val', data[0].customer.name);
    $('.supplierdetails').show();

    $('#txtgstno').val(data[0].customer.gstin);
    $('#ddlcompanystate').val(data[0].customer.billingstate);

    // $('#hfinvoiceno').text(suggestion.invoiceno);
    // $('.lblinvoiceno').text(suggestion.invoiceno);
    $('#ddlsalesrep').val(data[0].salesrep);
    $('#txtinvoiceno').val(data[0].invoiceno)
   // OldinvoiceDetail=data[0].invoiceReturnDetail;
  
    $.each(data[0].invoiceReturnDetail, function (j, v) {
    if(j<=2)
    {
        $('#detailsTable tbody tr').each(function (i,e){
            if(j==i)
            {
            let productdetails=productnameArray.filter(element => element.id ==v.productid);
            
                $('.ddl',this).val(productdetails[0].name) ;
                $('.productid',this).val(v.productid);
                $('.qty',this).val(v.qty);
                $('.rate',this).val(v.rate);
                $('.discount',this).val(v.discount);
                $('.saleqty',this).val(v.saleqty);
                $('.amount',this).val(v.amount);
                $('.hfdetailsysid',this).val(v._id);
                $('.hfinvoicedetail_id',this).val(v.invoicedetail_id);
                
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
        $(row).find('.ddl').val(productdetails[0].name) ;
        $(row).find('.qty').val(v.qty) ;
        $(row).find('.rate').val(v.rate) ;
        $(row).find('.discountvalue').val(v.discount);
        $(row).find('.amount').val(v.amount);
        $(row).find('.productid').val(v.productid);
        $(row).find('.saleqty').val(v.saleqty);
        $(row).find('.hfdetailsysid').val(v._id);
        $(row).find('.hfinvoicedetail_id').val(v.invoicedetail_id);
        
        $('#detailsTable').append(row);
    }
        
    
    
    })
    Cal_Amount();

}