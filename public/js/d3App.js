var overview = null;
var champion = null;
var svg = null;
var championinfo = null;
var chartinfo = null;
var width = null;
var height = null;
var radius = null;
var arc = null;
var pie = null;
var color = null;
var g = null;
var path = null;
var path2 = null;
var text = null;
var attack = null;
var defense = null;
var magic = null;
var difficulty = null;
var attacktxt = null;
var defensetxt = null;
var magictxt = null;
var difftxt = null;

//read data from json via ajax call
d3.json("/js/overview.json", function(error, data) {
    overview = data;
    datacall();
});

d3.json("/js/champion.json", function(error, data) {
    champion = data;
    datacall();
});

//check for validity of data
function datacall() {
    if (overview != null && champion != null) {
        startup();
    }
}

function startup() {
    //sets up pie chart
    width = 500;
    height = 500;
    radius = Math.min(width, height) / 2;
    color = d3.scale.ordinal()
        .range(["#001133"]);

    pie = d3.layout.pie()
        .value(function(d) {
            return d.champions;
        })
        .sort(null);

    arc = d3.svg.arc()
        .innerRadius(radius - 100)
        .outerRadius(radius - 10);

    svg = d3.select(".container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    championinfo = d3.select(".chart").append("svg")
        .attr("width", 250)
        .attr("height", 120);
    chartinfo = d3.select(".chartDetails").append("svg")
        .attr("width", 350)
        .attr("height", 120);

    g = svg.selectAll(".arc");

    //loads first pie chart
    original();

}

function original() {
    displayTip();
    displayCenter();

    //removes previous pie path drawing
    if (path2 != null) {
        path2.remove();
    }

    //removes chart drawing
    if (attack != null || defense != null || magic != null || difficulty != null) {
        attack.remove();
        defense.remove();
        magic.remove();
        difficulty.remove();
    }
    if (attacktxt != null || defensetxt != null || magictxt != null || difftxt != null) {
        attacktxt.remove();
        defensetxt.remove();
        magictxt.remove();
        difftxt.remove();
    }

    //gives pie chart specific data
    g = g.data(pie(overview), function(d) {
        return d.data.class;
    });

    //gives each path element mouseover, mouseout and click even attribute
    path = g.enter().append("path")
        .attr("fill", function(d) {
            return color(d.data.class);
        })
        .on('mouseover', function(d) {
            mouseOver(this, d);
        })
        .on('mouseout', function(d) {
            show(this);
        })
        .on("click", function(d) {
            change(d.data.class); //loads new pie based on path clicked
            displayCenter("Choose a Champion");
        });

    g.exit().remove(); //removes old labels
    g.attr("d", arc); //loads the pie chart

    putLabel();
}

function change(leagueTag) {
    path.remove(); //removes old data from previous pie
    pie.value(function(d) {
        return 1;
    });

    //gets specific data based on path chosen
    var specificChampions = specificChamps(champion, leagueTag);

    g = g.data(pie(specificChampions), function(d) {
        return d.data.name;
    });

    //appends paths to form a circle
    path2 = g.enter().append("path")
        .attr("fill", function(d) {
            return color(d.data.name);
        })
        .on('mouseover', function(d) {
            mouseOver(this, d, leagueTag);
        })
        .on('mouseout', function(d) {
            show(this);
        })
        .on("click", function(d) {
            getOriginal(d);
            displayCenter("Click here to choose class again");
        });

    g.exit().remove(); //removes previous labels
    g.attr("d", arc); //loads the pie
    putLabel(leagueTag);

}

//function that loads the orignal data for onclick events
function getOriginal(d) {
    d3.event.stopPropagation();
    if (d != null) {
        if (d.data.tags[1] != null) {
            displayTip("<h3><b>" + d.data.name + "</b></h3>" + "<p>" + d.data.tags[0] + ', ' + d.data.tags[1] + "</p>" + '<img src="' + d.data.image + '" />');
        } else {
            displayTip("<h3><b>" + d.data.name + "</b></h3>" + "<p>" + d.data.tags[0] + "</p>" + '<img src="' + d.data.image + '" />');
        }
        stats(d);

        d3.select('.info')
            .on("click", function() {
                d3.event.stopPropagation();
                original();
            });
    }
}

//appends to the pie labels
function putLabel(tag) {
    g.enter().append("text")
        //appends label based on size of the data
        .attr("transform", function(d) {
            var getAngle = (180 / Math.PI * (d.startAngle + d.endAngle) / 2 - 90);
            if (d.data.name == null || ((tag != "Fighter") && (tag != "Mage"))) {
                var getAngle = 0;
            }
            return "translate(" + arc.centroid(d) + ") " +
                "rotate(" + getAngle + ")";
        })
        .attr("text-anchor", "middle")
        .attr("fill", "#D2B14C")
        .attr("font-family", "Baskerville Old Face")
        .text(function(d) {
            if (d.data.name == null) {
                return d.data.class;
            }
            return d.data.name;
        })
        //appends same events as the path they overlay
        .on('mouseover', function(d) {
            if (d.data.name == null) {
                mouseOver(this, d);
            } else {
                mouseOver(this, d, tag);
            }
        })
        .on('mouseout', function(d) {
            if (d.data.name == null) {
                displayTip();
            }
            show(this);
        })
        .on("click", function(d) {
            if (d.data.class != null) {
                change(d.data.class);
                displayCenter("Choose a Champion");
            } else {
                getOriginal(d);
                displayCenter("Click here to choose class again");
            }
        });
}

function displayCenter(display) {
    if (text != null) {
        text.remove();
    }

    var displayinfo = "Choose a Class";
    if (display != null) {
        displayinfo = display;
        console.log(displayinfo);
    }
    text = svg.append("text")
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .attr("fill", "#D2B14C")
        .attr("font-size", "18px")
        .text(displayinfo)
        .on('mouseover', function(d) {
            d3.select(this)
                .style('opacity', 0.3);
        })
        .on('mouseout', function(d) {
            show(this);
        })
        .on("click", function(d) {
            d3.event.stopPropagation();

            original();
        });
}
d3.select('.title')
    .on("click", function() {
        d3.event.stopPropagation();
        original();
    });

//displays champion stats
function stats(stat) {
    if (attack != null || defense != null || magic != null || difficulty != null) {
        attack.remove();
        defense.remove();
        magic.remove();
        difficulty.remove();
    }
    if (attacktxt != null || defensetxt != null || magictxt != null || difftxt != null) {
        attacktxt.remove();
        defensetxt.remove();
        magictxt.remove();
        difftxt.remove();
    }

    attack = championinfo.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", stat.data.info.attack * 15)
        .attr("height", 15)
        .attr('fill', '#990000');

    defense = championinfo.append("rect")
        .attr("x", 0)
        .attr("y", 30)
        .attr("width", stat.data.info.defense * 15)
        .attr("height", 15)
        .attr('fill', '#00b300');

    magic = championinfo.append("rect")
        .attr("x", 0)
        .attr("y", 60)
        .attr("width", stat.data.info.magic * 15)
        .attr("height", 15)
        .attr('fill', '#0066cc');
    difficulty = championinfo.append("rect")
        .attr("x", 0)
        .attr("y", 90)
        .attr("width", stat.data.info.difficulty * 15)
        .attr("height", 15)
        .attr('fill', '#800080');

    attacktxt = chartinfo.append("text")
        .attr("x", 0)
        .attr("y", 15)
        .html("Attack: " + stat.data.info.attack)
        .attr('fill', '#990000');
    defensetxt = chartinfo.append("text")
        .attr("x", 70)
        .attr("y", 15)
        .html("Defense: " + stat.data.info.defense)
        .attr('fill', '#00b300');
    magictxt = chartinfo.append("text")
        .attr("x", 150)
        .attr("y", 15)
        .html("Magic: " + stat.data.info.magic)
        .attr('fill', '#0066cc');
    difftxt = chartinfo.append("text")
        .attr("x", 215)
        .attr("y", 15)
        .html("Difficulty: " + stat.data.info.difficulty)
        .attr('fill', '#800080');
}

//fucntions that performs actions for mouseover events
function mouseOver(current, d, tag) {
    if (tag == null) {
        displayTip('<div class = "classDescription"><img src="' + d.data.image + '" />' + "<h3>" + d.data.class + "</h3>" + d.data.info + "</div>");
    }
    d3.select(current)
        .style('opacity', 0.3);
}

//display information to the side of the pie
function displayTip(description) {
    var displayDescription = "";
    if (description != null) {
        displayDescription = description;
    }

    d3.select('.info')
        .html(displayDescription);
}

//shows current selected object
function show(current) {
    d3.select(current)
        .style('opacity', 1);
}

//hides current selected object
function hide(current) {
    d3.select(current)
        .style('opacity', 0);
}

//see if a class type is in the array of class types the champion belongs to
function contains(tags, certainTag) {
    var i = tags.length;
    while (i--) {
        if (tags[0] == certainTag) {
            return true;
        }
    }
    return false;
}

//returns an array of champions that fits the given critera
function specificChamps(champions, tags) {
    var specificChampion = [];
    champion.forEach(function(champ) {
        var champTag = champ.tags;
        if (champTag[0] == tags) {
            specificChampion.push(champ);
        }
    });
    return specificChampion;
}
