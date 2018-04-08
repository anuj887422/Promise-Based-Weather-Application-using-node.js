const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address',
            describe:'Address to fetch weather for',
            string: true
        }
    })
    .help()
    .alias('help','h')
    .argv;


var encodedAddress = encodeURIComponent(argv.address);
var geocodeUrl=  `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;


axios.get(geocodeUrl).then((response) => {
if(response.data.status === 'ZERO_RESULTS'){
throw new Error('Unable to find that address');
}
var latitude = response.data.results[0].geometry.lat;
var longitude = response.data.results[0].geometry.lat;
weatherUrl = `https://api.darksky.net/forecast/6ac6da24a36d458738511a9261f0fbbe/${latitude},${longitude}`;
console.log('Formatted Address: '+response.data.results[0].formatted_address);
return axios.get(weatherUrl);
}).then((response) => {
var temperature = response.data.currently.temperature;
var apparentTemperature = response.data.currently.apparentTemperature;
console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`);
})
.catch((e) => {
if(e.code === 'ENOTFOUND'){
console.log('unable to connect to server');
}else{
console.log("Error : "+e.message);
}
});