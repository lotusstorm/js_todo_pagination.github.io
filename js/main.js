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
let page = [];
let items = [];
let store = [];
let arr = [];
let counter = 0;
let start = -5;
let end = -1;
let flag;
let index;
let startEl = 0;
let endEl = 4;
// const regexp = /^\s*(\w|[а-яА-ЯёЁ]){1,}/;
let idCounter = 0;
let count;

function addItem(e) {
    e.preventDefault();

    if (page.length <= 0) {
        counter = 0;
        startEl = -5;
        endEl = -1;
        index = 0;
    }
    else if (page.length > 0) {
        counter = page[page.length -1].counter;
        startEl = page[page.length -1].start;
        endEl = page[page.length -1].end;
        index = page.length -1;
    }

    index = page.length - 1;
    let text = $("input[name=item]").val().trim();
    text = $($.parseHTML(`${text}`)).text().trim();
    const item = {
        index: idCounter++,
        text,
        done: false
    };


    if(text){
        items.push(item);
        index = page.length - 1;

        if (counter < items.length) {
            if (page.length <= 0) {
                counter += 5;
                startEl = start += 5;
                endEl = end += 5;
                index = 0;
            }else if (page.length > 0 && filterRange(page[page.length -1].start, page[page.length -1].end, items).length > 4) {
                counter = page[page.length -1].counter + 5;
                startEl = start = page[page.length -1].start + 5;
                endEl = end = page[page.length -1].end + 5;
                index = page.length -1;
            }
            addList(start, end, counter, page);
        }

        store = items;

        filterRange(startEl, endEl, store);
        renderLink(pagination, page);
        checkCounter();
        addItems[0].reset();

        $("button[name=list]").removeClass("active");
        btnShowAll.addClass("active");
        $("button[name=change]").removeClass("active");
        $("button[name=change]").last().addClass("active");

        itemsList.unbind("change", showOnlyChecked);
        itemsList.unbind("change", showOnlyUnchecked);

        console.log("addItem");
        console.table(page);
        console.table(items);
        console.table(store);
        console.log(`counter${counter}`);
        console.log(`start${start}`);
        console.log(`end${end}`);
        console.log(`flag${flag}`);
        console.log(`index${index}`);
        console.log(`startEl${startEl}`);
        console.log(`endEl${endEl}`);
    }
}

function toggleDone(e) {
    if (!e.target.matches("input[type=checkbox]")) {
        return;
    }

    const elem = +e.target.nextElementSibling.dataset.index;
    items.forEach(item => {
        if (elem === item.index) {
            item.done = !item.done;
        }
    });

    checkCounter();

    console.log("toggleDone");
    console.table(`page ${page}`);
    console.table(`items ${items}`);
    console.log(`counter ${counter}`);
    console.log(`start ${start}`);
    console.log(`end ${end}`);
    console.log(`flag ${flag}`);
    console.log(`index ${index}`);
    console.log(`startEl ${startEl}`);
    console.log(`endEl ${endEl}`);
}


function elementDel() {
    let start = -5;
    let end = -1;
    let counter = 0;
    let store = [];

    if (!event.target.matches("button")) {
        return;
    }

    const elem = +event.target.dataset.btn_index;
    items.forEach((item, i) => {
        if (elem === item.index){
            items.splice(i, 1);
        }
    });

    store.forEach((item, i) => {
        if (elem === item.index){
            store.splice(i, 1);
        }
    });

    paginationAll(page, items);

    filterRange(startEl, endEl, store);
    checkCounter();

    if (store.length !== 0) {
        $("button[name=change]").removeClass("active");
        $("button[name=change]")[index].classList.add("active");
    }

    // itemsList.unbind("change", showOnlyChecked);
    // itemsList.unbind("change", showOnlyUnchecked);

    console.log("elementDel");
    console.table(page);
    console.table(items);
    console.table(store);
    console.log(`counter${counter}`);
    console.log(`start${start}`);
    console.log(`end${end}`);
    console.log(`flag${flag}`);
    console.log(`index${index}`);
    console.log(`startEl${startEl}`);
    console.log(`endEl${endEl}`);
}

