const app = require('express')()
const http = require('http');
const https = require('https');
const logger = require('./logger');

app.all('/', (req, res) => 
{
    logger.silly({
        message: {
            Protocol: req.protocol,
            Method: req.method,
            URL: req.originalUrl,
            Headers: req.headers}
    });
    
    var opts = {
        protocol: req._parsedUrl.protocol,
        hostname: req.hostname,
        port: req.port,
        path: req.path,
        headers: req.headers,
        method: req.method
    };
    
    if(req.hostname.toLowerCase === '/testproxy.html'){
        res.statusCode = 200;
        res.contentType('.html');
        return res.sendFile(`${__dirname}/testProxy.html`);
    };

    if(req.protocol === 'http')
    {
        var serverReq = http.request(/*req.originalUrl,*/ opts, (newRes) => 
        {
            res.statusCode = newRes.statusCode;
            res.statusMessage = newRes.statusMessage;
            res.set(newRes.headers);

            newRes.on('data', (chunk) => {
                res.write(chunk)
                //res.end();
            })
            newRes.on('end', () => {
                if (!newRes.complete){
                    logger.error({message:{
                        error:'Connection was terminated while the message was still being sent'
                    }});
                }
                res.end();
            });
            newRes.on('error', (err) => {
                res.statusCode(400)
                res.end('Error: ', err.message)
                logger.error({message: {error:err.message}});
            });
        })
        .on('error', (err) => {
            logger.error({message: {error:err.message}});
        })
        serverReq.end();
    } else {
        logger.error({message:{error:'I only handle http requests.'}});
        res.statusCode = 500;
        res.contentType('text/plain');
        return res.end('I only handle http requests. ');
    }
})

app.listen(8080, () => console.log('Listening'));