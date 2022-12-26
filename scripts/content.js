/**
 *
 *
 * have dateflag to attach event or not
 *
 * get free hrefs
 *  from stream/text/parsed html, dig deeper || just load individual hrefs
 *
 *
 */
const LAST_FETCH_DATE = 0;

function getNextHref() {
    let hrefs = JSON.parse(localStorage.getItem("hrefs"));
    let href = hrefs.pop();

    localStorage.setItem("hrefs", JSON.stringify(hrefs));

    return href;
}

async function main() {
    await resolveOnLoad(window);

    if (LAST_FETCH_DATE < Date) {
        console.log("??");
        return;
    }
    let hrefs = getFreeGameAnchors();

    console.log(hrefs);
    {
        let dom = window.open(hrefs[0]);

        await resolveOnLoad(dom.window);

        dom.document.append(script);
        // `console.log([...window.document.querySelectorAll("button")].filter((e) => {
        //     return e.innerText.includes("GET");
        // })[0]);`;
    }
}

// let getButton = [...dom.window.document.querySelectorAll("button")].filter((e) => {
//     return e.innerText.includes("GET");
// })[0];

// let placeOrderButton = [...dom.window.document.querySelectorAll("button")].filter((e) => {
//     return e.innerText.includes("PLACE ORDER");
// })[0];

function getGetButton(myWindow) {
    [...myWindow.document.querySelectorAll("button")].filter((e) => {
        return e.innerText.includes("GET");
    })[0];
}

async function resolveOnLoad(myWindow) {
    return new Promise((resolve, reject) => {
        myWindow.addEventListener(
            "load",
            () => {
                resolve();
            },
            { once: true }
        );
    });
}

function getFreeGameAnchors() {
    let anchorsWithFree = [...window.document.querySelectorAll("a")].filter((e) => {
        return e.innerText.includes("FREE NOW");
    });
    return [...anchorsWithFree];
}

main();

// let a = [...window.document.querySelectorAll("span")].filter((e)=>{ return e.innerText.includes("FREE NOW")})

//
