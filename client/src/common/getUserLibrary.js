const getUserLibrary = async (username) => {
  const url = `${process.env.REACT_APP_SERVER}/user/${username}/library`;
  const res = await fetch(url, {
    method: "GET",
  });
  const data = await res.json();
  return data
}

export default getUserLibrary
