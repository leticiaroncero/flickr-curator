const inquirer = require('inquirer')
const readline = require('readline');
const FlickrAuth = require('./auth');
const getChromeTabs = require('get-chrome-tabs');


async function run() {
    flickr = await FlickrAuth()

    var answers = await inquirer.prompt([{    
        name: 'title',
        message: "What's the gallery title?"
    }, {    
        name: 'description',
        message: "What's the gallery description?"
    }, {    
        type: 'confirm',
        name: 'extract',
        message: "Extract Photo URLs from Chrome?",
        default: true
    }]);

    if (answers.extract) {
        extractPhotoUrls(answers.title, answers.description);
    } else {
        inputPhotoUrls(answers.title, answers.description);
    }
}

async function extractPhotoUrls(title, description) {
    var tabs = await getChromeTabs();

    var flickrTabs = tabs.filter(tab => /^https:\/\/(www.)?flickr.com\/photos\/(?:\w+|\d+@N\d\d)\/\d+/.test(tab.url))

    photoUrls = flickrTabs.map(tab => tab.url)

    await createFlickrGallery(title, description, photoUrls);
}

async function inputPhotoUrls(title, description) {
    console.log("Paste the Photo URLs:");
    console.log("When done, press Enter *twice*");

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    var urls = []
    for await (const line of rl) {
        if (line.length === 0) {
            rl.close();
        } else {
            urls.push(line);
        }
    }
    createFlickrGallery(title, description, urls);
}

async function createFlickrGallery(title, description, photoUrls) {
    console.log("Images to add:")
    console.log(photoUrls.join("\n"));

    var answer = await inquirer.prompt([{    
        type: 'confirm',
        name: 'confirmation',
        message: "Do you want to create the gallery?",
        default: true
    }]);

    if (!answer.confirmation) {
        return;
    }

    galleryCreateRes = await flickr.galleries.create({
        title: title,
        description: description
    });
    
    galleryId = galleryCreateRes.body.gallery.gallery_id;

    photoIds = photoUrls.map(url => url.split('/')[5])
    for (id of photoIds) {
        await flickr.galleries.addPhoto({
            gallery_id: galleryId,
            photo_id: id
        });
    };

    console.log("Done!")
}

run()


