import { url } from "../server/url.js";

const ky = localStorage.getItem('key');
if(!ky) {
  window.location.replace("./login.html")
}

const tableHandler = document.querySelector('#table-pointer');
const spinnerHandler = document.querySelector('.spinner');
const selectHandler = document.querySelector("#inputGroupSelect01");
let finalDataPlot = [], finalLinePlot = [];
let teamMatchList = {};
let matchList;
let teamList;

window.addEventListener('DOMContentLoaded', async () => {
  spinnerHandler.style.display = 'block';

  const seasonRes = await fetch(url + "matches/season/list/",{
    headers: {
      "Content-Type": "application/json",
      "authorization": "Bearer "+localStorage.getItem('key')
    }
  });
  const seasonData = await seasonRes.json();

  const seasons = seasonData.data;
  if(seasons.length === 0) {
    alert("Please Add the IPL season before adding matches");
    window.location.replace('./season.html');
    return;
  }
  let j = 0;
  seasons.forEach(sea => {
    if(j===0) {
      selectHandler.value = sea.fields.season;
      j+=1;
    }
    selectHandler.innerHTML += `<option value=${sea.fields.season}>${sea.fields.season}</option>`
  });


    const res = await fetch(url+"teams/"+selectHandler.value+"/list/",{
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer "+localStorage.getItem('key')
      }
    });
    const teamData = await res.json();
    teamList = teamData.data;
    let i = 1;
    teamList.forEach(team => {
      let imagePresnt = false;
      if(team.pk === "DC" || team.pk === "DD" || team.pk === "RCB" || team.pk === "KKR" || team.pk === "CSK" || team.pk === "KXIP" || team.pk === "MI" || team.pk === "SRH" || team.pk === "RR") {
        imagePresnt = true;
      }
        tableHandler.innerHTML += `
        <tr class=${i%2==0 ? 'active-row' : "" }>
        <th scope="row">${i}</th>
        <td><img src="images/${team.fields.team_name}.png" alt="logo" onerror='this.style.background="${team.fields.team_color.toLowerCase()}"; this.src="images/zpxl.png";'/></td>
        <td>${team.fields.team_name}</td>
        <td>${team.fields.total_matches}</td>
        <td>${team.fields.points}</td>
        <td>${team.fields.wins}</td>
        <td>${team.fields.losses}</td>
        <td>${team.fields.nrr.toFixed(3)}</td>
      </tr>`;

      i+=1;
    });

    const resMatch = await fetch(url + "matches/"+selectHandler.value+"/list/",{
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer "+localStorage.getItem('key')
      }
    });
    const temp = await resMatch.json();
    matchList = temp.data;

    drawLineGraph();
    displayTeamList();
    callLinearRegression();
    spinnerHandler.style.display = 'none';

});

selectHandler.addEventListener('change', async (e) => {

  spinnerHandler.style.display = "block";

  const response = await fetch(url + "teams/"+selectHandler.value+"/list/",{
    headers: {
      "Content-Type": "application/json",
      "authorization": "Bearer "+localStorage.getItem('key')
    }
  });
  const resData = await response.json();
  teamList = resData.data;
  let i = 1;
  tableHandler.innerHTML = '';
    teamList.forEach(team => {
      let imagePresnt = false;
      if(team.pk === "DC" || team.pk === "DD" || team.pk === "RCB" || team.pk === "KKR" || team.pk === "CSK" || team.pk === "KXIP" || team.pk === "MI" || team.pk === "SRH" || team.pk === "RR") {
        imagePresnt = true;
      }
        tableHandler.innerHTML += `
        <tr class=${i%2==0 ? 'active-row' : "" }>
        <th scope="row">${i}</th>
        <td><img src="images/${team.fields.team_name}.png" alt="logo" onerror='this.style.background="${team.fields.team_color.toLowerCase()}"; this.src="images/zpxl.png";'/></td>
        <td>${team.fields.team_name}</td>
        <td>${team.fields.total_matches}</td>
        <td>${team.fields.points}</td>
        <td>${team.fields.wins}</td>
        <td>${team.fields.losses}</td>
        <td>${team.fields.nrr.toFixed(3)}</td>
      </tr>`;

      i+=1;
    });

    const res = await fetch(url + "matches/"+selectHandler.value+"/list/",{
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer "+localStorage.getItem('key')
      }
    });
    const playersList = await res.json();
    matchList = playersList.data;
    drawLineGraph();
    displayTeamList();
    callLinearRegression();

  spinnerHandler.style.display = "none";
});