function paginationAll(page, items){
    if (filterRange(page[page.length - 1].start, page[page.length - 1].end, items) === -1) {
        if (page.length - 1 === index) {
            counter = page[page.length - 1].counter - 5;
            startEl = start = page[page.length - 1].start - 5;
            endEl = end = page[page.length - 1].end - 5;
            page.pop();
            index = page.length - 1 <= 0 ? 0 : page.length - 1;
        }else {
            page.pop();
        }
        renderLink(pagination, page);
    }
}



function delAllChecked() {
    count = 0;
    start = -5;
    end = -1;
    page = [];
    index = 0;
    startEl = 0;
    endEl = 4;

    store = _.filter(items, el => {
        if(!el.done) {
            return el;
        }
    });

    items = store;

    for (;count < store.length;) {
        count += 5;
        start += 5;
        end += 5;
        addList(start, end, count, page);
    }

    $("button[name=list]").removeClass("active");
    btnShowAll.addClass("active");
    filterRange(startEl, endEl, store);
    renderLink(pagination, page);

    checkCounter();

    $("button[name=change]").removeClass("active");
    $("button[name=change]").first().addClass("active");

    itemsList.unbind("change", showOnlyUnchecked);
    itemsList.unbind("change", showOnlyChecked);

    console.log("delAllChecked");
    console.table(page);
    console.table(items);
    console.table(store);
    console.log(`counter${counter}`);
    console.log(`start${start}`);
    console.log(`end${end}`);
    console.log(`flag${flag}`);
    console.log(`index${index}`);
    console.log(`startEl${startEl}`);
    console.log(`endEl${endEl}`);
}


function showOnlyChecked() {
    count = 0;
    let start = -5;
    let end = -1;
    arr = [];
    index = 0;
    startEl = 0;
    endEl = 4;

    store = _.filter(items, el => {
        if(el.done) {
            return el;
        }
    });

    for (;count < store.length;) {
        count += 5;
        start += 5;
        end += 5;
        addList(start, end, count, arr);
    }

    if (filterRange(start, end, store) === -1) {
        start -= 5;
        end -= 5;
        arr.pop();
    }

    filterRange(startEl, endEl, store);
    renderLink(pagination, arr);

    $("button[name=change]").removeClass("active");
    $("button[name=change]").first().addClass("active");
    itemsList.unbind("change", showOnlyUnchecked);
    itemsList.change(showOnlyChecked);

    console.log("showOnlyChecked");
    console.table(page);
    console.table(items);
    console.table(store);
    console.log(`counter${counter}`);
    console.log(`start${start}`);
    console.log(`end${end}`);
    console.log(`flag${flag}`);
    console.log(`index${index}`);
    console.log(`startEl${startEl}`);
    console.log(`endEl${endEl}`);
}


function showOnlyUnchecked() {
    count = 0;
    let start = -5;
    let end = -1;
    arr = [];
    index = 0;
    startEl = 0;
    endEl = 4;

    store = _.filter(items, el => {
        if(!el.done) {
            return el;
        }
    });

    for (;count < store.length;) {
        count += 5;
        start += 5;
        end += 5;
        addList(start, end, count, arr);
    }

    if (filterRange(start, end, store) === -1) {
        counter -= 5;
        start -= 5;
        end -= 5;
        arr.pop();
    }

    filterRange(startEl, endEl, store);
    renderLink(pagination, arr);

    $("button[name=change]").removeClass("active");
    $("button[name=change]").first().addClass("active");
    itemsList.unbind("change", showOnlyChecked);
    itemsList.change(showOnlyUnchecked);

    console.log("showOnlyUnchecked");
    console.table(page);
    console.table(items);
    console.table(store);
    console.log(`counter${counter}`);
    console.log(`start${start}`);
    console.log(`end${end}`);
    console.log(`flag${flag}`);
    console.log(`index${index}`);
    console.log(`startEl${startEl}`);
    console.log(`endEl${endEl}`);
}


function showAll() {
    count = 0;
    start = -5;
    end = -1;
    page = [];
    index = 0;
    startEl = 0;
    endEl = 4;

    store = _.filter(items, el => {
        return el;
    });

    for (;count < store.length;) {
        count += 5;
        start += 5;
        end += 5;
        addList(start, end, count, page);
    }

    filterRange(startEl, endEl, store);
    renderLink(pagination, page);

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
        } else {
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

    filterRange(startEl, endEl, items);
    checkCounter();


    $("button[name=list]").removeClass("active");
    btnShowAll.addClass("active");
    // itemsList.unbind("change", showOnlyUnchecked);
    // itemsList.unbind("change", showOnlyChecked);
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
}


