const LAST_FETCH_TIME = "LAST_FETCH_TIME";
const NEXT_FETCH_TIME = "NEXT_FETCH_TIME";
const HREFS = "HREFS";

const STORE_HREF = "https://store.epicgames.com/en-US/";

function isStoreHref() {
    return STORE_HREF === window.location.href;
}

//
function getItemFromStorageByKey(key) {
    return JSON.parse(localStorage.getItem(key));
}
function setItemInStorageByKey(key, item) {
    localStorage.setItem(key, JSON.stringify(item));
}
//

function getHrefs() {
    return getItemFromStorageByKey(HREFS);
}
function setHrefs(hrefs) {
    setItemInStorageByKey(HREFS, hrefs);
}

function getNextHref() {
    let hrefs = getHrefs();
    let href = hrefs.pop();
    setHrefs(hrefs);
    return href;
}

function getFreeGameAchors() {
    let achors = [...window.document.querySelectorAll("a")].filter((e) => {
        return e.innerText.includes("FREE NOW");
    });
    setNextFetchTime(achors[0]?.querySelector("time").dateTime);
    return achors;
}
function getFreeGameHrefs() {
    let freeHrefs = getFreeGameAchors().map((v) => {
        return v.href;
    });
    return [...freeHrefs];
}

function runNextHref() {
    let nextHref = getNextHref();
    if (nextHref) {
        window.location = nextHref;
    } else {
        setLastFetchTime();
    }
}

/**
 *
 * time
 */
function isTimeToFetch() {
    let isLastFetchSTnow = Date.parse(getLastFetchTime()) < Date.now();
    return !getLastFetchTime() || isLastFetchSTnow ? true : false;
}

function getLastFetchTime() {
    return getItemFromStorageByKey(LAST_FETCH_TIME);
}
function getNextFetchTime() {
    return getItemFromStorageByKey(NEXT_FETCH_TIME);
}

function setNextFetchTime(time) {
    setItemInStorageByKey(NEXT_FETCH_TIME, time);
}
function setLastFetchTime() {
    setItemInStorageByKey(LAST_FETCH_TIME, getItemFromStorageByKey(NEXT_FETCH_TIME));
}
// @@@

async function main() {
    await resolveOnLoad();

    if (!isTimeToFetch()) {
        console.log("reject fetch, not time yet");
        return;
    }

    if (!isStoreHref()) {
        console.log("in game page, get the game");
        getGetButton()?.click();

        let intervalID = setInterval(() => {
            let iframes = [...window.document.querySelectorAll("iframe")].filter((e) => {
                return e.src.includes("purchase");
            });
            if (iframes.length > 0) {
                // console.log("iframes: ", iframes);
                clearInterval(intervalID);
                iframes[0].addEventListener("load", (e) => {
                    console.log("in loaded iframe");
                    console.log(iframes[0].contentWindow.document.querySelector("button.payment-btn"));
                    iframes[0].contentWindow.document.querySelector("button.payment-btn").click();
                    runNextHref();
                });
                return;
            }
        }, 100);
    } else {
        // store homepage, filling it
        setHrefs(getFreeGameHrefs());
        runNextHref();
    }
}

function getGetButton() {
    return [...window.document.querySelectorAll("button")].filter((e) => {
        return e.innerText.includes("GET");
    })[0];
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

main();