const displayTeamList = () => {
  const ListTeam = document.querySelector('#teamListDisplay');

  ListTeam.innerHTML='';

  teamList.forEach(team => {
    ListTeam.innerHTML += `<li id=${team.fields.team_name}>${team.fields.team_name}</li>`
  });

  ListTeam.addEventListener('click', (e) => {
    let changeLineGraph = e.target.closest('li').id;
    for(const tm in teamMatchList) {
      if(tm === changeLineGraph) {
        console.log(teamMatchList[tm])
        finalLinePlot=[];
        let sm=0;
        finalLinePlot.push({y: sm})
        for(let j=0;j<teamMatchList[tm].length;j++) {
          if(teamMatchList[tm][j].match_won_txt===changeLineGraph) sm+=2;
          finalLinePlot.push({y: sm})
        }
      }
    }
    console.log(finalLinePlot);
    let lstTag = document.querySelectorAll('li');
    lstTag.forEach(li => {
      li.classList.remove('active');
    });
    e.target.closest('li').classList.add('active')
    drawLineGraph();
  })
}




// Line Graph of Teams
const drawLineGraph = () => {
  console.log("Entering")
  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "light2",
    title:{
      text: "Simple Line Chart"
    },
    data: [{        
      type: "line",
          indexLabelFontSize: 16,
      dataPoints: finalLinePlot
    }]
  });
  chart.render();
}


// Machine Learning multivalued Linear Regression
// probabilty = x1*nrrFactor + x2*pointsFactor + x3*winToLossFactor + x4*lastThreeMatchFactor
const nrrFactor = 0.15;
const pointsFactor = 0.30;
const winToLossFactor = 0.30;
const lastThreeMatchFactor = 0.20;
const lastMatchFactor = 0.05;

const callLinearRegression = () => {
  console.log(teamList, matchList);
  const teams = teamList, matches = matchList;
  const totalTeam = teamList.length;
  const predictorPoint = {};
  teamMatchList = {};

  // Total Points regression
  let totalPoints=0, minNRR = 0, maxNRR = 0;
  teams.forEach(team => {
    if(team.fields.nrr<minNRR) minNRR=team.fields.nrr;
    teamMatchList[team.fields.team_name] = [];
    totalPoints+=team.fields.points;
    predictorPoint[team.fields.team_name] = 0;
  });

  let totalNRR=0;
  teams.forEach(team => {
    if(maxNRR<team.fields.nrr - minNRR) maxNRR = team.fields.nrr;
    totalNRR += team.fields.nrr - minNRR;
    predictorPoint[team.fields.team_name] = (team.fields.points/totalPoints)*100;
  });

  // Net Run Rate regression
  const predictorNRR = {}, winLossRatio = {};
  let totalWinRate=0;
  teams.forEach(team => {
    winLossRatio[team.fields.team_name] = team.fields.wins/team.fields.total_matches;
    totalWinRate += team.fields.wins/team.fields.total_matches;
    predictorNRR[team.fields.team_name] = ((team.fields.nrr-minNRR)/totalNRR)*100;
  });

  // Win to Losses or Win Rate percentage ratio regression 
  const predictorWinRate = {};
  teams.forEach(team => {
    predictorWinRate[team.fields.team_name] = (winLossRatio[team.fields.team_name]/totalWinRate)*100;
  });

  // Previous three match strick regression
  const predictorLastThreeMatch = {};
  matches.forEach(match => {
    teamMatchList[match.fields.team_one_txt].push(match.fields);
    teamMatchList[match.fields.team_two_txt].push(match.fields);
  });
  
  const calculateProbLastThreeMatch = (team, listMatch) => {
    if(listMatch.length===0) return 0;
    if(listMatch.length<=3) {
      let sm=0;
      for(let i=0;i<listMatch.length;i++) {
        if(listMatch[i].match_won_txt===team) sm+=1/3;
      }
      return sm;
    } else {
      let sm=0;
      for(let i=listMatch.length-1; i>=listMatch.length-3;i--) {
        if(listMatch[i].match_won_txt===team) sm+=1/3;
      }
      return sm;
    }
  }
  
  for(const team in teamMatchList) {
    predictorLastThreeMatch[team] = calculateProbLastThreeMatch(team, teamMatchList[team]);
  }
  
  let lastThreeSum=0;
  for(const i in predictorLastThreeMatch) {
    lastThreeSum+=predictorLastThreeMatch[i];
  }

  for(const i in predictorLastThreeMatch) {
    predictorLastThreeMatch[i]=(predictorLastThreeMatch[i]/lastThreeSum)*100;
  }

  // Last Match Regression
  const calculateProbLastMatch = (team, listMatch) => {
    if(listMatch.length===0) return 0;
    return (listMatch[listMatch.length-1].match_won_txt===team) ? 1 : 0;
  };

  const predictorLastMatch = {};
  for(const team in teamMatchList) {
    predictorLastMatch[team] = calculateProbLastMatch(team, teamMatchList[team]);
  }

  let lastSum=0;
  for(const i in predictorLastMatch) {
    lastSum+=predictorLastMatch[i];
  }
  for(const i in predictorLastMatch) {
    predictorLastMatch[i]=(predictorLastMatch[i]/lastSum)*100;
  }

  // Final integration of all reggression variable
  // creating data points for chat plotting
  const finalPredictor = {};
  finalDataPlot = [];
  teams.forEach(team => {
    const teamName=team.fields.team_name;
    finalPredictor[teamName] = predictorPoint[teamName]*pointsFactor + predictorNRR[teamName]*nrrFactor + predictorWinRate[teamName]*winToLossFactor + predictorLastThreeMatch[teamName]*lastThreeMatchFactor + predictorLastMatch[teamName]*lastMatchFactor;
    finalDataPlot.unshift({country: teamName, research: parseFloat(finalPredictor[teamName].toFixed(2)) });
  })

  console.log(finalPredictor, finalDataPlot);
  console.log(teamMatchList);

  plotGraph();
  
  // console.log(predictorPoint, predictorNRR, predictorWinRate, predictorLastThreeMatch, predictorLastMatch);
}


