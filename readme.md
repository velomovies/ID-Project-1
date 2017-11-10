# Using some drugs

For project 1 of Information Design I made a little dashboad to really experience drugs. I used two charts based on [`bl.ock grouped barchart`](https://bl.ocks.org/mbostock/3887051) and [`bl.ock piechart`](https://bl.ocks.org/mbostock/3887235) by Mike Bostock. by
[**@Mike Bostock**](https://github.com/mike-bostock) (GPL-3.0).

![Preview image](logo.png)
> My work
> [**Velomovies**](https://velomovies.github.io/ID-Project-1).

## Background

For project 1 of Information Design I had to use all that I learned with frontend and make an usefull datavisualisation. I wanted a vey cool dashboard with a lot of functions. Unfortunataly my data wasn't complete so I had to improvise a little. I eventually made a overview and a detail page.

When I downloaded the data I saw directly that I had to clean it. This was an easy (but really necessary) part. In the data specification you can see how I cleaned it. 

The next step was to visualize the data in a correct way. I used a grouped bar chart and made it my own. I made it easy to compare and to read. Next to that I made a custom second page that shows the detail.

The code I wrote for that was:
```javascript
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
```
Then I made sure the data became interactive. I made a few `.on("change", function())` that ran code to update certain parts of the data. All together they make it so you can interactively can browse the whole dataset 
```javascript
  d3.select(".range").on("change", scaleUpdate)

    function scaleUpdate(e) {
      
        ...code
      
    }

    d3.selectAll(".bar").on("mouseover", active)

    function active(e) {

        ...code

    }

    d3.selectAll(".bar").on("mouseout", inactive)

    function inactive(e) {
        
        ...code
        
    }

    d3.selectAll("label").on("change", labelActivate)

    function labelActivate() {
        
        ...code
        
    }

    d3.select("form").on("change", update)

    function update() {
        ...code
    }
```
The next step was to add the second page. I chose a pie chart and I re-used the group chart. I chose to make two svg's so that I could move them separately and to make easier selections later on. To load in two charts I created two svg's:
```javascript
var svg = d3.select("body").append("svg").attr("width", 600).attr("height", 500),
  svg2 = d3.select("body").append("svg").attr("width", 600).attr("height", 500),
  margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
  },
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom,
  g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
  g2 = svg2.attr("transform", "translate(30,0)").append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
```

For updating the charts I made a few checks. The checks could be nicer and would have a be more efficient if I had more time. The reason I chose to leave it like it is, is because it works. I made checks for selected buttons, selected range and parameters (for the detail page).  Here you see a few scripts I made for that:

To check which button is clicked 
```javascript
if (ooitDrugs.checked) {
            ...doingsomething
          } else if (veelDrugs.checked) {
            ...doingsomething
          } else if (weinigDrugs.checked) {
            ...doingsomething
          }
```

To check the parameters
```javascript
var url_string = window.location.href,
  url = new URL(url_string),
  year = url.searchParams.get("y"),
  drugs = url.searchParams.get("d")
```

To check the value of the range input
```javascript
var scale = document.querySelector(".range").value
```

> Next to all the big code changes I made a few little design changes (Making it more like a dashboard). I used a google font (muli) and made sure the visualization had a fun transition. And last but not least I made my own logo for the dashboard

## List of changes

* Change the format of the data
* Connecting data to the grouped bar chart
* Using a different color
* Making a hover (with `mouseenter` and `mouseout)`
* Adding a barchart
* Updating the barchart `on("change")`
* Adding smooth transitions
* Making custom tooltip and compare tool
* Setting up a scale selection
* Updating `on("change")` of selection
* Making sure the correct data shown in the correct graph
* Making another page
* Using custom link with parameters
* Redoing the whole process of making a chart
* Make sure the data is in the right format
* Change the colors

> Happy end! 

## Data

[`Dataset`](http://statline.cbs.nl/Statweb/publication/?DM=SLNL&PA=83021ned&D1=25-45
&D2=0-13,37-52&D3=0&D4=a&HDR=T&STB=G1,G2,G3&VW=T). 

For this assessment I used an CBS dataset and cleaned it with this code:
```javascript
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
```
After the cleaning I had to use code to map it in to the right format

The dataset comes from CBS and is really extended. CBS is a reliable source and has good researches
* `Drugs` — The data has information of 5 drug types. 
* `Jaar` — You can use data from 2014 till 2016
* `Categorie` — There are a few features you can select the data in. Like household, age, education and money
* `Perioden` — The data is split up in three sections. From ever used drugs till used it this month.

## Features
*   [`d3-format`](https://github.com/d3/d3-format#api-reference)
    — `d3.format([number])`
*   [`d3-array`](https://github.com/d3/d3-array)
    — `max/min`
    — `d3.push` 
*   [`d3-selection`](https://github.com/d3/d3-selection#d3-selection)
    — `d3.select`
    — `on` mouse events
*   [`d3-request`](https://github.com/d3/d3-request#api-reference)
    — `d3.csv`
    — Loading files
*   [`d3-scale`](https://github.com/d3/d3-scale#api-reference)
    — `d3.range`,  `d3.domain`
    — scaling
*   [`d3-axis`](https://github.com/d3/d3-axis#d3-axis)
    — `d3.axisbottom`
    
    
    

## License

GPL-3.0 © Victor Zumpolle
