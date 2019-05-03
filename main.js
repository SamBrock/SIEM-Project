function getFrequency(){
    var frequencies = {};
    for(var count=0; count < security_data.length; count++)
    {
        var cell_data = security_data[count];
        frequencies[cell_data[0]] =  (frequencies[cell_data[0]] || 0)+ 1;
    }
    return frequencies;
}

function getFrequencyByCol(colNum){
    var colNum = colNum-1;

    //Create frequencies object
    var frequencies = {};
    for(var count=0; count < security_data.length; count++)
    {
        var cell_data = security_data[count];
        frequencies[cell_data[colNum]] =  (frequencies[cell_data[colNum]] || 0)+ 1;
    }
    return frequencies;
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

    //Sort array lowest to highest
    arr.sort(function(a, b){return a-b});

    return arr;
}

function rndParition() {
    var arr = freqArr();

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
    var arr = freqArr();

    var sum, avg = 0;
    if (arr.length){
        sum = arr.reduce(function(a, b) { return a + b; });
        avg = sum / arr.length;
    }

    //Partition the array
    var size = 0;
    //Gets the last (highest) value in the array
    var sdd = arr.slice(-1).pop();
    var sum = 0;

    //Randomise partitions 100 times to get the lowest SDD
    while(size < 100){
        //Get partitions
        size++;
        partitions = rndParition();

        //partitions = [[1,1,1,2,2,2,3,3,4,5,5], [22,57,71], [185,450]];
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
        var table_data = '<table>';
        var irregular_events = 0;
        var cutoff = jenksAnalysis();
        for(var count=0; count < security_data.length; count++)
        {
            var cell_data = security_data[count];

            var frequencies = getFrequency();

            if(count===0){
                table_data += '<tr class="header">';
            }else{
                $.each(frequencies, function(index, value){
                    if(cell_data[0] === index){
                        if(value <= cutoff){
                            table_data += '<tr class="irregular">';
                            irregular_events++;
                        }else{
                            table_data += '<tr>';
                        }
                    }
                })
            }



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
        $('#irregular-txt').html('<span class="highlight">'+irregular_events+' irregular events</span> / '+security_data.length);
        $('#check').show();
        $('#data-table').html(table_data);
        //Hide load button
        $('#load-btn').hide();
    })

    //Get column header number
    $(document).on('click', '#data-table th', function(){
        var colNum = $(this).text();
        var frequencies = getFrequencyByCol(colNum);

        //Toggle class to show active table header
        $('#data-table th').removeClass("active");
        $(this).addClass("active");

        //Draw chart for clicked on column
        drawChart(colNum);
    })

    $(document).on('change', '#irregular-check', function(){
        if ($('#irregular-check').is(':checked')) {
            //Hide all rows except header or irregular events
            $('#data-table tr').each(function() {
                $(this).not('.irregular').not('.header').hide()
            });
        } else {
            //Show all rows except header or irregular events
            $('#data-table tr').each(function() {
                $(this).not('.irregular').not('.header').show()
            });
        }
    })

    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart(colNum) {

        // Create the data table.
        var frequencies = getFrequencyByCol(colNum);

        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Column');
        data.addColumn('number', 'Frequency');

        $.each(frequencies, function(index, value){
            data.addRow([index, value]);
        })

        // Set chart options
        var options = {
            'title':'Column '+colNum+' Frequencies',
            'width':460,
            'height':350
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('freq-graph'));
        chart.draw(data, options);
    }
})
