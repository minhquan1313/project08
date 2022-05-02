const output = document.querySelector("#output");

const canvas = document.querySelector("#canvasBox"),
    c = canvas.getContext("2d"),
    cWidth = 794,
    cHeight = cWidth,
    colors = ["#A8E7DE", "#00FFDC", "#329F90", "#6DF2DE", "#7DF9A0", "#6EDBAC", "#85F2E2"],
    radius = cWidth / 2,
    Deg360 = Math.PI * 2,
    maxLongText = 12,
    fontName = "sitkaJs";
canvas.width = cWidth;
canvas.height = cHeight;
let numberOfPie;
let isCanvasReady = false;

isCanvasReadyHandler(trackBoard);
// output.style.fontSize = "33px";
// output.style.fontFamily = "Arial";
// output.append("Mai Thanh Binh");
// window.addEventListener("mousemove", (e) => {
//   console.log(e.x, " ", e.y);
// });
// --------------------------------------------------------------------------------------------------------------------------------------------------

function isCanvasReadyHandler(callBack) {
    const script = document.querySelector("script"),
        scriptUrl = script.src.substring(0, script.src.lastIndexOf("/"));
    let rand, deg;

    let fakeLoad = new FontFace(fontName, `url(${scriptUrl}/font/Sitka.ttc)`);
    fakeLoad
        .load()
        .then((res) => {
            document.fonts.add(res);
            isCanvasReady = true;
            canvas.onclick = onClickCanvas;
            callBack();
        })
        .catch((err) => alert(err));
    // ------------------------------------------------------------------------------------------------------------------------------------------------
    function onClickCanvas() {
        canvas.onclick = () => {};
        let resultArrow = document.querySelector("#resultArrow");
        if (!rand) rand = 0;
        canvas.setAttribute("style", `transform: rotate(${rand}deg)`);
        setTimeout(() => {
            if (!deg) deg = 0;
            rand = parseInt((Math.random() * 1000) % 360);
            // console.log(rand);
            canvas.setAttribute("style", `transition: all ease-in-out 5s;transform: rotate(${3600 + rand}deg);`);
            resultArrow.style.animation = "resultArrow 0.07s ease-in alternate-reverse infinite";
            // animation: resultArrow 0.07s ease-in alternate-reverse infinite;
            setTimeout(() => {
                canvas.onclick = onClickCanvas;
                resultArrow.style.animation = "";
            }, 5000);
        }, 1);
    }
}
function trackBoard() {
    const desk = document.querySelector("#desk"),
        visibleList = document.querySelector(".deskContent"),
        list = visibleList.querySelector(".deskContent__items"),
        addBtn = document.querySelector("#plusBtn");
    let listItems, listP;

    updateList();
    updateAddBtn();
    draggableBoard();
    window.onresize = updateAddBtn;
    addBtn.onclick = () => {
        createNewNode();
    };
    window.addEventListener("mousedown", (e) => {
        let tar = e.target;
        // console.log(tar);
        if (tar) {
            if (tar.closest(".deskContent__delete")) deleteNode(tar.closest(".deskContent__item"));
            else if (tar.closest(".deskContent__item")) editNode(tar.closest(".deskContent__item").firstElementChild);
            else checkNodesHandler();
        }
    });
    // ------------------------------------------------------------------------------------------------------------------------------------------------
    function draggableBoard() {
        let header = document.querySelector(".deskBg__headerTop"),
            desk = document.querySelector("#desk");
        // let x = window.getComputedStyle(header).top;
        let xdesk = 0;
        let ydesk = 0;
        let x = 0,
            y = 0,
            isDown = false;

        // console.log(xdesk, ydesk);
        // plusBtn
        window.addEventListener("mousedown", (e) => {
            if (e.target.closest("#desk") && !e.target.closest(".deskContent")) isDown = true;
            x = e.x;
            y = e.y;
            // console.log(e);
        });
        window.addEventListener("mousemove", (e) => {
            if (isDown) {
                // console.log(header.offsetHeight);
                // if(desk.offsetTop)
                desk.style.left = `${xdesk + e.x - x}px`;
                desk.style.top = `${ydesk + e.y - y}px`;
                updateAddBtn(1);
            }
        });
        window.addEventListener("mouseup", () => {
            isDown = false;
            x = 0;
            y = 0;
            xdesk = parseInt(window.getComputedStyle(desk).left);
            ydesk = parseInt(window.getComputedStyle(desk).top);
        });
    }
    function updateList() {
        // console.log("updateList");

        let listP1 = list.querySelectorAll(".deskContent__itemName");
        listP = [];
        listItems = [];
        //   if (i.innerText != "") {
        for (let i of listP1)
            if (i.innerText != "") {
                listP.push(i);
                listItems.push(i.parentNode);
            }

        numberOfPie = listItems.length;
        if (isCanvasReady) canvasHandle(listP.map((res) => res.innerText));
    }
    // function insertNewNode() {}
    function createNewNode(node) {
        // console.log("createNewNode");

        let t = document.createElement("li");
        t.classList.add("deskContent__item");
        t.innerHTML = `
        <p class="deskContent__itemName" contenteditable="true"></p>
        <div class="deskContent__delete">
          <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.2715 6.71102H2.83685C2.66987 6.69683 2.5044 6.75201 2.37928 6.86352C2.25627 6.9817 2.19928 7.15276 2.22678 7.32109L3.81293 21.139C3.99895 22.6625 5.29801 23.8042 6.83273 23.7928H14.5195C16.0975 23.8153 17.4266 22.619 17.5699 21.0476L18.8815 7.26008C18.8896 7.11219 18.8341 6.96786 18.729 6.86352C18.6039 6.75201 18.4385 6.69683 18.2715 6.71102ZM16.3498 20.9865C16.2539 21.9154 15.4527 22.6098 14.5196 22.5727H6.83279C5.91649 22.6099 5.12887 21.9291 5.03306 21.017L3.50793 7.93116H17.6004L16.3498 20.9865Z" fill="#6ECEDB" />
            <path d="M20.4982 2.74563H14.2145V1.76949C14.2484 0.826682 13.5116 0.0349793 12.5687 0.00111588C12.5378 6.55735e-06 12.5068 -0.000285368 12.4759 0.000298483H8.63242C7.68915 -0.0171587 6.91041 0.733324 6.89295 1.67659C6.89237 1.70754 6.89266 1.73854 6.89377 1.76949V2.74557H0.610067C0.273126 2.74557 0 3.01869 0 3.35563C0 3.69258 0.273126 3.9657 0.610067 3.9657H20.4982C20.8352 3.9657 21.1083 3.69258 21.1083 3.35563C21.1083 3.01869 20.8351 2.74563 20.4982 2.74563ZM12.9944 1.76949V2.74557H8.11384V1.76949C8.07945 1.50214 8.26833 1.25756 8.53568 1.22318C8.56773 1.21903 8.60013 1.21815 8.63236 1.22043H12.4758C12.7447 1.2014 12.9781 1.40388 12.9971 1.6728C12.9995 1.70503 12.9985 1.73743 12.9944 1.76949Z" fill="#6ECEDB" />
          </svg>
        </div>
    `;
        // console.log("node = ", node);
        if (!node) list.appendChild(t);
        else {
            list.insertBefore(t, node);
        }
        let tPara = t.querySelector(".deskContent__itemName");
        tPara.focus();
        tPara.onkeyup = () => {
            updateAddBtn();
            updateList();
        };
        tPara.onkeydown = (e) => {
            if (e.key == "Enter") {
                e.preventDefault();
                if (tPara.innerText != "") {
                    tPara.onblur = () => {};
                    // console.log(tPara.parentNode.nextElementSibling);
                    createNewNode(tPara.parentNode.nextElementSibling);
                }
            }
        };
        tPara.onblur = checkNodesHandler;
        updateAddBtn();
        updateList();
    }
    function updateAddBtn(e) {
        let currentH = visibleList.offsetTop + desk.offsetTop + visibleList.offsetHeight,
            currentW = desk.offsetLeft + desk.offsetWidth / 2;
        if (e) addBtn.style.transition = "0s";
        else addBtn.style.transition = "";

        addBtn.style.top = currentH + "px";
        addBtn.style.left = currentW - addBtn.offsetWidth / 2 + "px";
    }
    function deleteNode(node) {
        node.style.transform = "translateX(-100%)";
        setTimeout(() => {
            node.remove();
            updateAddBtn();
            updateList();
        }, 200);
    }
    function editNode(node) {
        // console.log("editNode");
        let isAppendNew = false;
        node.setAttribute("contenteditable", "true");
        node.focus();
        node.onkeydown = (e) => {
            if (e.key == "Enter") {
                e.preventDefault();
                // console.log();
                isAppendNew = true;
                createNewNode(node.parentNode.nextElementSibling);
                // list.insertBefore()
            }
        };
        node.onkeyup = (e) => {
            if (e.key != "Enter") {
                updateAddBtn();
                updateList();
                // ...
            }
        };
        node.onblur = () => {
            if (!isAppendNew) checkNodesHandler();
        };
    }
    function checkNodesHandler() {
        // console.log("checkNodesHandler");

        for (let i of list.querySelectorAll(".deskContent__itemName")) {
            i.setAttribute("contenteditable", "true");
            if (i.innerText == "") deleteNode(i.parentNode);
        }
        updateAddBtn();
        updateList();
    }
}
function canvasHandle(arrayNames) {
    c.clearRect(0, 0, cWidth, cHeight);
    let randColor, lastrandColor, firstrandColor, fz, text;
    fz = 44;
    if (numberOfPie < 40)
        for (let i = 0; i <= numberOfPie; i += 4) {
            fz -= 2;
            if (fz < 28) fz = 28;
        }
    else {
        fz = 28;
        for (let i = 40; i <= numberOfPie; i += 10) {
            fz -= 2;
        }
    }
    if (fz < 4) fz = 4;

    c.beginPath();
    for (let j = 0; j < numberOfPie; j++) {
        c.beginPath();
        c.fillStyle = colors[j % colors.length];
        c.strokeStyle = "#000";
        curr = (Deg360 / numberOfPie) * j;
        curr1 = curr + Deg360 / numberOfPie;
        c.arc(cWidth / 2, cHeight / 2, radius, curr, curr1, false);
        c.stroke();
        c.lineTo(cWidth / 2, cHeight / 2);
        c.fill();

        c.save();
        c.fillStyle = "#3F736B";
        c.font = `${fz}px ${fontName}`;
        c.textAlign = "left";
        c.textBaseline = "middle";
        text = arrayNames[j].trim();
        let i = text.length;
        if (c.measureText(text).width > radius) {
            while (c.measureText(text).width > radius) text = text.substring(0, --i) + "...";
        }
        //Tang khoang cach tu tam den canh tron
        while (c.measureText(text).width < radius + 100) {
            text = " " + text;
        }
        c.translate(cWidth / 2, cHeight / 2);
        c.rotate((curr + curr1) / 2);
        c.fillText(text, 0, 0, radius);
        c.restore();
    }

    function getRandomColor(j) {
        randColor = colors[parseInt((Math.random() * 100) % colors.length)];
        if (randColor == lastrandColor) {
            while (lastrandColor == randColor) {
                lastrandColor = randColor;
                randColor = colors[parseInt((Math.random() * 100) % colors.length)];
            }
        }
        lastrandColor = randColor;
        if (j == 0) firstrandColor = randColor;
        if (j == numberOfPie - 1) {
            if (randColor == firstrandColor) randColor = colors[parseInt((Math.random() * 100) % colors.length)];
        }
        return randColor;
    }
}
