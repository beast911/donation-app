window.donationModule = angular.module("donationApp.welcome", ["ngRoute"]).config(["$routeProvider", function(t) {
  t.when("/donation", {
    templateUrl: "donation/donation.html",
    controller: "DonationCtrl"
  }).when("/thankyou", {
    templateUrl: "thankyou/thankyou.html",
    controller: "thankYouCtrl"
  })
}]), donationModule.controller("DonationCtrl", ["$scope", "DonationService", "$q", function(t, e, o) {
  t.donatedBy = "", t.init = function() {
    localStorage.removeItem("temp_userId"), localStorage.removeItem("temp_checkoutId")
  }(), t.isNotValidNumber = function(t) {
    return t <= 100
  }, t.donate = function(a) {
    if (a.preventDefault(), n(t.donation.fromUserId)) {
      o.defer();
      t.donatedBy = t.donation.fromUserId, e.getDonationService(t.donation).then(function(o) {
        e.setUserToPass(t.donatedBy), r(o.data.id)
      }, function(t) {})
    }
  };
  var n = function(t) {
      var e = JSON.parse(localStorage.getItem(t)),
        o = 3600;
      if (null !== e) {
        var n = new Date(e.timestamp),
          r = new Date((new Date).toUTCString()),
          a = Math.floor((r - n) / 1e3);
        return !(a <= o)
      }
      return !0
    },
    r = function(t) {
      e.setCheckoutIdToVerify(t);
      var o = document.createElement("script");
      o.setAttribute("src", "https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=" + t), document.head.appendChild(
        o);
      var n = document.getElementById("donationForm");
      n.parentNode.removeChild(n);
      var r = document.createElement("form"),
        a = document.createTextNode("VISA"),
        i = window.location.origin + window.location.hash + "/#!/thankyou";
      r.appendChild(a), r.setAttribute("action", i), r.setAttribute("class", "paymentWidgets"), document.body.appendChild(
        r)
    }
}]), donationModule.service("DonationService", ["$log", "$q", "$http", "$httpParamSerializerJQLike", function(t, e, o,
  n) {
  var r = {
      verifyCheckout: function(t) {
        var n = e.defer(),
          r = "https://test.oppwa.com/v1/checkouts/" + t + "/payment";
        r += "?authentication.userId=8a8294174b7ecb28014b9699220015cc", r +=
          "&authentication.password=sy6KJsT8", r += "&authentication.entityId=8a8294174b7ecb28014b9699220015ca";
        var a = o({
          url: r,
          method: "GET"
        });
        return a.then(function(t) {
          n.resolve(t)
        }, function(t) {
          n.reject("error", t)
        }), n.promise
      },
      getDonationService: function(t) {
        var r = e.defer(),
          a = o({
            url: "https://test.oppwa.com/v1/checkouts",
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: n(c(t))
          });
        return a.then(function(t) {
          r.resolve(t)
        }, function(t) {
          r.reject("error", t)
        }), r.promise
      },
      setUserToPass: function(t) {
        i = t, localStorage.setItem("temp_userId", t)
      },
      setCheckoutIdToVerify: function(t) {
        a = t, localStorage.setItem("temp_checkoutId", a)
      },
      getUserToPass: function() {
        if (null !== i && void 0 !== i && "" !== i) return i;
        var t = localStorage.getItem("temp_userId");
        return t
      },
      getCheckoutIdToVerify: function() {
        if (null !== a && void 0 !== a && "" !== a) return a;
        var t = localStorage.getItem("temp_checkoutId");
        return t
      }
    },
    a = "",
    i = "",
    c = function(t) {
      var e = {};
      return e["authentication.userId"] = "8a8294174b7ecb28014b9699220015cc", e["authentication.entityId"] =
        "8a8294174b7ecb28014b9699220015ca", e["authentication.password"] = "sy6KJsT8", null !== t && void 0 !== t &&
        (e.paymentType = "DB", e.amount = t.amount, e.currency = t.currency), e
    };
  return r
}]), window.thankYouModule = angular.module("donationApp.thankYou", ["ngRoute"]).config(["$routeProvider", function(t) {
  t.when("/thankyou", {
    templateUrl: "thankyou/thankyou.html",
    controller: "thankYouCtrl"
  })
}]).controller("thankYouCtrl", ["$scope", "DonationService", "$window", function(t, e, o) {
  var n = (function() {
    console.log("init called");
    var t = e.getCheckoutIdToVerify();
    "" !== t && e.verifyCheckout(t).then(function(t) {
      n(t.data), window.location.href = window.location.origin + window.location.pathname +
        "/#!/donation"
    }, function(t) {})
  }(), function(t) {
    var o = e.getUserToPass(),
      n = {};
    n.id = t.id, n.amount = t.amount, n.currency = t.currency, n.buildNumber = t.buildNumber, n.timestamp = t
      .timestamp, n.ndc = t.ndc, localStorage.setItem(o, JSON.stringify(n))
  })
}]), window.baseModule = angular.module("donationApp", ["ngRoute", "donationApp.welcome", "donationApp.thankYou"]).config(
  ["$locationProvider", "$routeProvider", function(t, e) {
    t.hashPrefix("!"), e.otherwise({
      redirectTo: "/donation"
    })
  }]);