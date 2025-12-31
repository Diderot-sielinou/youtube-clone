
import axios from 'axios';

const BASE_URL = "https://youtube138.p.rapidapi.com"

const options = {
  params: {
    hl: 'en',
    gl: 'US'
  },
  headers: {
    'x-rapidapi-key': "2a72455b55msh35647596cd8e311p132da1jsn509068c84d7f",
    'x-rapidapi-host': 'youtube138.p.rapidapi.com'
  }
};



export const fetchDataFromApi= async(url)=>{
  const {data} = await axios.get(`${BASE_URL}/${url}`,options)
  return data
}

// const url = 'https://youtube138.p.rapidapi.com/search/?q=sport&hl=en&gl=US';
// const option = {
// 	method: 'GET',
// 	headers: {
// 		'x-rapidapi-key': 'd3699b3af0msh784c190f71e4928p1ab18ajsnb234bf0001c7',
// 		'x-rapidapi-host': 'youtube138.p.rapidapi.com'
// 	}
// };

// try {
// 	const response = await fetch(url, option);
// 	const result = await response.json();
// 	console.log(result);
// } catch (error) {
// 	console.error(error);
// }