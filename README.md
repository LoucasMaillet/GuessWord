# GuessWord v.6

Just a little webpage blind test game who don't require a server to work.

![alt text](https://github.com/LoucasMaillet/GuessWord/blob/main/ico.png?raw=true)

# Table of Contents

* [Usage](#usage)
* [Macros](#macros)
* [Build](#build)

# Usage

 * Wrap sentence with `¤` to have use space in cell.
 * Call macro with `$macro` or `$macro(arguments)`.
 * Use `Ctrl + Maj + i` to search and understand the code.

# Macros

The results is returned in stdin, but only the macro is saved, not the callBack.

- `$chrono(minutes, secondes)` Start a chronometer in box event.
- `$extern(url | path)` Open a pop-up to an extern ressource. 
- `$file` Get content from another file.
- `$helloThere` Just the welcome message. 
- `$reset` Reset parameters.
- `$transfrom(characters, regex=wordRegex)` Change default characters who replace thos of words. And the regex is to choose what will be replaced.
- `$video(url | path)` Show a local or youtube video.


# Build

Was build with WPC (see: https://github.com/LoucasMaillet/WPC)

