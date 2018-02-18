const addItems = $("#todo");
const btnDelAllChecked = $("#todo__btn_del-all-checked");
const btnShowOnlyChecked = $("#todo__btn_show-only-checked");
const btnShowOnlyUnchecked = $("#todo__btn_show-only-unchecked");
const btnShowAll = $("#todo__btn_show-all");
const btnCheckUncheckAll = $("#todo__btn_check-uncheck-all");
const todoCheckCounter = $("#todo__check-counter");
const todoUncheckCounter = $("#todo__uncheck-counter");
const itemsList = $("#todo__list");
const pagination = $("#pagination");
const btnList = $("#btn__list");
let items = [];
let store = [];
let page = [];
let counter = 0;
let start = -5;
let end = -1;
let idCounter = 0;
let index = -1;
let flag;
let startEl = 0;
let endEl = 4;


function inputFocus() {
    counter = 0;
    start = -5;
    end = -1;
    index = -1;
    page = [];

    store = _.filter(items, el => {
        return el;
    });

    for (;counter <= store.length;) {
        counter += 5;
        startEl = start += 5;
        endEl = end += 5;
        index += 1;
        addList(start, end, counter, page);
    }
}


function addItem(e) {
    e.preventDefault();

    inputFocus();
    let text = $("input[name=item]").val().trim();
    text = $($.parseHTML(`${text}`)).text().trim();
    const item = {
        index: idCounter++,
        text,
        done: false
    };

    if(text){
        items.push(item);
        store = items;

        filterRange(start, end, store);
        renderLink(pagination, page);
        checkCounter();
        addItems[0].reset();

        $("button[name=list]").removeClass("active");
        btnShowAll.addClass("active");
        $("button[name=change]").removeClass("active");
        $("button[name=change]").last().addClass("active");
        itemsList.unbind("change", showOnlyChecked);
        itemsList.unbind("change", showOnlyUnchecked);
    }
}


function checkCounter() {
    const fl = [];
    const tr = [];

    _.each(items, el => {
        if (el.done) {
            tr.push(el);
        } else {
            fl.push(el);
        }
    });

    todoCheckCounter.html(tr.length);
    todoUncheckCounter.html(fl.length);
    itemsList.unbind("change", showOnlyChecked);
    itemsList.unbind("change", showOnlyUnchecked);
}


function elementDel() {
    if (!event.target.matches("button")) {
        return;
    }

    let counter = 0;
    let start = -5;
    let end = -1;
    let i = -1;
    page = [];

    const elem = +event.target.dataset.btn_index;
    items.forEach((item, i) => {
        if (elem === item.index){
            items.splice(i, 1);
        }
    });

    if (btnShowOnlyChecked.hasClass("active")){
        store = _.filter(items, el => {
            if(el.done) {
                return el;
            }
        });
    }

    if (btnShowOnlyUnchecked.hasClass("active")) {
        store = _.filter(items, el => {
            if(!el.done) {
                return el;
            }
        });
    }

    if (btnShowAll.hasClass("active")){
        store = _.filter(items, el => {
            return el;
        });
    }

    for (;counter < store.length;) {
        counter += 5;
        start += 5;
        end += 5;
        i += 1;
        addList(start, end, counter, page);
    }

    if (i < index) {
        startEl = start;
        endEl = end;
        index = page.length - 1 <= 0 ? 0 : page.length - 1;
    }

    filterRange(startEl, endEl, store);
    renderLink(pagination, page);
    checkCounter();

    if (store.length !== 0) {
        $("button[name=change]").removeClass("active");
        $("button[name=change]")[index].classList.add("active");
    }
}


