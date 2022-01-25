/**
 * Calls Cinect Backend to delete specific reply. Bundled for reusability
 */
 const deleteReply = async ({reply_id, accessToken}) => {
  const url = `${process.env.REACT_APP_SERVER}/discussions/reply?reply_id=${reply_id}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      // Add the Authorization header to the existing headers
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res;
};
export default deleteReply;