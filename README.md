#Proximity
Driver for the hc-sr04 ultrasound sensor. It returns the distance, in cm, to the nearest object using ultrasound. 

This driver was tested on Tessel. When using Tessel, you must use G3 on the GPIO bank as the echo pin and you can use any other GPIO as the trigger pin.

The module works by pulling the trigger pin high for 10ms to signal to the proximity sensor that it should take a reading. Then the sensor pulls the echo pin high for an amount of time proportional to the distance to the nearest detected object. 

###Installation
```sh
npm install proximity-hcsr04
```

### Connecting it to Tessel
There are only four pins on the proximity sensor but, because it operates at 5V, we need to add a bit more circuitry to make sure our Tessel (which operates at 3.3V) doesn't get harmed. 

We need to take the signals coming from Tessel and boost them up to 5V and step the signals from the proximity sensor down to 3.3V. There are a couple of ways to do this. One simple way is to use a couple of resistors to make a [voltage divider](https://learn.sparkfun.com/tutorials/voltage-dividers/). I opted to use a [level shifter chip](https://www.sparkfun.com/products/12009) because I couldn't find resitors of the proper resistance lying around. 
```
Proximity Sensor <-> Level Shifter  
--------------------------------
VCC <-> High Voltage
ECHO <-> High Voltage Signal 1
TRIG <-> High Voltage Signal 2
GND <-> High Voltage GND

Tessel <-> Level Shifter
-------------------------
3.3V <-> Low Voltage
5V <-> High Voltage
GND <-> Low Voltage GND
GND <-> High Voltage GND
GPIO Bank G3 <-> Low Voltage Signal 1
GPIO Bank G2 <-> Low Voltage Signal 2
```
I should  call out that the echo pin *must* be connected to G3 on the GPIO port through the level shifter. It is the only pin that can read the kind of data being sent out by the sensor. The trigger pin can be any other GPIO.

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
