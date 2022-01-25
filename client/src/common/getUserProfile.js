const getUserProfile = async (username) => {
  const url = `${process.env.REACT_APP_SERVER}/user/${username}/profile`;
  const res = await fetch(url, {
    method: "GET",
  });
  const data = await res.json();
  return data
}

export default getUserProfile
