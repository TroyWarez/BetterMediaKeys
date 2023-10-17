echo packing extension
set devFolder=%cd%
cd ".."
set keyFolder=%cd%
cd "C:\Program Files (x86)\Microsoft\Edge\Application"
msedge.exe --pack-extension=%devFolder%\BetterMediaKeys --pack-extension-key=%keyFolder%\BetterMediaKeys.pem
cd "%devFolder%"
echo Done!