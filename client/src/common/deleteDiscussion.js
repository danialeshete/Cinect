/**
 * Calls Cinect Backend to delete specific discussion. Bundled for reusability
 */
 const deleteDiscussion = async ({comment_id, accessToken}) => {
  const url = `${process.env.REACT_APP_SERVER}/discussions/comment?comment_id=${comment_id}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      // Add the Authorization header to the existing headers
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res;
};
export default deleteDiscussion;