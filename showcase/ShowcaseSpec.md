# Croquet Metaverse Web Showcase

[https://croquet.io](https://croquet.io)

## Introduction

Your site, your content, your world.

Welcome to the ***Croquet Metaverse Web Showcase***. A Showcase is a 3D world populated by your images, documents and videos - extending your website experience in a dramatically new way. Your website becomes a place to share and discuss your business live with your customers - even enabling them to invite their colleagues to dynamically join the conversation in your world.  

This guide will enable you to quickly create and populate a Showcase world and then embed it directly into your own website with almost no programming required. 

If you need help setting this up for the first time, please connect with us at support@croquet.io and we will be happy to step you through the process ... but read this document first.

## Steps Toward Creating Your Own Showcase

### Step 1 - Enter Your Email

Simple.
Go to https://croquet.io/webshowcase/index.html.

This link is where you can enter your name and your email address. Once you do that, you will recieve an email with a link that will allow you to access your personal Showcase HTML template code that you will use to build your website experience. 

### Step 2 - Get Your Code - Launch Your Showcase

The link in your email will take you to the page with your Showcase template code. This includes your personal API key. This code can be used to immediately create a fully working 3D Showcase. 

Simply hit the "Copy to Clipboard" button, open a text editor or IDE and paste your HTML code into a new text file. If you save this file into the directory of your website as ***"showcase.html"***, you can immediately test your new Showcase by simply linking directly to it from your browser.

### Step 3 - Customize Your World

Your showcase includes the ability for you to place your own documents, videos and images as well as enable high quality Dolby&reg; spatial voice chat to engage your customers. 

In just the same way that you placed your showcase.html file into your web directory, you can also place the content you wish to display. You can then replace the content references in your showcase file with your own content. 

Showcase supports three content types:
- Images, which can include links to other pages:
<br>```{place: 1, type: "image", path: "./CallToAction.png", urlLink: "https://yoursite.com"},```
- PDF documents - fully scrollable and synchronized for all users in that showcase:
<br>```{place: 2, type: "pdf", path: "./CompanyDeck.pdf"},```
- Synchronized videos. 
<br>```{place: 1, type: "video", path: "./CustomerVideo.mov",```

Working examples of each of these are already in the code snippet.

***WARNING:*** Very large PDF files and videos can degrade your visitors experience and may not even work properly on some devices. It is best to keep these both relatively small and short.

### Step 4: - Embed Your Showcase in YOUR Site
As an example, if you named your Showcase HTML file ***showcase.html*** you can embed it into your main page using an iFrame:

```HTML
   <iframe width=1024 height=768 src="./showcase.html"/>
```

## Customizing Web Showcase
The Metaverse Web Showcase is a free low code, configurable Metaverse world you can customize with presentations, video testimonials, customer logos, calls to action and more. 

If you wish to expand the Showcase world, further customize it or add and create new features you can do so with ***Croquet Microverse World Builder***. Microverse is an open source development environment available now on GitHub at https://github.com/croquet/microverse. It enables developers to freely customize and extend any Metaverse project. Accounts using World Builder are subject to Croquet OS licensing and usage fees, which include 10,000 free user minutes per month.

Welcome to the Metaverse.

## A Deeper Dive

The template you download from https://croquet.io/keys should look like this:


```HTML
<!DOCTYPE html>
<html>
  <head><meta charset="utf-8"></head>
  <body>
    <script type="module">
      import {load} from "https://croquet.dev/showcase/showcase.js";
      load({
        title: "My Showcase", 
        showcase: "gallery", 
        cards: [
          // each item in cards array has a 'place' to specify the location in the art gallery
          // 'type' is either "image", "pdf", or "video"
          // 'path' specifies the location of the asset, either as full URL or as path relative to this html file
          {place: 1, type: "image", path: "https://croquet.dev/showcase/site/CompanyLogo.jpg"},
          {place: 2, type: "pdf", path: "https://croquet.dev/showcase/site/CompanyDeck.pdf"},
          {place: 3, type: "video", path: "https://croquet.dev/showcase/site/CustomerVideo.mp4", 
		  	muted: false},
          {place: 4, type: "image", path: "https://croquet.dev/showcase/site/CustomerLogos.png"},
          {place: 5, type: "image", path: "https://croquet.dev/showcase/site/CallToAction.png", 
		  	urlLink: "https://croquet.dev/webshowcase"},
        ],
        voiceChat: true,
        appId: "com.yourdomain.youremailname.showcase",
        apiKey: "dev:123456789abcdefg",
      });
    </script>
  </body>
</html>
```

The actual work is done by the `load` function with the single argument of an object defining the properties required to construct your world. The properties are listed below:

### showcase:string

This field specifies which showcase world to be used. Currently only "gallery" is supported. The gallery model looks like an art gallery shown below.

<p align="center">
<img src="./assets/gallery.jpg" width="800"/>
</p>

### cards:Array<Spec>

The `cards` property is an array of object references and and modifiers to specify your own content.

The `place` property specifies the predefined location in the showcase. The `type` property defines the kind of content, either `image`, `pdf` or `video`. The `path` property specifies where in the web to find the asset. the location can be a relative path from `showcase.html` or a full URL starting with "http" or "https". There are also additional modifiers that may be used.

### Images

```JavaScript
{place:number, type:"image", path:string, urlLink?:string}
```
When the "urlLink" property is provided, clicking on the image in the showcase opens a new browser window with the specified URL.

### PDF

```JavaScript
{place:number, type:"pdf", path:string}
```
This will create a shared, scrollable PDF viewer. Any user can scroll the document and it is synchronized for everyone in that session.

### Video

```JavaScript
{place:number, type:"video", path:string, videoWidth?:number, videoHeight?:number, muted?:boolean, loop?:boolean}
```

This creates a shared synchronized video. Any user can start and pause playback. Due to the browser's privacy restrictions, a user has to click somewhere in the Showcase window to start to play.

You may optionally provide the `videoWidth` and `videoHeight` properties to specify the CSS pixel resolution of the video. A video with non-standard dimension may be displayed incorrectly. It is best to provide videoWidth and videoHeight as a multiple of 16 and close to the original dimensions.

If you would like to have a video play audio, set `muted: false`. If you wish to loop the video set `loop: true`.

### apiKey:string

This is your Croquet API key. The value is filled in automatically when you create this file. 

### appId:string

This is the appId of your showcase. The value is filled in with a string generated from the key's name and your email. Feel free to change it as long as it conforms the "dot-separated words with hyphens" rule.

### title:string

This field is currently for information only. A future version of Metaverse it may be used to set the title element of the HTML header.

### voiceChat:boolean

If true, the spatial voice chat is enabled and the voice chat widget is added. Clicking on the green phone icon will turn on the audio device.

<p align="center">
<img src="./assets/gallery.jpg" width="277"/>
</p>

## Error Messages

There are sensible error messages displayed in the browser's console. Typical error messages are as follows.

### "Error verifying Croque APIkey: Invalid API Key"

<p align="center">
<img src="./assets/invalid-api.png" width="552"/>
</p>

### "Error verifying Croque APIkey: API Key not valid for domain"

<p align="center">
<img src="./assets/restriction.png" width="602"/>
</p>

Make sure that your key can be used for the domain where your showcase.html is located.

### "place 1 is already occupied"

<p align="center">
<img src="./assets/occupied.png" width="389"/>
</p>

The place property has to be all different from each other in the cards array.

### "Required property named "path" is missing from ..."

<p align="center">
<img src="./assets/missing.png" width="679"/>
</p>

A required property, such as `path` in this image, or `type` or `place` is missing from the Spec.

### "Access to fetch at ... has been blocked by CORS policy"

<p align="center">
<img src="./assets/cors.png" width="916"/>
</p>

The web technology uses security measures that rely upon the concept of `origin`, which means where a file is loaded from. Typically, "cross origin resource sharing" (CORS), which is the situation where a web page loaded from one site (origin)  requests resources from another site, is carefully guarded and only allowed when the other site allows it. In the Showcase, your showcase.html is located on one site, and it loads files specified as the `path` property in card spec. Those files need to be served from the same origin, or CORS needs to be enabled for those files.
