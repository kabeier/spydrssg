#!/usr/bin/env node

import fs from "fs";
import matter from "gray-matter";
import Marked from "marked";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
var ofolder;
var onotrecursive;
var oname;
var ocolor;
var otextColor;
var onometa;
var obodyBgColor;
var ofontFamily;
var obodyTextColor;
var basePath;
var metaTags;
const yargs = require("yargs");
var basePath = process.cwd();
const options = yargs
.usage("Usage: -f <path/to/markdown>")
.option("f", {
    alias: "folder",
    describe:
    "absolute path of highest level folder containing markdown files. Base Directory should include a index.md, Defaults to current Directory",
    type: "string",
    demandOption: false,
})
.option("x", {
    alias: "notrecursive",
    describe: "Render HTML for base folder only. No recursive functionality",
    demandOption: false,
})
.usage("Usage: -name <Name of Website/Company>")
.option("n", {
    alias: "name",
    describe: "A Name to use to Title your Site",
    type: "string",
    demandOption: false,
})
.usage("Usage: -c <name of color choice for navBar>")
.option("c", {
    alias: "color",
    describe: `Choose the background color for the NavBar
    Must match the color name exactly as shown
    options: blue, grey, green, red, yellow, lightblue, white, darkgrey`,
    type: "string",
    demandOption: false,
})
.usage("Usage: -t <name of color choice for navBar Text>")
.option("t", {
    alias: "textColor",
    describe: `Choose the text color for your nav Bar
    Must match the color name exactly as shown
    dark is for dark background and light is for light background
    options: dark, light`,
    type: "string",
    demandOption: false,
})
.option("i", {
    alias: "nometa",
    describe: "For when your md does not include meta data (default to include Title and Description meta from md file)",
    demandOption: false,
})
.usage("Usage: --bc <any valid css string Hex,rgb,text)>")
.option("bc", {
    alias: "bodyBgColor",
    describe: `Choose the color for the background color for your site any valid css color is allowed`,
    type: "string",
    demandOption: false,
})
.usage("Usage: --ff <any font name or list of fonts>")
.option("ff", {
    alias: "fontFamily",
    describe: `Choose the font for your site. font name or list of seperated with commas`,
    type: "string",
    demandOption: false,
})
.usage("Usage: --cc <flags>")
.option("cc", {
    alias: "createConfig",
    describe: `Will create a config file that iwll save all your command line flags`,
    demandOption: false,
})
.usage("Usage: --cc <flags>")
.option("lc", {
    alias: "loadConfig",
    describe: `Will load site with config file in base dir`,
    demandOption: false,
})
.usage("Usage: --bt <color any valid css string Hex,rgb,text>")
.option("bt", {
    alias: "bodyTextColor",
    describe: `Choose the color for the background text for your site use any valid css color is allowed`,
    type: "string",
    demandOption: false,
}).argv;





const { readdirSync, statSync } = require("fs");
const { join } = require("path");
const dirs = (p) =>
  readdirSync(p).filter((f) => statSync(join(p, f)).isDirectory());
let allFiles = [];
let folders = [];
function ThroughDirectory(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const Absolute = join(dir, file);
    if (fs.statSync(Absolute).isDirectory())
      return [ThroughDirectory(Absolute), folders.push(Absolute)];
    else return allFiles.push(Absolute);
  });
}

const files = (p) =>
  readdirSync(p).filter((f) => !statSync(join(p, f)).isDirectory());
const mdfiles = (f) => f.filter((f) => f.endsWith(".md"));

const bootstrapCSS = `
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.css">
`;
const bootstrapScripts = `
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
`;
const getNavBGColor = () => {
  var colorClass;
  switch (ocolor) {
    case "blue":
      colorClass = "bg-primary";
      break;
    case "grey":
      colorClass = "bg-secondary";
      break;
    case "green":
      colorClass = "bg-success";
      break;
    case "red":
      colorClass = "bg-danger";
      break;
    case "yellow":
      colorClass = "bg-warning";
      break;
    case "lightblue":
      colorClass = "bg-info";
      break;
    case "white":
      colorClass = "bg-light";
      break;
    case "darkgrey":
      colorClass = "bg-dark";
      break;
    default:
      colorClass = "bg-light";
      break;
  }
  return colorClass;
};

const getNavTextColor = () => {
  var colorClass;
  switch (otextColor) {
    case "dark":
      colorClass = "navbar-dark";
      break;
    case "light":
      colorClass = "navbar-light";
      break;
    default:
      colorClass = "navbar-light";
      break;
  }
  return colorClass;
};

function titleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

