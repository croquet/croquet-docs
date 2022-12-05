# Croquet Metaverse Web Showcase

[https://croquet.io](https://croquet.io)

## TL;DR
[Access your unique Web Showcase via this link.](https://croquet.io/webshowcase/) Keep reading to learn more about Web Showcase and how to customize it.

## Introduction
Currently, developers download the Microverse platform and work with the entire thing - our goal is to move all of this development - internal and external - into live behavior programming. The development process then becomes more of a drag and drop and associate behaviors. Developers are able to use an external IDE like Visual Studio Code to modify behaviors even while the system is running. We have been moving more and more of the Microverse components into that model.
Your site, your content, your world.

Welcome to the ***Croquet Metaverse Web Showcase***.

It's a 3D world you can populate with your own images, documents and videos - extending your web experience in a dramatic new way. Your website becomes a place to share and discuss your business live with your customers - even enabling them to invite their colleagues to dynamically join the conversation in your world.

 Croquet Metaverse Web Showcase includes high-quality Dolby&reg; spatial voice audio enabling remarkably clear and life-like conversations.

This guide will teach you how to quickly create and populate a Web Showcase world and then embed it directly into your own website with almost no programming.

After reading this document, if you need help setting up your Web Showcase, connect with us at [support@croquet.io](mailto:support@croquet.io) and we will be happy to step you through the process.

## Building Your Web Showcase

**Estimated Time to Completion:** 15 minutes

### Create an Account

1. Visit [the Web Showcase landing page on Croquet.io](https://croquet.io/webshowcase/).
2. Submit your name and email address.
3. Check your email account for a unique link to your Developer Portal, which contains your personalized Web Showcase HTML template code.

_A Croquet developer account is required to create a Web Showcase. Croquet will never share your personal information or send you unsolicited email. Usage of your personal data is governed by [the Croquet Privacy Policy](https://croquet.io/privacy.html)._

### Download Your Web Showcase
1. On the Croquet Developer Portal's "Web Showcase" tab, click the "Download" button.

<p align="center">
<img src="./assets/WebShowcaseDownload.png" width="800"/>
</p>

This Web Showcase HTML file already contains your public Croquet API key.

If you wanted to, you could host this `webshowcase.html` file directly on your Web server and view it that way.

### Customize Your Showcase

Within your Showcase, you can place your images, videos, and documents by modifying `webshowcase.html`.

1. Open `webshowcase.html` in your favorite text editor.

2. Modify the `cards: []` array with links to your own content.

Showcase supports three content types:
- Images, which can include links to other pages:
<br>```{place: 1, type: "image", path: "./CallToAction.png", urlLink: "https://yoursite.com"},```
- PDF documents, whose scroll state is synchronized among all session participants:
<br>```{place: 2, type: "pdf", path: "./CompanyDeck.pdf"},```
    - Large PDF files may impact performance on some devices.
- Videos with the `.mov` or `.mp4` extension. Video playback state and position are synchronized among all session participants:
<br>```{place: 3, type: "video", path: "./CustomerVideo.mov",```
    - Large, high-resolution video files may impact performance on some devices.

### Embed Your Showcase on _Your_ Site

After you upload `webshowcase.html` to your Web server, you and your customers can access your Showcase via a link to that document directly.

You can also embed your Showcase within existing pages on your site using an `<iframe>` with the `src` parameter set to `webshowcase.html`. For example:

```HTML
   <iframe width="640" height="360" src="webshowcase.html" />
```

### Done

Welcome to the Metaverse. You can invite customers to your Showcase using the invite menu item.

<p align="center">
<img src="./assets/WebShowcaseInvite.png" width="800"/>
</p>

If you'd like to learn more about Croquet, or how to further customize your Showcase, continue reading.

-----

## Customizing Web Showcase

The Metaverse Web Showcase is a free low code, configurable Metaverse world you can customize with presentations, video testimonials, customer logos, calls to action and more.

If you wish to expand beyond your free Showcase world, further customize it or add and create new features you can do so with ***Croquet Microverse World Builder***.

Microverse is an open source development environment available now on GitHub at https://github.com/croquet/microverse. It enables developers to freely customize and extend any Metaverse project. Accounts using World Builder are subject to Croquet OS licensing and usage fees, which include 10,000 free user minutes per month.

Welcome to the Metaverse.

## A Deeper Dive

The template you download from https://croquet.io/keys should look like this:


```HTML
<!DOCTYPE html>
<html>
  <head><meta charset="utf-8"></head>
  <body>
    <script type="module">
      import {load} from "https://croquet.io/webshowcase/v1.js";
      load({
        title: "My Web Showcase",
        showcase: "gallery",
        cards: [
          // each item in cards array has a 'place' to specify the location in the art gallery
          // 'type' is either "image", "pdf", or "video"
          // 'path' specifies the location of the asset, either as full URL or as path relative to this html file
          {place: 1, type: "image", path: "https://croquet.io/webshowcase/site/CompanyLogo.jpg"},
          {place: 2, type: "pdf", path: "https://croquet.io/webshowcase/site/CompanyDeck.pdf"},
          {place: 3, type: "video", path: "https://croquet.io/webshowcase/site/CustomerVideo.mp4", muted: false},
          {place: 4, type: "image", path: "https://croquet.io/webshowcase/site/CustomerLogos.png"},
          {place: 5, type: "image", path: "https://croquet.io/webshowcase/site/CallToAction.png", urlLink: "https://croquet.io/webshowcase"},
        ],
        voiceChat: true,
        appId: "com.yourdomain.youremailname.webshowcase",
        apiKey: "123456789abcdefg",
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

The `cards` property is an array of object references and modifiers to specify your own content.

The `place` property specifies the predefined location in the showcase. The `type` property defines the kind of content, either `image`, `pdf` or `video`. The `path` property specifies where in the web to find the asset. The location can be a relative path from `webshowcase.html` or a full URL starting with "http" or "https". There are also additional modifiers that may be used.

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
<img src="./assets/gallery.jpg" width="803"/>
</p>

## Error Messages

There are sensible error messages displayed in the browser's console. Typical error messages are as follows.

### "Error verifying Croque APIkey: Invalid API Key"

<p align="left">
<img src="./assets/invalid-api.png" width="481"/>
</p>

### "Error verifying Croque APIkey: API Key not valid for domain"

<p align="left">
<img src="./assets/restriction.png" width="629"/>
</p>

Make sure that your key can be used for the domain where your webshowcase.html is located.

### "place 1 is already occupied"

<p align="left">
<img src="./assets/occupied.png" width="301"/>
</p>

The place property has to be all different from each other in the cards array.

### "Required property named "path" is missing from ..."

<p align="left">
<img src="./assets/missing.png" width="508"/>
</p>

A required property, such as `path` in this image, or `type` or `place` is missing from the Spec.

### "Access to fetch at ... has been blocked by CORS policy"

<p align="left">
<img src="./assets/cors.png" width="705"/>
</p>

The web technology uses security measures that rely upon the concept of `origin`, which means where a file is loaded from. Typically, "cross origin resource sharing" (CORS), which is the situation where a web page loaded from one site (origin)  requests resources from another site, is carefully guarded and only allowed when the other site allows it. In the Showcase, your webshowcase.html is located on one site, and it loads files specified as the `path` property in card spec. Those files need to be served from the same origin, or CORS needs to be enabled for those files.
