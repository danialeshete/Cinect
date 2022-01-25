/**
 * Calls Cinect Backend to set the user Profile. 
 */
const setOwnUserProfile = async ({entryChanges , accessToken}) => {
  const data = entryChanges;
  const url = `${process.env.REACT_APP_SERVER}/user/me/profile`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      // Add the Authorization header to the existing headers
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });
  return res;
};
export default setOwnUserProfile;