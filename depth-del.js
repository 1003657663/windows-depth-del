#!/usr/bin/env node


debugger;

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


var inputPath = process.cwd();
if (process.argv[2].indexOf(":") != -1) {
    inputPath = process.argv[2];
} else {
    for (var i = 2; i < process.argv.length; i++) {
        inputPath += "\\" + process.argv[i];
    }
}
var realPath = path.normalize(inputPath);
if (realPath[realPath.length - 1] == '\\') {
    realPath = realPath.substring(0, realPath.length - 1);
}


delAll(realPath, true);

function delAll(inputPath, isFirst) {
    if (inputPath.length < realPath.length && !isFirst) {
        process.exit();
        return;
    }
    console.log("正在删除：" + inputPath);
    fs.stat(inputPath, function (err, stat) {
        if (err) {
            return console.error(err);
        }
        if (stat.isFile()) {
            if (fs.existsSync(inputPath)) {
                fs.unlink(inputPath, function (err) {
                    if (err!=null && err.message.indexOf("no such file or directory")==-1) {
                        return console.error(err);
                    }
                    console.log(inputPath + "-----删除成功");
                    var parentPath = inputPath.substring(0, inputPath.lastIndexOf('\\'));
                    delAll(parentPath);
                });
            }
        } else if (stat.isDirectory()) {
            fs.readdir(inputPath, function (err, files) {
                if (err) {
                    return console.log(err);
                }
                if (files.length == 0) {
                    if (fs.existsSync(inputPath)) {
                        fs.rmdir(inputPath, function (err) {
                            if (err != null && err.message.indexOf("no such file or directory")==-1) {
                                return console.error(err);
                            }
                            console.log(inputPath + "-----删除成功");
                            //获取父目录
                            var parentPath = inputPath.substring(0, inputPath.lastIndexOf('\\'));
                            delAll(parentPath);
                        });
                    }
                } else {
                    for (var i = 0; i < files.length; i++) {
                        delAll(inputPath + '\\' + files[i])
                    }
                }
            });
        }
    });
}