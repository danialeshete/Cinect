/**
 * Calls TMDB API to retrieve Media Metadata. Bundled for reusability
 */
const getMediaMetadata = async (media_type, media_id) => {
  let tmdbKey = "eeff9ca42dcc809611efdfe69f8348bc";

  let response = (await fetch(`https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${tmdbKey}`, {
        "method": "GET"
      })).json();
  return response;
};
export default getMediaMetadata;