const qs = require('qs');

/**
 * [displaySearchResults description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function displaySearchResults(data) {
  const results = document.querySelector('.results');
  const p = document.createElement('p');
  p.innerHTML = data;   
  results.append(p);
}

function displaySearchResult(data) {
  const results = document.querySelector('.results');
  const p = document.createElement('p');
  p.innerHTML = data;   
  results.append(p);
}

/**
 * general fetch function with params
 * @return {[type]} [description]
 */
function requestArticles(uri, options, cb) {
  return fetch(uri, options)
    .then(function(res) {
      if (res.status >= 200 || res.status < 300) {
        return res.text();
      }
      throw Error(res.statusText);
    })
    .then(function(data){
      console.log(data);
      cb(data);
      return data;
    });
}

/**
 * Return a formatted qs to adhere to the wikipedia api
 * @param  {string} qs [description]
 * @return {string}    [description]
 */
function parseQueryString(qs) {
  const formattedQs = qs.replace('?query=', '')
    .split('+')
    .map(function(item) {      
      return item.charAt(0).toUpperCase() + item.slice(1);
    })
    .join('_');
  return formattedQs;
}

/**
 * [requestWikiArticles description]
 * https://en.wikipedia.org/api/rest_v1/
 * @return {[type]} [description]
 */
function requestWikiArticle() {
  
  const query = window.location.search;
  console.log('query', query);
  if (query) {
    const queryParams = {
      action: 'query',
      origin: '*', 
      prop: 'extracts',
      exintro: true, 
      exlimit: 20,
      format: 'json',
      formatversion: 2,
      generator: 'search',
      gsrsearch: `${query}`,
      gsrnamespace: 0,
      gsrlimit: 5

    };
    const endpoint = `https://en.wikipedia.org/w/api.php?${queryParams}`;
    const options = { 
      method: 'GET',
      mode: 'cors',
    };
   requestArticles(endpoint, options, displaySearchResults);  
  }
}

/**
 * Request Multiple articles that match the search query
 * @return {array} list of articles
 */
function requestWikiArticles() {
  const query = parseQueryString(window.location.search);
  console.log('query', query);
  if (query) {
    const queryParams = {
      action: 'query',
      origin: '*', 
      prop: 'extracts',
      exintro: true, 
      exlimit: 20,
      list: 'search',
      format: 'json',
      formatversion: 2,
    };
    const endpoint = `https://en.wikipedia.org/w/api.php?${qs.stringify(queryParams)}`;
    const options = { 
      method: 'GET',
      mode: 'cors',
    };
   requestArticles(endpoint, options, displaySearchResult);  
  }
}

const form = document.querySelector('form');
form.addEventListener('submit', requestWikiArticle());

