let currentRepo;
let contributionsList = [];
let languages = {};
const repoName = localStorage.repository;
let reporAvatarImg = document.querySelector("#reporAvatarImg");
let nameUser = document.querySelector("#name");
let copyCli = document.querySelector("#copyCli");
let copySsh = document.querySelector("#copySsh");
let copyHttps = document.querySelector("#copyHttps");
let copyCliButton = document.querySelector("#copyCliButton");
let copySshButton = document.querySelector("#copySshButton");
let copyHttpsButton = document.querySelector("#copyHttpsButton");
let repoNameText = document.querySelector("#repoName");
let repoDescription = document.querySelector("#repoDescription");
let createdAt = document.querySelector("#createdAt");
let updatedAt = document.querySelector("#updatedAt");
let whatching = document.querySelector("#whatching");
let fork = document.querySelector("#fork");
let stars = document.querySelector("#stars");
let contributors = document.querySelector("#contributors");

const api = axios.create({
  baseURL: " https://api.github.com/",
  headers: {
    "X-GitHub-Api-Version": "2022-11-28",
  },
});

const list = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="popover"]')
);
list.map((el) => {
  let opts = {
    animation: false,
  };
  if (el.hasAttribute("data-bs-content-id")) {
    opts.content = document.getElementById(
      el.getAttribute("data-bs-content-id")
    ).innerHTML;
    opts.html = true;
  }
  new bootstrap.Popover(el, opts);
});

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      alert("Copied");
    })
    .catch((err) => {
      console.error("Error copying to clipboard:", err);
      alert("Unable to copy to clipboard");
    });
}

document.addEventListener("DOMContentLoaded", function () {
  var popover = new bootstrap.Popover(
    document.getElementById("popoverButton"),
    {
      content: document.getElementById("popover-content").innerHTML,
      html: true,
    }
  );
});

copyCliButton.addEventListener("click", () => copyToClipboard(copyCli.value))
copySshButton.addEventListener("click", () => copyToClipboard(copySsh.value))
copyHttpsButton.addEventListener("click", () => copyToClipboard(copyHttps.value))

async function fetchGetRepo() {
  try {
    const response = await api.get(`repos/${repoName}`);
    if (response.status === 200) {
      currentRepo = response.data;
      reporAvatarImg.src = currentRepo.owner.avatar_url;
      copyCli.value = currentRepo.git_url;
      copySsh.value = currentRepo.ssh_url;
      copyHttps.value = currentRepo.clone_url;
      repoNameText.innerHTML = currentRepo.name;
      repoNameText.href = currentRepo.html_url;
      createdAt.innerHTML = currentRepo.created_at
        ? `Created at: ${new Date(currentRepo.created_at).toLocaleDateString()}`
        : `Created at ${new Date().toLocaleDateString()}`;
      updatedAt.innerHTML = currentRepo.updated_at
        ? `Updated at: ${new Date(currentRepo.updated_at).toLocaleDateString()}`
        : `Created at ${new Date().toLocaleDateString()}`;
      whatching.innerHTML = `${currentRepo.watchers_count} whatching`;
      fork.innerHTML = `${currentRepo.forks_count} forks`;
      stars.innerHTML = `${currentRepo.stargazers_count} stars`;
      repoDescription.innerHTML = currentRepo.description ?? "No description";
      return currentRepo;
    }
  } catch (error) {
    console.log({ error });
    // alert("This user does not exist!");
  }
}

async function fetchGetContributors() {
  try {
    const response = await api.get(`repos/${repoName}/contributors`);
    if (response.status === 200) {
      contributionsList = response.data;
      return contributionsList;
    }
  } catch (error) {
    console.log({ error });
    // alert("This user does not exist!");
  }
}

async function fetchGetLanguages() {
  try {
    const response = await api.get(`repos/${repoName}/languages`);
    if (response.status === 200) {
      languages = response.data;
      return languages;
    }
  } catch (error) {
    console.log({ error });
    // alert("This user does not exist!");
  }
}

function renderContributors(contributors) {
  const contributorsContainer = document.querySelector(".w-50");

  contributors.forEach((contributor) => {
    const contributorDiv = document.createElement("div");
    contributorDiv.classList.add("d-flex", "align-items-center", "mb-3");

    const avatarImg = document.createElement("img");
    avatarImg.src = contributor.avatar_url;
    avatarImg.alt = "avatar";
    avatarImg.classList.add("rounded-circle", "mx-2");
    avatarImg.width = 24;

    const contributorInfo = document.createElement("div");
    const githubLink = document.createElement("a");
    githubLink.href = contributor.html_url;
    githubLink.target = "_blank";
    githubLink.classList.add("pe-2", "fw-bold");
    githubLink.textContent = contributor.login;

    const contributionsSpan = document.createElement("span");
    contributionsSpan.textContent = `Contributions: ${contributor.contributions}`;

    contributorInfo.appendChild(githubLink);
    contributorInfo.appendChild(contributionsSpan);

    contributorDiv.appendChild(avatarImg);
    contributorDiv.appendChild(contributorInfo);

    contributorsContainer.appendChild(contributorDiv);
  });
}

function renderProgressBars() {
  const values = Object.values(languages);
  const keys = Object.keys(languages);
  const total = values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const progressBarDiv = document.createElement("div");
  const progressContainer = document.querySelector(".progress");
  progressBarDiv.style.width = "100%";
  progressBarDiv.style.height = "100px";
  
  for (const skill in languages) {
    if (Object.hasOwnProperty.call(languages, skill)) {
      const progressValue = languages[skill];
      const progressBar = document.createElement("div");
      progressBar.style.textAlign = "center";

      switch (skill) {
        case "TypeScript":
        case "PHP":
          progressBar.style.width = `${(progressValue / total) * 100}%`;
          progressBar.style.backgroundColor = "#17a2b8";
          progressBar.textContent = skill;
          break;
        case "CSS":
        case "SCSS":
          progressBar.style.width = `${(progressValue / total) * 100}%`;
          progressBar.style.backgroundColor = "#28a745";
          progressBar.textContent = "CSS";
          progressBar.textContent = skill;
          break;
        case "JavaScript":
          progressBar.style.width = `${(progressValue / total) * 100}%`;
          progressBar.style.backgroundColor = "#ffc107";
          progressBar.textContent = skill;
          break;
        case "HTML":
          progressBar.style.width = `${(progressValue / total) * 100}%`;
          progressBar.style.backgroundColor = "#dc3545";
          progressBar.textContent = skill;
          break;
        default:
          break;
      }

      progressContainer.appendChild(progressBar);
      progressBar.setAttribute("role", "progressbar");
      progressBar.setAttribute("aria-valuenow", progressValue);
      progressBar.setAttribute("aria-valuemin", "0");
      progressBar.setAttribute("aria-valuemax", "100");
    }
  }
}

async function main() {
  await fetchGetRepo();
  await fetchGetContributors();
  await fetchGetLanguages();
  renderProgressBars()
  renderContributors(contributionsList);
}

main();
