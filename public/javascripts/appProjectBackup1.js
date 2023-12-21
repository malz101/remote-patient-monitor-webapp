/**********************
 *MAIN SECTION OF CODE*
 **********************/
var bpmChartRef,tempChartRef,acclChartRef, timearray, lastTime,taxis_len=20000, timeout=10000000000;
const maxDataLen=200;
renderBpmChart();//creates bpm chart
renderTempChart();//creates temperature chart
renderAcclChart();//creates accleration chart

/*FUNCTION TO HIDE OR SHOW TABLE*/
document.getElementById('table-button').addEventListener('click', function () {
    var tableSection = document.getElementById("tableSection");
    var button = document.getElementById("table-button");
    if (tableSection.style.display === "none" || tableSection.style.display==="") {
        tableSection.style.display = "block";
        button.innerText="Hide Table";
      } else {
        tableSection.style.display = "none";
        button.innerText="Show Table";
      }
  });

/*CODE FOR AUTOMATIC REFRESH */
setInterval(function(){
    ajax("/addDatatoChart","POST",{id:"0001"},() => {});
}, 1000);







/**********************
 *FUNCTION DEFINITIONS*
 **********************/

function ajax(url, method, payload, successCallback){
    //console.log(JSON.stringify(payload));
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4 || xhr.status != 200) return;
        var data = JSON.parse(xhr.responseText);
        var now = new Date();
        console.log(data);
        //lastTime = data.lastTime;//stores timestamp of last data received
        
        if(data.status==1){//only process data if a status of 1 is received (basically an Ok status from server)
            data.dataPoints.forEach(function(newData) {
                checkForCriticalVitals(newData);//displays message for critical conditions
                updateVitals(newData);//updates vitals being display
                updateTable(newData);//shows table with log of all previous vital readings
                updateCharts(newData);//update charts
            });//ENDOF FOR EACH FUNCTION
        }//End of IF(data.status==1)
        else if(data.con_stat>timeout){
            var errorsArea = document.getElementById("errorArea");
            errorsArea.innerText="CONNECTION OF LOCAL SYSTEM TO SERVER HAS BEEN LOST";
            //alert("CONNECTION OF LOCAL SYSTEM TO SERVER HAS BEEN LOST");
            // bpmChartRef.data.datasets[0].data=[];
            // tempChartRef.data.datasets[0].data=[];
            // acclChartRef.data.datasets[0].data=[];
            // bpmChartRef.update();
            // tempChartRef.update();
            // acclChartRef.update();
        }
        ((bpmChartRef.options.scales.xAxes)[0]).ticks.min=now-taxis_len;
        bpmChartRef.update();//updates heart rate chart
        tempChartRef.update();//updates temperature chart
        acclChartRef.update();//updates accleration chart

        successCallback(xhr.responseText);
    };
    xhr.send(JSON.stringify(payload));
}//END OF AJAX FUNCTION


 /*CHECKING PATIENT VITALS FOR ALERTS*/
function checkForCriticalVitals(newData){
    var field_errors ="ATTENTION!:\n";
    if(newData.bpm>100){field_errors+="Patient Heart Rate is critical!\n";}
    if(newData.temp<20 || newData.temp>40){field_errors+="Patient Temperature is critical!\n";}
    if(newData.alert=="FELL!"){field_errors+="Patient has FALLEN!\n";}
    if(newData.alert=="HELP!"){field_errors+="Patient needs HELP!\n";}

    var errorsArea = document.getElementById("errorArea");
    if(field_errors != "ATTENTION!:\n"){
        errorsArea.innerText=field_errors;
    }
    else{
        errorsArea.innerText="";
    }
}

/*UPDATING VITALS*/
function updateVitals(newData){
                
    var bpm = document.getElementById("bpm");
    var temp = document.getElementById("temp");
    var pos = document.getElementById("pos");
    var accl = document.getElementById("accl");
    bpm.innerText = newData.bpm+"bpm";
    temp.innerText = newData.temp+"°C";
    pos.innerText = newData.pos;
    accl.innerText = newData.accl+"m/s";
}

/*UPDATING PATIENT VITAL TABLE*/
function updateTable(newData){
    var table = document.getElementById("patientTable");
    var row = table.insertRow(2);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    //var cell8 = row.insertCell(7);
    cell1.innerHTML = newData.id;
    cell2.innerHTML = newData.bpm;
    cell3.innerHTML = newData.temp;
    cell4.innerHTML = newData.pos;
    cell5.innerHTML = newData.accl;
    cell6.innerHTML = newData.alert;
    cell7.innerHTML = new Date(newData.time);
    //cell8.innerHTML = date;
}


