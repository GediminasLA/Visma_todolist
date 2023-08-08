//Preload initial data

let initData = [
    {
        id: 1,
        task: "Buy xbox storage expansion",
        registerDate: 1691179908265,
        deadline: 1691852400000,
        isCompleted: true
    },
    {
        id: 2,
        task: "Download lots of games",
        registerDate: 1691279908265,
        deadline: 1692025200000,
        isCompleted: false
    },
    {
        id: 3,
        task: "Never play them",
        registerDate: 1691379908265,
        deadline: "",
        isCompleted: false
    }
]

sessionStorage.setItem("items", JSON.stringify(initData))

//create event listener for ADD button
let addBtn = document.querySelector("#addBtn")
addBtn.addEventListener("click", addItem);

//filter event listener
let sorting = document.getElementById("sortingOrder");

sorting.addEventListener("change", () => {
    renderList();
});

function filter(items) {
    let selection = sorting.value;

    switch (selection) {
        case "recentlyAdded":
            console.log("recently added")
            items.sort((a, b) => {
                return a.registerDate - b.registerDate;
            })
            items.sort((a) => a.isCompleted ? 1 : -1)
            break;
            case "deadline":
                console.log("deadline")
                items.sort((a, b) => {
                return b.deadline - a.deadline;
            })
            items.sort((a) => a.isCompleted ? 1 : -1)
            break;
        case "recentlyCompleted":
            console.log("recently completed")
            items.sort((a) => a.isCompleted ? -1 : 1)
            break;

    }
    // items.sort((a) => a.isCompleted ? 1 : -1)
    return(items);
}

//gets new data from sessionStorage and creates list
function renderList() {
    let items = JSON.parse(sessionStorage.getItem("items"));
    console.log(items);
    filter(items);
    console.log(items);
    let listView = document.querySelector("ul")
    listView.innerHTML = "";

    items.forEach(el => {
        let checkbox = el.isCompleted ? '<input type="checkbox" checked>' : '<input type="checkbox">'
        if (el.deadline === "") {
            listView.innerHTML += `<li id="${el.id}">${checkbox}<span>${el.task}</span><button>Delete</button></li>`
        } else {
            let timeleft = timeLeftCalculation(el.deadline);
            listView.innerHTML += `<li id="${el.id}">${checkbox}<span>${el.task} | ${timeleft}</span><button>Delete</button></li>`
        }

        //add event listener for checkboxes
        let checkboxes = document.querySelectorAll("ul > li > input[type='checkbox']");
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener("click", () => {
                let li = checkbox.parentElement;
                let id = li.id;
                let isChecked = checkbox.checked;
                updateItem(id, isChecked);
            })
        })

        //add event listener for buttons
        let deleteButtons = document.querySelectorAll("ul > li > button");
        deleteButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                let li = btn.parentElement;
                let id = li.id;
                if (confirm("Delete this item?") == true) {
                    deleteItem(id);
                } else {
                    return;
                }
            })
        })
    });
}

//Time difference calculation for remaining deadline time
function timeLeftCalculation(deadlineString) {
    let deadline = new Date(deadlineString);
    let today = new Date();
    let timeleft = deadline - today;

    let days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    let hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    return `${days} days, ${hours} hours and ${minutes} minutes left`;
}

//gets item ID from the list, removes it from sessionStorage and calls list update function
function deleteItem(id) {
    let items = JSON.parse(sessionStorage.getItem("items"));
    let index = items.findIndex((item) => item.id == id)
    items.splice(index, 1);
    sessionStorage.setItem("items", JSON.stringify(items));
    renderList();
}

function updateItem(id, isChecked) {
    let items = JSON.parse(sessionStorage.getItem("items"));
    let index = items.findIndex((item) => item.id == id);
    items[index].isCompleted = isChecked;
    sessionStorage.setItem("items", JSON.stringify(items));
    renderList();
}

//Adds item to sessionStorage and calls list update function
function addItem() {
    let task = document.querySelector("#task").value.trim();
    let deadline = document.querySelector("#deadline").value;
    if (deadline != ""){
        deadline = new Date(deadline) - 0;
    }
    let UID = new Date().getTime();

    if (task === "") {
        alert("Please enter task.")
    } else {
        if (confirm("Do you want to save it?") == true) {
            let newItem = {
                id: UID,
                task: task,
                registerDate: UID,
                deadline: deadline,
                isCompleted: false
            }

            let items = JSON.parse(sessionStorage.getItem("items"));
            items.push(newItem);
            sessionStorage.setItem("items", JSON.stringify(items));
        } else {
            return;
        }
    }

    renderList();

    //clear input fields
    document.querySelector("#task").value = "";
    document.querySelector("#deadline").value = "";
}

renderList();
