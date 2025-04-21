# Cloudflare-Turnstile-Bypass

#### Proof of Concept bypass method to obtain captcha tokens on Realmz.io in order to authenticate illegitimate connections.
#### Tested on Realmz.io with its founder before their swap away from Turnstile.

####
####
Turnstile relies on "small non-interactive JavaScript challenges" including
 - proof-of-work
 - proof-of-space
 - probing for web APIs
 - various other challenges for detecting browser-quirks and human behavior

######
However, these challenges seem to be easily bypassed by a headless browser (such as Puppeteer with stealth) and even on an unclean VPN IP address.
####
The conclusion drawn from this Proof of Concept is Turnstile's failure to prevent low volume or sophisticated botting.
</br>
Additionally, Captcha solutions that require human interaction decrease attack volume and increase cost during prolonged attacks which is what was recommended to the Realmz.io team along with further dynamic attack detection.
</br>
</br>




