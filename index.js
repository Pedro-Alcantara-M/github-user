let usernameInput = document.querySelector("#username");
let currentUsername = "";




const api = axios.create({
  baseURL: " https://api.github.com/",
  headers: {
    "X-GitHub-Api-Version": "2022-11-28",
  },
});



async function fetchSearch() {
  try {
    const response = await api.get(`/users/${currentUsername}`);
    if (response.status === 200) {
      localStorage.setItem("username", currentUsername);
      usernameInput.value = ""
      window.location.href = "./profile/profile.html";
    }
  } catch (error) {
    alert("This user does not exist!");
    console.error("Error:", error);
  }
}

function startEventListeners() {
  usernameInput.addEventListener("input", function () {
    currentUsername = usernameInput.value;
  });
}

function init() {
  startEventListeners();
}

init()
