# Meme generator 2000

## Project draft
- 3-4[^1] pages (landing, generator, editor, about)
- landing page is there to look nice, has one big GENERATE button and sign up if we want it
- About page has a description and some buy me a coffee or paypal links
- Generator page is used to generate images, so it has input for prompts and other parameters. Offers
overview of generated images and option to take one or more images to the editor
- Editor allows:
    - use to place captions on generated meme images, it can have some templates 
    (caption above or below image in a white box, caption on top or bottom of the image (overlay),
    captions to the side of progressively extreme meme images ([mind blown meme](https://imageresizer.com/meme-generator/edit/mind-blown-template)). 
    - Also offers an option to place captions anywhere on the image and add whiteboxes to the sides.
    - Offers multiple fonts. 
    - Shows accurate preview of final image. 
    - Lets user finalize and download generated memes.
    - Prompts users to rate how good the created meme is.
- A few memes can be selected to be showcased on front page, maybe the ones with the best rating or just at random.
- We probably want some NSFW content filters
- My list of backend services:
    - server that serves content and responds to API calls
    - generator that generates images from prompts
    - small cleanup service (probably a cronjob that runs every 5 mins or so) that deletes images that are older
      than X minutes and moves a small selection to separate folder for display
    - image editor can be a separate service

[^1]: We can optionally have generator and editor in one page.
