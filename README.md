<p align="center">
  <a href="https://github.com/TroyWarez/BetterMediaKeys"><img src="/BetterMediaKeys/icons/icon128.png" alt="Logo"></img></a>
</p>

<h1 align="center">BetterMediaKeys</h1>
<p>
BetterMediaKeys is an open-source browser extension that works with Chromium-based browsers and Firefox. It allows you to skip forward to the next chapter/video using the next track key (⏩) and also go back to the pervious chapter or restart the current video from the beginning using the pervious track key (⏪) on YouTube.
</p>

<p align="center">
  <b>Download:</b>
   </br>
  <a href="https://chromewebstore.google.com/detail/better-media-keys-for-you/hgkdlkhheakimlklkhaokglbgokjplaj">Chrome</a>
  </br>
  <a href="https://microsoftedge.microsoft.com/addons/detail/better-media-keys-for-you/cnmnmildigcbajiojdonmiaafacbcaoi">Edge</a>
    </br>
  <a href="https://addons.mozilla.org/en-CA/firefox/addon/better-media-keys-for-youtube/">Firefox</a>
    </br>
</p>

### Question: What are the differences between BetterMediaKeys and Tweaks for YouTube with global shortcuts?
BetterMediaKeys default behaviour is similar to Tweaks for YouTube with the pervious track and next track keys set to 'Next/Previous chapter or video' as a global shortcut. However, there are the following differences:

<b>BetterMediaKeys does not effect the handling of the hardware media keys browser wide. A major limitation with using any media keys as a global shortcut on Chromium is that it does not allow for any website to use your media keys and some of the media session api. You'll lose the ability to see video thumbnails and titles on the lockscreen mini player and it does not allow for control when your device is locked. Other sites that use your media keys will no longer work, such as Spotify.<b>
- BetterMediaKeys does not go back to the previous video, only to the beginning of the current video.
- BetterMediaKeys does not require any configuration or global shortcuts.
- BetterMediaKeys will restart the current chapter from the begining instead of going to the previous chapter, if the video time is beyond the first three seconds of the chapter start. This is similar to how the music site works with playlists.
- BetterMediaKeys will set the lockscreen mini player title to the chapter title. Useful for single video music compilations/playlists.


If you'd prefer the vanilla YouTube chapter experience (⏪) = ArrowLeft + control key or ArrowRight + control key = (⏩), I'd recommend using the 1.0.0.1 release at this time.

Note: This release isn't signed and requires extra installation steps to install.

# Non-Chrome Webstore Manual Installation

### First, toggle on developer mode in your extensions management page inside your browser.

To install BetterMediaKeys 1.0.0.6 or above, download the .crx from the releases page, then open the extensions management page and enable developer mode. Now, drag and drop the .crx file on to the extensions page to finish the installation.

To install BetterMediaKeys 1.0.0.5 or below, you'll have to either load the extracted zip folder as an unpacked extension or add the extenesion id to the extension whitelist and allow list: 

Find the location of the Policies key(Folder) in the registry (HKEY_LOCAL_MACHINE\SOFTWARE for Windows), then the chromium developer's name (/Google) and finally the browser's name (/Chrome). Now, create two keys called "ExtensionInstallAllowlist".

Lastly, create a string value (REG_SZ) with the name being "1" and "eokodajgpjmnhdlbijnhdlnbbefjbgjn" as the value inside "ExtensionInstallAllowlist" keys, then restart your browser.

If done correctly, you should now be able to drag and drop the .crx file on to the extensions management page to finish the installation without any warnings.

### You can now turn off developer mode if you used a .crx file for installation.

# License

This project is licensed under MIT.
