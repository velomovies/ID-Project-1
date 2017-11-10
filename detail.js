//This code is based on https://bl.ocks.org/mbostock/3887051 and https://bl.ocks.org/mbostock/3887235 by Mike Bostock. I created my own version of it and added some code.

//The code from this example is a little bit the same as index.js. I will explain the parts that I've not discussed yet.
var svg = d3.select("body").append("svg").attr("width", 600).attr("height", 500),
//The difference now is that there will be two charts on one page
  svg2 = d3.select("body").append("svg").attr("width", 600).attr("height", 500),
  margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
  },
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom,
  radius = (Math.min(width, height) / 2) - 30,
  g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
  g2 = svg2.attr("transform", "translate(30,0)").append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

//For the pie chart there will be a few standard things. Like the radius, color and some calculations.
var color = d3.scaleOrdinal(["#556F44", "#95BF74"])

var pie = d3.pie()
.sort(null)
.value(function(d) {
  return d.percentage; })

var path = d3.arc()
.outerRadius(radius - 10)
.innerRadius(0)

var label = d3.arc()
.outerRadius(radius - 40)
.innerRadius(radius - 40)

var x0 = d3.scaleBand()
  .rangeRound([0, width])
  .paddingInner(0.1)

var x1 = d3.scaleBand()
  .padding(0.05)

var y = d3.scaleLinear()
  .rangeRound([height, 0])

var z = d3.scaleOrdinal()
  .range(["#283F3B", "#556F44", "#659B5E", "#95BF74", "#99DDC8"])

var ooitDrugs = document.getElementsByName("frequentie")[0],
  veelDrugs = document.getElementsByName("frequentie")[1],
  weinigDrugs = document.getElementsByName("frequentie")[2]

//To use the right data there are two parameters in the link. They will help to select the right data.
var url_string = window.location.href,
  url = new URL(url_string),
  year = url.searchParams.get("y"),
  drugs = url.searchParams.get("d"),
//Here is a check for the year. When the year is 2015 it will output 0 otherwise it will output 1
  i = Number((year == 2015 ? "0" : "1"))

  document.querySelector("h1").innerHTML = "Informatie over: " + drugs

//Loading the csv from CBS as an text so I can clean it
d3.text("index.csv")
  .get(onload)

