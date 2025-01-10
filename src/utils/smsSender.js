var https = require('follow-redirects').https;

const sendSMS = (to, message) => {
    return new Promise((resolve, reject) => {
        var options = {
            method: 'POST',
            hostname: 'qdqreq.api.infobip.com',
            path: '/sms/2/text/advanced',
            headers: {
                Authorization: 'App a91c886fa18ee0832d3b84c206ef4c51-93f76732-8b09-49cf-bde4-23a79bdc384f',
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            maxRedirects: 20,
        };

        var req = https.request(options, function (res) {
            var chunks = [];

            res.on('data', function (chunk) {
                chunks.push(chunk);
            });

            res.on('end', function () {
                var body = Buffer.concat(chunks);
                resolve(body.toString());
            });

            res.on('error', function (error) {
                reject(error);
            });
        });

        var postData = JSON.stringify({
            messages: [
                {
                    destinations: [{ to: to }],
                    from: 'Greenfinity',
                    text: message,
                },
            ],
        });

        req.write(postData);
        req.end();
    });
};

module.exports = {
    sendSMS,
};
