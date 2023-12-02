let currentUser;
const username = localStorage.username;
let reporAvatarImg = document.querySelector('#reporAvatarImg');
let nameUser = document.querySelector("#name");


const api = axios.create({
  baseURL: " https://api.github.com/",
  headers: {
    "X-GitHub-Api-Version": "2022-11-28",
  },
});

const list = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
list.map((el) => {
  let opts = {
    animation: false,
  }
  if (el.hasAttribute('data-bs-content-id')) {
    opts.content = document.getElementById(el.getAttribute('data-bs-content-id')).innerHTML;
    opts.html = true;
  }
  new bootstrap.Popover(el, opts);
})

function copyToClipboard() {
  const copyInput = document.getElementById("copyInput");
  copyInput.select();
  copyInput.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Copied to clipboard: " + copyInput.value);
}

document.addEventListener('DOMContentLoaded', function() {
  // Initialize popover
  var popover = new bootstrap.Popover(document.getElementById('popoverButton'), {
    content: document.getElementById('popover-content').innerHTML,
    html: true
  });
});

async function fetchGetUser() {
  try {
    // const response = await api.get(`/users/${username}`);
    if (response.status === 200) {
      currentUser = response.data;
      reporAvatarImg.src = currentUser.avatar_url;
      nameUser.innerHTML = currentUser.name;
      return currentUser;
    }
  } catch (error) {
    console.log({ error });
   // alert("This user does not exist!");
  }
}

async function main() {
  await fetchGetUser();
}

main()
