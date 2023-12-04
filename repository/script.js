let currentRepo;
let contributionsList = [];
let languages = {};
const repoName = localStorage.repository;
const logouButton = document.getElementById("logout");
const backButton = document.getElementById("backButton");
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
let legends = document.querySelector("#legends");

let isMobile = window.innerWidth < 768;

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
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("Copied");
    })
    .catch((err) => {
      console.error("Error copying to clipboard:", err);
      alert("Unable to copy to clipboard");
    });
}

backButton.addEventListener("click", function () {
  window.location.href = "../profile/profile.html";
})

logout.addEventListener("click", function () {
  localStorage.clear();
  window.location.href = "../index.html";
});

document.addEventListener("DOMContentLoaded", function () {
  var popover = new bootstrap.Popover(
    document.getElementById("popoverButton"),
    {
      content: document.getElementById("popover-content").innerHTML,
      html: true,
    }
  );
});

copyCliButton.addEventListener("click", () => copyToClipboard(copyCli.value));
copySshButton.addEventListener("click", () => copyToClipboard(copySsh.value));
copyHttpsButton.addEventListener("click", () =>
  copyToClipboard(copyHttps.value)
);

async function fetchGetRepo() {
  try {
    const response = await api.get(`repos/${repoName}`);
    if (response.status === 200) {
      currentRepo = response.data;
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
  const contributorsContainer = document.querySelector(".contribuitorsContainer");

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
    githubLink.classList.add("pe-2", "fw-bold", "link-primary");
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
  const total = values.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  const progressContainer =  document.querySelector(".progress");

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
          break;
        case "CSS":
        case "SCSS":
          progressBar.style.width = `${(progressValue / total) * 100}%`;
          progressBar.style.backgroundColor = "#28a745";
          break;
        case "JavaScript":
          progressBar.style.width = `${(progressValue / total) * 100}%`;
          progressBar.style.backgroundColor = "#ffc107";
          break;
        case "HTML":
          progressBar.style.width = `${(progressValue / total) * 100}%`;
          progressBar.style.backgroundColor = "#dc3545";
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

function renderLegends() {
  const values = Object.values(languages);
  const total = values.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  const legendContainer = document.querySelector(".legend");

  for (const language in languages) {
    if (Object.hasOwnProperty.call(languages, language)) {
      const languageValue = languages[language];

      const legendItem = document.createElement("div");
      legendItem.classList.add(
        "legend-item",
        "d-flex",
        "align-items-center",
        "flex-row",
        "gap-2"
      );

      const legendCircle = document.createElement("div");
      legendCircle.classList.add("rounded");
      legendCircle.style.width = "15px";
      legendCircle.style.height = "15px";
      legendCircle.style.backgroundColor = getLegendColor(language);

      const legendLabel = document.createElement("small");
      legendLabel.textContent = language;

      const legendValue = document.createElement("small");
      legendValue.textContent =
        " (" + Math.round((languageValue / total) * 100) + "%)";

      legendItem.appendChild(legendCircle);
      legendItem.appendChild(legendLabel);
      legendItem.appendChild(legendValue);

      legendContainer.appendChild(legendItem);
    }
  }
}

function getLegendColor(language) {
  switch (language) {
    case "TypeScript":
      return "#17a2b8"; // Blue
    case "CSS":
      return "#28a745"; // Green
    case "JavaScript":
      return "#ffc107"; // Yellow
    case "HTML":
      return "#dc3545"; // Red
    default:
      return "#6c757d"; // Gray for other languages
  }
}

async function main() {
  await fetchGetRepo();
  await fetchGetContributors();
  await fetchGetLanguages();
  renderProgressBars();
  renderContributors(contributionsList);
  renderLegends();
}

main();
