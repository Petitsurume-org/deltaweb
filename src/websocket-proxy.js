const express = require("express")
const router = express.Router()
const websocket = require("websocket")
const endpoints = [
    "home",
    "talk",
    "group-talk"
]

endpoints.forEach(function(endpoint) {
    router.ws("/"+endpoint,function(ws, req) {
        if (req.session.user_id == null) {
            console.log("not login")
            return ws.close()
        }
        if (req.session.csrf != req.query.csrf) {
            console.log("invalid csrf")
            return ws.close()
        }
        var upstream = new websocket.client()
        upstream.on("connectFailed", function() {
            ws.close()
        })
        upstream.on("connect", function() {
            ws.on("close", function() {
                upstream.close()
            })
        })
        upstream.on("close", function() {
            ws.close()
        })
        upstream.on("message", function(data) {
            console.log(data)
            ws.send(data)
        })
        var queryobject = req.query
        queryobject["passkey"] = process.env.API_KEY
        queryobject["user-id"] = req.session.user_id
        delete queryobject["csrf"]
        var query = ""
        Object.keys(queryobject).forEach(name => {
            query += name + "=" + encodeURIComponent(queryobject[name]) + "&"
        })
        query = query.slice(0, -1)
        console.log(query)
        const url = process.env.API_ROOT.replace("http", "ws")+"/streams/"+endpoint+"?"+query
        console.log(url)
        upstream.connect(url)
    })
})
module.exports = router
