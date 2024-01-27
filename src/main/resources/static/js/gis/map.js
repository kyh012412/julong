const markers =
{
    Nuclear: [],
    Thermal: [],
    Solar: [],
    Hydro: [],
    Wind: [],
    Geothermal: [],
    Tidal: [],
    Other: []
};
const check_data =
{
    Nuclear: true,
    Thermal: true,
    Solar: true,
    Hydro: true,
    Wind: true,
    Geothermal: true,
    Tidal: true,
    Other: true
};

let countries_color;
let map;
let isWheelDown = false;
$(document).ready(
function () {
    let height = $('.panel-wrap').height() - $('.map-chaeck-control').height() - 21;
    $('.map-continent-control>.continent-menu').css('height', height);
    $('.map-continent-control.scroll').css('height', $('.continent-select').css('height'));
    $('.map-continent-control.scroll').css('position', '');
    $('.nav-side-menu.scroll').css('height', height);

    // $( "body" ).addClass( "map-ui" );
    $.getJSON("/json/country-color.json", function(json) {
        countries_color = json;
        map = drawMap();
    });
});

$(function () {
    (function (H) {
        var extend = H.extend,
        Pointer = H.Pointer;
            extend(Pointer.prototype, {
                onContainerMouseWheel: function (e) {
                (e.deltaY > 0)? isWheelDown = true : isWheelDown = false;
                var chart = this.chart,
                delta;
                    e = this.normalize(e);

                    delta = e.detail || -(e.wheelDelta / 250);
                    if (chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) {
                        chart.mapZoom(
                        Math.pow(chart.options.mapNavigation.mouseWheelSensitivity, delta),
                        chart.xAxis[0].toValue(e.chartX),
                        chart.yAxis[0].toValue(e.chartY),
                        e.chartX,
                        e.chartY
                    );
                }
            }
        });
    }(Highcharts));
});

let dragCircle;
let dragLocation;

let mouseIsDown = false;
let mouseIsMove = false;
document.getElementById('map_container').addEventListener('mousedown', function(){mouseIsDown = true})
document.getElementById('map_container').addEventListener('mouseup', function(){
    if (dragCircle && mouseIsMove) {
        dragCircle.destroy();   //Remove drag circle.
        dragCircle = drawCircle(map, null, null);
        map.lab.attr({  //Remove geoInfo.
            text: null
        });

        loadGeoInfos(map);  //Reload map and markers.
    }
    mouseIsDown = false;
    mouseIsMove = false;
})

document.getElementById('map_container').addEventListener('mousemove', function (e) {
    if (mouseIsDown) {
        if (map) {
            mouseIsMove = true;
            if (!map.lab) {
              map.lab = map.renderer.text('', 0, 0)
                .attr({
                  zIndex: 5
                })
                .css({
                  color: '#505050'
                })
                .add();
            }

            e = map.pointer.normalize(e);
            if (dragCircle) {
              dragCircle.destroy();
            }
            const center = getCenterPoint(map);
            dragCircle = drawCircle(map, center.y, center.x);

            const geoCenter = map.fromPointToLatLon({
              x: center.x,
              y: center.y
            });
            map.lab.attr({
                x: e.chartX + 5,
                y: e.chartY - 22,
                text: 'Lat: ' + geoCenter.lat.toFixed(2) + '<br>Lon: ' + geoCenter.lon.toFixed(2) + '<br>y: ' + center.y.toFixed(2) + '<br>x: ' + center.x.toFixed(2)
            });

            dragCircle.add();
        }
    }
});

