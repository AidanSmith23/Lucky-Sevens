function rollDice(){
  return Math.ceil(Math.random()*6);
}

// These elements will be used in both functions.
var $betting = document.forms["betting"];
var start = document.getElementById("start");
var speed = 1;
var submitButton = document.getElementById("submitButton");


var startMoney;
var money;
var count = 0;
var maxMoney;
var maxCount = 0;
var update;
var chart;

function validate() {

    clearInterval(update);
    betting.className = "needs-validation";

    if (!betting.checkValidity()) {
        betting.className = "was-validated";
        return false;
    }


    money = parseFloat(start.value);
    maxMoney = money;
    startMoney = money;
    count = 0;
    maxCount = 0;

    chart = new CanvasJS.Chart("chartContainer", {
      data: [
      {
        type: "line",
        markerType: "none",
        dataPoints: [
          { y: money },
        ]
      }
    ],
    axisY:{
			stripLines:[
			{
        color: "green",
        thickness: 5
			}
    ],},

    });


    document.getElementById("sum").innerText = 2;
    document.getElementById('dice1').src=('images/dice1.png');
    document.getElementById('dice2').src=('images/dice1.png');
    results.style.display = "none";
    live.style.display = "block";
    chartContainer2.style.display = "none";
    chartContainer.style.display = "block";


    if (automatic.checked){
      speed = parseFloat(document.getElementById("speed").value);
      update = setInterval(updateTable, 300/speed);

        updateTable();
    }
    else{
      rollButton.style.display = "block";
      document.getElementById("rolls").innerText = count;
      document.getElementById("winnings").innerText = "£" + money.toFixed(2);
    }
    chart.render();

    submitButton.innerText = "Replay";

    // We always return false so that the form doesn't submit.
    // Submission causes the page to reload.

    if (instant.checked){
      changeInstant();
    }

    return false;
}


function updateTable(){
  if (money>0){
    count ++;
    var dice1 = rollDice();
    var dice2 = rollDice();
    document.getElementById("sum").innerText = (dice1 + dice2).toString();
    document.getElementById('dice1').src=('images/dice' + dice1 + '.png');
    document.getElementById('dice2').src=('images/dice' + dice2 + '.png');
    if (dice1+dice2==7){
      money += 4;
      if (money>=startMoney){
        chart.options.data[0].lineColor = "green";
      }
      if (money>maxMoney){
        maxMoney=money;
        maxCount = count;
      }
    }
    else{
      money -= 1;
      if (money<startMoney){
        chart.options.data[0].lineColor = "red";
      }
    }

    document.getElementById("rolls").innerText = count;
    document.getElementById("winnings").innerText = "£" + money.toFixed(2);

    var length = chart.options.data[0].dataPoints.length;
  	chart.options.data[0].dataPoints.push({ y: money});
  	chart.render();

  }
  else{
    clearInterval(update);
    live.style.display = "none";
    document.getElementById("startingBet").innerText = "£" + startMoney.toFixed(2);
    document.getElementById("totalRolls").innerText = count;
    document.getElementById("highestAmount").innerText = "£" + maxMoney.toFixed(2);
    document.getElementById("rollCountHigh").innerText = maxCount;
    results.style.display = "block";
    var chart2 = new CanvasJS.Chart("chartContainer2", chart.options);
    chartContainer.style.display = "none";
    chartContainer2.style.display = "block";
    chart2.options.axisY.stripLines[0].value = maxMoney;
    chart2.render();

  }

}

function changeSpeed (){

  betting.className = "needs-validation";

  if (!betting.checkValidity()) {

      betting.className = "was-validated";
      return false;
  }

  clearInterval(update);
  speed = parseFloat(document.getElementById("speed").value);
  update = setInterval(updateTable, 300/speed);
}

function changeAuto () {
  speedBox.style.display = "block";
  if (money > 0){
    update = setInterval(updateTable, 300/speed);
  }
  rollButton.style.display = "none";
}

function changeManual() {
  clearInterval(update);
  speedBox.style.display = "none";

  if (money > 0){
    rollButton.style.display = "block";
  }
}

function changeInstant() {
  clearInterval(update);
  speedBox.style.display = "none";
  rollButton.style.display = "none";

  if (money>0){
    while (money>0){
      count ++;
      var dice1 = rollDice();
      var dice2 = rollDice();
      if (dice1+dice2==7){
        money += 4;
        if (money>maxMoney){
          maxMoney=money;
          maxCount = count;
        }
      }
      else{
        money -= 1;
      }
      var length = chart.options.data[0].dataPoints.length;
    	chart.options.data[0].dataPoints.push({ y: money});
    }
    updateTable();
  }
}


document.getElementById("speed").addEventListener("change", changeSpeed);
document.getElementById("automatic").addEventListener("change", changeAuto);
document.getElementById("manual").addEventListener("change", changeManual);
document.getElementById("instant").addEventListener("change", changeInstant);
document.getElementById("rollButton").addEventListener("click", updateTable);