function toggleDone() {
    if (!event.target.matches("input[type=checkbox]")) {
        return;
    }

    let counter = 0;
    let start = -5;
    let end = -1;
    let i = -1;
    page = [];

    const elem = +event.target.nextElementSibling.dataset.index;
    items.forEach(item => {
        if (elem === item.index) {
            item.done = !item.done;
        }
    });

    if (btnShowOnlyChecked.hasClass("active")){
        store = _.filter(items, el => {
            if(el.done) {
                return el;
            }
        });
    }

    if (btnShowOnlyUnchecked.hasClass("active")) {
        store = _.filter(items, el => {
            if(!el.done) {
                return el;
            }
        });
    }

    for (;counter < store.length;) {
        counter += 5;
        start += 5;
        end += 5;
        i += 1;
        addList(start, end, counter, page);
    }

    if (i < index) {
        startEl = start;
        endEl = end;
        index = page.length - 1 <= 0 ? 0 : page.length - 1;
        console.log("1");
    }

    filterRange(startEl, endEl, store);
    renderLink(pagination, page);
    checkCounter();

    itemsList.unbind("change", showOnlyUnchecked);
    itemsList.unbind("change", showOnlyChecked);

    if (store.length !== 0) {
        $("button[name=change]").removeClass("active");
        $("button[name=change]")[index].classList.add("active");
    }
}


function filterRange(start, end, arr = []) {
    const result = [];

    arr.forEach((item, i) => {
        if (i >= start && i <= end) {
            result.push(item);
        }
    });

    if (result.length === 0) {
        addElem(itemsList, result);
        return -1;
    }

    addElem(itemsList, result);
}


function addList(a, b, c, arr = []) {
    arr.push({ start: a, end : b, counter: c});
}


function renderLink(elementList, elements = []) {
    elementList.html(elements.map((item, i) => {
        return `<button type="button" name="change" class="btn btn-outline-dark btn-sm m-1" data-counter="${item.counter}" data-start="${item.start}" data-end="${item.end}" data-index="${i}">${i + 1}</button>`;
    }).join(""));
}


function changePage() {
    counter = +event.target.dataset.counter;
    startEl = +event.target.dataset.start;
    endEl = +event.target.dataset.end;
    index = +event.target.dataset.index;

    if (!event.target.matches("button")) {
        return;
    }

    $("button[name=change]").removeClass("active");
    event.target.classList.add("active");

    filterRange(startEl, endEl, store);
}


function addElem(elemList, arr = []) {
    elemList.html(arr.map((item) => {
        return `
        <li class="d-flex flex-row align-items-center justify-content-between col-sm-10 list-group-item">
            <div class="d-flex align-items-center col-11">
                <input type="checkbox" data-index="${item.index}" id="item-${item.index}" ${item.done ? "checked" : ""}>
                <lable data-index="${item.index}" class="ml-2" for="item-${item.index}">${item.text}</lable>
            </div>
            <button type="button" data-btn_index="${item.index}" class="btn btn-outline-dark btn-sm">X</button>
        </li>
    `;
    }).join(""));
}


function changeText() {
    if (!event.target.matches("lable")) {
        return;
    }

    let counter = 0;
    let start = -5;
    let end = -1;
    let i = -1;
    page = [];

    for (;counter < store.length;) {
        counter += 5;
        start += 5;
        end += 5;
        i += 1;
        addList(start, end, counter, page);
    }

    const ev = event.target;

    _.each(items, el => {
        if (+ev.dataset.index === el.index) {
            // ev.classList.add("edit-ev");

            let textArea = document.createElement("input");
            textArea.className = "p-0 col-12 edit-inp";

            textArea.value = el.text;
            ev.innerHTML = "";
            ev.appendChild(textArea);
            textArea.focus();

            itemsList.keydown(function (ev) {
                let text = $($.parseHTML(`${textArea.value}`)).text().trim();
                if (event.keyCode === 13) {
                    if (text) {
                        el.text = text;
                        filterRange(startEl, endEl, store);
                        ev.target.remove();
                    }else {
                        ev.innerHTML = el.text;
                        ev.target.remove();
                        filterRange(startEl, endEl, store);
                    }
                }
                if (event.keyCode === 27) {

                    ev.innerHTML = el.text;
                    ev.target.remove();
                    filterRange(startEl, endEl, store);
                }
            });
        }
    });

    renderLink(pagination, page);
    checkCounter();

    if (store.length !== 0) {
        $("button[name=change]").removeClass("active");
        $("button[name=change]")[index].classList.add("active");
    }

    console.log(i);
    console.log(index);
}



