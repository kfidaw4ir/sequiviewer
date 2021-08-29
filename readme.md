# sequiviewer

a **seq**uential **i**mage **viewer** for kaios.

it is mostly designed for manga and comics, but you can use it for other images in sequential order as well (but not animations).

this repository along with many others on my profile was created so that people can try out my applications before it is stable.

## download stable version
website: https://alego.web.fc2.com/kaiosapps/sequiviewer/  
bh store: https://store.bananahackers.net/#sequiviewer

## library structure
for detailed instructions click the following link: https://alego.web.fc2.com/kaiosapps/sequiviewer/setup/

but basically the format should be like this:

    .sequiviewer/book_title/chapter_number/page_number.jpg

`book_title` is the book title. if you don't include a `metadata.json` file it will use this name. (see the detailed instructions)

`chapter_number` should just be a number. it can include decimals. it will show up as `Ch. #` in the application.

`page_number` should be a whole number.

alternatively, you can also use `cbz` files.

    .sequiviewer/book_title/chapter_number.cbz

## attribution
[JSZip](http://stuartk.com/jszip) v3.5.0 by Stuart Knightley, licenced under MIT Licence.  
[青](https://www.pixiv.net/en/artworks/58306343) (/img/zo.gif) by K.Hati, use allowed with credit for non-commercial purposes.