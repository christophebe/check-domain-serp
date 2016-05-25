# Check domains in a SERP

This module allows to execute a search on Google and get infos on the related domains (mainly trust flow, topical trust flow & whois).

# Installation

``` bash
$ npm install check-domain-serp
```

# Example

``` javascript
var serp = require('check-domain-serp');

var options = {
  host : "google.be",
  qs : {
    q : "[add your keywords]"
  },
  majecticKey : "[Add your majestickey here]",
  whois : {user : "[Add you login]", password : "[add your password]"}
};

serp.searchDomains(options, function(error, domains){
    if (error) {
      console.log("Error during retrieving domains on SERP : " + error);
    }

    console.log(domains);
});

```
# Options

The option json structure can contain the following paramaters :

**For executing the request/scrape on Google :**
- For google.com, the param host is not necessary.
- qs can contain the usual Google search parameters : https://moz.com/ugc/the-ultimate-guide-to-the-google-search-parameters.
- options.qs.q is the keyword or an array of keywords.
- num is the number of desired results (defaut is 10).
- The options object can also contain [Request](https://github.com/request/request) parameters like http headers, ...
- The user agent is not mandatory. Default value will be : 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1'
- delay : delay in ms between each HTTP request on Google (default : 0 ms).
- retry : number of retry if an HTTP request fails (error or HTTP status != 200).

**For Checking the domains :**
- majecticKey : your majestic key API,
- whois : your credentials for [Whois XML API](https://www.whoisxmlapi.com/),
- noCheckIfDNSResolve : if true, the domain info are not retrieved if the DNS is resolved for this domain.
- minTrustFlow : The min TrustFlow value for getting the whois API
- sortOnTrustFlow : if true, sort the SERP on the TrustFlow.
