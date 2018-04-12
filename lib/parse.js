'use strict';

module.exports = function(onepifdata) {

    var items = onepifdata.split(/\n\*\*\*.*?\*\*\*\n/);

    var creds = [];
    var count_password = 0;
    var count_credential = 0;
    var count_wifi = 0;

    items.forEach(function(item) {
        if (item) {
            var i = JSON.parse(item);
            var f = {
                locationKey: i.locationKey, // basically our "title"
                location: i.location, // URL
                username: '',
                password: '',
                type: i.typeName,
                shortType: i.typeName.split(".")[i.typeName.split(".").length - 1],
                title: i.title,
                secureContents: i.secureContents
            };

            if (i.typeName === 'webforms.WebForm') {
                i.secureContents.fields.forEach(function(field) {

                    if (field.designation === 'username') {
                        f.username = field.value;
                    }
                    if (field.designation === 'password') {
                        f.password = field.value;
                    }

                });
                if (f.locationKey === undefined && f.location === undefined && f.username === undefined) {
                  return;
                } else if (f.locationKey === undefined && f.location === undefined && f.username !== undefined && f.title !== undefined) {
                  f.locationKey = f.title;
                }
                creds.push(f);
                count_credential++;
                console.log('INFO: Credential for  ' + i.locationKey + ' ( ' + i.location  + ') collected.');
                //console.log(f);
            } else if (i.typeName === 'wallet.computer.Router') {
              f.locationKey = i.secureContents.network_name;
              f.password = i.secureContents.wireless_password;
              creds.push(f);
              count_wifi++;
              console.log('INFO: Credential for  wifi ' + f.locationKey + ' ( ' + f.password  + ') collected.');
            } else if (i.typeName === 'passwords.Password') {
                f.password = i.secureContents.password;
                creds.push(f);
                count_password++;
                console.log('INFO: Password for ' + i.locationKey + ' ( ' + i.location  + ') collected.');
                //console.log(f);
            }
            else {
                if (!i.locationKey && !!i.title) {
                  f.locationKey = i.title;
                }
                creds.push(f);
                console.log('WARN: Unknown type "' + i.typeName + '" item skipped.');
            }

        } // if item
    }); //foreach item

    console.log('INFO: ' + items.length + ' items parsed\n' +
        'INFO: ' + count_credential + ' credentials collected\n' +
        'INFO: ' + count_password + ' passwords collected\n' +
        'INFO: Total ' + (count_credential + count_password) + ' collected. Now continuing...');

    return creds;

};
