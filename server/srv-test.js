const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.cluster0.bcgnwkz.mongodb.net",
  (err, res) => {
    console.log("ERROR:", err);
    console.log("RESULT:", res);
  }
);