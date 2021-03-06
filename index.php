<?php
include("parser.php");
?>

<html>
    <head>
        <link href="style.css" rel="stylesheet" type="text/css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    </head>
    <script>
        var security_data = <?php echo json_encode($data) ?>;
    </script>
    <header>
        <h2>SIEM Project</h2>
    </header>
    <body>
        <div class="container">
            <div id="data">
                <button id="load-btn">Load data</button>
                <div id="data-table">

                </div>
            </div>
            <div id="graphs">
                <div class="frequency">
                    <div class="div-header">
                        <h2>Frequencies</h2>
                        <span>Click the column headers</span>
                    </div>
                    <div id="freq-graph"></div>
                </div>
                <div class="irregularities">
                    <div class="div-header">
                        <h2>Irregularities</h2>

                    </div>
                    <div id="irregular-txt"></div>
                    <div id="check" style="display: none;">
                        <input type="checkbox" id="irregular-check" name="irr" ><label for="irr"> Show only irregular events</label>
                    </div>

                </div>
            </div>
        </div>
        <script src="main.js"></script>
    </body>
</html>
