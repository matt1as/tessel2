var tessel = require('tessel');
var config = require('./config.json'); //with path

var climatelib = require('climate-si7020');
var climate = climatelib.use(tessel.port[config.sensor.port]);

var Keen = require('keen.io');
var keen = Keen.configure({
    projectId: config.keen.projectId,
    writeKey: config.keen.writeKey,
});

climate.on('ready', function(){
  setInterval(function(){
    climate.readHumidity(function(err, humid){
      climate.readTemperature(config.sensor.unit, function(err, temp){
        sendToCloud(temp, humid);
      });
    });
  }, config.sensor.interval);
});

climate.on('error', function(err) {
  console.log('error connecting module', err);
});


function sendToCloud(tdata, hdata) {
  keen.addEvent("climate", {
   "temp": tdata,
   "humidity": hdata
  }, function(){
    console.log("Added climate with data temperature: " + tdata +", humidity: " + hdata);
  });
}
