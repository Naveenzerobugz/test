$(document).ready(function() {

    var CurrentDate = GetCurrentDate()

    $(".CurrentDate").val(CurrentDate);

});

function ShowimgPreview(imageUploader, previewImage) {

    if (imageUploader.files && imageUploader.files[0]) {

        var reader = new FileReader();
        reader.onload = function(e) {

            $(previewImage).attr('src', e.target.result);
        }
        reader.readAsDataURL(imageUploader.files[0]);
    }

}

function Converdate(date) {

    var dateSplit = date.split("-");
    year = dateSplit[2];
    month = dateSplit[1];
    day = dateSplit[0];
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    var dateTime = year + '-' + month + '-' + day + ' ' + time;
    //alert(dateTime);
    return dateTime;
    // [year, month, day,''+time].join('-');
    // return dateTime;

}
function Convertfdate(date) {

    var dateSplit = date.split("-");
    year = dateSplit[2];
    month = dateSplit[1];
    day = dateSplit[0];
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    var dateTime = year + '-' + month + '-' + day + ' ' + '00:00:00';
    //alert(dateTime);
    return dateTime;
    // [year, month, day,''+time].join('-');
    // return dateTime;

}
function Converttdate(date) {

    var dateSplit = date.split("-");
    year = dateSplit[2];
    month = dateSplit[1];
    day = dateSplit[0];
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    var dateTime = year + '-' + month + '-' + day + ' ' + '23:59:59';
    //alert(dateTime);
    return dateTime;
    // [year, month, day,''+time].join('-');
    // return dateTime;

}
function Convertdateymd(date) {

    let dateSplit = date.split("-");
    year = dateSplit[2];
    month = dateSplit[1];
    day = dateSplit[0];


    let dateTime = day + '-' + month + '-' + year + ' ';
    //alert(dateTime);
    return dateTime;
    // [year, month, day,''+time].join('-');
    // return dateTime;

}


function GetCurrentDate() {
    var tdate = new Date();
    var dd = tdate.getDate(); //yields day
    var MM = tdate.getMonth(); //yields month
    var yyyy = tdate.getFullYear(); //yields year
    var currentDate = dd + "-" + (MM + 1) + "-" + yyyy;
    return currentDate;
}

function CurrentDatetime() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
    var dateTime = date + ' ' + time;
    return dateTime;
}
/*-----------------------------------bind datatables ------------------------------------*/

function binddata(tablename, uri, data) {

    var datacount = data.length;

    for (i = 0; i < datacount; i++) {
        data[i] = eval({ "data": data[i], "name": data[i], "autoWidth": true });
    }
    if (tablename == '#gvproductlist') {
        data[datacount] = eval({
            "data": "Sysid",
            "width": "50px",
            "render": function(data) {
                return '<a style="padding:1px;" id="liEdit" class="liEdit glyphicon glyphicon-search" href="#" onclick="return getbyID(' + data + ')"><i style="color:teal;" class="far fa-edit"></i> </a>';
            }

        });

    } else {
        data[datacount] = eval({
            "data": "Sysid",
            "width": "50px",
            "render": function(data) {
                return '<a style="padding:1px;" id="liEdit" class="liEdit btn btn-icon waves-effect btn-white m-b-5" href="#" onclick="return getbyID(' + data + ')"><i style="color:teal;" class="far fa-edit"></i> </a>';
            }

        });
        data[datacount + 1] = eval({
            "data": "Sysid",
            "width": "50px",
            "render": function(data) {
                return '<a  id="liDel" class="liDel on-default remove-row" href="#" onclick="return Delete(' + data + ',this)"><i style="color:teal;" class="fas fa-trash-alt"></i></a>';
            }
        });
    }
    $(tablename).dataTable().fnDestroy();
    $(tablename).DataTable({
        "ajax": {
            "url": uri,
            "type": "POST",
            "datatype": "json"

        },
        "columns": data,
        "serverSide": "true",
        "order": [0, "desc"],
        "dom": '<"top">rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        "processing": "true",
        "language": {
            "processing": "processing ... please wait"
        }
    });
    oTable = $(tablename).DataTable();
    $('#btnSearch').click(function() {
        //Apply search for Employee Name // DataTable column index 0
        oTable.columns(0).search($('#searchby').val().trim());
        //Apply search for Country // DataTable column index 3
        oTable.columns(3).search($('#searchtext').val().trim());
        //hit search on server
        oTable.draw();
    });
}

