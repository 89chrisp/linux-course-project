/**
 * Front for server
 */


// A better router to create a handler for all routes
import Router from "./router";
// import Router from "../router/router";
var router = new Router();



// Import the http server as base
var http = require("http");
var url = require("url");

var salData = require("../salar.json");


/**
 * Wrapper function for sending a JSON response
 *
 * @param  Object        res     The response
 * @param  Object/String content What should be written to the response
 * @param  Integer       code    HTTP status code
 */
function sendJSONResponse(res, content, code = 200) {
    res.writeHead(code, { "Content-Type": "application/json; charset=utf8" });
    res.write(JSON.stringify(content, null, "    "));
    res.end();
    // Log response for debug mode
    if (server.debug2) {
        console.log(JSON.stringify(content, null, "    "));
    }
}

/**
 * Display a helptext about the API.
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/", (req, res) => {

    res.writeHead(200, "Content-Type: text/plain");
    var cont = "Welcome to the room server.\n\n"
        + " /                             Display this helptext.\n"
        + " /room/list                    List all available rooms\n"
        + " /room/view/id/:number         View details on the room with the roomnumber.\n"
        + " /room/view/house/:house       View all rooms within specified house.\n"
        + " /room/search/:search          View rooms matching search.\n";
    res.write(cont);
    res.end();
    // Log response for debug mode
    if (server.debug2) {
        console.log(cont);
    }
});

/**
 * View the listed rooms
 *
 * @param Object req The request
 * @param Object res The response
 */
router.get("/room/list", (req, res) => {
    var response = [];
    var max = parseInt(req.query.max);
    for (var i = 0; i < salData.salar.length; i++) {
        if (salData.salar[i].Salsnr === null) {
            response.push(salData.salar[i].Salsnamn);
        }else {
            response.push(salData.salar[i].Salsnr);
        }
    }
    if (isNaN(max)) {
        sendJSONResponse(res, response);
    }else {
        sendJSONResponse(res, response.slice(0, max));
    }

});
router.get("/room/view/id/:number", (req, res) => {
    var number = req.params.number;
    var response = [];
    // var max = parseInt(req.query.max);
    for (var i = 0; i < salData.salar.length; i++) {
        if (salData.salar[i].Salsnr === null) {
            if (salData.salar[i].Salsnamn == number) {
                response.push(salData.salar[i]);
            }
        }else if (salData.salar[i].Salsnr == number) {
            response.push(salData.salar[i]);
        }
    }

    sendJSONResponse(res, response);
});
router.get("/room/view/house/:house", (req, res) => {
    var house = req.params.house;
    var response = [];
    var max = parseInt(req.query.max);
    for (var i = 0; i < salData.salar.length; i++) {
        if (salData.salar[i].Hus == house) {
            response.push(salData.salar[i]);
        }
    }
    if (isNaN(max)) {
        sendJSONResponse(res, response);
    }else {
        sendJSONResponse(res, response.slice(0, max));
    }
});
router.get("/room/search/:search", (req, res) => {
    var search = decodeURI(req.params.search.toLowerCase());
    var response = [];
    var max = parseInt(req.query.max);
    var theKeys = Object.keys(salData.salar[0]);
    for (var i = 0; i < salData.salar.length; i++) {
        for (var j = 0; j < theKeys.length; j++) {
            var check = salData.salar[i][theKeys[j]];
            if (check === null) {

            }else if (check.toLowerCase().indexOf(search) > -1) {
                response.push(salData.salar[i]);
                break;
            }else if (search.indexOf(check.toLowerCase()) > -1) {
                response.push(salData.salar[i]);
                break;
            }
        }

    }
    if (isNaN(max)) {
        sendJSONResponse(res, response);
    }else {
        sendJSONResponse(res, response.slice(0, max));
    }
});

router.get("/room/searchp/:searchp", (req, res) => {
    var search = decodeURI(req.params.searchp);
    var response = [];
    var max = parseInt(req.query.max);
    var theKeys = Object.keys(salData.salar[0]);
    // Array for storing objects with rooms and their priority
    var items = [];
    // Priority rating for match in a field
    var fieldPrio = [1, 1, 0.4, 0.4, 0.4, 0.5, 0.4, 0.4, 0.2];
    for (var i = 0; i < salData.salar.length; i++) {
        var totPrio = 0;
        for (var j = 0; j < theKeys.length; j++) {
            var check = salData.salar[i][theKeys[j]];
            var matchPrio = 0;
            if (check === null) {

            // check if the search-string is a substring of a key-value
            }else if (check.toLowerCase().indexOf(search.toLowerCase()) > -1) {
                matchPrio = prio(search, check);
                if (matchPrio*fieldPrio[j] > totPrio) {
                    totPrio = matchPrio*fieldPrio[j];
                }
            // check if the key-value is a substring of the search-string
            }else if (search.toLowerCase().indexOf(check.toLowerCase()) > -1) {
                matchPrio = prio(check, search);
                if (matchPrio*fieldPrio[j] > totPrio) {
                    totPrio = matchPrio*fieldPrio[j];
                }
                // console.log(check);

            }
        }
        // Only add a room if there was a match in the search
        if (totPrio > 0) {
            items.push({ name: salData.salar[i], value: totPrio });
        }

    }
    // sort in descending order
    items.sort(function (b, a) {
        if (a.value > b.value) {
            return 1;
        }
        if (a.value < b.value) {
            return -1;
        }
        return 0;
    });
    // loop through objects and add to response array
    for ( i = 0; i < items.length; i++) {
        response.push(items[i].name);
        console.log(items[i].value);
    }
    // return response array via sendJSONResponse
    if (isNaN(max)) {
        sendJSONResponse(res, response);
    }else {
        sendJSONResponse(res, response.slice(0, max));
    }
});

function prio(searchStr, chkMatch){
    var val = 0;
    if (searchStr == chkMatch) {
        // match mer rätt case
        val = 1;
    }else if (searchStr.toLowerCase() == chkMatch.toLowerCase()) {
        // match med fel case
        val = 0.9;
    }else if (chkMatch.toLowerCase().indexOf(searchStr.toLowerCase()) > -1) {
        // match av delsträng med rätt case
        if (chkMatch.indexOf(searchStr) === 0) {
            // match av delsträng i rätt case i början av sträng
            val = 0.6;
        }else if (chkMatch.toLowerCase().indexOf(searchStr.toLowerCase()) === 0) {
            // match av delsträng i fel case i början av sträng
            val = 0.55;
        }else if (chkMatch.endsWith(searchStr)){
            // match av delsträng i rätt case i slutet av sträng
            val = 0.5;
        }else if (chkMatch.toLowerCase().endsWith(searchStr.toLowerCase())) {
            // match av delsträng i fel case i slutet av sträng
            val = 0.45;
        }else if (chkMatch.indexOf(searchStr) > -1){
            // match av delsträng i rätt case i mitten av sträng
            val = 0.4;
        }else {
            // match av delsträng i fel case i mitten av sträng
            val = 0.35;
        }
    }
    return val;
}

/**
 * Create and export the server
 */
var server = http.createServer((req, res) => {
    var ipAddress,
        route, debug2;

    // Log incoming requests
    ipAddress = req.connection.remoteAddress;

    // Check what route is requested
    route = url.parse(req.url).pathname;
    console.log("Incoming route " + route + " from ip " + ipAddress);

    // Let the router take care of all requests
    router.route(req, res);

    // Default to debug mode not active
    debug2 = false;

});

export default server;
