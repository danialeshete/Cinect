const searchTmdb = async ({ query, page }) => {
  const tmdbKey = 'eeff9ca42dcc809611efdfe69f8348bc';
  const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${tmdbKey}&language=en-US&query=${query}&page=${page}&include_adult=false`)
  const data = await res.json();
  return data
};

export default searchTmdb;