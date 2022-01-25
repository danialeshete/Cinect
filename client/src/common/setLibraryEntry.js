/**
 * Calls Cinect Backend to set make changes to a Library Entry. Bundled for reusability
 */
const setLibraryEntry = async ({media_id, entryChanges, is_tv, accessToken}) => {
  const data = entryChanges;
  const url = `${process.env.REACT_APP_SERVER}/user/me/library/entry/${media_id}?is_tv=${is_tv}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      // Add the Authorization header to the existing headers
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });
  return res;
};
export default setLibraryEntry;