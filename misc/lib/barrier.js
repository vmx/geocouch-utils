/**
* A simple barrier point coordination class for node.js
*
* See http://www.ioexception.de/2010/07/05/barrier-points-in-node-js/ for more details.
*
* @author Benjamin Erb | http://www.benjamin-erb.de
*
*/

/**
* @class
*
* Creates a new barrier for the given amount of parties.
* @param parties
* @param barrierCallback
* @param abortCallback
* @return
*/
var Barrier = exports.Barrier = function(parties, barrierCallback, abortCallback)
{
this.parties = parties;
this.barrierCallback = barrierCallback;
this.abortCallback = abortCallback;

this.running = true;
this.count = 0;
};

/**
* Signals a completion of one of the parties.
* @return
*/
Barrier.prototype.submit = function()
{
if (++this.count === this.parties && this.running)
{
this.barrierCallback();
}
};

/**
* Signals an abort by one of the parties. If not callback is passed, the default abort callback will be executed.
* @param customAbortCallback Optional callback that should be executed due to the abort.
* @return
*/
Barrier.prototype.abort = function(customAbortCallback)
{
if (this.running && customAbortCallback)
{
customAbortCallback();
}
else if (this.running && this.abortCallback)
{
this.abortCallback();
}
this.running = false;
};
