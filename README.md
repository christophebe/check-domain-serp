# Check domains in a SERP

This module allows to execute search on Google and get infos on the related domains (mainly PageRank, Majestic Data & whois).
This module is using the Majestic API & the whoisxml API.

# Installation

``` bash
$ npm install check-domain-serp
```

# Exemple

``` javascript
var serp = require('check-domain-serp');

var options = {
  host : "google.be",
  qs : {
    q : "[add your keyword]"
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

The options are the same as the module :
qs can contains the usual Google search parameters : https://moz.com/ugc/the-ultimate-guide-to-the-google-search-parameters.

The options object can also contain all request options like proxy : https://github.com/request/request
