var _            = require("underscore");
var async        = require("async");
var request      = require("request");
var serp         = require("serp");
var checkDomain  = require("check-domain");
var URI          = require("crawler-ninja-uri");
var log          = require("crawler-ninja-logger").Logger;

/**
 *  Main function of this module,
 *  Make Search on Google based on keywords & get information on the domains
 *
 * @param the options use to make the google search and to get info on the domains
 * E.g :
 * var options = {
 *   host : "google.com",  // The Google domain  : .com, .fr, ...
 *   qs : {
 *     q : "keyword",
 *     // You can add all google query parameters like :
 *     filter : 0,
 *     pws : 0
 *   },
 *   delay : 1000, // delay between request - default : 0
 *   num : 100,  // number of result - default : 10
 *   majecticKey : "...", // not mandatory. Used to get the Majestic info : TrustFlow, backlinks, ...
 *   whois : {user : "", password : ""}, //not mandatory : the whois xml API
 *   noCheckIfDNSResolve : true, // if true : there is no check for the domain if its dns can be resolved
 *   minTrustFlow : the min trustflow value required to retrieve availability and whois data
 *   sortOnTrustFlow : Sort the list of the domain on the trustflow (descending)
 *   proxy : "http://user:passwor@host.com" // Optional proxyList
 *   proxyList : proxyList // List of proxies (based on the simple proxies module available on npm)
 * };
 *
 * @callback(error, domainsInfo)
 */
function searchDomains(searchOptions, callback) {

    serp.search(searchOptions, function(error, urls) {

        if (error) {
            return callback(error);
        }
        //console.log("Serp Result", urls);
        getDomainList(searchOptions, urls, callback);

    });

}

/**
 *  Get the domains with their infos (availability, MajesticInfo, ... )
 *
 * @param the options use to make the google search and to get info on the domains
 * @param a set of urls matching to a google search
 * @callback(error, domainsInfo)
 */
function getDomainList(searchOptions, urls, callback) {
    async.waterfall([
      function(callback) {
         getDomainInfos(searchOptions, urls, callback);
      },

      // Sort the list in function of the Majestic TrustFlow
      function(domains, callback) {
          domains = _.compact(domains);

          if (searchOptions.majecticKey && searchOptions.sortOnTrustFlow) {
            domains = _.sortBy(domains, function(domain){ return -domain.majestic.TrustFlow; });
          }

          callback(null, domains);
      }

    ], function(error, domains) {
        if (error) {
          logError("Error during getting infos for domains", searchOptions, error);
        }
        callback(error, domains);
    });
}

/**
 * Get info on all domains
 *
 * @param the options use to make the google search and to get info on the domains
 * @param a set of urls matching to a google search
 * @callback(error, domainsInfo)
 *
 */
function getDomainInfos(searchOptions, urls, endCallback) {
    var checkedDomains = [];

    async.map(urls, function(urldata, callback) {
          var domain = URI.domain(urldata.url);

          // Don't add twice the same domain
          if (checkedDomains.indexOf(domain) > -1) {
            callback();
          }
          else {
            checkedDomains.push(domain);
            getDomainInfo(searchOptions, urldata, callback);
          }

    },
    function(error, domains) {
        endCallback(error, domains);
    });
}

/**
 * Get info for one domains
 *
 * @param the options use to make the google search and to get info on the domains
 * @callback the url
 */
function getDomainInfo(searchOptions, urldata, callback) {

    // Don't return an error if the url is invalid
    // otherwise it will stop the complete check
    if (! URI.isValidDomain(urldata.url)) {
        return callback();
    }

    var options = _.clone(searchOptions);
    options.domain = URI.domain(urldata.url);
    logInfo("Getting domain info", options.domain);

    checkDomain(options, function(error, result) {
          result.url = urldata.url;
          result.title = urldata.title; 

          callback(error, result);
    });

}

function logInfo(message, options) {
  log.info({module : "check-domain-serp", message : message, options : options});
}

function logError(message, options, error) {
  log.error({module : "check-domain-serp", message : message, options : options, error : error });
}
module.exports.searchDomains = searchDomains;
