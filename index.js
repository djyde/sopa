#!/usr/bin/env node
var sopa = require('commander');
var request = require('request');
var nconf = require('nconf');
var fs = require('fs');
var mkdirp = require('mkdirp');
var fse = require('fs-extra');


// pull package from cdnjs
// Usage:
// $ sopa pull jquery@2.1.3@js

nconf.file({
  file: process.env.HOME + '/.sopa/config.json'
})

var components = nconf.get('components_dir')

// $
sopa
  .command('pull <package> <url>')
  .description('Pull package from url')
  .action(function(package,url){
    if(components == 'unset'){
      console.log('Please set your components dir first (e.g. $ sopa set-dir ~/sopa_components)')
    } else {
      var packageName = package.split('@')[0];
      var packageVersion = package.split('@')[1];
      var packageType = package.split('@')[2];
      console.log('pulling',packageName,'into',components);

      request(url.slice(0,1) == '/' ? 'https:' + url : url, function(err,res,body){
        if(!err){
          var fileDir = components + packageName + '/' + packageVersion + '/';
          var fileName = packageName + '.' + packageType;
          mkdirp(fileDir, function(err){
            if(!err){
              fs.writeFile(fileDir + fileName, body, function(err){
                if(!err){
                  console.log('Pulling success!');
                } else console.log('Pulling failed: ',err);
              })
            } else {
              console.log('mkdirp',err);
            }
          })
        } else console.log('request',err)
      })
    }
  })

sopa
  .command('set-dir <dir>')
  .description('Set components folder')
  .action(function(dir){
    nconf.set('components_dir',dir.slice(-1) == '/' ? dir : dir + '/');
    fs.exists(process.env.HOME + '/.sopa', function(exists){
      if(exists){
        nconf.save(function(err){
          if(!err){
            console.log('dir had been changed to',nconf.get('components_dir'))
          } else console.log(err)
        });
      } else {
        var config = {
            "components_dir": dir.slice(-1) == '/' ? dir : dir + '/'
        }
        mkdirp(process.env.HOME + '/.sopa', function(err){
          if(!err){
            fs.appendFile(process.env.HOME + '/.sopa/config.json','',function(err){
              if(!err){
                nconf.defaults({
                  'components_dir': dir.slice(-1) == '/' ? dir : dir + '/'
                });
                nconf.save();
                console.log('dir had been changed to',nconf.get('components_dir'))
              } else {
                console.log('append',err)
              }
            })
          }
        })

      }
    })
    
  })

sopa
  .command('install <package> <folder>')
  .description('install package to current dir')
  .action(function(package,folder){
    if(components == 'unset'){
      console.log('Please set your components dir first (e.g. $ sopa set-dir ~/sopa_components)');
    } else {
      console.log('Installing', package, 'into',folder)
      var packageName = package.split('@')[0];
      var packageVersion = package.split('@')[1];
      var packageType = package.split('@')[2];
      var fileName = packageName + '.' + packageType;
      fse.copy(components + packageName + '/' + packageVersion + '/' + fileName, process.cwd() + '/' + folder + '/' + fileName, function(err){
        if(!err){
          console.log('Install',packageName,'success')
        } else {
          console.log('Install',packageName, 'failed: ',err)
        }
      });
    }
  })

sopa
  .command('ls [package]')
  .description('List all package or list all version of the package')
  .action(function(package){
    if(package){
      fs.readdir(components + package, function(err,files){
        if(!err){
          files.forEach(function(version){
            console.log(version)
          })
        } else console.log(package,'was not exist!')
      })
    } else {
      fs.readdir(components, function(err,files){
        files.forEach(function(pkg){
          console.log(pkg)
        })
      })
    }
    
  })


sopa.parse(process.argv);
