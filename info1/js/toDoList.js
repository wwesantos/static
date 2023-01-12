const addBtn = get("#add-btn");
const addText = get("#add-txt");
const listGroup = get("#list-group");

let items = [];
let itemsStatus = [];
let ids = [];
let lastId = 0;

const ALL = true;
const STATUS_ONLY = false;

const saveItems = all => {
  localStorage.setItem(
    "ON_BROWSER_APP_ITEMS_STATUS",
    JSON.stringify(itemsStatus)
  );
  if (all) {
    localStorage.setItem("ON_BROWSER_APP_ITEMS_IDS", JSON.stringify(ids));
    localStorage.setItem("ON_BROWSER_APP_ITEMS", JSON.stringify(items));
  }
};

addText.addEventListener("keypress", e => {
  if (e.keyCode == 13) {
    addBtn.click();
  }
});

const addListItem = (id, text, textClass, disp1, disp2) => {
  const li = document.createElement("li");
  li.id = id;
  li.className = "list-group-item";
  li.innerHTML = `
	  <span class="item-text ${textClass}">${text}</span>
		<span class="item-btn">
			<button class="btn btn-outline-secondary btn-undo" type="button" aria-label="Undo" style="${disp1}">
				<i class="fas fa-undo"></i>
			</button>
			<button class="btn btn-outline-secondary btn-trash" type="button" aria-label="Delete" style="${disp1}">
				<i class="fas fa-trash"></i>
			</button>
			<button class="btn btn-outline-secondary btn-check" type="button" aria-label="Check" style="${disp2}">
				<i class="fas fa-check"></i>
			</button>
		</span>`;
  listGroup.appendChild(li);
};

addBtn.addEventListener("click", e => {
  e.preventDefault();
  const text = addText.value.trim();
  addText.value = "";
  if (text.length == 0) {
    showError("Please add a description to your task.");
  } else {
    lastId++;
    const id = `item_${lastId}`;
    addListItem(id, text, "", "display:none", "display:inline-box");
    items.push(text);
    itemsStatus.push("todo");
    ids.push(id);
    saveItems(ALL);
  }
});

listGroup.addEventListener("click", e => {
  e.preventDefault();
  const classList = e.target.classList;
  if (classList.contains("fa-check") || classList.contains("btn-check")) {
    let id = "";
    if (classList.contains("fa-check")) {
      id = e.target.parentNode.parentNode.parentNode.id;
    } else {
      id = e.target.parentNode.parentNode.id;
    }
    get(`#${id} .item-text`).classList.add("strike");
    get(`#${id} .btn-check`).style.display = "none";
    get(`#${id} .btn-trash`).style.display = "inline-block";
    get(`#${id} .btn-undo`).style.display = "inline-block";
    const index = ids.indexOf(id);
    itemsStatus[index] = "done";
    saveItems(STATUS_ONLY);
  } else if (classList.contains("fa-undo") || classList.contains("btn-undo")) {
    let id = "";
    if (classList.contains("fa-undo")) {
      id = e.target.parentNode.parentNode.parentNode.id;
    } else {
      id = e.target.parentNode.parentNode.id;
    }
    get(`#${id} .item-text`).classList.remove("strike");
    get(`#${id} .btn-check`).style.display = "inline-block";
    get(`#${id} .btn-trash`).style.display = "none";
    get(`#${id} .btn-undo`).style.display = "none";
    const index = ids.indexOf(id);
    itemsStatus[index] = "todo";
    saveItems(STATUS_ONLY);
  } else if (
    classList.contains("fa-trash") ||
    classList.contains("btn-trash")
  ) {
    let id = "";
    if (classList.contains("fa-trash")) {
      id = e.target.parentNode.parentNode.parentNode.id;
    } else {
      id = e.target.parentNode.parentNode.id;
    }
    get(`#${id}`).remove();
    const index = ids.indexOf(id);
    itemsStatus.splice(index, 1);
    items.splice(index, 1);
    ids.splice(index, 1);
    saveItems(ALL);
  }
});

document.addEventListener("DOMContentLoaded", e => {
  if (localStorage.getItem("ON_BROWSER_APP_ITEMS_STATUS") != null) {
    items = JSON.parse(localStorage.getItem("ON_BROWSER_APP_ITEMS"));
    itemsStatus = JSON.parse(
      localStorage.getItem("ON_BROWSER_APP_ITEMS_STATUS")
    );
    ids = JSON.parse(localStorage.getItem("ON_BROWSER_APP_ITEMS_IDS"));
    if (ids.length > 0) {
      lastId = ids[ids.length - 1].split("_")[1] + 1;
    }
    for (i = 0; i < items.length; i++) {
      if (itemsStatus[i] == "todo") {
        addListItem(ids[i], items[i], "", "display:none", "display:inline-box");
      } else {
        addListItem(
          ids[i],
          items[i],
          "strike",
          "display:inline-box",
          "display:none"
        );
      }
    }
  }
});
