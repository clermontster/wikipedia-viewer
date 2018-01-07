const qs = require('qs');

/**
 * [displaySearchResults description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function displaySearchResults(data) {
  const results = document.querySelector('.results');
  if (data.query && data.query.pages.length) {
    const ul = document.createElement('ul');

    data.query.pages.forEach(function(page) {
      const li = document.createElement('li');
      const title = document.createElement('h3');
      const desc = document.createElement('div');
      const link = document.createElement('a');
      link.href= `https://en.wikipedia.org?curid=${page.pageid}`;
      link.target = '_blank';
      title.innerHTML = page.title;
      desc.innerHTML = page.extract;
      link.append(title);
      link.append(desc);
      li.append(link);   
      ul.append(li);
    });
    return results.append(ul);  
  }
  const h1 = document.createElement('h1');
  h1.innerHTML = "No Results Found";
  return results.append(h1);
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
        return res.json();
      }
      throw Error(res.statusText);
    })
    .then(function(data){
      cb(data);
      return data;
    });
}

function requestArticle(uri, options, cb) {
  return fetch(uri, options)
    .then(function(res) {
      if (res.status >= 200 || res.status < 300) {
        return res.text();
      }
      throw Error(res.statusText);
    })
    .then(function(data){
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
 * Request Multiple articles that match the search query
 * https://stackoverflow.com/questions/44794197/how-to-return-more-than-one-search-results-by-wikipedia-api
 * @return {[type]} [description]
 */
function requestWikiArticles() {
  const query = window.location.search.replace('query=', '').replace('+','_');

  if (query) {
    const queryParams = {
      action: 'query',
      origin: '*', 
      prop: 'extracts',
      exintro: true, 
      exlimit: 20,
      explaintext: true,
      exsentences: 1,
      format: 'json',
      formatversion: 2,
      generator: 'search',
      gsrsearch: `${query}`,
      gsrnamespace: 0,
      gsrlimit: 10
    };
    const endpoint = `https://en.wikipedia.org/w/api.php?${qs.stringify(queryParams)}`;
    const options = { 
      method: 'GET',
      mode: 'cors',
    };
   requestArticles(endpoint, options, displaySearchResults);  
  }
}

/**
 * Request single wikipedia article using rest api
 * https://en.wikipedia.org/api/rest_v1/
 * @return {array} list of articles
 */
function requestWikiArticle() {
  const query = parseQueryString(window.location.search);
  if (query) {
    const endpoint = `https://en.wikipedia.org/api/rest_v1/page/html/${query}`;
    const options = { 
      method: 'GET',
      mode: 'cors',
    };
   requestArticle(endpoint, options, displaySearchResult);  
  }
}

const form = document.querySelector('form');
form.addEventListener('submit', requestWikiArticles());

