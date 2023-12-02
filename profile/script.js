let currentUser;
const username = localStorage.username;
let avatarImg = document.querySelector('#avatarImg');
let nameUser = document.querySelector("#name");
let userName = document.querySelector("#username");
let followers = document.querySelector("#followers");
let following = document.querySelector("#following");
let repoDetails = document.querySelector("#repoDetails");

const api = axios.create({
  baseURL: " https://api.github.com/",
  headers: {
    "X-GitHub-Api-Version": "2022-11-28",
  },
});


function goToRepositoryDetails() {
  window.location.href = "../repository/repository.html";
}

repoDetails.addEventListener("click", goToRepositoryDetails);


async function fetchGetUser() {
  try {
    const response = await api.get(`/users/${username}`);
    if (response.status === 200) {
      currentUser = response.data;
      avatarImg.src = currentUser.avatar_url;
      nameUser.innerHTML = currentUser.name;
      userName.innerHTML = currentUser.login;
      followers.innerHTML = `followers: <strong>${currentUser.followers}</strong>`;
      following.innerHTML = `following:  <strong>${currentUser.following}</strong>`;
      return currentUser;
    }
  } catch (error) {
    console.log({ error });
    alert("This user does not exist!");
  }
}

fetchGetUser()
