// 获取用户是否在线
export const fetchUser = () => {

  const userInfo = localStorage.getItem("user") !== undefined ? JSON.parse(localStorage.getItem("user")) : localStorage.clear();

  return userInfo
}