const bootstrapNav = (subPath) => {
  var navBar;
  if (onotrecursive) {
    navBar = `
    <nav class="navbar navbar-expand-sm ${getNavTextColor()} ${getNavBGColor()}">
    <a class="navbar-brand" href="./index.html">${oname?oname:"SpydrSite"}</a>
    <button class="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId" aria-controls="collapsibleNavId"
    aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="collapsibleNavId">
    <ul class="navbar-nav mr-auto mt-2 mt-lg-0">`;
    mdfiles(files(basePath)).forEach((file) => {
      navBar += `
            <li class="nav-item">
                <a class="nav-link" href="${file.slice(0, -3) + ".html"}">${
        file.slice(0, -3).toLowerCase() == "index"
          ? "Home"
          : titleCase(file.slice(0, -3))
      }</a>
            </li>`;
    });
    navBar += `    </ul>
    </div>
    </nav> `;
    return navBar;
  }
  var subPathFiles = [];
  var nested;
  var dropDownTitles=new Set()
  allFiles.forEach((file) => {
    subPathFiles.push(file.replace(basePath, ""));
  });

  subPathFiles.forEach((file) => {
    if(subPath==''){
    nested=0
    }else{
    nested = subPath.slice(1).split('/').length //number of folder i need to move up to get to baseDir
    }
});
  navBar = `    <nav class="navbar navbar-expand-sm ${getNavTextColor()} ${getNavBGColor()}">
  <a class="navbar-brand" href="${nested>0 ? ('./'+'../'.repeat(nested))+"index.html" : './'+ "index.html"}">${oname?oname:"SpydrSite"}</a>
  <button class="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId" aria-controls="collapsibleNavId"
  aria-expanded="false" aria-label="Toggle navigation">
  <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="collapsibleNavId">
  <ul class="navbar-nav mr-auto mt-2 mt-lg-0">`;

  subPathFiles.forEach((file) => {
    if(file.split('/')[1].endsWith(".md")){ //root folder .md files
        navBar += `
              <li class="nav-item">
                  <a class="nav-link" href="${nested>0 ? ('./'+'../'.repeat(nested))+file.slice(1, -3) + ".html" : './'+file.slice(1, -3) + ".html"}">${
          file.slice(1, -3).toLowerCase() == "index"
            ? "Home"
            : titleCase(file.slice(1, -3))
        }</a>
              </li>`;
      }else if(!file.split('/')[1].includes('.')){//sub folders  
        dropDownTitles.add(file.split('/')[1])
      };
    });
    dropDownTitles.forEach((title)=>{
      navBar += `<li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="dropdownId" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${title}</a>
                    <div class="dropdown-menu" aria-labelledby="dropdownId">`
                        subPathFiles.forEach((sub)=>{
                            sub.slice(1,).startsWith(title) 
                            ? navBar +=`
                            <a class="dropdown-item" href="${nested>0 
                                ? ('./'+'../'.repeat(nested))+sub.replace('.md','.html').slice(1,) 
                                : './'+sub.replace('.md','.html').slice(1)}">${sub.slice(1,-3).replaceAll('/','‣').split('‣').slice(1,).join('‣')}</a>`
                            :''})
                        
                navBar+=`</div>
                </li>`      
    });
  navBar += `    </ul>
    </div>
    </nav> `;
  return navBar;
}

