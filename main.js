var security_data;

function getFrequency(){
    var frequencies = {};
    for(var count=0; count < security_data.length; count++)
    {
        var cell_data = security_data[count].split(",");
        frequencies[cell_data[2]] =  (frequencies[cell_data[2]] || 0)+ 1;
    }
    return frequencies;
}

function getFrequencyByCol(colNum){
    var colNum = colNum-1;
    var counts = {};
    for(var count=0; count < security_data.length; count++)
    {
        var cell_data = security_data[count].split(",");
        counts[cell_data[colNum]] =  (counts[cell_data[colNum]] || 0)+ 1;
    }
    return counts;
}

function jenksAnalysis(){
    var frequencies = getFrequency();
    var total = 0;
    var freqLength = 0;

    $.each(frequencies, function(index, value){
        total += value;
        freqLength++;
    })

    var avg = total / freqLength;

    var squaredDifferences = [];
    $.each(frequencies, function(index, value){
        squaredDifferences.push(Math.pow((value-avg), 2));
    })

    total = 0;
    var length = 0;
    var ssd = 0;
    $.each(squaredDifferences, function(index, value){
        total += value;
        length++;
    })

    var ssd = total / length;
    var ssdSqrt = Math.sqrt(ssd);

//
//    var newArr = [];
//    $.each(frequencies, function(index, value){
//        newArr.push(value);
//    })
//
//    newArr.sort(function(a, b){return a-b});

//    var arrays = [];
//    var size = (newArr.length/2)-1;
//
//    var largestValue = newArr.slice(-1).pop()
//
//    while (newArr.length > 0){
//        size++;
//        arrays.push(newArr.splice(0, size));
//    }
//
//
    return ssdSqrt;
}

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
                    var frequencies = getFrequency();

                    var jenks = jenksAnalysis();

                    $.each(frequencies, function(index, value){
                        if(cell_data[2] === index){
                            if(value <= jenks){
                                table_data += '<tr class="irregular">';
                            }else{
                                table_data += '<tr>';
                            }
                        }
                    })

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
        var colNum = $(this).text();
        var counts = getFrequencyByCol(colNum);
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
        var counts = getFrequencyByCol(colNum);

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
