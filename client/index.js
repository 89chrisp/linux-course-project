#!/usr/bin/env babel-node

/**
 * Main program to run the client bthappen to the server
 *
 */

const VERSION = "1.0.0";

// For CLI usage
var path = require("path");
var scriptName = path.basename(process.argv[1]);
var args = process.argv.slice(2);
var arg;



// Get the server with defaults
import roomClient from "./roomClient.js";

var roomC = new roomClient();
var url = "http://localhost:";
var port = 1337;


// Make it using prompt
var readline = require("readline");

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



/**
 * Display helptext about usage of this script.
 */
function usage() {
    console.log(`Usage: ${scriptName} [options]

Options:
 -h               Display help text.
 -v               Display the version.
 --server <url>   Set the server url to use.
 --port <port     Set the port number
 --debug2         Run client in debug mode`);
}



/**
 * Display helptext about bad usage.
 *
 * @param String message to display.
 */
function badUsage(message) {
    console.log(`${message}
Use -h to get an overview of the command.`);
}



/**
 * Display version.
 */
function version() {
    console.log(VERSION);
}



// Walkthrough all arguments checking for options.
while ((arg = args.shift()) !== undefined) {
    switch (arg) {
        case "-h":
            usage();
            process.exit(0);
            break;

        case "-v":
            version();
            process.exit(0);
            break;

        case "--server":
            url = args.shift();
            if (url === undefined) {
                badUsage("--server must be followed by a url.");
                process.exit(1);
            }
            break;
        case "--port":
            port = Number.parseInt(args.shift());
            if (Number.isNaN(port)) {
                badUsage("--port must be followed by a port number.");
                process.exit(1);
            }
            break;
        case "--debug2":
            roomC.debug2 = true;
            console.log("Debug mode active.");
            break;

        default:
            badUsage("Unknown argument.");
            process.exit(1);
            break;
    }
}

var server = url+port;
// console.log(server);
/**
 * Display a menu.
 */
function menu() {
    console.log(`Commands available:
 exit             Leave this program.
 menu             Print this menu.
 url              Get url to view game in browser
 list             List all rooms
 view <id>        View the room with the selected id.
 house <house>    View the names of all rooms in this building (house).
 search <string>  View the details of all matching rooms (one per row).
 searchp <string> View the details of all matching rooms, improved search.`);
}



/**
 * Callbacks for game asking question.
 */
 rl.on("line", function(line) {
     // Split incoming line with arguments into an array
     var args = line.trim().split(" ");
     args = args.filter(value => {
         return value !== "";
     });
    var max = 0;
    switch (args[0]) {
        case "exit":
             console.log("Bye!");
             process.exit(0);
             break;

        case "menu":
             menu();
             rl.prompt();
             break;

        case "list":
            if (args[1] == 'max') {
                max = args[2];
            }
            roomC.list(max)
            .then(value => {
                console.log(value);
                rl.prompt();
            })
            .catch(err => {
                console.log("FAILED: Could not list the rooms.\nDetails: " + err);
                rl.prompt();
            });
            break;

        case "view":
            var id = args[1];
            roomC.view(id)
                .then(value => {
                    console.log(value);
                    rl.prompt();
                })
                .catch(err => {
                    console.log("FAILED: Could not view the room.\nDetails: " + err);
                    rl.prompt();
                });
            break;

        case "house":
            var house = args[1];
            if (args[2] == 'max') {
                max = args[3];
            }
            roomC.house(house, max)
                .then(value => {
                    console.log(value);
                    rl.prompt();
                })
                .catch(err => {
                    console.log("FAILED: Could not view the rooms.\nDetails: " + err);
                    rl.prompt();
                });
            break;

        case "search":
            var search = args[1];
            if (typeof args[2] != 'undefined') {
                if (args[2] == 'max') {
                    max = args[3];
                }else {
                    search = [args[1], args[2]].join(" ");
                    if (typeof args[3] != 'undefined') {
                        if (args[3] == 'max') {
                            max = args[4];
                        }
                    }

                }
            }
            roomC.searchs(search, max)
                .then(value => {
                    var jsonobj = JSON.parse(value);
                    if (jsonobj.length > 0) {
                        var theKeys = Object.keys(jsonobj[0]);
                        for (var i = 0; i < jsonobj.length; i++) {
                            var subfields = "";
                            for (var j = 0; j < theKeys.length; j++) {
                                if (j == theKeys.length-1) {
                                    subfields += (jsonobj[i][theKeys[j]]);
                                }else {
                                    subfields += (jsonobj[i][theKeys[j]]) + ", ";
                                }
                            }
                            console.log(subfields);
                        }
                    }else {
                        console.log(value);
                    }
                    rl.prompt();
                })
                .catch(err => {
                    console.log("FAILED: Could not view the rooms.\nDetails: " + err);
                    rl.prompt();
                });
            break;
        case "searchp":
            var searchp = args[1];
            if (typeof args[2] != 'undefined') {
                if (args[2] == 'max') {
                    max = args[3];
                }else {
                    searchp = [args[1], args[2]].join(" ");
                    if (args[3] == 'max') {
                        max = args[4];
                    }
                }
            }
            roomC.searchp(searchp, max)
                .then(value => {
                    var jsonobj = JSON.parse(value);
                    if (jsonobj.length > 0) {
                        var theKeys = Object.keys(jsonobj[0]);
                        for (var i = 0; i < jsonobj.length; i++) {
                            var subfields = "";
                            for (var j = 0; j < theKeys.length; j++) {
                                if (j == theKeys.length-1) {
                                    subfields += (jsonobj[i][theKeys[j]]);
                                }else {
                                    subfields += (jsonobj[i][theKeys[j]]) + ", ";
                                }
                            }
                            console.log(subfields);
                        }
                    }else {
                        console.log(value);
                    }
                    rl.prompt();
                })
                .catch(err => {
                    console.log("FAILED: Could not view the rooms.\nDetails: " + err);
                    rl.prompt();
                });
            break;

        case "url":
            console.log("Click this url to view the application in a browser.\n" + server + "/");
            rl.prompt();
            break;

        default:
            console.log("Enter 'menu' to get an overview of what you can do here.");
            rl.prompt();
     }
 });



 rl.on("close", function() {
     console.log("Bye!");
     process.exit(0);
 });



// Main

roomC.setServer(server);
console.log("Use -h to get a list of options to start this program.");
console.log("Ready to talk to server url '" + server + "'.");
console.log("Use 'menu' to get a list of commands.");
rl.setPrompt("Bthappen$ ");
rl.prompt();
