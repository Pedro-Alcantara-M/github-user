let usernameInput = document.querySelector("#username");
let currentUsername = "";


usernameInput.addEventListener("input", function () {
  // This function will be called whenever the input value changes
  currentUsername = usernameInput.value;
  console.log("Current Username:", currentUsername);
});

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
      window.location.href = "./profile/profile.html";
    }
  } catch (error) {
    alert("This user does not exist!");
    console.error("Error:", error);
  }
}