$(function () {
    $("#detailPP .panel-cont>.btn-list-more").click(function () {
        $('#detailPP .panel-cont>.scroll>.spinner-wrap').css("display", "block");
        $('#detailPP .panel-cont>.scroll').css("overflow-y", "hidden");

        const city_ko = $('#info_city_ko').text();
        const city_en = $('#info_city_en').text();
        const country = $('#info_country_code').text();
        const page_no = Number($("#detailPP .panel-cont>.btn-list-more").attr("next_page_no"));
        loadRelatedNews(city_ko, city_en, country, page_no);
        setTimeout(function () {
            $('#detailPP .panel-cont>.scroll>.spinner-wrap').css("display", "none");
            $('#detailPP .panel-cont>.scroll').css("overflow-y", "auto");
            $("#detailPP .panel-cont>.btn-list-more").attr("next_page_no", page_no + 1);
        }, 1500);
        $(window).trigger('resize');
    });
});
function drawMap() {
    const _map = Highcharts.mapChart('map_container', {
      chart: {
        map: 'custom/world-highres3',
        backgroundColor: '#e3f3f9',
      },
      title: {
          text: ''
      },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            floating: true
        },
      colorAxis: {
        min: 0,
        minColor: 'rgba(95,65,203,0.4)',
        maxColor: 'rgba(95,65,203,1)',
        max: 2000
      },
      xAxis: {
        minRange: 1,
        events: {
            afterSetExtremes: function(event){
              const chart = this.chart;
              const extX = chart.xAxis[0].getExtremes();
              if(isWheelDown === true && extX.max - extX.min > 3000){
                const center = getCenterPoint(chart);
                chart.mapZoom(Math.pow(chart.options.mapNavigation.mouseWheelSensitivity, -0.6),
				    center.x,
                    center.y);
			  }
            }
        }
      },
      yAxis: {
        minRange: 1
      },
      mapNavigation: {
        enabled: true,
        enableDoubleClickZoom:true,
        enableMouseWheelZoom:true,
        mouseWheelSensitivity:2
      },

      tooltip: {
        formatter: function () {
            if (this.series.name === "Marker") {
              if (this.point.clusteredData) {
                //this.point.series.tooltipOptions.enabled=false;
                return 'Clustered counts: ' + this.point.clusterPointsAmount;
              }
              else {
                    return '<b>' + this.key + '</b>' +
                    '<br>Address: ' + this.point.address +
                    '<br>Lat: ' + this.point.lat.toFixed(2) + ', Lon: ' + this.point.lon.toFixed(2);
              }
            }
            else
            {
                return false;
            }
        }
      },

      plotOptions: {
        mappoint: {
          cluster: {
            enabled: true,
            allowOverlap: true,
            animation: {
              duration: 450
            },
            layoutAlgorithm: {
              type: 'grid',
              gridSize: 70
            },
            zones: [{
              to: 10,
              marker: {
                fillColor: 'rgba(95,65,203,0.6)',
                radius: 13
              }
            }, {
              from: 10,
              to: 100,
              marker: {
                fillColor: 'rgba(95,65,203,0.7)',
                radius: 15
              }
            }, {
              from: 100,
              to: 300,
              marker: {
                fillColor: 'rgba(95,65,203,0.8)',
                radius: 17
              }
            }, {
              from: 300,
              to: 1000,
              marker: {
                fillColor: 'rgba(95,65,203,0.9)',
                radius: 19
              }
            }, {
              from: 1000,
              to: 2000,
              marker: {
                fillColor: 'rgba(95,65,203,1)',
                radius: 21
              }
            }]
          },
        }
      },
      series: [{
        name: 'Basemap',
        data: countries_color,
        nullColor: 'rgba(95,65,203,0.5)',
        showInLegend: false,
        dataLabels: {
            enabled: true,
            format: '{point.name}'
        },
        states: {
            hover: {
                color: ''
            }
        },
        enableMouseTracking: false,
      },
        {
        type: 'mappoint',
        allowPointSelect: true,
        enableMouseTracking: true,
        turboThreshold: 5000,
        marker:
        {
        enabled: true,
        symbol: 'url(images/gis/marker/pin.png)',

        states:
        {
          hover:
          {
            enabled: true
          },
          select:
          {
            enabled: true,
            fillColor: '#00FFFF'
          }
        }
        },
        point: {
        events: {
          click: function (e) {
            if (!e.point.isCluster) {
                document.getElementById("info_id").innerText = this.id;
                document.getElementById("info_name").innerText = this.name;
                (LANG === 'ko') ?
                    document.getElementById("info_address").innerText = this.address_ko :
                    document.getElementById("info_address").innerText = this.address_en;
                document.getElementById("info_detail").innerText = this.description;
                document.getElementById("info_operationType").innerText = this.operationType;
                document.getElementById("info_city_ko").innerText = this.city_ko;
                document.getElementById("info_city_en").innerText = this.city_en;
                const dvider = document.querySelectorAll('.panel-header .dvider');

                if(this.materialType === "Substation") {
                    for(let u=0; u<dvider.length; u++) {
                        dvider.item(u).style.display = 'none';
                    }
                }
                else {
                    const regionNames = new Intl.DisplayNames([LANG], {type: 'region'});
                    for(let u=0; u<dvider.length; u++) {
                        dvider.item(u).style.display = 'block';
                    }
                    document.getElementsByClassName("dvider").display = "block";
                    document.getElementById("info_materialType").innerText = this.materialType;
                    document.getElementById("info_capacity").innerText = this.capacity + " MW";
                    document.getElementById("info_year").innerText = this.establishmentYear;
                    document.getElementById("info_country_code").innerText = this.country;
                    document.getElementById("info_country").innerText = regionNames.of(this.country.toUpperCase());
                }
                loadRelatedNews(this.city_ko, this.city_en, this.country, 0);
                $("#detailPP .panel-cont>.btn-list-more").attr("next_page_no", 1);
                $('#btn_info_window').click();
            }
          }
        }
        },
        cursor: 'pointer',
        colorKey: 'clusterPointsAmount',
        name: 'Marker',
        mapData: Highcharts.maps['custom/world-highres3.js'],
        joinBy: ['iso-a2', 'country']
        }
      ]
    });
    setCenter(_map, 37.0, 128.0, 0.1);
    loadGeoInfos(_map);
    return _map;
}

