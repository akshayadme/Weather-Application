const http = require('http');
const fs = require('fs');
const requests = require('requests');

const homeFile = fs.readFileSync("index.html","utf-8");

const replacevalue =(tempval,orgval)=>{
	let temperature = tempval.replace("{%temp%}",orgval.main.temp);
	temperature = temperature.replace("{%loc%}",orgval.name);
	temperature = temperature.replace("{%countary%}",orgval.sys.country);
	temperature = temperature.replace("{%wind%}",orgval.wind.speed);
	temperature = temperature.replace("{%humid%}",orgval.main.humidity);
	temperature = temperature.replace("{%visible%}",orgval.visibility);
	temperature = temperature.replace("{%mintemp%}",orgval.main.temp_min);
	temperature = temperature.replace("{%maxtemp%}",orgval.main.temp_max);
	temperature = temperature.replace("{%tempstatus%}",orgval.weather[0].main);
	temperature = temperature.replace("{%status%}",orgval.weather[0].main);

	return temperature;
}

const server = http.createServer((req,res)=>{
	if(req.url=='/'){
		requests("http://api.openweathermap.org/data/2.5/weather?q={your location}&appid={your API Key}")
		.on("data",(chunk)=>{
			const objdata = JSON.parse(chunk);
			const arraydata = [objdata];
			// console.log(arraydata);
			const realtimeData = arraydata.map((val)=> replacevalue(homeFile,val))
			.join("");
			res.write(realtimeData);
		})
		.on("end",(err)=>{
			if(err)	return console.log("Connection closed by some err",err);
			// console.log('end');
			res.end();
		});
	}
});

server.listen(3000);
// haze clear mist smoke
