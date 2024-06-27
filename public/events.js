var map, infobox, Microsoft = null
var locations = []
var BingMapsKey = 'AkMdzF1Q7JCJCXj3415UZvH4JYRCJihZ_W7JEOnpx6eH5Hwtt1qie1LQqIrJ7-jS'

GetMap()
function GetMap() {
    if (document.getElementById('myMap') && Microsoft) {
        map = new Microsoft.Maps.Map('#myMap');
        infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
            visible: false
        });

        //Assign the infobox to a map instance.
        infobox.setMap(map);
        if (onMapLoad) onMapLoad()
        positionInterval = setInterval(onMapLoad, 60000)
    }
    else {
        window.addEventListener('DOMContentLoaded', GetMap)
    }
}


function onMapLoad() {
    events.forEach(function(event, i) {
        var requestOptions = {
            method: 'GET',
        };
          
        fetch(`https://api.geoapify.com/v1/geocode/search?text=${event.location}%20UC%20Berkeley&apiKey=068d044ed4464de8a2742b35df2c4ce6`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.features.length > 0) {
                    var feature = result.features[0]
                    var geometry = feature.geometry
                    var coordinates = geometry.coordinates
                    
                    var location = new Microsoft.Maps.Location(coordinates[1], coordinates[0])
                    console.log(location)
                    locations.push(location)
                    
                    // Add the pushpin to the map
                    pin = new Microsoft.Maps.Pushpin(location, {
                        icon: '/assets/icons/location.svg',
                    });
                    pin.metadata = event;
                    
                    var events = ['click']
                    events.forEach(function(ev) {
                        Microsoft.Maps.Events.addHandler(pin, ev, showInfo);
                    })
                    
                    map.entities.push(pin);

                    if (i >= events.length - 1) {
                        var rect = Microsoft.Maps.LocationRect.fromLocations(locations);
                        map.setView({ bounds: rect, padding: 80 });
                    }
                }
            })
            .catch(error => console.log('error', error));
    })
}

function showInfo(e) {
    //Make sure the infobox has metadata to display.
    var data = e.target.metadata
    if (data) {
        var options = {
            title: [
                data.title, 
            ], 
            description: [
                `Date: ${data.date}`,
                `Time: ${data.time}`,
                `Location: ${data.location}`,
                `Description: ${data.description}`,
            ]
        }
        
        infobox.setOptions({
            location: e.target.getLocation(),
            title: options.title,
            htmlContent: `<div class="infobox"><span class="title">${options.title.join('<br>')}</span><br><span>${options.description.join('</span><br><span>')}</span></div>`,
            visible: true
        });
    }
}

