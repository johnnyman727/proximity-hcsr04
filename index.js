var tessel = require('tessel');
var events = require('events');
var util = require('util');
var port = tessel.port['GPIO'];
var trig = port.digital[1];
var echo = port.digital[2];

function Proximity(trigger, echo, callback) {
  this.trigger = trigger;
  this.echo = echo;

  setImmediate(function ready() {
    this.emit('ready');
  }.bind(this));

  if (callback) {
    callback(null, this);
  }

  return this;
}

util.inherits(Proximity, events.EventEmitter);

Proximity.prototype.triggerRead = function() {
  this.trigger.write(1);
  setTimeout(function off() {
    this.trigger.write(0);
  }.bind(this), 10);
}

Proximity.prototype.getDistance = function(callback) {
  this.triggerRead(trig);
  this.echo.readPulse('high', 1000, function(err, duration) {

    if (err) {
      if (callback) {
        callback(err);
      }
      return;
    }

    var distance = ((duration * 1000)/2) / 29.1;
    
    if (callback) {
      callback(null, distance);
    }
  }.bind(this));
}

function use(trigger, echo, callback) {
  return new Proximity(trigger, echo, callback);
}

module.exports.use = use;
module.exports.Proximity = Proximity;
