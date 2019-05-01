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

function calcSDD(arr, avg){
    //Calculate squared differences
    var sqDiff = [];

    for(let i = 0; i < arr.length; i++){
        sqDiff.push(Math.pow((arr[i]-avg), 2));
    }

    //Calculate average of squared differences
    if (sqDiff.length){
        sum = sqDiff.reduce(function(a, b) { return a + b; });
        avg = sum / sqDiff.length;
    }

    //Calculate SDD
    var sdd = Math.sqrt(avg);

    return sdd;
}

function freqArr(){
    var frequencies = getFrequency();

    //Convert frequencies object to array
    var arr = [];

    $.each(frequencies, function(index, value){
        arr.push(value);
    })

    return arr;
}

function randParition() {
    var arr = freqArr();

    //Sort array
    arr.sort(function(a, b){return a-b});

    //Randomly partition array
    var arrs = [],size=1;
    var min=1;
    var max=arr.length-1;
    while (arr.length > 0) {
        size = Math.min(max,Math.floor((Math.random()*max)+min));
        arrs.push(arr.splice(0, size));
    }
    return arrs;
}

function jenksAnalysis(){
    //Get array average
    var arr = freqArr;

    var sum, avg = 0;
    if (arr.length){
        sum = arr.reduce(function(a, b) { return a + b; });
        avg = sum / arr.length;
    }

    //Partition the array
    var size = 0;
    var sdd = 450;
    var sum = 0;

    //Randomise partitions 100 times to get the lowest SDD
    while(size < 100){
        //Get partitions
        size++;
        partitions = randParition();

        //Get SDD for partitions
        var sddPartitions = [];

        for(let i = 0; i < partitions.length; i++){
            var arrSdd = calcSDD(partitions[i], avg);
            sddPartitions.push(arrSdd);
        }

        sum = sddPartitions.reduce(function(a, b) { return a + b; });

        //Keep lowest SDD
        if(sum < sdd){
            sdd = sum;
        }
    }

    return sdd;
}



$(document).ready(function(){
    $('#load-btn').click(function(){
        $.ajax({
            url: "kddcup.testdata.csv",
            dataType: "text",
            success: function(data)
            {
                security_data = data.split(/\r?\n|\r/);
                var jenksVal = jenksAnalysis();
                var table_data = '<table>';
                for(var count=0; count < security_data.length; count++)
                {
                    var cell_data = security_data[count].split(",");
                    var frequencies = getFrequency();

                    $.each(frequencies, function(index, value){
                        if(cell_data[2] === index){
                            if(value <= jenksVal){
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
