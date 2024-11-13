# Meme generator 2000

## Project purpose
Project is designed to provide an easy and fast way to generate new memes with the help of ai.
The target group are young people that are familiar with memes and would like to create them.

## Project draft
(✅ - whats done)
- [x] 3-4[^1] pages (landing, generator, editor, about)
- [x] landing page is there to look nice, has one big GENERATE button and sign up if we want it
- [ ] About page has a description and some buy me a coffee or paypal links
- [x] Generator page is used to generate images, so it has input for prompts and other parameters.
- [ ] Offers overview of generated images and option to take one or more images to the editor
- Editor allows:
    - [x] use to place captions on generated meme images, it can have some templates
    - [x] Also offers an option to place captions anywhere on the image and add whiteboxes to the sides.
    - [x] Offers multiple fonts.
    - [x] Shows accurate preview of final image. 
    - [x] Lets user finalize and download generated memes.
    - [ ] Prompts users to rate how good the created meme is.
- [ ] A few memes can be selected to be showcased on front page, maybe the ones with the best rating or just at random.
- [ ] We probably want some NSFW content filters
- My list of backend services:
    - [x] server that serves content and responds to API calls
    - [x] generator that generates images from prompts 
    - [ ] small cleanup service (probably a cronjob that runs every 5 mins or so) that deletes images that are older
      than X minutes and moves a small selection to separate folder for display

## Some functionalities to implement
- all the things listed in project draft that haven't been done yet
- speeding up image generation
- having a public front page with best generated memes
- rating system for generated memes that people share
- improve the token system (token is used for each generation)

[^1]: We can optionally have generator and editor in one page.
