var assert    = require("assert");
var serp   = require("../index.js");
var proxyLoader = require("simple-proxies/lib/proxyfileloader");


describe('search Domains on SERP', function() {

        var proxyList = null;

        /*
        before(function(done) {
              this.timeout(100000);
              console.log("Loading proxies ...");
              proxyLoader.loadDefaultProxies(function(error, pl){
                  console.log("Number of loaded proxies : " + pl.getProxies().length);
                  proxyList = pl;
                  if (pl.getProxies().length === 0) {
                    return done(new Error("No proxy loaded"));
                  }
                  done();
              });

        });
        */

        it('Should return a list of domains from a SERP', function(done) {
            this.timeout(100000);

            var options = {

              host : "google.be",
              num : 20,
              jar: true,
              delay : 1500,
              qs : {
                q : "rachat crédit",
                lr : "lang_fr",
                cr : "BE",
                pws : "0"
              },
              majecticKey : "E2C60E44548BC914AE7F9146096AD5FB",
              //whois : {user : "christophe.lombart@gmail.com", password : "clasamperbb975"},
              //noCheckIfDNSResolve : true,
              //minTrustFlow : 15, // used to get whois data
              proxyList

            };

            serp.searchDomains(options, function(error, domains){
                if (error) {
                  console.log("Error during retrieving domains on SERP : " + error);
                  done();
                }

                //console.log("List", domains);

                domains.forEach(function(domain){
                   console.log(domain.domain + "," + domain.isDNSFound +"," +  domain.majestic.TrustFlow + "," + domain.TopicalTrustFlow_Topic_0);
                });

                done();
            });
        });
});
