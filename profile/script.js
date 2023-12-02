let currentUser;
const username = localStorage.username;
let avatarImg = document.querySelector('#avatarImg');
let nameUser = document.querySelector("#name");
let userName = document.querySelector("#username");
let followers = document.querySelector("#followers");
let following = document.querySelector("#following");
let repoDetails = document.querySelector("#repoDetails");
let email = document.querySelector("#email");
let bio = document.querySelector("#bio");

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
      followers.innerHTML = `<strong>${currentUser.followers}</strong> followers`;
      following.innerHTML = `<strong>${currentUser.following}</strong> following`;
      email.innerHTML = currentUser.email ? `Email: ${currentUser.email}` : "This profile has no email";
      bio.innerHTML =  currentUser.bio ? `Bio: ${currentUser.bio}` : "This profile has no bio" ;
      return currentUser;
    }
  } catch (error) {
    console.log({ error });
    alert("This user does not exist!");
  }
}

fetchGetUser()
