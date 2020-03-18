var ddllist = []
function Drobdownbind(element, Url) {
    ddllist='';
    if (ddllist.length == 0) {
        $.ajax({
            type: "GET",
            url: Url,
            success: function (data) {
                  ddllist = data.data;                
                renderdatas(element);
                //$(element).selectpicker('val','0');
                
            }
        })
    }
    else {
        //render catagory to the element
        renderdatas(element);
    }
}
function renderdatas(element) {
    var $ele = $(element);
    $ele.empty();
    $ele.append($('<option/>').val('').text('Select'));
  //  $(element).append('<option value="0"> Select </option>');
    $.each(ddllist, function (i, val) {
        $ele.append($('<option/>').val(val.id).text(val.name));
    })
    $(element).val('').selectpicker('refresh');
}

//-------------------------------------select picker with id--------------------------//

function CasecadeDrobdownbind(element, Url,id) {
    ddllist='';
    if (ddllist.length == 0) {
        $.ajax({
            type: "get",            
            url: Url,
            success: function (data) {
              
                ddllist = data;                
                bindddll(element,id);
                
            }
        })
    }
    else {
        //render catagory to the element
        bindddll(element,id);
    }
}
function bindddll(element,id) {
    var $ele = $(element);
    $ele.empty();
    $ele.append($('<option/>').val('0').text('Select'));
    $.each(ddllist, function (i, val) {
        $ele.append($('<option/>').val(val.id).text(val.Name));
    })
    $(element).val(id).selectpicker('refresh');
}