// graph ploting
const plotGraph = () => {


am4core.ready(function() {

  // Themes begin
  am4core.useTheme(am4themes_material);
  am4core.useTheme(am4themes_animated);
  // Themes end
  
  // Create chart instance
  var chart = am4core.create("chartdiv", am4charts.XYChart);
  
  // Add data
  var data = finalDataPlot;
  
  chart.data = data;
  // Create axes
  var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = "country";
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.renderer.minGridDistance = 10;
  categoryAxis.interpolationDuration = 2000;
  
  var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
  
  // Create series
  function createSeries(field, name) {
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = "research";
    series.dataFields.categoryY = "country";
    series.columns.template.tooltipText = "[bold]{valueX}[/]";
    series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
  
    var hs = series.columns.template.states.create("hover");
    hs.properties.fillOpacity = 0.7;
  
    var columnTemplate = series.columns.template;
    columnTemplate.maxX = 0;
    columnTemplate.draggable = true;
  
    columnTemplate.events.on("dragstart", function (ev) {
      var dataItem = ev.target.dataItem;
  
      var axislabelItem = categoryAxis.dataItemsByCategory.getKey(
        dataItem.categoryY
      )._label;
      axislabelItem.isMeasured = false;
      axislabelItem.minX = axislabelItem.pixelX;
      axislabelItem.maxX = axislabelItem.pixelX;
  
      axislabelItem.dragStart(ev.target.interactions.downPointers.getIndex(0));
      axislabelItem.dragStart(ev.pointer);
    });
    columnTemplate.events.on("dragstop", function (ev) {
      var dataItem = ev.target.dataItem;
      var axislabelItem = categoryAxis.dataItemsByCategory.getKey(
        dataItem.categoryY
      )._label;
      axislabelItem.dragStop();
      handleDragStop(ev);
    });
  }
  createSeries("research", "Research");
  
  function handleDragStop(ev) {
    data = [];
    chart.series.each(function (series) {
      if (series instanceof am4charts.ColumnSeries) {
        series.dataItems.values.sort(compare);
  
        var indexes = {};
        series.dataItems.each(function (seriesItem, index) {
          indexes[seriesItem.categoryY] = index;
        });
  
        categoryAxis.dataItems.values.sort(function (a, b) {
          var ai = indexes[a.category];
          var bi = indexes[b.category];
          if (ai == bi) {
            return 0;
          } else if (ai < bi) {
            return -1;
          } else {
            return 1;
          }
        });
  
        var i = 0;
        categoryAxis.dataItems.each(function (dataItem) {
          dataItem._index = i;
          i++;
        });
  
        categoryAxis.validateDataItems();
        series.validateDataItems();
      }
    });
  }
  
  function compare(a, b) {
    if (a.column.pixelY < b.column.pixelY) {
      return 1;
    }
    if (a.column.pixelY > b.column.pixelY) {
      return -1;
    }
    return 0;
  }
  
  }); // end am4core.ready()

}