const version = "<#version>";

const stdin = document.querySelector(".btm p");
const stdout = document.querySelector(".box > div > p");
const topBox = document.querySelector(".top");
const notifs = document.querySelector(".notifs");

var saveText = [];
var showState = false;
var wordRegex = /[A-Za-z]/g;
var wordCharacter = "X ";
var chrono;
var genLoop = setTimeout(() => { }, 0);

/* Utils functions */

/**
 * Wait an <ms> time.
 * @param {Int} ms 
 * @returns {Promise}
 */
const delay = (ms) => { return new Promise(res => setTimeout(res, ms)) };

/**
 * Delete text from String.
 * @param {String} arguments Removed text.
 */
String.prototype.remove = function () {
    res = this;
    Object.values(arguments).forEach((c) => {
        res = res.replace(c, "")
    });
    return res
};

/**
 * Notif information
 * @param {string} text information to notif
*/
function notif(content) {
    let newNotif = document.createElement("p");
    newNotif.innerHTML = content;
    notifs.insertAdjacentElement("afterbegin", newNotif);
    notifs.scrollTop = newNotif.offsetTop;
    setTimeout(() => {
        newNotif.classList.add("passed");
        notifs.removeChild(newNotif);
    }, 5000);
}

/* Macros */

const macros = {
    /**
     * Add a text file.
     * @return {String}
     */
    file: async () => {
        open = document.createElement("input");
        open.type = "file";
        return await new Promise((resolve, reject) => {
            open.addEventListener("change", () => {
                file = open.files[0];
                if (/text/.test(file.type)) {
                    var reader = new FileReader();
                    reader.onload = () => {
                        resolve(reader.result);
                    };
                    reader.onerror = reject;
                    reader.readAsText(file, "UTF-8");
                } else {
                    alert("File type invalid.");
                }
            });
            open.click();
        });
    },

    /**
     * Show a local or a youtube video.
     * @param {String} path Path/Url to the video.
     */
    video: (path) => {
        url = path.match(/^.*(youtube\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
        if (url) {
            topBox.innerHTML = `
                         <iframe
                             src="https://www.youtube.com/embed/${url[2]}" 
                             title="YouTube video player" frameborder="0" 
                             allow="accelerometer; autoplay; clipboard-write; 
                             encrypted-media; gyroscope; picture-in-picture" 
                             allowfullscreen>
                         </iframe>`;
        } else {
            topBox.innerHTML = `<video controls src="${path}"></video>`;
        }
    },

    /**
     * Popup to an extern ressource.
     * @param {String} path Path/Url to ressource. 
     */
    extern: (path) => {
        window.open(path, "blank")
    },

    /**
     * Change the regex who's in charge of the caracter replacement'.
     * @param {String} character Replace every letter from word.
     * @param {String} regex The regex that transform the word (see: https://regex101.com/). Default to /./g.
     */
    transfrom: (character, regex = wordRegex) => {
        wordRegex = new RegExp(rgx, "g");
        wordCharacter = character;
    },

    /**
     * Reset page.
     */
    reset: () => {
        clearTimeout(chrono);
        topBox.innerHTML = "<p><#name></p>";
        topBox.style.color = "var(--c-back)";
        wordRegex = /[A-Za-z]/g;
        wordCharacter = "X ";
        genSave("$helloThere");
    },

    /**
     * Start a chronometer.
     * @param {number} min Minutes (default: 1).
     * @param {number} sec Secondes (default: 0).
     */
    chrono: (min = 1, sec = 0) => {
        delay = parseFloat(min) * 60 + parseFloat(sec);
        count = delay;
        clearTimeout(chrono);
        chrono = setInterval(() => {
            topBox.style.display = "block";
            topBox.innerHTML = `<p>${`${Math.floor(count / 60)}:`.padStart(3, "0")}${`${count % 60}`.padStart(2, "0")}</p>`;
            if (count == 0) {
                topBox.innerHTML = "<p>Time's up !</p>";
                setTimeout(() => {
                    topBox.innerHTML = "<p>Guess word v0.4</p>";
                    topBox.style.color = "var(-c-back)";
                }, 3000);
                clearTimeout(chrono);
            } else if (count <= 5) {
                topBox.style.color = "var(--c-main)";
            }
            count--;
        }, 1000);
    },

    /**
     * Just a simple exemple.
     * @return {String}
     */
    helloThere: () => {
        return "Hello there,\nthis sentence is an exemple,\nby the way, look at the\nhelp ¤(click help).¤"
    }
};

/* Main functions */

/**
 * Show a short help about the typographie.
 */
function help() {
    topBox.innerHTML = "<p><#name></p>";
    stdout.innerHTML =
        `<span class="help">
            <strong><#name> <#version></strong><br>
            <br>
            <strong>Usage:</strong><br>
            &emsp;Wrap sentence with <kbd>¤</kbd> to have use space in cell.<br>
            &emsp;Call macro with <kbd>$macro</kbd> or <kbd>$macro(arguments)</kbd>.<br>
            &emsp;Use <kbd>Ctrl</kbd> + <kbd>Maj</kbd> + <kbd>i</kbd> to search and understand the code.<br>
            <br>
            <strong>Macros:</strong><br>
            &emsp;<kbd>$${Object.keys(macros).sort().join("</kbd> <kbd>$")}</kbd><br>
            <br>
            <a href="https://github.com/LoucasMaillet/GuessWord">More on Github</a><br>
        </span>`;
}

/**
 * Show every word.
 */
function show() {
    if (showState) showState = false;
    else showState = true;
    stdout.querySelectorAll("span").forEach((word) => {
        if ((word.innerHTML == word.dataset.content) != showState) {
            word.click();
        }
    });
}

/**
 * Save content.
 */
function save() {
    fileSaver = document.createElement("a");
    fileSaver.download = `${new Date().toLocaleDateString('fr-FR', { hour12: false }).replace(/(\/)/g, "-")}.txt`;
    fileSaver.href = `data:text/plain;charset=utf-8, ${encodeURIComponent(saveText.join(" "))}`;
    fileSaver.click();
}

/**
 * Un/show a word.
 * @param {HTMLElement} word Word to un/show.
 */
function wordClick(cell) {
    if (cell.innerHTML != cell.dataset.content) {
        cell.innerHTML = cell.dataset.content;
    } else {
        cell.innerHTML = cell.dataset.hide;
    }
}

/**
 * Un/show a word and save his state.
 * @param {HTMLElement} word Word to un/show.
 */
function wordClickSave(cell) {
    if (cell.innerHTML != cell.dataset.content) {
        saveText[cell.dataset.id] = `${saveText[cell.dataset.id][0]}^${saveText[cell.dataset.id].slice(1)}`;
        cell.innerHTML = cell.dataset.content;
    } else {
        saveText[cell.dataset.id] = saveText[cell.dataset.id].remove("^");
        cell.innerHTML = cell.dataset.hide;
    }
}

/**
 * Generate a word HTMLElement.
 * @param {String} content Content to turn in cell.
 * @param {String} onclick Call when clicked.
 */
async function genWord(content, onclick) {
    cell = document.createElement("span");
    cell.setAttribute("onclick", onclick);
    cell.dataset.content = content.remove(/¤/g, "^");
    cell.title = `length : ${cell.dataset.content.length}`;
    cell.dataset.hide = cell.dataset.content.replace(wordRegex, wordCharacter);
    if (content.includes("^")) cell.innerHTML = cell.dataset.content;
    else cell.innerHTML = cell.dataset.hide;
    cell.classList.add("load");
    stdout.appendChild(cell);
    await delay(100);
    cell.classList.remove("load");
    return cell
}

/**
 * Generate each word.
 * @param {String} text Text to generate.
 */
async function gen(text) {
    let buffer = text.match(/([^\s¤]+|¤[^¤]*¤+|\n)/g);
    for (chunk in buffer) {
        chunk = buffer[chunk];
        if (chunk == "\n") {
            stdout.innerHTML += "<br>";
            continue
        }
        else if (chunk.includes("$")) {
            try {
                let [macro, arguments] = chunk.remove(/¤/g, "^").match(/(?<=\$).*?(?=\(|$)|(?<=\().*?(?=\))/g);
                if (macro in macros) {
                    res = await (eval(`macros.${macro}`))(...eval(`[${arguments}]`));
                    if (res) await gen(res)
                }
            } catch (err) {
                chunk = err;
            }
        } else {
            await genWord(chunk, "wordClick(this)");
        }
    }
}

/**
 * Generate each word and save it.
 * @param {String} text Text to generate.
 */
async function genSave(text) {
    stdout.innerHTML = "";
    saveText = [];
    let buffer = text.match(/([^\s¤]+|¤[^¤]*¤+|\n)/g);
    for (id = 0; id < buffer.length; id++) {
        let chunk = buffer[id];
        saveText.push(chunk);
        if (chunk == "\n") {
            stdout.innerHTML += "<br>";
            continue
        }
        else if (chunk.includes("$")) {
            try {
                let [macro, arguments] = chunk.remove(/¤/g, "^").match(/(?<=\$).*?(?=\(|$)|(?<=\().*?(?=\))/g);
                if (macro in macros) {
                    res = await (eval(`macros.${macro}`))(...eval(`[${arguments}]`));
                    if (res) await gen(res)
                }
            } catch (err) {
                notif(err);
            }
        } else {
            (await genWord(chunk, "wordClickSave(this)")).dataset.id = id;
        }
    };
}

/* Events */

/**
 * Process text from stdin.
 * @param {KeyboardEvent} key Key. 
 */
stdin.onkeydown = async (key) => {
    if (key.key == "Enter" && !key.shiftKey) {
        [input, stdin.innerText] = [stdin.innerText, ""];
        await genSave(input);
    }
};

/**
 * Process keyEvent of document.
 * @param {KeyboardEvent} key Key. 
 */
document.onkeydown = (key) => {
    /* Crtl + S */
    if (key.key == "s" && key.ctrlKey) {
        key.preventDefault();
        save();
    }
};

/* Setup */

genSave(`$helloThere`);
fetch(new Request("https://api.github.com/repos/LoucasMaillet/GuessWord/releases/latest")).then(async (res) => {
    res = await res.json();
    if (res.tag_name == version) notif("GuessWord is up to date.");
    else notif(`New release (${res.tag_name}) from <a href="https://github.com/LoucasMaillet/GuessWord/releases/download/${res.tag_name}/index.html">Github</a>.`);
})