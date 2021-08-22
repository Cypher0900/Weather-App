const http=require('http');
const port=8000;
const fs=require('fs');
const url=require('url');
var requests = require('requests');

const homeFile = fs.readFileSync("home.html","utf-8");
const replaceVal=(tempVal, orgVal)=>{
    let temperature = tempVal.replace("{%tempval%}",Math.round(orgVal.main.temp-273.15));
     temperature = temperature.replace("{%tempmin%}",Math.round(orgVal.main.temp_min-273.15));
     temperature = temperature.replace("{%tempmax%}",Math.ceil(orgVal.main.temp_max-273.15));
     temperature = temperature.replace("{%location%}",orgVal.main.name);
     temperature = temperature.replace("{%country%}",orgVal.sys.country);

     return temperature;
}


const server=http.createServer((req,res)=>{
   
    if(req.url="/"){
       requests("https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=6fe954bcb12a79d0077be9edac378562")
       
       .on("data",(chunkdata)=>{
             const objdata = JSON.parse(chunkdata);
             const arrData=[objdata];
            //  console.log(Math.round(arrData[0].main.temp-273.15));

            const realTimeData = arrData.map((val)=> replaceVal(homeFile,val)).join("");
            //console.log(realTimeData);
            res.write(realTimeData);
       })
       .on("end",(err)=>{
           if(err) return console.log("Connection closed due to error");
           res.end();
           console.log("end");
       });
    }
});

server.listen(port,'127.0.0.1');