const folderToPages = (p) => {
  if (!fs.existsSync(join(p, "spydrsite").toString()) && p === basePath) {
    fs.mkdirSync(join(p, "spydrsite").toString());
  }
  mdfiles(files(p)).forEach((file) => {
    const meta = matter(fs.readFileSync(join(p, file).toString()));
    const html = Marked(meta.content);
    const subPath = p.replace(basePath, "");
    var file_contents = `
    <!doctype html>
    <html lang="en">
        <head>
            ${
              onometa
                ? `<title>${
                    oname ? oname : "The Best Site Ever"
                  }</title>`
                : `<title>${oname ? oname + "--" : ""} ${
                    meta.data.title? meta.data.title :''
                  }</title>
                <meta name="description" content=${meta.data.description?meta.data.description:'a Sydyr built bootstrap site'}/>`
            }`

            metaTags?
            metaTags.forEach(tag => {
                file_contents+=`<meta name="${tag.name}" content="${tag.content}"/>`
            }):''
        
            file_contents+=`
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">        
            ${bootstrapCSS}
        </head>
            ${bootstrapNav(subPath)}
            <body style="background-color: ${obodyBgColor?obodyBgColor:'white'}; color:${obodyTextColor?obodyTextColor:'black'}; font-family: ${ofontFamily?ofontFamily:'Calibri'};" >
            <div style="margin: 25px 75px 10px 75px;" class="container">
            ${html}
            ${bootstrapScripts}
        </div>
        </body>
    </html>
    `;
    if (onotrecursive) {
      fs.writeFile(
        join(p, "spydrsite", file.slice(0, -3) + ".html"),
        file_contents,
        function (err) {
          if (err) throw err;
          console.log(`${file} converted`);
        }
      );
    } else {
      if (basePath == p) {
        fs.writeFile(
          join(p, "spydrsite", file.slice(0, -3) + ".html"),
          file_contents,
          function (err) {
            if (err) throw err;
            console.log(`${file} converted`);
          }
        );
      } else {
        if (!fs.existsSync(join(basePath, "spydrsite", subPath).toString())) {
          fs.mkdirSync(join(basePath, "spydrsite", subPath).toString());
        }
        fs.writeFile(
          join(basePath, "spydrsite", subPath, file.slice(0, -3) + ".html"),
          file_contents,
          function (err) {
            if (err) throw err;
            console.log(`${file} converted`);
          }
        );
    }
}
});


};
const makeFolders = () => {
  ThroughDirectory(basePath);
  if (!fs.existsSync(join(basePath, "spydrsite").toString())) {
    fs.mkdirSync(join(basePath, "spydrsite").toString());
  }
  folders.sort(function (a, b) {
    return a.length - b.length;
  });
  var subPaths = [];
  folders.forEach((folder) => {
    subPaths.push(folder.replace(basePath, ""));
  });
  subPaths.forEach((subPath) => {
    if (!fs.existsSync(join(basePath, "spydrsite", subPath).toString())) {
      console.log("making folder:" + basePath + "/spydrsite" + subPath);
      fs.mkdirSync(join(basePath, "spydrsite", subPath).toString());
    }
  });
};
const removeOldSpydrSite=()=>{
    var rimraf = require("rimraf");
    if (fs.existsSync(join(basePath, "spydrsite").toString())) {
        rimraf.sync(join(basePath+"/spydrsite").toString());
        console.log("Old Spydr Site Removed");
    }
}
const loadConfig=()=>{
    try {
        return fs.readFileSync(join(basePath,"sydyrConfig.json"), 'utf8')
      } catch (err) {
        console.error(err)
        return (false)
      }
}

const main = () => {
    if(options.createConfig){
        ofolder =options.folder;
        basePath = options.folder ? options.folder:process.cwd();
        const file_contents={
            'ofolder' : options.folder,
            'onotrecursive':options.notrecursive,
            'oname':options.name,
            'ocolor':options.color,
            'otextColor':options.textColor,
            'onometa':options.nometa,
            'obodyBgColor':options.bodyBgColor,
            'ofontFamily':options.fontFamily,
            'obodyTextColor':options.bodyTextColor,
            'metaTags':[{
                "name": "",
                "content":""
            }]
        }
        fs.writeFile(
            join(basePath,"sydyrConfig.json"),
            JSON.stringify(file_contents),
            function (err) {
              if (err) throw err;
              console.log(`config created`);
            }
          );
    }else if(options.loadConfig){
        basePath = options.folder ? options.folder:process.cwd();
        var config=loadConfig()?JSON.parse(loadConfig()):'';
        ofolder =config.folder? config.folder :options.folder;
        onotrecursive=config.onotrecursive? config.onotrecursive :options.notrecursive;
        oname=config.oname ? config.oname :options.name;
        ocolor=config.ocolor? config.ocolor :options.color;
        otextColor=config.otextColor? config.otextColor :options.textColor;
        onometa=config.onometa? config.onometa :options.nometa;
        obodyBgColor=config.obodyBgColor? config.obodyBgColor :options.bodyBgColor;
        ofontFamily=config.ofontFamily? config.ofontFamily :options.fontFamily;
        obodyTextColor=config.obodyTextColor? config.obodyTextColor :options.bodyTextColor;
        basePath = ofolder ? ofolder:process.cwd();
        metaTags = config.metaTags ? config.metaTags : '';
        createSite() ;
    }
    else{ 
        ofolder =options.folder;
        onotrecursive=options.notrecursive;
        oname=options.name;
        ocolor=options.color;
        otextColor=options.textColor;
        onometa=options.nometa;
        obodyBgColor=options.bodyBgColor;
        ofontFamily=options.fontFamily;
        obodyTextColor=options.bodyTextColor;
        basePath = ofolder ? ofolder:process.cwd();
        createSite() 
    }
};

const createSite=()=>{
    removeOldSpydrSite()
    if (onotrecursive) {
        folderToPages(basePath);
        return false;
    } else {
        makeFolders();
        folderToPages(basePath);
        folders.forEach((folder) => {
        folderToPages(folder.toString());
        });
  }
}

main();

