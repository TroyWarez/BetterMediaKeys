const script = document.createElement('script');
script.src = chrome.runtime.getURL('mediaKeys.js');
document.documentElement.appendChild(script);