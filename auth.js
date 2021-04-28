var Flickr = require('flickr-sdk');
const inquirer = require('inquirer')
const fs = require('fs') 
const envfile = require('envfile')
require('dotenv').config()
    
var consumer_key = "INSERT_YOUR_API_KEY";
var consumer_secret = "INSERT_YOUR_API_SECRET"

async function run() {
    var credentials = await readCredentials();
    names = Object.keys(credentials)
    names.push("Use new account");
    var input = await inquirer.prompt({    
        type: 'list',
        name: 'account',
        message: "What account do you want to use?",
        choices: names
    });
    if (input.account != "Use new account") {
        return new Flickr(Flickr.OAuth.createPlugin(
            consumer_key,
            consumer_secret,
            credentials[input.account].access_token,
            credentials[input.account].access_token_secret
            ));;
    }
    return await auth();
}

async function auth() {  
    var oauth_token;
    var oauth_token_secret;
    
    var oauth = new Flickr.OAuth(
        consumer_key,
        consumer_secret
    );
    
    var res = await oauth.request('http://localhost:3000/oauth/callback');
    
    oauth_token = res.body.oauth_token;
    oauth_token_secret = res.body.oauth_token_secret;
    var url = oauth.authorizeUrl(oauth_token, "write");
    console.log("Open this URL in the browser, grant permissions and copy the verifier from the URL (it will look like an error page)");
    console.log(url);

    var input = await inquirer.prompt({    
        name: 'verifier',
        message: "What's the Oauth verifier?"
    });
    
    res = await oauth.verify(oauth_token, input.verifier, oauth_token_secret)
    var access_token = res.body.oauth_token;
    var access_token_secret = res.body.oauth_token_secret;

    await saveCredentials(access_token, access_token_secret, res.body.user_nsid, res.body.username);

    return new Flickr(Flickr.OAuth.createPlugin(
        consumer_key,
        consumer_secret,
        access_token,
        access_token_secret
      ));
}

async function readCredentials() {
    var credentials_str = process.env.credentials || '{}'
    return JSON.parse(credentials_str)
}

async function saveCredentials(access_token, access_token_secret, nsid, username) {
    const sourcePath = '.env'
    let parsedFile = envfile.parse(sourcePath);

    var credentials_str = parsedFile.credentials || '{}'
    var credentials = JSON.parse(credentials_str)
    
    credentials[username] = {
            access_token: access_token,
            access_token_secret: access_token_secret,
            nsid: nsid
        }
    parsedFile.credentials = JSON.stringify(credentials)
    
    fs.writeFileSync('./.env', envfile.stringify(parsedFile)) 
}

module.exports = run;
