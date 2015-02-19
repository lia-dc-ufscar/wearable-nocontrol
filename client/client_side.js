//Susbscribe to desired collection
dataSubscription = Meteor.subscribe("data");

/*--------------MAP-------------*/

// When the map DOM is rendered, initialize google maps
Template.map.rendered = function() {
    if (! Session.get('map'))
        gmaps.initialize();
}

// Avoids reloading of map on every meteor update
Template.map.destroyed = function() {
    Session.set('map', false);
}

//Helper functions for the map template
Template.map.helpers({
  data: function () {
    return Data.find();
  },
  addMapMarker: function () {
    var icon_type = 'images/gps.svg';
    if (Session.get('map')) {
      if (this.extra.type == 1) {
          icon_type = 'images/photo.svg';
      } else if (this.extra.type != 0) {
          throw '[ERROR] Not a valid data type!';
          return;
      }

      var marker = {
        createdAt: this.createdAt,
        lat: this.geo_lat,
        lng: this.geo_lng,
        icon: icon_type,
        data: this.extra,
      }
      gmaps.addMarker(marker);
    }
  }
});

/*--------------BODY--------------*/

// Helper functions used inside body
Template.body.helpers({
  // Check if data have been loaded
  dataReady: function() {
    return dataSubscription.ready();
  }
});
