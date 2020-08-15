var markers = [];
var marker;
var map;
var infoWindow;
var infoContent = '<b>feed me</b>';

function getMarkers() {
  $.get("/result", function (data) {
    $.each(data, function (key, item) {
      setMarker(item);
    });
  });
}
function setMarker(data) {
  var latLng = new google.maps.LatLng(data.gasStationLat, data.gasStationLong);
  //Information windows      
  infoWindow = new google.maps.InfoWindow({    
  });


  marker = new google.maps.Marker({
    position: latLng,
    map: map,
    title: data.gasStationOwner + `(` + data.fuelCompNormalName + `)`,
    icon: 'http://maps.google.com/mapfiles/kml/paddle/grn-blank.png',
    info: infoContent,
    id: data.gasStationID
  });


  google.maps.event.addListener(marker, 'click', function () {

    //Modal buttons(order,prices) inside the InfoWindow
    infoContent = data.gasStationOwner + `<br/>` + data.gasStationAddress + `<br/> <br/>  <button id="orderbtn" class="btn btn-info" data-toggle="modal" data-target="#ordersModal">Παραγγελία / Τιμοκατάλογος </button>`;

    let gasowner = data.gasStationOwner;
    $('#gasowner').html(data.gasStationOwner);
    $('#fuels-list').append(gasowner);

    let markerID = this.id;
     //το this πλεον ειναι το modal element -_-  YYYY-MM-DD HH:
    $('#ordersModal').off('show.bs.modal').on('show.bs.modal', function (e) {
      $('#orderform').trigger('reset'); //reset form
      $('#fuels-list').html(`<option value='0' disabled selected>Επιλογή καυσίμου</option>`);
      $('#fuel-price').html('');
            

      $.get('/getStationInfo/' + markerID, function (data) {
        var pricedata = [];
        $.each(data, function (k, i) {        
        
          // $('#fuels-list').append(`<option value='` + i.fuelTypeID + `'>` + i.fuelNormalName + `</option>`);
        $('#fuels-list').append(`<option value='` + i.productID + `'>` + i.fuelName + `</option>`);
          pricedata.push({ id: i.productID, price: i.fuelPrice });          
        });
        $('#fuels-list').off('change').change(function (ev) {
          let index = pricedata.findIndex(e => e.id === Number($('#fuels-list option:selected').val()));
          $('#fuel-price').html(pricedata[index].price);
        });
      });
    });
    infoWindow.setContent(infoContent);
    infoWindow.position = marker.getPosition();
    infoWindow.open(map, this);
  });


  markers.push(marker);
}
function initMap() {
  var larissa = { lat: 39.639, lng: 22.4191 };
  map = new google.maps.Map(
    document.getElementById('map'), { zoom: 12, center: larissa });
  getMarkers();
}





