const getUserSearch = async (query) => {
  const url = `${process.env.REACT_APP_SERVER}/find/users?q=${query}`;
  const res = await fetch(url, {
    method: "GET",
  });
  const data = await res.json();
  return data
}

export default getUserSearch
