<?php
$filename = "kddcup.testdata.10000.csv";	//input file
$delimeter = ",";	//split string using 'comma'

//if file exists and can be read
if(!file_exists($filename) || !is_readable($filename))
    return FALSE;

//array to hold CSV file
$data = array();

$numOfRows = 0;
if (($handle = fopen($filename, 'r')) !== FALSE) //open file
{
    //read 1024 chunk of file at once and split the string using delimeter
    while (($row = fgetcsv($handle, 1024, $delimeter)) !== FALSE)
    {
        //index of $data hold whole array
        $data[$numOfRows] = $row;
        $numOfRows++;
    }
    fclose($handle);
}
?>
