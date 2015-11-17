var _            = require("underscore");
var async        = require("async");
var serp         = require("serp");
var checkDomain  = require("check-domain");
var URI          = require("crawler-ninja-uri");


function searchDomains(searchOptions, endCallback) {

    serp.search(searchOptions, function(error, urls) {

        if (error) {
            return endCallback(error);
        }
        async.waterfall([
          function(callback) {
             getDomains(searchOptions, urls, callback);
          },
          function(domains, callback) {
              if (searchOptions.majecticKey) {
                domains = _.sortBy(domains, function(domain){ return -domain.majestic.TrustFlow; });
              }

              callback(null, domains);
          }

        ], function(error, domains) {
            endCallback(error, domains);
        });
    });

}

function getDomains(searchOptions, urls, endCallback) {
    var checkedDomains = [];

    async.map(urls, function(url, callback) {
          var domain = URI.domain(url);

          if (checkedDomains.indexOf(domain) > -1) {
            callback();
          }
          else {
            checkedDomains.push(domain); 
            getDomain(searchOptions, url, callback);
          }

    },
    function(error, domains) {
        //console.log("checks", result);
        endCallback(error, domains);
    });
}

function getDomain(searchOptions, url, callback) {
    if (! URI.isValidDomain(url)) {
        return callback(new Error("Invalid Domain"));
    }

    var options = _.clone(searchOptions)
    options.domain = URI.domain(url);

    checkDomain(options, function(error, result) {
        callback(error, result);
    });
}

module.exports.searchDomains = searchDomains;
