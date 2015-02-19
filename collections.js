/*
  Data collection
  datum = {
    _id: unique identifier
    createdAt: date the data was created
    geo_lat: latitute
    geo_lng: longitude
    display: display or not position
    extra: {
      type: type of data [0: only gps, 1: photo]
      path: path to the extra data file
    }
  }
*/
Data = new Mongo.Collection("data");


/*
  Clicks collection
  click = {
    _id: unique identifier
    clicked: id of marker clicked
    status: [0: denied, 1: allowed, 2: ignored]
    createdAt: date the marker was clicked
  }
*/
Clicks = new Mongo.Collection("clicks");
