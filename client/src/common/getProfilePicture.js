const getProfilePicture = async (username) => {
  const url = `${process.env.REACT_APP_SERVER}/user/${username}/picture`;
  const res = await fetch(url, {
    method: "GET",
  });
  const data = await res.blob();
  return URL.createObjectURL(data);
}

export default getProfilePicture
