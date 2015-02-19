var infoWindow = null;
var oms = null;
var poly = null;

// map object
var map = null;
 
// google markers objects
var markers = [];
 
// google lat lng objects
var latLngs = [];
 
// formatted marker data objects
// marker {
//	createdAt: Date
//	lat: float
//	lng: float
 //  icon: string
//	data {
// 		type: int (0: no_data, 1: photo)
//		path: string
//	}
// }
var markerData = [];

gmaps = {
    // add a marker given our formatted marker data object
    addMarker: function(marker) {
        var wContent = '';
        var icon = {url: marker.icon};
        var gLatLng = new google.maps.LatLng(marker.lat, marker.lng);
        var gMarker = new google.maps.Marker({
            position: gLatLng,
            map: map,
            icon: icon
        });

        switch(marker.data.type) {
          case 0:
            wContent = '<div id="content" style="white-space: nowrap;">Was here on: ' + marker.createdAt.toLocaleString() + '</div>'
            break;
          case 1:
            wContent = '<div id="content"><p>Saw this on: ' + marker.createdAt.toLocaleString() + '</p><img src="http://lia.dc.ufscar.br/image_upload/uploads/' + marker.data.path + '"width="320" height="240"/></div>'
            break;
          default:
            throw('[ERROR] Not a valid data type');
        }

        gMarker.content = wContent;
        
        oms.addMarker(gMarker);

        var path = poly.getPath();
        path.push(gLatLng);

        google.maps.event.addListener(gMarker, 'click', function() {
          createdAt = markerData[markers.indexOf(gMarker)].createdAt; 
          infoWindow.setContent(gMarker.content);
          infoWindow.open(this.map, gMarker);
          Meteor.call('addClick', createdAt, 1, 
            function(error, result) {
              if (error) {
                console.log("[ERROR] addClick: ", error.reason);
              }
            }); 
        });

        markerData.push(marker);
        latLngs.push(gLatLng);
        markers.push(gMarker);
        this.calcBounds();
        map.setCenter(gLatLng);
        return gMarker;
    },


    // calculate and move the bound box based on our markers
    calcBounds: function() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, latLngLength = latLngs.length; i < latLngLength; i++) {
            bounds.extend(latLngs[i]);
        }
        map.fitBounds(bounds);
    },
 
    // check if a marker already exists
    markerExists: function(key, val) {
        _.each(markers, function(storedMarker) {
            if (storedMarker[key] == val)
                return true;
        });
        return false;
    },
 
    // intialize the map
    initialize: function() {
        console.log("[+] Intializing Google Maps...");
        
        var mapOptions = {
            zoom: 15,
            center: new google.maps.LatLng(49.260605, -123.245994),
            mapTypeId: google.maps.MapTypeId.HYBRID,
						disableDefaultUI: true
        };
 
        map = new google.maps.Map(
            document.getElementById('map-canvas'),
            mapOptions
        );
 
        infoWindow = new google.maps.InfoWindow();
        oms = new OverlappingMarkerSpiderfier(map, {markersWontMove: true, markersWontHide: true, keepSpiderfied: true});

        var polyOptions = {
          strokeColor: '#000000',
          strokeOpacity: 1.0,
          strokeWeight: 3
        };
        poly = new google.maps.Polyline(polyOptions);
        poly.setMap(map);

        // global flag saying we intialized already
        Session.set('map', true);
    }
}
