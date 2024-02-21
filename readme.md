# sequiviewer

## TODO

- [ ]  update jszip
- [ ]  fix the sorting algo
- [ ]  rewrite the reader 
- [ ]  implement library cache 
- [ ]  border cropping
- [ ]  adjust the preload amount
- [ ]  add a kill switch? 
- [ ]  adjust the zooming step *(increase it to 20%)*
- [ ]  zoom into double page spreads 
- [ ]  make some use of the remaining button (call, 0, *, #, middle)
   
    - [ ]  ~~screenshot~~
    - [ ]  exit the app/turn off the screen
    - [ ]  save the last state of the reader

---



## ATTN: this project ~~has been abandoned.~~ i'll make improvements to the app


this project was created when i was worser (worser than i am now) at programming. i dont want to maintain this code anymore so i will abandon this project.

i may or may not create a new version. uhh yea that's it.

## description

a **seq**uential **i**mage **viewer** for kaios.

it is mostly designed for manga and comics, but you can use it for other images in sequential order as well (but not animations).

this repository along with many others on my profile was created so that people can try out my applications before it is stable.

## download stable version
website: https://alego.web.fc2.com/kaiosapps/sequiviewer/  
bh store: https://store.bananahackers.net/#sequiviewer

## library structure
for detailed instructions click the following link: https://alego.web.fc2.com/kaiosapps/sequiviewer/setup/

the most basic format is this.

    .sequiviewer/book_title/chapter_number/page_number.jpg

`book_title` is the book title. if you don't include a `metadata.json` file it will use this name. (see the detailed instructions)

`chapter_number` should just be a number. it can include decimals. it will show up as `Ch. #` in the application.

`page_number` should be a whole number.

alternatively, you can also use `cbz` files.

    .sequiviewer/book_title/chapter_number.cbz

## attribution
[JSZip](http://stuartk.com/jszip) v3.5.0 by Stuart Knightley, licenced under MIT Licence.  
[青](https://www.pixiv.net/en/artworks/58306343) (/img/zo.gif) by K.Hati, use allowed with credit for non-commercial purposes.
