var map, infobox, Microsoft = null
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
    vehicleData.forEach(function(event, i) {
        var location = {
            longitude: vehicleLocation.Longitude, 
            latitude: vehicleLocation.Latitude, 
            // altitude: 0, 
            // altitudeReference: -1,
        }
        
        // Add the pushpin to the map
        pin = new Microsoft.Maps.Pushpin(location, {
            text: route,
            color: color, 
            // icon: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20"><rect x="0" y="0" width="100%" height="100%" fill="${color}" /><text x="50%" y="50%" dy="2" textLength="${width-5}" lengthAdjust="spacing" font-family="sans-serif" dominant-baseline="middle" text-anchor="middle">${route}</text></svg>`,
        });
        pin.metadata = event;
        
        var events = ['click']
        events.forEach(function(ev) {
            Microsoft.Maps.Events.addHandler(pin, ev, showInfo);
        })
        
        map.entities.push(pin);
    })
}

function showVehicleInfo(e) {
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

