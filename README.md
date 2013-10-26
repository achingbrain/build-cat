# Ptolemy

A [johnny-five](https://github.com/rwaldron/johnny-five) based build notification system.

![Ptolemy, relaxing with Sir Patric Moore](https://raw.github.com/achingbrain/build-cat/master/assets/ptolemy.jpg)

Ptolemy (named for much mourned national treasure [Sir Patric Moore](http://en.wikipedia.org/wiki/Patrick_Moore)'s cat) watches a Jenkins URL for failing builds and then strikes fear into the heart of developers until they fix the build and restore Ptolemy to a happy state.

## Construction

Ptolemy uses a [Pololu Mini Maestro](http://www.pololu.com/catalog/product/1352) built into a Meccano skeleton.  It has a servo motor to drive it's head and two RGB LEDs for eyes, with the green channels spliced and connected to the sole PWM output available on the board.

The software runs on [Node.js](http://nodejs.org/), interfaces with [johnny-five](https://github.com/rwaldron/johnny-five) via [ioboard](https://github.com/achingbrain/node-ioboard), [pololu-maestro-ioboard](https://github.com/achingbrain/node-maestro-ioboard) and finally [pololu-maestro](https://github.com/omcaree/node-pololumaestro).