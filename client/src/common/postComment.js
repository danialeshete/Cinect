/**
 * Post a reply to a comment
 */
const postComment = async ({ media_id, is_tv, is_review, content, accessToken }) => {
  const data = { content: content };
  const url = `${process.env.REACT_APP_SERVER}/discussions/comment/medium/${media_id}?is_review=${is_review}&is_tv=${is_tv}`;
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
export default postComment;