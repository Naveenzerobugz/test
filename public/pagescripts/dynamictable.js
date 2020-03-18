function Add_Row() {
    var row = $("#detailsTable .trbody").last().clone();
    clear(row);
    $('#detailsTable').append(row);
    return false;
}
function clear(row) {
    var sno = parseInt($(row).find('.sno').text()) + 1;
    $(row).find('.sno').text(sno);
    $(row).find('.ddl').val("0");
    $(row).find('.sysid').val("");
    $(row).find('.hfdetailsysid').val("");
    
    $("td input:text", row).val("");
    $('td .lbldel',row).attr("style", "display: none;");
    $("td button[type=button]", row).val('Delete');
    $("td button[type=button]", row).attr("style", "display: block");
    $("td input[type=date]", row).val('');
    $("td input[type=time]", row).val('');
  
}