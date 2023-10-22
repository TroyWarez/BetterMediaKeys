<p align="center">
  <a href="https://github.com/TroyWarez/BetterMediaKeys/main"><img src="/BetterMediaKeys/icons/icon128.png" alt="Logo"></img></a>
</p>

<h1 align="center">BetterMediaKeys</h1>
</p>
BetterMediaKeys is an open-source browser extension that works with Chromium-based browsers and Firefox. It allows you to skip forward to the next chapter using the next track key (⏩) and also go back to the pervious chapter using the pervious track key (⏪) on YouTube without window focus.
## What are the differences between BetterMediaKeys and Tweaks for YouTube with global shortcuts?
BetterMediaKeys default behaviour is similar to Tweaks for YouTube with the rewind and fastforward keys set to 'Next chapter or video' as a global shortcut. However, there are the following differences:
- BetterMediaKeys will restart the current chapter from the begining instead of going to the previous chapter, if the current chapter is beyond the first five seconds of the chapter start. This is similar to how the music site works with playlists.
- BetterMediaKeys does not effect the default behaviour of YouTube.


In addition, it mimics the way that playlists are handled on YouTube Music: If the current chapter is within 5 seconds of starting when the pervious track key (⏪) is pressed, it will go back to the previous chapter, otherwise it will restart the current chapter from the beginning. The title of current chapter is also set to the title of the meta data in the current media session.


If you'd prefer the vanilla YouTube chapter experience (⏪) = ArrowLeft + control key or ArrowRight + control key = (⏩), I'd recommend using the 1.0.0.1 release at this time.
### Chromium Installation

To install BetterMediaKeys, you'll need to clone the repo and load the sub folder "BetterMediaKeys" as an unpacked extension. 

If you'd perfer to use .crx files on Chromium you'll have to add the extension id:"eokodajgpjmnhdlbijnhdlnbbefjbgjn" to "ExtensionInstallWhitelist" and "ExtensionInstallAllowlist". The location of this registry key on Windows is dependent on your specific Chromium-based browser. This only has to be done once.
### License

This project is licensed under MIT.
