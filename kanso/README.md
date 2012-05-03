# Helper Functions for GeoCouch

Allows the geocouch-utils to be used with the [Kanso](http://kan.so) tools to make life even easier!

## Using the Kanso Package

If you haven't got Kanso installed, you can install it via NPM:

<code>npm install -g kanso</code>

Once Kanso is installed, stay in this directory (./kanso) and gather the Kanso dependencies:

<code>kanso install</code>

You will now be ready to use Kanso to deploy the geocouch-utils tools to any CouchDB GeoCouch database. To do this, use Kanso to push the package to the Couch database.

<code>kanso push *db url*</code>

And you are done - Kanso will have published to geocouch-utils to [db_url]/_design/geo

## Building the Kanso Package

The packages in lib/ purely wrap the code found in the ../couchapp directory, so there is no duplication. This is done through the use of the [interleave](https://github.com/DamonOehlman/interleave) build tool. In order to build the source, you will need this tool - it can be installed via NPM.

<code>npm install -g interleave</code>

Once interleave is installed, simply build the source by running <code>make</code>