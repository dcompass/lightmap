to make all dev things work 
yu need install nginx ,openssl (the development run in https) , node, mongod,
We use a proxy to simulate a real website with nginx so we have a hosts file and a special nginx config 


In linux:
sudo apt-get install nginx 

For mac: (i recommande)
if yu ve not home-brew
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
then
brew update
brew upgrade
brew doctor (to check if it's ok)
brew install openssl
brew install node 
brew install nginx

see http://blog.teamtreehouse.com/install-node-js-npm-mac



copy my nginx config from temp/domain-conf-nginx
cp temp/domain-conf-nginx/nginx /usr/local/etc/
cp temp/domain-conf-nginx/openssl /usr/local/etc/

add in /etc/hosts this line:
127.0.0.1	localhost dev.skiscooldev.com


go to /temp
run
make install

Manual action to apply 
unzip mapbox.js.zip to /temp/node_modules (replace the installed one by mine)
unzip match-media-mock.zip to /temp/node_modules (replace the installed one by mine)
unzip material-ui-country-flags.zip to /temp/node_modules (replace the installed one by mine)
unzip mobx-react-form.zip to /temp/node_modules (replace the installed one by mine)
unzip validatorjs.zip to /temp/node_modules (replace the installed one by mine)

then
delete in /temp/node_module 
├── react-addons-create-fragment@15.3.2 
│ ├── react-addons-transition-group@15.3.2 
│ └─┬ react-event-listener@0.3.1 
and react 

go to / (root)
run
make install


to start application in / (root) 

1)
first start the application:
mongod (start mongo)

then 
2)run nginx

sudo nginx (sudo is important)

3)
npm start

go in your browser in 
https://dev.skiscooldev.com

login in the website with Facebook (faster and i didn't check manual register)

click on map yu see the map










