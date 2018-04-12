'use strict';

var fs = require('fs');
var execSync = require('child_process').execSync;

module.exports = function(creds) {

    creds.forEach(function(c) {
        var cmd = '';

        if ((c.type === 'webforms.WebForm')) {
            // a website!
            cmd = 'pass insert -m "' + c.locationKey + '/' + c.username + '"';
        } else if ((c.type === 'wallet.computer.Router')) {
            // "router" type (i use this just to store wifi passwords from various places)
            cmd = 'pass insert -m "00/Wifi/' + c.locationKey + '"';
        } else if (!!c.shortType) {
            // Generic? dunno.
            cmd = 'pass insert -m "00/'+ c.shortType +'/' + c.locationKey + '"';
        } else {
            // Generic? dunno.
            cmd = 'pass insert -m "00/Other/' + c.locationKey + '"';
        }
        if (!!c.location && !!c.username) {
          execSync(cmd, {input: c.password + "\nurl: " + c.location + "\nlogin: " + c.username + "\n\n=====\n\n"+ JSON.stringify(c.secureContents, null, 4)});
        } else if (!c.location && !!c.username) {
          execSync(cmd, {input: c.password + "\nlogin: " + c.username + "\n\n=====\n\n" + JSON.stringify(c.secureContents, null, 4)});
        } else if (!!c.location && !c.username) {
          execSync(cmd, {input: c.password + "\nurl: " + c.location + "\n\n=====\n\n"+ JSON.stringify(c.secureContents, null, 4)});
        } else if (!c.location && !c.username && !!c.password) {
          execSync(cmd, {input: c.password + "\n\n=====\n\n"+ JSON.stringify(c.secureContents, null, 4)});
        } else {
          execSync(cmd, {input: '' + "\n\n\n=====\n\n" + JSON.stringify(c.secureContents, null, 4)});
        }
        console.log('INFO: ' + (c.username || 'Password entry') + ' at ' + c.locationKey + ' imported.');
    });

};
