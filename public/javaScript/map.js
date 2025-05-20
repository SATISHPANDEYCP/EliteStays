
// let mapToken = "<%=process.env.MAP_TOKEN%>";
// console.log(mapToken);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    center: [-74.5, 40],
    zoom: 9
});