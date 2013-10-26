# Ptolemy

A [johnny-five](https://github.com/rwaldron/johnny-five) based build notification system.  It's built from a [toy cat picked up from Toys R Us](http://www.toysrus.co.uk/Toys-R-Us/Toys/Soft-Toys/Fur-Real-White-Walking-Kitty\(0079055\)), has a head mounted on a servo and has had something horrible done to it's eyes with a dremel.

It watches a Jenkins URL for failing builds and then strikes fear into the heart of developers until they fix the build and restore Ptolemy to a happy state.

Ptolemy is named after a cat that belonged to much mourned national treasure [Sir Patric Moore](http://en.wikipedia.org/wiki/Patrick_Moore).

![Ptolemy, relaxing with Sir Patric Moore](https://raw.github.com/achingbrain/build-cat/master/assets/ptolemy.jpg)

## Demo

[![Link to Vimeo](https://raw.github.com/achingbrain/build-cat/master/assets/video.jpg)](https://vimeo.com/77849849)

## Construction

Ptolemy uses a [Pololu Mini Maestro](http://www.pololu.com/catalog/product/1352) built into a Meccano skeleton (mostly because I destroyed the original plastic skeleton through exploratory construction).  It has a servo motor to drive it's head and two RGB LEDs for eyes, with the green channels spliced and connected to the sole PWM output available on the board.

The software runs on [Node.js](http://nodejs.org/), interfaces with [johnny-five](https://github.com/rwaldron/johnny-five) via [ioboard](https://github.com/achingbrain/node-ioboard), [pololu-maestro-ioboard](https://github.com/achingbrain/node-maestro-ioboard) and finally [pololu-maestro](https://github.com/omcaree/node-pololumaestro).

## Photos

The Meccano skeleton showing my shoddy glue gun work.  The servo is glued into the remains of the original plastic skeleton which has holes drilled into it to mount Meccano bits on.  The legs have since been lengthened and you can also see the Maestro board sitting next to it.

![Meccano skeleton](https://raw.github.com/achingbrain/build-cat/master/assets/skeleton.jpg)

Somewhat freaky image with the head attached to the servo:

![Skeleton with face attached](https://raw.github.com/achingbrain/build-cat/master/assets/skeletonwithskin.jpg)

## What's next?

 * Sounds
 * More movement
 * Maybe a rebuild with [this one](http://www.toysrus.co.uk/Toys-R-Us/Toys/Soft-Toys/Fur-Real-Daisy-Plays-with-Me-Kitty\(0106748\))
 * IRL Ptolemy was black. Maybe some spray paint?
