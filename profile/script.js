let currentUser;
let repoList;
let repoListFiltred;
const username = localStorage.username;
const avatarImg = document.querySelector("#avatarImg");
const nameUser = document.querySelector("#name");
const userName = document.querySelector("#username");
const followers = document.querySelector("#followers");
const following = document.querySelector("#following");
const email = document.querySelector("#email");
const bio = document.querySelector("#bio");
const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");
const repoListContainer = document.getElementById("repoList");
const logouButton = document.getElementById("logout");
const sortButtons = document.querySelectorAll(".filterLanguage");
let currentWidth = window.innerWidth;
let sortDirection = 'desc'; 

const api = axios.create({
  baseURL: " https://api.github.com/",
  headers: {
    "X-GitHub-Api-Version": "2022-11-28",
  },
});

function adjustFilterButtonsMargin() {
  const currentWidth = window.innerWidth;

  if (currentWidth < 991) {
      document.getElementById('filterButtons').classList.add('mt-2');
  } else {
      document.getElementById('filterButtons').classList.remove('mt-2');
  }
}

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

function sortByStarred(array, direction) {
  return array.sort((a, b) => {
    const stargazersA = a.stargazers_count;
    const stargazersB = b.stargazers_count;

    if (direction === 'asc') {
      return stargazersA - stargazersB;
    } else {
      return stargazersB - stargazersA;
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

    const starIcon = document.createElement("ion-icon");
    starIcon.setAttribute("name", "star-outline");
    const starContainer = document.createElement("div");
    starContainer.classList.add("d-flex", 'jutify-content-start', 'gap-1', 'mt-1');
    const stargazersSpan = document.createElement("small");
    stargazersSpan.classList.add("text-muted");
    stargazersSpan.textContent = `${repo.stargazers_count} Stars`;

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
    starContainer.appendChild(starIcon);
    starContainer.appendChild(stargazersSpan);
    repoDetailsContainer.appendChild(starContainer); 
    repoDetailsContainer.appendChild(updatedSpan);

    repoInfoContainer.appendChild(repoNameLink);
    repoInfoContainer.appendChild(repoDetailsContainer);

    repoItem.appendChild(repoInfoContainer);
    repoItem.appendChild(repoDetailsButton);

    repoListContainer.appendChild(repoItem);
  });
}

function startEventListeners() {
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
    repoListFiltred = sortByStarred(repoListFiltred, sortDirection);
    renderRepoList(repoListFiltred);
  
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  });

  logout.addEventListener('click', function () {
    localStorage.clear();
    window.location.href = "../index.html";
  });
  
  searchInput.addEventListener("input", function () {
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

}

window.addEventListener('resize', adjustFilterButtonsMargin);
async function renderPage() {
  await fetchGetUser();
  await fetchGetRepo();
  startEventListeners()
  const repoListSorted = sortByStarred(repoListFiltred, sortDirection)
  renderRepoList(repoListSorted);
}

renderPage();