function changePage() {
    counter = +event.target.dataset.counter;
    startEl = start = +event.target.dataset.start;
    endEl = end = +event.target.dataset.end;
    index = +event.target.dataset.index;

    if (!event.target.matches("button")) {
        return;
    }

    $("button[name=change]").removeClass("active");
    event.target.classList.add("active");

    filterRange(startEl, endEl, store);
}


function renderLink(elementList, elements = []) {
    elementList.html(elements.map((item, i) => {
        return `<button type="button" name="change" class="btn btn-outline-dark btn-sm m-1" data-counter="${item.counter}" data-start="${item.start}" data-end="${item.end}" data-index="${i}">${i + 1}</button>`;
    }).join(""));
}


function addList(a, b, c, arr = []) {
    arr.push({ start: a, end : b, counter: c});
}


function filterRange(start, end, arr = []) {
    const result = [];

    arr.forEach((item, i) => {
        if (i >= start && i <= end) {
            result.push(item);
        }
    });

    if (result.length < 1) {
        addElem(itemsList, result);
        return -1;
    }

    addElem(itemsList, result);
    return result;
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

    const ev = event.target;

    _.each(items, el => {
        if (+ev.dataset.index === el.index) {
            ev.classList.add("edit-ev");

            let textArea = document.createElement("input");
            textArea.className = "p-0 col-12 edit-inp";

            textArea.value = el.text;
            ev.innerHTML = "";
            ev.appendChild(textArea);
            textArea.focus();

            itemsList.keydown(function (ev) {
                if (event.keyCode === 13) {
                    let text = $($.parseHTML(`${textArea.value}`)).text().trim();
                    if (text) {
                        el.text = text;
                        filterRange(startEl, endEl, store);
                        ev.target.remove();
                    }else {
                        ev.innerHTML = el.text;
                        filterRange(startEl, endEl, store);
                        ev.target.remove();
                    }
                }

                if (event.keyCode === 27) {
                    ev.innerHTML = el.text;
                    filterRange(startEl, endEl, store);
                    ev.target.remove();
                }
            });
        }
    });
}


function btnActive() {
    if (!event.target.matches("button")) {
        return;
    }

    $("button[type=submit]").removeClass("active");
    $("button[name=list]").removeClass("active");
    event.target.classList.add("active");
}

function pagination () {

}

$(document).ready(function() {
    addItems.submit(addItem);
    itemsList.click(toggleDone);
    itemsList.click(elementDel);
    btnDelAllChecked.click(delAllChecked);
    btnShowOnlyChecked.click(showOnlyChecked);
    btnShowOnlyUnchecked.click(showOnlyUnchecked);
    btnShowAll.click(showAll);
    btnCheckUncheckAll.click(checkUncheckAll);
    pagination.click(changePage);
    itemsList.dblclick(changeText);
    btnList.click(btnActive);

    $("#todo__input").focus(function () {
        counter = 0;
        start = -5;
        end = -1;
        page = [];

        store = _.filter(items, el => {
            return el;
        });

        for (;counter < store.length;) {
            counter += 5;
            start += 5;
            end += 5;
            addList(start, end, counter, page);
        }

        // btnDelAllChecked.unbind("click", delAllChecked);
        console.table(page);
        console.table(items);
        console.table(store);
        console.log(`counter${counter}`);
        console.log(`start${start}`);
        console.log(`end${end}`);
        console.log(`flag${flag}`);
        console.log(`index${index}`);
        console.log(`startEl${startEl}`);
        console.log(`endEl${endEl}`);
    });

    // addItems.change(function(){
    //     console.table(`page ${page}`);
    //     console.table(`items ${items}`);
    //     console.log(`counter ${counter}`);
    //     console.log(`start ${start}`);
    //     console.log(`end ${end}`);
    //     console.log(`flag ${flag}`);
    //     console.log(`index ${index}`);
    //     console.log(`startEl ${startEl}`);
    //     console.log(`endEl ${endEl}`);
    // });
});