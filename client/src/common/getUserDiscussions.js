const getUserDiscussions = async (username) => {
  const url = `${process.env.REACT_APP_SERVER}/discussions/comment/user/${username}`;
  const res = await fetch(url, {
    method: "GET",
  });
  const data = await res.json();
  return data
}

export default getUserDiscussions