//When the csv is loaded it will start a function for cleaning it
function onload(err, doc) {
  if (err) throw err

  //Start the clean up. This is based on the code from the cleaning example.
  var header = doc.indexOf("Kenmerken personen")
  doc = doc.slice(header)
  end = doc.indexOf("\n", doc)
  doc = doc.slice(end).trim()
  doc = doc.replace(/,/g, "").replace(/"+/g, "").replace(/;+/g, ",")
  end = doc.indexOf("�")
  doc = doc.substring(0, end).trim()
  cleanData = d3.csvParseRows(doc, map)

  function map(d, i) {
    return {
      categorie: d[0],
      jaar: d[1],
      cannabisgebruik_maand: Number(d[2]),
      cannabisgebruik_jaar: Number(d[3]),
      cannabisgebruik_ooit: Number(d[4]),
      amfetaminegebruik_maand: Number(d[5]),
      amfetaminegebruik_jaar: Number(d[6]),
      amfetaminegebruik_ooit: Number(d[7]),
      ecstasygebruik_maand: Number(d[8]),
      ecstasygebruik_jaar: Number(d[9]),
      ecstasygebruik_ooit: Number(d[10]),
      cocainegebruik_maand: Number(d[11]),
      cocainegebruik_jaar: Number(d[12]),
      cocainegebruik_ooit: Number(d[13]),
      overige_drugsgebruik_maand: Number(d[14]),
      overige_drugsgebruik_jaar: Number(d[15]),
      overige_drugsgebruik_ooit: Number(d[16]),
      totaal_drugsgebruik_maand: Number(d[16]),
      totaal_drugsgebruik_jaar: Number(d[16]),
      totaal_drugsgebruik_ooit: Number(d[16])
    }
  }

  data2 = d3.nest()
    .key(function(d) {
      return d.categorie
    })
    .entries(cleanData)
    .map(function(d) {
        return {
          categorie: d.key,
          Cannabis: d.values[0].cannabisgebruik_ooit,
          Amfetamine: d.values[0].amfetaminegebruik_ooit,
          Ecstasy: d.values[0].ecstasygebruik_ooit,
          Cocaïne: d.values[0].cocainegebruik_ooit,
          Overig: d.values[0].overige_drugsgebruik_ooit
        }
    })

    data2.splice(0,18)

//The data for the grouped chart was not right. So I had to put it in an own made array. It first checks in the parameters what drugs is selected. With more time I could make this check better readable and more efficient
  groupedData = []
   if(drugs == "Cannabis") {
    groep1 = {
      categorie: "Laagste inkomen/vermogen",
      Inkomen: data2[0].Cannabis,
      Vermogen: data2[5].Cannabis
    }
    groep2 = {
      categorie: "2e groep",
      Inkomen: data2[1].Cannabis,
      Vermogen: data2[6].Cannabis
    }
    groep3 = {
      categorie: "3e groep",
      Inkomen: data2[2].Cannabis,
      Vermogen: data2[7].Cannabis
    }
    groep4 = {
      categorie: "4e groep",
      Inkomen: data2[3].Cannabis,
      Vermogen: data2[8].Cannabis
    }
    groep5 = {
      categorie: "Hoogste inkomen/vermogen",
      Inkomen: data2[4].Cannabis,
      Vermogen: data2[9].Cannabis
    }
  } else  if(drugs == "Amfetamine") {
    groep1 = {
      categorie: "Laagste inkomen/vermogen",
      Inkomen: data2[0].Amfetamine,
      Vermogen: data2[5].Amfetamine
    }
    groep2 = {
      categorie: "2e groep",
      Inkomen: data2[1].Amfetamine,
      Vermogen: data2[6].Amfetamine
    }
    groep3 = {
      categorie: "3e groep",
      Inkomen: data2[2].Amfetamine,
      Vermogen: data2[7].Amfetamine
    }
    groep4 = {
      categorie: "4e groep",
      Inkomen: data2[3].Amfetamine,
      Vermogen: data2[8].Amfetamine
    }
    groep5 = {
      categorie: "Hoogste inkomen/vermogen",
      Inkomen: data2[4].Amfetamine,
      Vermogen: data2[9].Amfetamine
    }
  } else  if(drugs == "Ecstasy") {
      groep1 = {
        categorie: "Laagste inkomen/vermogen",
        Inkomen: data2[0].Ecstasy,
        Vermogen: data2[5].Ecstasy
      }
      groep2 = {
        categorie: "2e groep",
        Inkomen: data2[1].Ecstasy,
        Vermogen: data2[6].Ecstasy
      }
      groep3 = {
        categorie: "3e groep",
        Inkomen: data2[2].Ecstasy,
        Vermogen: data2[7].Ecstasy
      }
      groep4 = {
        categorie: "4e groep",
        Inkomen: data2[3].Ecstasy,
        Vermogen: data2[8].Ecstasy
      }
      groep5 = {
        categorie: "Hoogste inkomen/vermogen",
        Inkomen: data2[4].Ecstasy,
        Vermogen: data2[9].Ecstasy
      }
    } else  if(drugs == "Cocaïne") {
        groep1 = {
          categorie: "Laagste inkomen/vermogen",
          Inkomen: data2[0].Cocaïne,
          Vermogen: data2[5].Cocaïne
        }
        groep2 = {
          categorie: "2e groep",
          Inkomen: data2[1].Cocaïne,
          Vermogen: data2[6].Cocaïne
        }
        groep3 = {
          categorie: "3e groep",
          Inkomen: data2[2].Cocaïne,
          Vermogen: data2[7].Cocaïne
        }
        groep4 = {
          categorie: "4e groep",
          Inkomen: data2[3].Cocaïne,
          Vermogen: data2[8].Cocaïne
        }
        groep5 = {
          categorie: "Hoogste inkomen/vermogen",
          Inkomen: data2[4].Cocaïne,
          Vermogen: data2[9].Cocaïne
        }
      } else  if(drugs == "Overig") {
          groep1 = {
            categorie: "Laagste inkomen/vermogen",
            Inkomen: data2[0].Overig,
            Vermogen: data2[5].Overig
          }
          groep2 = {
            categorie: "2e groep",
            Inkomen: data2[1].Overig,
            Vermogen: data2[6].Overig
          }
          groep3 = {
            categorie: "3e groep",
            Inkomen: data2[2].Overig,
            Vermogen: data2[7].Overig
          }
          groep4 = {
            categorie: "4e groep",
            Inkomen: data2[3].Overig,
            Vermogen: data2[8].Overig
          }
          groep5 = {
            categorie: "Hoogste inkomen/vermogen",
            Inkomen: data2[4].Overig,
            Vermogen: data2[9].Overig
          }
        }

//The right data is pushed in the array. This is the way the code reads the data
  groupedData.push(groep1, groep2, groep3, groep4, groep5)

//As before you have to make sure the columns array is set properly so the code will run right
  var keys = function() {
      groupedData["columns"] = [
        "categorie",
        "Inkomen",
        "Vermogen"
      ]
      return groupedData.columns.slice(1)
  }()

//For the pie chart I made another dataset
  dataMapped = d3.nest()
    .key(function(d) {
      return d.jaar
    })
    .entries(cleanData)
    .map(function(d) {
        return {
          categorie_man: d.key,
          Cannabis_man: d.values[1].cannabisgebruik_ooit,
          Amfetamine_man: d.values[1].amfetaminegebruik_ooit,
          Ecstasy_man: d.values[1].ecstasygebruik_ooit,
          Cocaïne_man: d.values[1].cocainegebruik_ooit,
          Overig_man: d.values[1].overige_drugsgebruik_ooit,
          Cannabis_vrouw: d.values[2].cannabisgebruik_ooit,
          Amfetamine_vrouw: d.values[2].amfetaminegebruik_ooit,
          Ecstasy_vrouw: d.values[2].ecstasygebruik_ooit,
          Cocaïne_vrouw: d.values[2].cocainegebruik_ooit,
          Overig_vrouw: d.values[2].overige_drugsgebruik_ooit
        }
    })

//As you can see is this a function that almost does the same as above only with other data. It will check what drugs is chosen. After that it will create a custom dataset.
    function dataSet() {
      data = []

      if(drugs == "Cannabis") {
        Vrouw = {
          percentage: dataMapped[i].Cannabis_vrouw,
          geslacht: "Vrouw"
        }
        Man = {
          percentage: dataMapped[i].Cannabis_man,
          geslacht: "Man"
        }
      } else if(drugs == "Amfetamine") {
        Vrouw = {
          percentage: dataMapped[i].Amfetamine_vrouw,
          geslacht: "Vrouw"
        }
        Man = {
          percentage: dataMapped[i].Amfetamine_man,
          geslacht: "Man"
        }
      } else if(drugs == "Cocaïne") {
        Vrouw = {
          percentage: dataMapped[i].Cocaïne_vrouw,
          geslacht: "Vrouw"
        }
        Man = {
          percentage: dataMapped[i].Cocaïne_man,
          geslacht: "Man"
        }
      } else if(drugs == "Ecstasy") {
        Vrouw = {
          percentage: dataMapped[i].Ecstasy_vrouw,
          geslacht: "Vrouw"
        }
        Man = {
          percentage: dataMapped[i].Ecstasy_man,
          geslacht: "Man"
        }
      } else if(drugs == "Overig") {
        Vrouw = {
          percentage: dataMapped[i].Overig_vrouw,
          geslacht: "Vrouw"
        }
        Man = {
          percentage: dataMapped[i].Overig_man,
          geslacht: "Man"
        }
      }
      data.push(Vrouw, Man)

      data["columns"] = [
        "percentage",
        "geslacht"
      ]

      return data
  }

//For the pie chart it will make an arc and connect the custom dataset to it
  var arc = g.selectAll(".arc")
    .data(pie(dataSet()))
    .enter().append("g")
      .attr("class", "arc")

//It makes sure the path is right and setting the right color
  arc.append("path")
    .attr("d", path)
    .attr("fill", function(d) {
      return color(d.data.geslacht); })

//Inside the circle I put two text elements so it shows which part is what. Next to that it shows the right percentage
  arc.append("text")
    .attr("transform", function(d) {
      return "translate(" + (label.centroid(d)[0] - 20) + "," + label.centroid(d)[1] + ")"; })
    .attr("dy", "0.35em")
    .text(function(d) {
       return d.data.geslacht
     })

  arc.append("text")
    .attr("transform", function(d) {
      return "translate(" + (label.centroid(d)[0] - 15) + "," + (label.centroid(d)[1] + 20) + ")"; })
    .attr("dy", "0.35em")
//It will add a text that represents the percentage. I made a calculation myself. The outcome is the right percntage
    .text(function(d) {
      return Math.round(d.data.percentage / (data[0].percentage + data[1].percentage) * 100) + "%"
    })


///////////////////////////////////////////////////////////////////////////////////////

//This is exactly the same code as index.js. The difference being the position, which is set in earlier code.

  x0.domain(groupedData.map(function(d) {
    return d.categorie
  }))
  x1.domain(keys).rangeRound([0, x0.bandwidth()])
  y.domain([0, d3.max(groupedData, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

  g2.append("g")
    .selectAll("g")
    .data(groupedData)
    .enter().append("g")
    .attr("transform", function(d) {
      return "translate(" + x0(d.categorie) + ",0)"
    }).attr("class", "chart")
    .selectAll("rect")
    .data(function(d) {
      return keys.map(function(key) {
        return {
          key: key,
          value: d[key],
          year: d.categorie
        }
      })
    })
    .enter().append("a")
    .append("rect")
    .attr("width", x1.bandwidth())
    .attr("fill", function(d) {
      return z(d.key)
    })
    .attr("class", "bar")
    .attr("x", function(d) {
      return x1(d.key)
    })
      .transition()
      .duration(100)
      .delay(function(d, i) {
        return i * 100 })
    .attr("y", function(d) {
      return y(d.value)
    })
    .attr("height", function(d) {
      return height - y(d.value)
    })


  g2.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x0))

  g2.append("g")
    .attr("class", "axis--y")
    .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
    .attr("x", 2)
    .attr("y", y(y.ticks().pop()) + 0.5)
    .attr("dy", "0.32em")
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "start")
    .text("%")

  var legend = g2.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
    .attr("transform", function(d, i) {
      return "translate(0," + i * 20 + ")"
    })

  legend.append("rect")
    .attr("x", width - 19)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", z)

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(function(d) {
      return d
    })


}
