Meteor.publish("data", function () {
  return Data.find({});
});

// Authentication token
var auth = '436174696e7468654d61704c49414a43';

// Last request
var rTime = new Date(1990, 06, 12, 8, 25, 0, 0);

Meteor.methods({
  'addClick': function(createdAt, status) {
    click = Data.find({"createdAt": new Date(createdAt)}).fetch();
    Clicks.insert({
      createdAt: new Date(),
      clicked: click[0]._id,
      status: status
    });
  }
});

HTTP.methods({
  // Data: auth
  'getNewClicks': function(data) {
    if (auth == data.auth) {
      clicks = Clicks.find({"createdAt": { $gt : rTime }}).fetch();
      var response = '';
      if (clicks.length > 0) {
        rTime = new Date();
        clicks.forEach(function(click){
          response += click._id + '|';
        });
        return response.substr(0, response.length -1);
      }
      this.setStatusCode(204); // No response
      return 'No new clicks';
    }
    this.setStatusCode(401);
    return 'Unauthorized';
  },
  // Data: auth, lat, lng, display, extra (type [, path])
  'addDatum': function(data) {
    if (auth == data.auth) {
      Data.insert({
        createdAt: new Date(),
        geo_lat: data.lat,
        geo_lng: data.lng,
        display: data.display,
        extra: data.extra
      });
    } else {
      this.setStatusCode(401);
      return 'Unauthorized';
    }
  },
  /* Clean DB functions */
  // Data: auth
  'cleanData': function(data) {
    if (auth == data.auth) {
      Data.find().fetch().forEach(function(item){
        Data.remove({_id: item._id});
      });
    } else {
      this.setStatusCode(401);
      return 'Unauthorized';
    }
  },
  // Data: auth
  'cleanClicks': function(data) {
    if (auth == data.auth) {
      Clicks.find().fetch().forEach(function(item){
        Clicks.remove({_id: item._id});
      });
    } else {
      this.setstatusCode(401);
      return 'Unauthorized';
    }
  }
});
