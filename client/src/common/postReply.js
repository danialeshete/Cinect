/**
 * Post a reply to a comment
 */
const postReply = async ({ comment_id, content, accessToken }) => {
  const data = { content: content };
  const url = `${process.env.REACT_APP_SERVER}/discussions/reply?comment_id=${comment_id}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      // Add the Authorization header to the existing headers
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });
  return res;
};
export default postReply;