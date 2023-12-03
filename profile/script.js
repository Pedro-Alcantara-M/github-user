let currentUser;
let repoList;
const username = localStorage.username;
let avatarImg = document.querySelector("#avatarImg");
let nameUser = document.querySelector("#name");
let userName = document.querySelector("#username");
let followers = document.querySelector("#followers");
let following = document.querySelector("#following");
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

async function fetchGetRepo() {
  try {
    const response = await api.get(`/users/${username}/repos`);
    if (response.status === 200) {
      repoList = response.data;
      console.log({ repoList });
      return repoList;
    }
  } catch (error) {
    console.log({ error });
    //alert("This user does not exist!");
  }
}

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
      email.innerHTML = currentUser.email
        ? `Email: ${currentUser.email}`
        : "This profile has no email";
      bio.innerHTML = currentUser.bio
        ? `Bio: ${currentUser.bio}`
        : "This profile has no bio";
      return currentUser;
    }
  } catch (error) {
    console.log({ error });
    alert("This user does not exist!");
  }
}

function renderRepoList(repositories) {
  const repoListContainer = document.getElementById('repoList');

  repositories.forEach(repo => {
    const repoItem = document.createElement('div');
    repoItem.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'py-3', 'border-bottom', 'border-1');

    const repoInfoContainer = document.createElement('div');
    repoInfoContainer.classList.add('d-flex', 'flex-column');

    const repoNameLink = document.createElement('a');
    repoNameLink.classList.add('fw-bold', 'fs-5', 'link-primary', 'text-decoration-none');
    repoNameLink.href = repo.html_url;
    repoNameLink.target = '_blank';
    repoNameLink.textContent = repo.name;

    const repoDetailsContainer = document.createElement('div');
    repoDetailsContainer.classList.add('d-flex', 'flex-row', 'align-items-center', 'gap-4');

    const languageSpan = document.createElement('small');
    languageSpan.classList.add('text-muted');
    languageSpan.textContent = repo.language;

    const updatedSpan = document.createElement('small');
    updatedSpan.classList.add('text-muted');
    updatedSpan.textContent = `Updated ${formatDate(repo.updated_at)}`;

    const repoDetailsButton = document.createElement('button');
    repoDetailsButton.classList.add('btn');
    repoDetailsButton.textContent = 'Details';
    repoDetailsButton.addEventListener('click', () => goToRepositoryDetails());

    repoDetailsContainer.appendChild(languageSpan);
    repoDetailsContainer.appendChild(updatedSpan);

    repoInfoContainer.appendChild(repoNameLink);
    repoInfoContainer.appendChild(repoDetailsContainer);

    repoItem.appendChild(repoInfoContainer);
    repoItem.appendChild(repoDetailsButton);

    repoListContainer.appendChild(repoItem);
  });
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

async function renderPage() {
  await fetchGetUser();
  await fetchGetRepo();
  renderRepoList(repoList);
}

renderPage();