function showOnlyUnchecked() {
    let counter = 0;
    let start = -5;
    let end = -1;
    let i = -1;
    let index = 0;
    startEl = 0;
    endEl = 4;
    page = [];

    store = _.filter(items, el => {
        if(!el.done) {
            return el;
        }
    });

    for (;counter < store.length;) {
        i += 1;
        counter += 5;
        start += 5;
        end += 5;
        addList(start, end, counter, page);
    }

    filterRange(startEl, endEl, store);
    renderLink(pagination, page);
    itemsList.unbind("change", showOnlyChecked);
    itemsList.change(showOnlyUnchecked);

    if (store.length !== 0) {
        $("button[name=change]").removeClass("active");
        $("button[name=change]")[index].classList.add("active");
    }

    console.log(i);
    console.log(index);
}


function showOnlyChecked() {
    let counter = 0;
    let start = -5;
    let end = -1;
    let i = -1;
    let index = 0;
    startEl = 0;
    endEl = 4;
    page = [];

    store = _.filter(items, el => {
        if(el.done) {
            return el;
        }
    });

    for (;counter < store.length;) {
        i += 1;
        counter += 5;
        start += 5;
        end += 5;
        addList(start, end, counter, page);
    }

    filterRange(startEl, endEl, store);
    renderLink(pagination, page);
    itemsList.unbind("change", showOnlyUnchecked);
    itemsList.change(showOnlyChecked);

    if (store.length !== 0) {
        $("button[name=change]").removeClass("active");
        $("button[name=change]")[index].classList.add("active");
    }
    console.log(i);
    console.log(index);
}


function btnActive() {
    if (!event.target.matches("button")) {
        return;
    }

    $("button[type=submit]").removeClass("active");
    $("button[name=list]").removeClass("active");
    event.target.classList.add("active");
}


function showAll() {
    counter = 0;
    start = -5;
    end = -1;
    page = [];
    index = 0;
    startEl = 0;
    endEl = 4;

    store = _.filter(items, el => {
        return el;
    });

    for (;counter < store.length;) {
        counter += 5;
        start += 5;
        end += 5;
        addList(start, end, counter, page);
    }

    filterRange(startEl, endEl, store);
    renderLink(pagination, page);
    checkCounter();

    $("button[name=change]").removeClass("active");
    $("button[name=change]").first().addClass("active");
    itemsList.unbind("change", showOnlyUnchecked);
    itemsList.unbind("change", showOnlyChecked);
}


function checkUncheckAll() {
    const fl = [];
    const tr = [];

    _.each(items, el => {
        if (!el.done) {
            fl.push(el);
        }else {
            tr.push(el);
        }
    });

    flag = tr.length < fl.length;

    const store = [];
    _.each(items, function (el) {
        el.done = flag;
        return store.push(el);
    });

    items = store;

    showAll();

    $("button[name=list]").removeClass("active");
    btnShowAll.addClass("active");
    itemsList.unbind("change", showOnlyUnchecked);
    itemsList.unbind("change", showOnlyChecked);
}


function delAllChecked() {
    store = _.filter(items, el => {
        if(!el.done) {
            return el;
        }
    });

    items = store;

    showAll();

    $("button[name=list]").removeClass("active");
    btnShowAll.addClass("active");
    $("button[name=change]").removeClass("active");
    $("button[name=change]").first().addClass("active");

    itemsList.unbind("change", showOnlyUnchecked);
    itemsList.unbind("change", showOnlyChecked);
}

$(document).ready(function() {
    addItems.submit(addItem);
    itemsList.click(toggleDone);
    itemsList.click(elementDel);
    itemsList.dblclick(changeText);
    pagination.click(changePage);
    btnDelAllChecked.click(delAllChecked);
    btnShowOnlyChecked.click(showOnlyChecked);
    btnShowOnlyUnchecked.click(showOnlyUnchecked);
    btnShowAll.click(showAll);
    btnCheckUncheckAll.click(checkUncheckAll);
    btnList.click(btnActive);

    addItems.change(function(){
        console.table(page);
        console.table(items);
        console.table(store);
        console.log(`counter ${counter}`);
        console.log(`start ${start}`);
        console.log(`end ${end}`);
        console.log(`flag ${flag}`);
        console.log(`index ${index}`);
        console.log(`startEl ${startEl}`);
        console.log(`endEl ${endEl}`);
    });
});