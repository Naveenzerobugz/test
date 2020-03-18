function savedata() {
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
            var data = {
                rolename: $('#txtrolename').val(),
                description: $('#txtdescription').val()
            }
            insertdata('frm', data, '/adminpanel/roleinsert', $('#hfsysid').val())
        }
    })
}

function LoadData() {

    $('#gvlist').dataTable().fnDestroy();
    var table = $('#gvlist');

    // begin first table
    table.DataTable({
        responsive: true,
        searchDelay: 500,
        processing: true,
        serverSide: false,
        ajax: '/Adminpanel/rolelist',

        columns: [
            { data: '_id', name: '_id' },
            { data: 'rolename', name: 'rolename' },
            { data: 'description', name: 'description' },
            { data: '_id', responsivePriority: -1 },
        ],
        order: [1, "desc"],
        dom: '<"top" f>rt<"bottom"<"row"<"col-md-2"l><"col-md-3"i><"col-md-4"p>>><"clear">',
        columnDefs: [{
            targets: -1,
            title: 'Action',
            orderable: false,
            render: function(data, type, full, meta) {
                return `                      
                          <a onclick='btnedit("` + data + `")' class ="btn btn-sm btn-clean btn-icon btn-icon-md" title="View">
                            <i class ="la la-edit"></i>
                          </a>
                                <a onclick= 'btndeleted("` + data + `")' class ="btn btn-sm btn-clean btn-icon btn-icon-md" title="delete">
                            <i class ="la la-bitbucket-square"></i>
                          </a>`;
            },
        }],
    });
    oTable = $(table).DataTable();
}

function btnedit(id) {
    editassignvalue('/adminpanel/roleedit/' + id)
}

function assignvalue(data) {
    $('#txtrolename').val(data[0].rolename);
    $('#txtdescription').val(data[0].description);
    $('#hfsysid').val(data[0]._id);
}

function btndeleted(id) {
    deletedata('/adminpanel/roledelete/' + id);
}

$(document).ready(() => {
    LoadData();
})