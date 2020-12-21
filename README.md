# Spydr SSG

## Simple bootstrap site Generator

Spydr SSG is a simple site generator that will create a bootstrap website from your markdown files.

## To install from npm

npm install spydrssg

run with command: spydr

## To install from Git

1. Clone the repo
2. Open terminal in Folder
3. Type: npm install .
4. To Run type: spydr

## How to Use

Options:

--help Show help  
 --version Show version number  
 -f, --folder absolute path of highest level folder containing
markdown files. Base Directory should include a
index.md, Defaults to current Directory  
 -x, --notrecursive Render HTML for base folder only. No recursive
functionality
-n, --name A Name to use to Title your Site  
 -c, --color Choose the background color for the NavBar
Must match the color name exactly as shown
options: blue, grey, green, red, yellow, lightblue,
white, darkgrey  
 -t, --textColor Choose the text color for your nav Bar
Must match the color name exactly as shown
dark is for dark background and light is for light
background
options: dark, light  
 -i, --nometa For when your md does not include meta data (default to
include Title and Description meta from md file)
--bc, --bodyBgColor Choose the color for the background color for your site
any valid css color is allowed  
 --ff, --fontFamily Choose the font for your site. font name or list of
seperated with commas  
 --cc, --createConfig Will create a config file that iwll save all your
command line flags
--lc, --loadConfig Will load site with config file in base dir
--bt, --bodyTextColor Choose the color for the background text for your site
use any valid css color is allowed

## The Config File

Run spydr with your desired flags and value and add the --cc flag and a spydrConfig file will be created in your root directory saving your flag.

You can now run spydr --lc and have all your flag saved

You can edit the config file to add meta fields to your site.

the meta tag section will default like below:
`"metaTags":[{"name":"","content":""}]`

Your tags in HTML:

```
  <meta name="author" content="Kevin Beier">
  <meta name="keywords" content="markdown, ssg, bootstrap">
```

Your Tags in the Config file:

`"metaTags":[{"name":"author","content":"Kevin Beier"},{"name":"keywords","content":"markdown, ssg, bootstrap"}]`

## Navagation

folder/file name are link titles

If using '-x' for no recursion then every .md file will be a link on your navagation bar.

If running without '-x'

All .md files in base directory will be link on the navagation bar

Every Folder in base directory will become a dropdown menu

Every Folder within a Base Directory folder will be inside the dropdown for the Base Directory folder with the links be titled:
Subfolder‣filename

## md File Meta

Its recommended using the Title Meta tag because this adds to the page name.

Currently the only other md meta tag support is description.

You can always add more meta tags to every page via the config file.