function loadGeoInfos(_map) {
    const center = getCenterPoint(_map);
    const geoPos = _map.fromPointToLatLon({
       x: center.x,
       y: center.y
    });
    let params = {};
    params["latitude"] = geoPos.lat;
    params["longitude"] = geoPos.lon;
    $.ajax({
        type: "POST",
        url: "/map_list/sub_tile",
        data: params,
        dataType: 'json',
        success: function (res) {
            for(let key in markers){markers[key] = [];}
            setMarkers(_map, res);
            setMarkerCount(markers);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}

function setMarkers(_map, dictionary) {
    let data = [];
    for (const key in dictionary) {
        markers[key] = dictionary[key];
        if(check_data.hasOwnProperty(key) && check_data[key] === true)
        {//checkBox가 true로 체크되어 있는 확인
            data = data.concat(dictionary[key]);
        }
    }
    _map.series[1].setData(data);
}

function clearAllMarkers(_map) {
    const merged_data = [];
    _map.series[1].setData(merged_data);
}
function drawCircle(_map, y, x) {
    return _map.renderer.circle(
      _map.xAxis[0].toPixels(x),
      _map.yAxis[0].toPixels(y),
      28
    ).attr({
      zIndex: 100,
      fill: '#FFA100',
      'fill-opacity': 0.4,
    });
}

function getCenterPoint(_map)
{
    const pos =
    {
      x: 0,
      y: 0
    };
    let extX = _map.xAxis[0].getExtremes();
    let extY = _map.yAxis[0].getExtremes();
    pos.x = extX.max - (Math.abs(extX.max - extX.min) / 2);
    pos.y = extY.max - (Math.abs(extY.max - extY.min) / 2);
    return pos;
}

function setCenter(_map, lat, lon, zoom)
{
    const center = _map.fromLatLonToPoint({ lat: lat, lon: lon});
    _map.mapZoom(zoom, center.x, center.y);
}

function setMarkerCount(_markers)
{
    let plantCount = 0;
    for(let key in markers)
    {
        $('[eid=' + key + ']').siblings('.count').text(_markers[key].length);
        plantCount += markers[key].length;
    }
    $('[eid=PowerPlant]').siblings('.count').text(plantCount);
}

$(function () {
    //수정버튼을 클릭한 경우
    $('[data-target="#editModal_powerPlant"]').on('click', function () {
        const id = parseInt($('#info_id').text());
        const operationType = $('#info_operationType').text();
        const plants = markers[operationType];
        plants.forEach((value, index, array)=>{
            if(id === value.id)
            {
                $('#edit_id').val(value.id);
                $('#edit_country').val(value.country);
                (LANG === 'ko') ?
                    $('#edit_address').val(value.address_ko):
                    $('#edit_address').val(value.address_en);
                $('#edit_name').val(value.name);
                $('#edit_establishmentYear').val(value.establishmentYear);
                $('#edit_materialType').val(value.materialType);
                $('#edit_description').text(value.description);
                $('#edit_lat').val(value.lat);
                $('#edit_lon').val(value.lon);
                return;
            }
        });
    });
});

function saveGeoInfo() {
    const formData = getFormData($('#editModal_powerPlant'));
    $.ajax({
        type: "POST",
        url: "/map_list/save",
        data: formData,
        dataType: 'json',
        success: function (res) {
            alert(TEXT_SAVED_CHANGES);
            $("#detailPP").removeClass('active');
            $("#editModal_powerPlant").find('[data-dismiss="modal"]').click();
            loadGeoInfos(map);  //Reload map and markers.
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}

function getFormData($form){
    const unindexed_array = $form.serializeArray();
    const indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

function loadCountriesByContinent(key) {
    const regionNames = new Intl.DisplayNames([LANG], {type: 'region'});

    const window_height =  $(window).height();
    const div_height =  $('#detailPP .panel-header').height();
    const div_height_all = window_height - div_height - 200;
    $("#detailPP .panel-cont>.scroll").css("height", div_height_all + "px");


    $('#countries').empty();
    const countries = continents[key];
    if(key === "geographic.panel.continents.Korea" ||
        key === "geographic.panel.continents.Japan" ||
        key === "geographic.panel.continents.China") {
        const lat = parseFloat(countries[0].refTxt07);
        const lng = parseFloat(countries[0].refTxt08);
        const pos = {
            lat: lat,
            lng: lng
        };
        setCenter(map, lat, lng, 1);
        loadGeoInfos(map);
    }
    else
    {
        const ul = document.getElementById("countries");
        for(let u=0; u<countries.length; u++)
        {
            const li = document.createElement("li");
            li.classList.add("menu-item");
            const a = document.createElement("a");
            a.innerHTML = regionNames.of(countries[u].code.toUpperCase());
            a.addEventListener('click', function() {
                const lat = parseFloat(countries[u].refTxt07);
                const lng = parseFloat(countries[u].refTxt08);
                const pos = {
                    lat: lat,
                    lng: lng
                };
                setCenter(map, lat, lng, 1);
                loadGeoInfos(map);
            });
            li.appendChild(a);
            ul.appendChild(li);
        }
    }
}

function loadRelatedNews(city_ko, city_en, country, page_no) {
    if(page_no === 0)
    {
        $('#detailPP .list-ul').empty();
    }
    let search;
    if((city_ko && city_ko.length >0) && (city_en && city_en.length >0))
    {
        search = city_en + "," + city_ko;
    }
    else if(city_ko && city_ko.length >0)
    {
        search = city_ko;
    }
    else
    {
        search = city_en;
    }
    $.ajax({
        type: "GET",
        url: "/api/search/map/news",
        data:
        {
            search: search,
            page: page_no,
            tags: country
        },
        success: function (res) {
            const newsListUL = document.getElementById('detailPP').getElementsByClassName('list-ul')[0];

            const newsList = JSON.parse(res).result;
            newsList.forEach((value, index, array)=>{
                const li = document.createElement('li');
                const id = document.createElement('span');
                id.hidden = true;
                id.value = value.analysisId;

                const title = document.createElement('a');
                title.classList.add("ellipsis");
                title.innerText = cleanText(value.title);
                title.setAttribute('href', 'javascript:');
                title.setAttribute('data-toggle', 'modal');
                title.setAttribute('data-target', '#newsModal');
                title.setAttribute('data-query-type', "news");
                title.setAttribute('data-from', 'map_list');
                title.setAttribute('data-id', value.analysisId);

                const body = document.createElement('p');
                body.classList.add("summary");
                body.innerText = cleanText(value.content);

                const div = document.createElement('div');
                div.classList.add("article-info");

                const source = document.createElement('span');
                source.classList.add("source");
                source.innerText = value.source;

                const divider = document.createElement('span');
                divider.classList.add("dvider");

                const date_time = document.createElement('span');
                date_time.classList.add("date_time");
                date_time.innerText = value.createdAt;


                div.appendChild(source);
                div.appendChild(divider);
                div.appendChild(date_time);
                li.appendChild(title);
                li.appendChild(body);
                li.appendChild(div);
                newsListUL.appendChild(li);
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}