function bindReportdata(tablename, uri, data) {

    var datacount = data.length;
    for (i = 0; i < datacount; i++) {
        data[i] = eval({ "data": data[i], "name": data[i], "autoWidth": true });
    }

    $(tablename).dataTable().fnDestroy();
    $(tablename).DataTable({
        "ajax": {
            "url": uri,
            "type": "POST",
            "datatype": "json"

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
    $('#btnSearch').click(function() {
        //Apply search for Employee Name // DataTable column index 0
        oTable.columns(0).search($('#searchby').val().trim());
        //Apply search for Country // DataTable column index 3
        oTable.columns(3).search($('#searchtext').val().trim());
        //hit search on server
        oTable.draw();
    });
}

function binddataview(tablename, uri, data) {

    var datacount = data.length;
    for (i = 0; i < datacount; i++) {
        data[i] = eval({ "data": data[i], "name": data[i], "autoWidth": true });
    }
    data[datacount] = eval({
        "data": "Sysid",
        "width": "50px",
        "render": function(data) {

            return '<a style="padding:1px;" class="btn btn-icon waves-effect btn-white m-b-5 rowval" href="#" onclick="return getbyID(' + data + ')"><i style="color:teal;" class="fas fa-eye"></i> </a>';
        }
    });
    $(tablename).dataTable().fnDestroy();
    $(tablename).DataTable({
        "ajax": {
            "url": uri,
            "type": "POST",
            "datatype": "json"

        },
        "columns": data,
        "serverSide": "true",
        "order": [0, "desc"],
        "dom": '<"top">rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        "processing": "true",
        "language": {
            "processing": "processing ... please wait"
        }
    });
    oTable = $(tablename).DataTable();
    $('#btnSearch').click(function() {
        //Apply search for Employee Name // DataTable column index 0
        oTable.columns(0).search($('#searchby').val().trim());
        //Apply search for Country // DataTable column index 3
        oTable.columns(3).search($('#searchtext').val().trim());
        //hit search on server
        oTable.draw();
    });
}

function binddataedit(tablename, uri, data) {

    var datacount = data.length;
    for (i = 0; i < datacount; i++) {
        data[i] = eval({ "data": data[i], "name": data[i], "autoWidth": true });
    }
    data[datacount] = eval({
        "data": "Sysid",
        "width": "50px",
        "render": function(data) {

            return '<a style="padding:1px;" class="btn btn-icon waves-effect btn-white m-b-5 rowval" href="#" onclick="return getbyID(' + data + ')" ><i style="color:teal;" class="far fa-edit"></i></a>';
        }
    });
    $(tablename).dataTable().fnDestroy();
    $(tablename).DataTable({
        "ajax": {
            "url": uri,
            "type": "POST",
            "datatype": "json"

        },
        "columns": data,
        "serverSide": "true",
        "order": [0, "desc"],
        "dom": '<"top">rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        "processing": "true",
        "language": {
            "processing": "processing ... please wait"
        }
    });
    oTable = $(tablename).DataTable();
    $('#btnSearch').click(function() {
        //Apply search for Employee Name // DataTable column index 0
        oTable.columns(0).search($('#searchby').val().trim());
        //Apply search for Country // DataTable column index 3
        oTable.columns(3).search($('#searchtext').val().trim());
        //hit search on server
        oTable.draw();
    });
}

function binddataviewwithparameter(tablename, uri, data, FilterParameter) {

    var datacount = data.length;
    for (i = 0; i < datacount; i++) {
        data[i] = eval({ "data": data[i], "name": data[i], "autoWidth": true });
    }
    data[datacount] = eval({
        "data": "Sysid",
        "width": "50px",
        "render": function(data) {

            return '<a style="padding:1px;" class="btn btn-icon waves-effect btn-white m-b-5 rowval" href="#" onclick="return getbyID(' + data + ')"><i style="color:teal;" class="fas fa-eye"></i> </a>';
        }
    });
    $(tablename).dataTable().fnDestroy();
    $(tablename).DataTable({
        "ajax": {
            "url": uri,
            "type": "POST",
            "datatype": "json",
            "data": FilterParameter

        },
        "columns": data,
        "serverSide": "true",
        "order": [0, "desc"],
        "dom": '<"top">rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        "processing": "true",
        "language": {
            "processing": "processing ... please wait"
        }
    });
    oTable = $(tablename).DataTable();
    $('#btnSearch').click(function() {
        //Apply search for Employee Name // DataTable column index 0
        oTable.columns(0).search($('#searchby').val().trim());
        //Apply search for Country // DataTable column index 3
        oTable.columns(3).search($('#searchtext').val().trim());
        //hit search on server
        oTable.draw();
    });
}
/*-----------------------------------start CRUD Process ------------------------------------*/

function insertdata(frmname, fieldvalue, uri, id) {
    var type;
    if (id == '') {
        url = uri;
        type = "POST"
    } else {
        url = uri + '/' + id;
        type = "POST"
    }
    $.ajax({
        url: url,
        data: JSON.stringify(fieldvalue),
        type: type,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function(result) {
            if (result.status == 'success') {
                toastr.success(result.message);

                LoadData();
                cleardata();
            } else {
                toastr.error(result.message);

            }

        },
        error: function(errormessage) {

            toastr.error(errormessage.responseText);
        }

    });
    return false
}




//---------------------------Excel File Uploads-------------------------------//
var excelupload = function(fileid, uploaduri) {
    var file = $(fileid).get(0).files;
    var data = new FormData;

    data.append("ExcelFile", file[0]);


    $.ajax({
        type: "Post",
        url: uploaduri,
        data: data,
        contentType: false,
        processData: false,
        success: function(result) {
            if (result.Status == true) {
                LoadProgressBar(result);
                LoadData();
                cleardata();
                ClearPreview();
            } else {

                toastr.error(result.Message);
            }
        },
        error: function(errormessage) {

            toastr.error(errormessage.responseText);
        }
    });
    return false;
}


//--------------------------get drobdown datas--------------------------------------//

function Getdatawithctrl(ctrl, Data, uri) {
    try {
        $.ajax({
            url: uri,
            data: "{ 'Data': '" + Data + "'}",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function(Data) {
                var parsed = JSON.parse(Data);
                if (parsed.length == 1) {
                    $.map(parsed, function(Item) {

                        SetValues(ctrl, Item)

                    });
                } else {

                }
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
    } catch (e) {

    }
}

var Categories = []

function BindddlData(element, Url) {
    Categories = '';
    if (Categories.length == 0) {
        //ajax function for fetch data
        $.ajax({
            type: "GET",
            url: Url,
            success: function(data) {

                Categories = data;
                //console.log(data)
                //render catagory
                renderCategory(element);

            }
        })
    } else {
        //render catagory to the element
        renderCategory(element);
    }
}

function renderCategory(element) {
    var $ele = $(element);
    $ele.empty();
    $ele.append($('<option/>').val('').text('Select'));
    $.each(Categories.data, function(i, val) {

        $ele.append($('<option/>').val(val._id).text(val.name));
    })

}

function BindddldetailData(row, element, Url) {
    Categories = '';
    if (Categories.length == 0) {
        //ajax function for fetch data

        $.ajax({
            type: "GET",
            url: Url,
            success: function(data) {

                Categories = data;
                //console.log(data)
                //render catagory
                renderdetailCategory(row, element);

            }
        })
    } else {
        //render catagory to the element
        renderdetailCategory(element);
    }
}

function renderdetailCategory(row, element) {
    var $ele = $(row).find(element);

    $ele.empty();
    $ele.append($('<option/>').val('').text('Select'));
    $.each(Categories.data, function(i, val) {
        $ele.append($('<option/>').val(val._id).text(val.name));
    })
    $(row).find(element).val('');
}

function BindddlDatadefault(element, Url) {
    Categories = '';
    if (Categories.length == 0) {
        //ajax function for fetch data    
        $.ajax({
            type: "GET",
            url: Url,
            success: function(data) {
                Categories = data;
                console.log(data)
                    //render catagory
                renderCategorydefaukt(element);
            }
        })
    } else {
        //render catagory to the element
        renderCategorydefaukt(element);
    }
}

function renderCategorydefaukt(element) {
    var $ele = $(element);
    $ele.empty();

    // $ele.append($('<option/>').val('').text('Select'));
    $.each(Categories.data, function(i, val) {
        $ele.append($('<option/>').val(val._id).text(val.name));
    })
}

function BindddlDataele(element, Url, item) {
    Categories = '';
    if (Categories.length == 0) {
        //ajax function for fetch data

        $.ajax({
            type: "GET",
            url: Url,
            success: function(data) {

                Categories = data;
                //render catagory
                renderCategoryele(element, item);

            }
        })
    } else {
        //render catagory to the element
        renderCategory(element);
    }
}

function renderCategoryele(element, item) {

    var $ele = $(element);
    $ele.empty();
    $ele.append($('<option/>').val('0').text('Select'));
    $.each(Categories.data, function(i, val) {

        $ele.append($('<option/>').val(val.id).text(val.name));
    })
    $ele.val(item);

}


function Parameterbinddata(tablename, uri, data, FilterParameter) {

    var datacount = data.length;
    for (i = 0; i < datacount; i++) {
        data[i] = eval({ "data": data[i], "name": data[i], "autoWidth": true });
    }
    //data[datacount] = eval({
    //    "data": "Sysid", "width": "50px", "render": function (data) {
    //        return '<a style="padding:1px;" class="btn btn-icon waves-effect btn-white m-b-5" href="#" onclick="return getByParameter(' + data + ')"><i style="color:teal;" class="far fa-edit"></i> Edit </a>';
    //    }

    //});

    $(tablename).dataTable().fnDestroy();

    $(tablename).DataTable({
        "ajax": {
            "url": uri,
            "type": "POST",
            "datatype": "json",
            "data": FilterParameter
        },
        "columns": data,
        "serverSide": "true",
        "order": [0, "desc"],
        "dom": '<"top">rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        "processing": "true",
        "language": {
            "processing": "processing ... please wait"
        }
    });
    oTable = $(tablename).DataTable();
    $('#btnSearch').click(function() {
        //Apply search for Employee Name // DataTable column index 0
        oTable.columns(0).search($('#searchby').val().trim());
        //Apply search for Country // DataTable column index 3
        oTable.columns(3).search($('#searchtext').val().trim());
        //hit search on server
        oTable.draw();
    });
}

//get Price by dropdown price selected

// Private functions
function TypeHead(id, value) {
    states = value;
    alert(states)
    var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
            var matches, substringRegex;

            // an array that will be populated with substring matches
            matches = [];

            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');

            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function(i, str) {
                if (substrRegex.test(str)) {
                    matches.push(str);
                }
            });

            cb(matches);
        };
    };

    $(id).typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    }, {
        name: 'states',
        source: substringMatcher(states)
    });
}