/*UPDATE CHARTS*/
function updateCharts(newData){
    let bpmData = bpmChartRef.data.datasets[0].data;
    let tempData = tempChartRef.data.datasets[0].data;
    let acclData = acclChartRef.data.datasets[0].data;
    //=let bpmDataLabels =bpmChartRef.data.labels;
    let time = new Date(newData.time);
    /*UPDATING BPM CHART*/
    if(bpmData.length > maxDataLen){
        //bpmDataLabels.splice(0, 1); // remove the label first
        bpmData.splice(0, 1);//removes first data value
    }
    //bpmDataLabels.push(newData.time);//adds new time label
    bpmData.push({
        x:time,
        y:newData.bpm
    });//adds new bpm data
    //((bpmChartRef.options.scales.xAxes)[0]).ticks.min=new Date()-20000;
    // console.log("difference",new Date(lastTime)-20000);
    //console.log(((bpmChartRef.options.scales.xAxes)[0]).ticks.min);
    bpmChartRef.update();//updates bpm chart


    /*UPDATING TEMPERATURE CHART*/
    if(tempData.length > maxDataLen){
        //tempChartRef.data.labels.splice(0, 1); // remove the label first
        tempData.splice(0, 1);//removes first data value
    }
    //tempChartRef.data.labels.push(newData.time);//adds new time label
    tempData.push({
        x:time,
        y:newData.temp
    });//adds new temperature data
    tempChartRef.update();//updates temperature chart


    /*UPDATING ACCLERATION CHART*/
    if(acclData.length > maxDataLen){
        //acclChartRef.data.labels.splice(0, 1); // remove the label first
        acclData.splice(0, 1);//removes first data value
    }
    //acclChartRef.data.labels.push(newData.time);//adds new time data
    acclData.push({
        x:time,
        y:newData.accl
    });//adds new acceleration data
    acclChartRef.update();
}


/*FUNCTION TO MAKE BPM CHART*/
function renderBpmChart() {
    var bpmconfig = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Beats per Minute (bpm)',//this was disabled by using legend below
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(192,75,192,0.4)",
                borderColor: "rgba(192,75,192,1)",
                borderCapStyle: 'butt',
                borderJoinStyle: 'miter',
                data: []
            }]//End of dataset
        },
        options: {
            legend:{
                display:false //hides the label for each dataset
            },
            responsive: true,
            title: {
                display: true,
                text: "Chart Showing Patient's Heart Rate"
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    type: 'time',
                    time:{
                        unit: 'second',
                        unitStepSize: 5,
                        displayFormats: {second: 'h:mm:ss a'},
                        distribution: 'linear',
                    },
                    ticks:{},
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Beats Per Minute (bpm)'
                    }
                }]
            }
        }
    };

    var bpmCTX = document.getElementById('bpmCanvas').getContext("2d");
    bpmChartRef = new Chart(bpmCTX, bpmconfig );
}//End of renderBpmChart




/*FUNCTION TO MAKE TEMPERATURE CHART*/
function renderTempChart() {
    var tempconfig = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature (°C)',//this was disabled using legend below
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(67,75,192,0.4)",
                borderColor: "rgba(67,75,192,1)",
                borderCapStyle: 'butt',
                borderJoinStyle: 'miter',
                data: []
            }]//End of dataset
        },
        options: {
            legend:{
                display:false //hides the label for each dataset
            },
            responsive: true,
            title: {
                display: true,
                text: "Chart Showing Patient's Temperature"
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    type: 'time',
                    time:{
                        unit: 'second',
                        unitStepSize: 5,
                        displayFormats: {second: 'h:mm:ss a'},
                        distribution: 'linear',
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Temperature (°C)'
                    }
                }]
            }
        }
    };

    var tempCTX = document.getElementById('hrCanvas').getContext('2d');
    tempChartRef = new Chart(tempCTX, tempconfig);   //hear rate chart

}//End of renderTempChart




/*FUNCTION TO MAKE ACCLERATION CHART*/
function renderAcclChart() {
    var acclconfig = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Accleration (m/s)',//this was disabled using legend below
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderJoinStyle: 'miter',
                data: []
            }]//End of dataset
        },
        options: {
            legend:{
                display:false //hides the label for each dataset
            },
            responsive: true,
            title: {
                display: true,
                text: "Chart Showing Patient's Acceleration"
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    type: 'time',
                    time:{
                        unit: 'second',
                        unitStepSize: 5,
                        displayFormats: {second: 'h:mm:ss a'},
                        distribution: 'linear',
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Acceleration (m/s)'
                    }
                }]
            }
        }
    };

    var acclCTX = document.getElementById('acclCanvas').getContext('2d');
    acclChartRef = new Chart(acclCTX, acclconfig);   //hear rate chart

}//End of renderAcclChart

