// Local static server for public/. No dependencies.
const http=require('http'),fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..','public'),port=Number(process.env.PORT)||8137;
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
http.createServer((req,res)=>{
 const rel=decodeURIComponent(new URL(req.url,'http://x').pathname);
 const file=path.join(root,rel.endsWith('/')?rel+'index.html':rel);
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end('Not found');return}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'}).end(data)});
}).listen(port,'127.0.0.1',()=>console.log('http://127.0.0.1:'+port));
