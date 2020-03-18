

function insertupdate(fieldvalue,url) {
   
    $.ajax({
        url: url,
        data: JSON.stringify(fieldvalue),
        type: 'post',
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.status == 'success') {
                toastr.success(result.message);
                afterinsertupdatefunction(result);
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

function editassignvalue(uri) {
   
    try {
        $.ajax({
            url: uri,
          
            dataType: "json",
            type: "get",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
            
            assignvalue(data);
            },
            error: function (response) {
                var parsed = JSON.parse(response.responseText);
                toastr.error(parsed.Message);
                d.resolve();
            },
            failure: function (response) {
                var parsed = JSON.parse(response.responseText);
                toastr.error(parsed.Message);
               
                d.resolve();
            }
        });
    } catch (e) {

    }
}

function deletedata(uri) {

   
    swal.fire({
        title: "Please Confirm?",
        text: 'Are you sure Do you want delete from List..!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-secondary',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: "No, cancel it!",
        closeOnClickOutside: false,
        // backdrop:true,
      //  onOpen: () => Swal.getConfirmButton().focus()

    }).then(function (dismiss) {
        var one = JSON.stringify(dismiss);
     
    
        if (one == '{"dismiss":"cancel"}') {
            swal.fire(
                'Cancelled',
                'Thankyou For Saving Me !!!',
                'error'
            )
        }
        else if (one == '{"value":true}') {
            
            $.ajax({
                url: uri,
                type: "post",
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                success: function (result) {
                  
                    if (result.status == 'success') {

                        toastr.success(result.message);
                      
                        afterdelete()

                    }
                    else {
                        toastr.error(result.message);
                    }
                },
                error: function (errormessage) {
                    toastr.error(errormessage.responseText);
                }
            });
        }
       
     
    }

)
};

function binddatareportwithdata(tablename, uri, data,FilterParameter) {

    var datacount = data.length;
    for (i = 0; i < datacount; i++) {
        data[i] = eval({ "data": data[i], "name": data[i], "autoWidth": true });
    }

    $(tablename).dataTable().fnDestroy();
    $(tablename).DataTable({
        "ajax": {
            "url": uri,
            "type": "POST",
            "datatype": "json",
            "data": FilterParameter
        },
        "columns": data,
        // "serverSide": "true",
        "order": [0, "desc"],
        "dom": '<"top">rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        "processing": "true",
        "language": {
            "processing": "processing ... please wait"
        }
    });
    oTable = $(tablename).DataTable();
    $('#btnSearch').click(function () {
        //Apply search for Employee Name // DataTable column index 0
        oTable.columns(0).search($('#searchby').val().trim());
        //Apply search for Country // DataTable column index 3
        oTable.columns(3).search($('#searchtext').val().trim());
        //hit search on server
        oTable.draw();
    });
}