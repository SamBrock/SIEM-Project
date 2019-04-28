var security_data;

$(document).ready(function(){
    $('#load-btn').click(function(){
        $.ajax({
            url: "kddcup.testdata.csv",
            dataType: "text",
            success: function(data)
            {
                security_data = data.split(/\r?\n|\r/);
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

    function getCounts(colNum){
        var colNum = colNum-1;
        var counts = {};
        for(var count=0; count < security_data.length; count++)
        {
            var cell_data = security_data[count].split(",");
            counts[cell_data[colNum]] =  (counts[cell_data[colNum]] || 0)+ 1;
        }
        return counts;
    }

    $(document).on('click', '#data-table th', function(){
        var colNum = $(this).text();
        var counts = getCounts(colNum);
        console.log(counts);
        drawChart(colNum);
    })

    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    //google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart(colNum) {

        // Create the data table.
        var counts = getCounts(colNum);

        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Column');
        data.addColumn('number', 'Frequency');

        $.each(counts, function(index, value){
            data.addRow([index, value]);
        })

        // Set chart options
        var options = {
            'title':'Column '+colNum+' Frequencies',
            'width':500,
            'height':400
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('graphs'));
        chart.draw(data, options);
    }

})
