let currentUser;
let repoList;
let repoListFiltred;
const username = localStorage.username;
let avatarImg = document.querySelector("#avatarImg");
let nameUser = document.querySelector("#name");
let userName = document.querySelector("#username");
let followers = document.querySelector("#followers");
let following = document.querySelector("#following");
let email = document.querySelector("#email");
let bio = document.querySelector("#bio");
let searchInput = document.querySelector("#searchInput");
let searchButton = document.querySelector("#searchButton");
const repoListContainer = document.getElementById("repoList");
const logouButton = document.getElementById("logout");
let sortButtons = document.querySelectorAll(".filterLanguage");

let sortDirection = 'desc'; 

const api = axios.create({
  baseURL: " https://api.github.com/",
  headers: {
    "X-GitHub-Api-Version": "2022-11-28",
  },
});

function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function searchArray(array, value) {
  if (!array) {
    return [];
  }

  return array.filter((item) => {
    for (const key in item) {
      if (
        Object.prototype.hasOwnProperty.call(item, key) &&
        String(item[key]).toLowerCase().includes(String(value).toLowerCase())
      ) {
        return true;
      }
    }
    return false;
  });
}

function filterByLanguage(array, language) {
  return array.filter(item => {
    const itemLanguage = item.language ? item.language.toLowerCase() : '';
    return itemLanguage === language.toLowerCase();
  });
}

function sortByName(array, direction) {
  return array.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (direction === 'asc') {
          return nameA.localeCompare(nameB);
      } else {
          return nameB.localeCompare(nameA);
      }
  });
}

function goToRepositoryDetails(repo) {
  localStorage.setItem("repository", repo);
  window.location.href = "../repository/repository.html";
}

async function fetchGetRepo() {
  try {
    const response = await api.get(`/users/${username}/repos`);
    if (response.status === 200) {
      repoList = response.data;
      repoListFiltred = response.data;
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
    window.location.href = "../index.html";
    alert("This user does not exist!");
  }
}

function renderRepoList(repositories) {
  repositories.forEach((repo) => {
    const repoItem = document.createElement("div");
    repoItem.classList.add(
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "py-3",
      "border-bottom",
      "border-1"
    );

    const repoInfoContainer = document.createElement("div");
    repoInfoContainer.classList.add("d-flex", "flex-column");

    const repoNameLink = document.createElement("a");
    repoNameLink.classList.add(
      "fw-bold",
      "fs-5",
      "link-primary",
      "text-decoration-none"
    );
    repoNameLink.href = repo.html_url;
    repoNameLink.target = "_blank";
    repoNameLink.textContent = repo.name;

    const repoDetailsContainer = document.createElement("div");
    repoDetailsContainer.classList.add(
      "d-flex",
      "flex-row",
      "align-items-center",
      "gap-4"
    );

    const languageSpan = document.createElement("small");
    languageSpan.classList.add("text-muted");
    languageSpan.textContent = repo.language;

    const updatedSpan = document.createElement("small");
    updatedSpan.classList.add("text-muted");
    updatedSpan.textContent = `Updated ${formatDate(repo.updated_at)}`;

    const repoDetailsButton = document.createElement("button");
    repoDetailsButton.classList.add("btn");
    repoDetailsButton.textContent = "details";
    repoDetailsButton.addEventListener("click", () =>
      goToRepositoryDetails(repo.full_name)
    );

    repoDetailsContainer.appendChild(languageSpan);
    repoDetailsContainer.appendChild(updatedSpan);

    repoInfoContainer.appendChild(repoNameLink);
    repoInfoContainer.appendChild(repoDetailsContainer);

    repoItem.appendChild(repoInfoContainer);
    repoItem.appendChild(repoDetailsButton);

    repoListContainer.appendChild(repoItem);
  });
}

logout.addEventListener('click', function () {
  localStorage.clear();
  window.location.href = "../index.html";
});

searchButton.addEventListener("click", function () {
  repoListFiltred = [];
  repoListContainer.innerHTML = "";
  const searchResult = searchArray(repoList, searchInput.value);

  if (searchResult.length > 0) {
    repoListFiltred = searchResult;
  } else {
    repoListFiltred = repoList;
  }

  return renderRepoList(repoListFiltred);
});

sortButtons.forEach(button => {
  
  button.addEventListener('click', function () {
    repoListContainer.innerHTML = "";
    searchInput.value = "";
    const selectedLanguage = button.textContent.toLowerCase();
    repoListFiltred = filterByLanguage(repoList, selectedLanguage);

    if (!repoListFiltred.length > 0) {
      repoListFiltred = repoList;
    }
    renderRepoList(repoListFiltred);
  });
});

document.getElementById('sortButton').addEventListener('click', function () {
  repoListContainer.innerHTML = "";
  repoListFiltred = sortByName(repoListFiltred, sortDirection);
  renderRepoList(repoListFiltred);

  sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
});

async function renderPage() {
  await fetchGetUser();
  await fetchGetRepo();
  renderRepoList(repoListFiltred);
}

renderPage();
