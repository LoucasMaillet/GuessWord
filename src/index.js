
var stdin = document.getElementById("stdin");
var stdout = document.getElementById("stdout");
var topBox = document.getElementById("topBox");

var saveText = [];
var showState = false;
var wordRegex = /./g;
var wordCharacter = "X ";
var chrono;

String.prototype.remove = function () {
    /**
     * Delete text from String.
     * @param {String} arguments Removed text.
     */
    res = this;
    Object.values(arguments).forEach((c) => {
        res = res.replace(c, "")
    });
    return res
};

var macros = {
    file: async () => {
        /**
         * Add a text file.
         * @return {String}
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

    video: (path) => {
        /**
         * Show a video from youtube.
         * @param {String} path Path to the video 
        */
        topBox.innerHTML = `<video controls src="${path}"></video>`;
    },

    videoYt: (url) => {
        /**
         * Show a video from youtube.
         * @param {String} url Youtube link of video 
        */
        url = url.match(/^.*(youtube\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)[2];
        if (url) {
            topBox.innerHTML = `
                        <iframe
                            src="https://www.youtube.com/embed/${url}" 
                            title="YouTube video player" frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; 
                            encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>`;
        } else {
            topBox.innerHTM = "<p>Error: Bad url</p>"
        }
    },

    transfrom: (character, regex = wordRegex) => {
        /**
         * Change the regex who's in charge of the caracter replacement'.
         * @param {String} character Replace every letter from word
         * @param {String} regex The regex that transform the word (see: https://regex101.com/). Default to /./g
        */
        wordRegex = new RegExp(rgx, "g");
        wordCharacter = character;
    },

    reset: () => {
        /**
         * Reset page.
        */
        clearTimeout(chrono);
        topBox.macros = "";
        topBox.innerHTML = "<p><#name> <#version></p>";
        topBox.style.color = "var(--c-back)";
        wordRegex = /./g;
        wordCharacter = "X ";
        genSave("$helloThere");
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
                topBox.style.color = "var(--c-red)";
            }
            count--;
        }, 1000);
    },

    helloThere: () => {
        /**
         * Just a simple exemple.
         * @return {String}
        */
        console.log(`%s%c - General Kenobi %s%c`, "Hello there!", "font-style: italic");
        return `Hello there,\nthis sentence is an exemple,\nby the way, look at the help\n¤(click help).¤¤`
    }
};

function help() {
    /**
     * Show a short help about the typographie.
    */
    stdout.innerHTML =
        `<word style="text-align:left">
                        <strong><#name> (<#version>)</strong><br>
                        <br>
                        • Wrap sentence with "¤" to have use space in cell.<br>
                        • Call macro with "$macro" or "$macro(arguments)".<br>
                        • Use <kbd>Ctrl</kbd> + <kbd>Maj</kbd> + <kbd>i</kbd> to search and understand the code<br>.
                        <br>
                        • Available macros :<br>
                        &emsp;• $${Object.keys(macros).sort().join(",<br>&emsp;• $")}
                        <br>
                        <br>
                        <i>Credits to Lucas Maillet, idea from his father</i>
                    </word>`;
}

function show() {
    /**
     * Show every word.
    */
    if (showState) showState = false;
    else showState = true;
    stdout.querySelectorAll("word").forEach((word) => {
        if ((word.innerHTML == word.dataset.word) != showState) {
            word.click();
        }
    });
}

function save() {
    /**
     * Save content.
     */
    fileSaver = document.createElement("a");
    fileSaver.download = `${new Date().toLocaleDateString('fr-FR', { hour12: false }).replace(/(\/)/g, "-")}.txt`;
    fileSaver.href = `data:text/plain;charset=utf-8, ${encodeURIComponent(saveText.join(" "))}`;
    fileSaver.click();
}

function wordClick(word) {
    /**
     * Un/show a word.
     * @param {HTMLElement} word Word to un/show.
    */
    if (word.innerHTML != word.dataset.word) {
        word.innerHTML = word.dataset.word;
    } else {
        word.innerHTML = word.dataset.hideWord;
    }
}

function wordClickSave(word) {
    /**
     * Un/show a word and save his state.
     * @param {HTMLElement} word Word to un/show.
    */
    if (word.innerHTML != word.dataset.word) {
        saveText[word.dataset.id] = `${saveText[word.dataset.id][0]}👀${saveText[word.dataset.id].slice(1)}`;
        word.innerHTML = word.dataset.word;
    } else {
        saveText[word.dataset.id] = saveText[word.dataset.id].replace("👀", "");
        word.innerHTML = word.dataset.hideWord;
    }
}

function genWord(word) {
    wordHtml = document.createElement("word");
    wordHtml.dataset.word = word.remove(/¤/g, "👀");
    wordHtml.title = `length : ${wordHtml.dataset.word.length}`;
    wordHtml.dataset.hideWord = wordHtml.dataset.word.replace(wordRegex, wordCharacter);
    if (word.includes("👀")) wordHtml.innerHTML = wordHtml.dataset.word;
    else wordHtml.innerHTML = wordHtml.dataset.hideWord;
    return wordHtml
}

function gen(text) {
    /**
     * Generate each word.
     * @param {String} text Text to generate.
    */
    text.match(/([^\s¤]+|¤[^¤]*¤+|\n)/g).forEach((word) => {
        if (word == "\n") {
            stdout.innerHTML += "<br>";
            return
        }
        word = genWord(word);
        word.setAttribute("onclick", `wordClick(this)`);
        stdout.appendChild(word);
    });
}

async function genSave(text) {
    /**
     * Generate each word and save it.
     * @param {String} text Text to generate.
    */
    if (text.toLowerCase() != text.toUpperCase()) {
        stdout.innerHTML = "";
        saveText = [];
        let words = text.match(/([^\s¤]+|¤[^¤]*¤+|\n)/g);
        for (id = 0; id < words.length; id++) {
            let word = words[id];
            saveText.push(word);
            if (word == "\n") {
                stdout.innerHTML += "<br>";
                continue
            }
            if (word[0] == "$") {
                try {
                    let macro = word.remove(/¤/g, "👀").match(/(?<=\$).*?(?=\(|$)/g)[0];
                    if (macro in macros) {
                        res = await (eval(`macros.${macro}`))(...eval(`[${word.match(/(?<=\().*?(?=\))/g) || undefined}]`));
                        if (res) gen(res)
                    }
                } catch (err) {
                    stdout.innerHTML += `<word>${err}</word>`;
                }
            } else {
                word = genWord(word);
                word.dataset.id = id;
                word.setAttribute("onclick", `wordClickSave(this)`);
                stdout.appendChild(word);
            }
        };
    }

}

stdin.addEventListener("keydown", async (key) => {
    /**
     * Process text from stdin.
     * @param {topBox} key Key. 
    */
    if (key.key == "Enter" && !key.shiftKey) {
        genSave(stdin.innerText);
        stdin.innerText = "";
    }
});

genSave("$helloThere");
