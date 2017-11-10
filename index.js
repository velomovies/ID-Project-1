//This code is based on https://bl.ocks.org/mbostock/3887235 by Mike Bostock. I created my own version of it and added some code.

//Set variables to render an svg and so you can use it later
var svg = d3.select("body").append("svg").attr("width", 960).attr("height", 500),
  margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
  },
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom,
  g = svg.attr("transform", "translate(30,0)").append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

//These are some variables for creating the right scale and color for the grouped bar chart
var x0 = d3.scaleBand()
  .rangeRound([0, width])
  .paddingInner(0.1)

var x1 = d3.scaleBand()
  .padding(0.05)

var y = d3.scaleLinear()
  .rangeRound([height, 0])

var z = d3.scaleOrdinal()
  .range(["#283F3B", "#556F44", "#659B5E", "#95BF74", "#99DDC8"])

//This gets the input of which data the user wants to see
var ooitDrugs = document.getElementsByName("frequentie")[0],
  veelDrugs = document.getElementsByName("frequentie")[1],
  weinigDrugs = document.getElementsByName("frequentie")[2]

//For setting the scale of the y-axis there is a variable that checks the selected value
var scale = document.querySelector(".range").value

//Loading the csv from CBS as an text so I can clean it
d3.text("index.csv")
  .get(onload)

//When the csv is loaded it will start a function for cleaning it
function onload(err, doc) {
  if (err) throw err

  //Start the clean up. This is based on the code from frontend 3.
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

//When the data is cleaned it categorized by year and given a few keys. This is so we can use the right data
  data = d3.nest()
    .key(function(d) {
      return d.jaar
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

//The code uses a array columns. Here I set it with some parameters
  var keys = function() {
      data["columns"] = [
        "categorie",
        "Cannabis",
        "Amfetamine",
        "Ecstasy",
        "Cocaïne",
        "Overig"
      ]
      return data.columns.slice(1)
  }()

//Setting a domain to get the scale of the chart right
  x0.domain(data.map(function(d) {
    return d.categorie
  }))
  x1.domain(keys).rangeRound([0, x0.bandwidth()])
  y.domain([0, 22])

//Making the barchart itself. Appending some groups and connect the data to them
  g.append("g")
    .selectAll("g")
    .data(data)
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
//Every rectangle gets an personal link that is used for the detail page
    .attr("xlink:href", function(d) {
      return "detail.html?d=" + d.key + "&y=" + d.year})
    .append("rect")
    .attr("width", x1.bandwidth())
    .attr("fill", function(d) {
      return z(d.key)
    })
    .attr("class", "bar")
    .attr("x", function(d) {
      return x1(d.key)
    })
//With a little transition to load you get a dynamic feeling
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

//For the x-axis so that it gets the right data
  g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x0))

//The y axis is made a little bit more difficult. It gives the right data and some styling added with attr
  g.append("g")
    .attr("class", "axis--y")
    .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
    .attr("x", 2)
    .attr("y", y(y.ticks().pop()) + 0.5)
    .attr("dy", "0.32em")
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "start")
//This is the text you can see as label of the y-axis
    .text("%")

//The legend shows the labels and the right colors
  var legend = g.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .selectAll("g")
//It shows all the labels from bottom to top
    .data(keys.slice().reverse())
    .enter().append("g")
    .attr("transform", function(d, i) {
      return "translate(0," + i * 20 + ")"
    })

//It gets its own little square with the right color
  legend.append("rect")
    .attr("x", width - 19)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", z)

//The labels are set and given a position
  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(function(d) {
      return d
    })

//When you change the range input it will start an function. The function will get the selected value. This is used in the scaling. After this the whole chart will update
    d3.select(".range").on("change", scaleUpdate)

    function scaleUpdate(e) {
      scale = document.querySelector(".range").value

      y.domain([0, scale])
      g.select(".axis--y")
        .call(d3.axisLeft(y).ticks(null, "s"))

      update()
    }

