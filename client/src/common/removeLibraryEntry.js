/**
 * Calls Cinect Backend to remove Library Entry. Bundled for reusability
 */
const removeLibraryEntry = async (media_id, is_tv, accessToken) => {
  const url = `${process.env.REACT_APP_SERVER}/user/me/library/entry/${media_id}?is_tv=${is_tv}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      // Add the Authorization header to the existing headers
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res;
};
export default removeLibraryEntry;