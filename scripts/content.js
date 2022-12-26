const LAST_FETCH_DATE = "LAST_FETCH_DATE";
const HREFS = "HREFS";
const STORE_HREF = "https://store.epicgames.com/en-US/";

function isStoreHref() {
    return STORE_HREF === window.location.href;
}

function loadFromStorageByKey(key) {
    return JSON.parse(localStorage.getItem(key));
}
function setItemInStorageByKey(key, item) {
    localStorage.setItem(key, JSON.stringify(item));
}
// @@@
function getNextHref() {
    let hrefs = getHrefs();
    let href = hrefs.pop();

    setHrefs(hrefs);

    return href;
}
function getHrefs() {
    // return loadFromStorageByKey(HREFS);
    // console.log("in getHrefs: ", JSON.parse(localStorage.getItem(HREFS)));
    return JSON.parse(localStorage.getItem(HREFS));
}
function setHrefs(hrefs) {
    // setItemInStorageByKey(HREFS, hrefs);
    // console.log("in setHrefs: ", JSON.stringify(hrefs));
    // console.log("saving: ", hrefs);
    localStorage.setItem(HREFS, JSON.stringify(hrefs));
}
// @@@
// @@@
function isTimeToFetch() {
    return !LAST_FETCH_DATE || LAST_FETCH_DATE < Date ? true : false;
}
// function
function setFetchedTime() {}
// @@@

async function main() {
    await resolveOnLoad();

    if (!isTimeToFetch()) {
        return;
    }
    console.log("isStoreHref: ", isStoreHref());
    if (!isStoreHref()) {
        // in game page, get the game
        console.log("in game page, get the game");

        // console.log(
        //     [...window.document.querySelectorAll("button")].filter((e) => {
        //         return e.innerText.includes("GET");
        //     })[0]
        // );
        let asd = getGetButton()?.click();

        console.log(asd);
        await resolveOnLoad();
        console.log(asd);

        console.log(getPlaceOrderButton());
    } else {
        // get free game hrefs & store in localStorage, when in store home
        console.log("store homepage, filling it");
        setHrefs(getFreeGameHrefs());
    }

    // console.log(getHrefs());
    if (getHrefs().length > 0) {
        window.location = getNextHref();
        // setTimeout(() => {
        // }, 1000);
    }

    console.log("all done, now set next time");

    //all done, now set next time
}

function getGetButton() {
    return [...window.document.querySelectorAll("button")].filter((e) => {
        return e.innerText.includes("GET");
    })[0];
}

function getPlaceOrderButton() {
    return window.document.querySelectorAll("button");
}

async function resolveOnLoad() {
    return new Promise((resolve, reject) => {
        window.addEventListener(
            "load",
            () => {
                resolve();
            },
            { once: true }
        );
    });
}

function getFreeGameHrefs() {
    let freeHrefs = [...window.document.querySelectorAll("a")]
        .filter((e) => {
            return e.innerText.includes("FREE NOW");
        })
        .map((v) => {
            return v.href;
        });
    return [...freeHrefs];
}

// let getButton = [...dom.window.document.querySelectorAll("button")].filter((e) => {
//     return e.innerText.includes("GET");
// })[0];

// let placeOrderButton = [...dom.window.document.querySelectorAll("button")].filter((e) => {
//     return e.innerText.includes("PLACE ORDER");
// })[0];

main();

// let a = [...window.document.querySelectorAll("span")].filter((e)=>{ return e.innerText.includes("FREE NOW")})

//