//When you mouseover a bar of the barchart it will show you the amount and compare it accross the whole chart
    d3.selectAll(".bar").on("mouseover", active)

    function active(e) {
       this.classList.add("active")

//Get the right bar and it will put a text with the right data
       d3.select(this.parentNode)
        .append("text")
          .text(e.value + "%")
          .attr("x", Number(this.getAttribute("x")) + 25)
          .attr("y", Number(this.getAttribute("y")) - 5)

//The line accross the chart is calculated by getting the y value of the selected bar
          d3.select("svg").select("g")
           .append("line")
           .style("stroke", "black")
            .attr("x1", 0)
            .attr("y1",  this.getAttribute("y"))
            .attr("x2", 900)
            .attr("y2", this.getAttribute("y"))

    }

//When the mouse is removed from the chart it will remove all text and line elements. Next to that it will remove the active state from the bar
    d3.selectAll(".bar").on("mouseout", inactive)

    function inactive(e) {
      d3.select(this.parentNode)
       .select("text")
        .remove()

      d3.select("svg").select("g").selectAll("line").remove()

       this.classList.remove("active")
    }

//When the label is clicked it will start a function
    d3.selectAll("label").on("change", labelActivate)

//To style the button for selecting which data I had to write code that would add and remove the activeLabel class
    function labelActivate() {
      activeLabel = this.parentNode.querySelectorAll("label")
      for (k = 0; k < activeLabel.length; k++) {
        activeLabel[k].classList.remove("activeLabel")
    }
      this.classList.add("activeLabel")
    }

//When you click the form it will start the function. This will update the whole chart
    d3.select("form").on("change", update)

    function update() {

//It gets the new data
      dataUpdate = d3.nest()
        .key(function(d) {
          return d.jaar
        })
        .entries(cleanData)
        .map(function(d) {
//It checks which label is selected so it will show the right data
          if (ooitDrugs.checked) {
            return {
              categorie: d.key,
              Cannabis: d.values[0].cannabisgebruik_ooit,
              Amfetamine: d.values[0].amfetaminegebruik_ooit,
              Ecstasy: d.values[0].ecstasygebruik_ooit,
              Cocaïne: d.values[0].cocainegebruik_ooit,
              Overig: d.values[0].overige_drugsgebruik_ooit
            }
          } else if (veelDrugs.checked) {
            return {
              categorie: d.key,
              Cannabis: d.values[0].cannabisgebruik_maand,
              Amfetamine: d.values[0].amfetaminegebruik_maand,
              Ecstasy: d.values[0].ecstasygebruik_maand,
              Cocaïne: d.values[0].cocainegebruik_maand,
              Overig: d.values[0].overige_drugsgebruik_maand
            }
          } else if (weinigDrugs.checked) {
            return {
              categorie: d.key,
              Cannabis: d.values[0].cannabisgebruik_jaar,
              Amfetamine: d.values[0].amfetaminegebruik_jaar,
              Ecstasy: d.values[0].ecstasygebruik_jaar,
              Cocaïne: d.values[0].cocainegebruik_jaar,
              Overig: d.values[0].overige_drugsgebruik_jaar
            }
          }
        })

//Because the code uses columns there will be an array set to the data
      var keysUpdate = function() {
          dataUpdate["columns"] = [
            "categorie",
            "Cannabis",
            "Amfetamine",
            "Ecstasy",
            "Cocaïne",
            "Overig"
          ]
          return dataUpdate.columns.slice(1)
      }()

//It updates the x-axis
      x0.domain(dataUpdate.map(function(d) {
        return d.categorie
      }))
      x1.domain(keysUpdate).rangeRound([0, x0.bandwidth()])

//To update the chart I select the right groups and connect the right data to it
      g.select("g")
        .selectAll("g")
        .data(dataUpdate)
        .selectAll("rect")
        .data(function(d) {
          return keysUpdate.map(function(key) {
            return {
              key: key,
              value: d[key]
            }
          })
        })
//This is the same as earlier, but now with the updated data. Next to that I will not use append but only use select or selectAll
          .transition()
          .duration(500)
          .ease(d3.easeBounce)
          .delay(function(d, i) { return i * 100 })
        .attr("x", function(d) {
          return x1(d.key)
        })
        .attr("y", function(d) {
          return y(d.value)
        })
        .attr("width", x1.bandwidth())
        .attr("height", function(d) {
          return height - y(d.value)
        })

    }

}
