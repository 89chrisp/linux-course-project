/**
 * Front for roomServer
 */


// Import the http server as base
var http = require("http");



/**
 * Class for client.
 *
 */
class roomClient {



    /**
     * Constructor.
     *
     */
    constructor() {
        this.debug2 = false;
    }



    /**
     * Set the url of the server to connect to.
     *
     * @param  String url to use to connect to the server.
     *
     */
    setServer(url) {
        this.server = url;
    }



    /**
     * Make a HTTP GET request, wrapped in a Promise.
     *
     * @param  String url to connect to.
     *
     * @return Promise
     *
     */
    httpGet(url) {
        if (this.debug2) {
            console.log("Debug mode active, url sent to server: ");
            console.log(this.server + url);
        }
        return new Promise((resolve, reject) => {
            http.get(this.server + url, (res) => {
                var data = "";

                res.on('data', (chunk) => {
                    data += chunk;
                }).on('end', () => {
                    if (res.statusCode === 200) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                }).on('error', (e) => {
                    reject("Got error: " + e.message);
                });
            });
        });

    }




    list(max) {
        if (max > 0) {
            return this.httpGet("/room/list?max=" + max);
        }else {
            return this.httpGet("/room/list");
        }
    }




    view(id) {
        return this.httpGet("/room/view/id/" + id);
    }


    house(house, max) {
        if (max > 0) {
            return this.httpGet("/room/view/house/" + house + "?max=" + max);
        }else {
            return this.httpGet("/room/view/house/" + house);
        }

    }


    searchs(search, max) {
        var response;
        if (max > 0) {
            response = this.httpGet("/room/search/" + search + "?max=" + max);
        }else {
            response = this.httpGet("/room/search/" + search);
        }


        return response;
    }

    searchp(searchp, max) {
        if (max > 0) {
            return this.httpGet("/room/searchp/" + searchp + "?max=" + max);
        }else {
            return this.httpGet("/room/searchp/" + searchp);
        }
    }

}

export default roomClient;
