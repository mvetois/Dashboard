const redirectIfNotConnected = (req, res) => {
    if (!req.session.connected) {
        res.writeHead(302, {"Location": "/"});
        res.end();
        return (true);
    }
    return (false);
}

exports.redirectIfNotConnected = redirectIfNotConnected;

exports.isJSONEmpty =  isJSONEmpty = (json) => {
    for(var key in json) {
        if(json.hasOwnProperty(key))
            return (false);
    }
    return (true);
}