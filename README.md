#Proximity
Driver for the hc-sr04 ultrasound sensor. It returns the distance, in cm, to the nearest object using ultrasound. 

This driver was tested on Tessel. When using Tessel, you must use G3 on the GPIO bank as the echo pin and you can use any other GPIO as the trigger pin.

The module works by pulling the trigger pin high for 10ms to signal to the proximity sensor that it should take a reading. Then the sensor pulls the echo pin high for an amount of time proportional to the distance to the nearest detected object. 

###Installation
```sh
npm install proximity-hcsr04
```

###Example
```js
var tessel = require('tessel');
var gpio = tessel.port.GPIO;
// The trigger pin can be any GPIO
var triggerPin = gpio.digital[1];
// The echo pin MUST be G3 on the GPIO bank
var echoPin = gpio.digital[2];

var proximityLib = require('prox-hcsr04');
var proximity = proximityLib.use(triggerPin, echoPin);

function printDistance() {
  proximity.getDistance(function(err, distance) {
    if (err) throw err;

    console.log("Distance: ", distance, "cm away.");

    printDistance();
  });
}

printDistance();
```

###Methods

* ```use(triggerPin, echoPin, [callback])```: must be called in order to create a `Proximity` object. It returns the `Proximity` object and also calls the optional callback with `(err, proximity`). 

* ```proximity.getDistance(callback)```: used to make a reading, in centimeters, from the distance sensor. It calls the callback upon completion with `(err, distance)`. 

###Events

* ```"ready"```: called when the proximity sensor is ready to receive commands. It's not really necessary at the moment and doesn't need to be used.

* ```"data"```: called when a distance reading is made.


### License
MIT or Apache 2.0, at your option  
