const getDiscussions = async (media_id, media_type) => {
  const is_tv = (media_type === "tv") ? true : false;
  const url = `${process.env.REACT_APP_SERVER}/discussions/comment/medium/${media_id}?is_tv=${is_tv}`;
  const res = await fetch(url, {
    method: "GET",
  });
  const data = await res.json();
  return data
}

export default getDiscussions
