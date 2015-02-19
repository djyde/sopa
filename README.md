#Sopa

Sopa is a local package manager. You can imagine it was a **local version of bower**.

##Getting Start

###Install
```shell
$ npm install sopa -g
```

###Pull package
To use sopa, the first thing you need to do is setting the components dir use `set-dir`:

```shell
$ sopa set-dir ~/sopa_components
```

The dir is a place where store all your packages pull from web.

Now I pull the jQuery from cdnjs (https://cdnjs.com/), for example.

Firstly I search jQuery on cdnjs and copy the static file url. Here I found is a version of `2.1.3` js file - `//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js`

So I need to pull this file:
```shell
$ sopa pull jquery@2.1.3@js //cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js
```

`jquery` is the package name you defined and `2.1.3` is the version of the package. Note that you are required a file type ( **js** or **css* ).

###Install package
Now I need to install jQuery which I'd pulled from cdnjs at current folder.

```
$ sopa install jquery@2.1.3@js javascripts
```

The last command is the folder you wanna install the static file into.

###List
Sometimes you may wanna list what packages you had pull or what version you'd pull. Sopa has a command help you list it:

```
$ sopa ls
vue
jquery
```

If you wanna show what jQuery version you'd pulled, you can:

```
$ sopa ls jquery
1.11.2
2.1.3
```

##Why
The reason why I create Sopa is my college always limit my data whithin 9 GB per month. Everytime I `bower install` or `npm install` cost much data. So I made Sopa.

##Sopa
It named **Sopa**, in memory of my idol Aaron Swartz, who againsted SOPA.