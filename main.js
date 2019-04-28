$(document).ready(function(){
    $('#load-btn').click(function(){
        $.ajax({
            url: "kddcup.testdata.csv",
            dataType: "text",
            success: function(data)
            {
                var security_data = data.split(/\r?\n|\r/);
                var table_data = '<table>';
                for(var count=0; count < security_data.length; count++)
                {
                    var cell_data = security_data[count].split(",");
                    table_data += '<tr>';
                    table_data += '<td>'+count+'</td>';
                    for(var cell_count = 0; cell_count < cell_data.length; cell_count++)
                    {
                        if(count===0){
                            table_data += '<th>'+(cell_count+1)+'</th>';
                        } else {
                            table_data += '<td>'+cell_data[cell_count]+'</td>';
                        }

                    }
                    table_data += '</tr>';
                }
                table_data += '</table>';
                $('#data-table').html(table_data);
            }
        })
        $('#load-btn').hide();
    })

    $(document).on('click', '#data-table th', function(){

    })
})
