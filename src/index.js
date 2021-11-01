
var input = document.getElementById("input");
var output = document.getElementById("output");
var event = document.getElementById("event");

var saveText = [];
var saveMacro = [];
var showState = false;
var wordRegex = /./g;
var wordCaracter = "X ";
var chrono;

String.prototype.remove = function () {
    /**
     * Delete text from string.
     * @param {string} arguments      Removed text
     */
    res = this;
    Object.values(arguments).forEach((c) => {
        res = res.replace(c, "")
    });
    return res
};

var macro = {
    file: async () => {
        /**
         * Add a text file.
         * @return {string}
        */
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

    show: () => {
        /**
         * Show every word.
        */
        if (!showState) {
            output.querySelectorAll("word").forEach((el) => {
                if (el.innerHTML != el.dataset.word) {
                    saveText[el.dataset.index] = `${saveText[el.dataset.index][0]}👀${saveText[el.dataset.index].slice(1)}`;
                    el.innerHTML = el.dataset.word;
                }
            });
            showState = true;
        } else {
            output.querySelectorAll("word").forEach((el) => {
                if (el.innerHTML == el.dataset.word) {
                    saveText[el.dataset.index] = saveText[el.dataset.index].replace("👀", "");
                    el.innerHTML = el.dataset.hideWord;
                }
            });
            showState = false;
        }
    },

    video: (path) => {
        /**
         * Show a video from youtube.
         * @param {string} path      Path to the video 
        */
        event.innerHTML = `<video controls src="${path}"></video>`;
    },

    videoYt: (url) => {
        /**
         * Show a video from youtube.
         * @param {string} url      Youtube link of video 
        */
        url = url.match(/^.*(youtube\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)[2];
        if (url) {
            event.innerHTML = `
                        <iframe
                            src="https://www.youtube.com/embed/${url}" 
                            title="YouTube video player" frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; 
                            encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>`;
        } else {
            event.innerHTM = "<p>Error: Bad url</p>"
        }
    },

    transfrom: (regex, caracter) => {
        /**
         * Change the regex who's in charge of the caracter replacement'.
         * @param {string} regex    The regex that transform the word (see: https://regex101.com/)
         * @param {string} caracter Replace every letter from word
        */
        wordRegex = new RegExp(rgx, "g");
        wordCaracter = caracter;
    },

    reset: () => {
        /**
         * Reset page.
        */
        clearTimeout(chrono);
        event.macro = "";
        event.innerHTML = "<p>Guess word v0.4</p>";
        event.style.color = "var(--c-back)";
        wordRegex = /[^\d.-]/g;
        wordCaracter = "X ";
    },

    chrono: (min = 1, sec = 0) => {
        /**
         * Start a chronometer.
         * @param {number} min Minutes (default: 1)
         * @param {number} sec Secondes (default: 0)
        */
        delay = parseFloat(min) * 60 + parseFloat(sec);
        count = delay;
        clearTimeout(chrono);
        chrono = setInterval(() => {
            event.style.display = "block";
            event.innerHTML = `<p>${`${Math.floor(count / 60)}:`.padStart(3, "0")}${`${count % 60}`.padStart(2, "0")}</p>`;
            if (count == 0) {
                event.innerHTML = "<p>Time's up !</p>";
                setTimeout(() => {
                    event.innerHTML = "<p>Guess word v0.4</p>";
                    event.style.color = "var(-c-back)";
                }, 3000);
                clearTimeout(chrono);
            } else if (count <= 5) {
                event.style.color = "var(--c-red)";
            }
            count--;
        }, 1000);
    },

    helloThere: (text = "Hello there!", desc = "General Kenobi") => {
        /**
         * Just a simple exemple.
         * @param {string} text     Text 
         * @param {string} desc     Description of text 
         * @return {string}
        */
        console.log(`%s%c - ${desc} %s%c`, `${text}`, "font-style: italic");
        return `${text}\n"${desc.italics()}"`
    }
};

function help() {
    /**
     * Show a short help about the typographie.
    */
    output.innerHTML =
        `<word style="text-align:left">
                        <strong><#name> (<#version>)</strong><br>
                        <br>
                        • Write multiple words in one cell with "Hello world!"<br>
                        • Call functions with '$function' or '$function(arg0,arg1)'<br>
                        • Write commentary with '<i># your comment</i> '<br>
                        • Use <kbd>Ctrl</kbd> + <kbd>Maj</kbd> + <kbd>i</kbd> to search and understand the code<br>
                        <br>
                        • Availables functions :<br>
                        &emsp;• $${Object.keys(macro).sort().join(",<br>&emsp;• $")}
                        <br>
                        <br>
                        <i>Credits to Lucas Maillet, idea from his father</i>
                    </word>`;
}

function save() {
    fileSaver = document.createElement("a");
    fileSaver.download = `${new Date().toLocaleDateString('fr-FR', { hour12: false }).replace(/(\/)/g, "-")}.gw`;
    fileSaver.href = `data:text/plain;charset=utf-8, ${encodeURIComponent(saveMacro.join(" ") + saveText.join(" "))}`;
    fileSaver.click();
}

function wordClick(el) {
    if (el.innerHTML != el.dataset.word) {
        saveText[el.dataset.index] = `${saveText[el.dataset.index][0]}👀${saveText[el.dataset.index].slice(1)}`;
        el.innerHTML = el.dataset.word;
    } else {
        saveText[el.dataset.index] = saveText[el.dataset.index].replace("👀", "");
        el.innerHTML = el.dataset.hideWord;
    }
}

async function gen(text) {
    /**
     * Generate each word.
     * @param {string} text      Text
     */
    saveText = [];
    index = 0;
    text.split(/\n/g).forEach((line) => {
        words = line.match(/([^\s"]+|"[^"]*")/g);
        if (words) {
            words.forEach((word) => {
                wordHtml = document.createElement("word");
                wordHtml.title = `length : ${word.length}`;
                wordHtml.dataset.index = index;
                wordHtml.dataset.word = word.remove(/\"/g, "👀");
                wordHtml.dataset.hideWord = word.remove(/\"/g).replace(wordRegex, wordCaracter);
                wordHtml.setAttribute("onclick", `wordClick(this)`);
                if (word.includes("$")) {
                    for (mrc in macro) {
                        if (text.includes(`$${mrc}`)) {
                            arg = text.split(`$${mrc}(`);
                            if (arg[1]) {
                                arg = arg[1].split(")")[0];
                                res = macro[mrc](...arg.split(","));
                                mcrStr = `${mrc}(${arg})`;
                            } else {
                                res = macro[mrc]();
                                mcrStr = mrc;
                            }
                            if (res) {
                                saveMacro.push(`$${mrc}`);
                                gen(res);
                                console.log("e")
                            }
                        }
                    }
                } else {
                    if (word.includes("👀")) {
                        wordHtml.innerHTML = wordHtml.dataset.word;
                    } else {
                        wordHtml.innerHTML = wordHtml.dataset.hideWord;
                    }
                    output.appendChild(wordHtml);
                    saveText.push(word);
                    index++;
                }
            });
            output.innerHTML += "<br>";
            saveText.push("\n");
            index++;
        }
    })
}

async function genString(text) {
    try {
        if (text.toLowerCase() != text.toUpperCase()) {
            output.innerHTML = "";
            await gen(text);
        }
    } catch (err) {
        output.innerHTML = `<word>${err}</word>`;
    }
}

input.addEventListener("keydown", async (event) => {
    /**
     * Process text from input.
     * @param {event} event     Event 
    */
    if (event.keyCode == 13 && !event.shiftKey) {
        genString(input.innerText);
        input.innerText = "";
    }
});

gen(`Hello there,\nthat sentence is an exemple,\nby the way, look at the help\n"(click help)."`);
