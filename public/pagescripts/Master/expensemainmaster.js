var exepnsectrl='';
function showexpense(ctrl){
    exepnsectrl = ctrl;
    $('#expensemodal').modal('show');
}
var validationexpansemaster = function () {
   
    $("#expenseform").validate({
        // define validation rules
        rules: {
            //= Client Information(step 3)
            // Billing Information
            expanse: {
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
                        id: '',
                        expansename:$('#txtexpanse').val(),
                        description:$('#txtdescription').val(),
                    }
                    insertupdate(data,'/master/expanse');   
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
function afterinsertupdatefunction(res){
    $('#expensemodal').modal('hide');
    $(exepnsectrl).closest('tr').find('.txtexpanse').val(res.data.expansename);
    $(exepnsectrl).closest('tr').find('#hfexpanseid').val(res.data._id);
    $('#txtexpanse').val('');
    $('#txtdescription').val('');
}

function firstaddrow() {
    sno=sno+1
    CalTotal();
    var defaultrow = `
    <tr class="form-group">  
    <td>
       <div class="typehead">
          <input class="form-control txtexpanse dark-border bg-white" onblur="getxpensedetails(this)" onkeypress="getxpensedetails(this)"  type="text" dir="ltr" >
          <input id="hfexpanseid"  type="hidden" >
          <input id="hfdetailsid"  type="hidden" >
          <input id="sno" value="`+sno+`"  type="hidden" >
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
    <a onClick="removerow(this)" type="button" class="btn btn-sm btn-delete-red btn-icon  btn-icon btn-icon-sm" title="Delete">
       <i class ="la la-trash"></i>
    </a>       
    </td>
 </tr>`;
 
    $('.tblbody').append(defaultrow)

    getexpanse('.txtexpanse', '', '1strow');

 }
