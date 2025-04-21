const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

function logCaptchaToken(cap) {
    console.log("Intercepted WebSocket Message. Received Captcha Token")
    console.log(cap)
}

(async () => {
    const browser = await puppeteer.launch({ headless: false, targetFilter: target => !!target.url() });
    let page = await browser.pages();
    page = page[0]
    await page.exposeFunction('logToNode', async (message) => {
        logCaptchaToken(message)
    });
    await page.exposeFunction('clickCap',async (type) => {
        setTimeout(async () => {
            setInterval(async () => {
                try {
                    await page.waitForSelector(`#${type}`, { visible: true });
                    const captchaElement = await page.$(`#${type}`);
                    if (captchaElement) {
                        await captchaElement.click();
                    }
                } catch(e) {
                    console.log("Err with click")
                }
            },500)

        },5000)
    })
    console.log("Captcha scraper initialized.");

    page.setDefaultNavigationTimeout(0)
    page.setDefaultTimeout(0)
    console.log("Disabled Timeout Restrictions")

    const client = await page.target().createCDPSession();
    console.log("Chromium DevTools Protocol Session Initialized.");
    page.goto('https://realmz.io');
    console.log("Located victim domain.");

    await page.setRequestInterception(true);
    page.on('request', (request) => {
        const url = request.url();
        const filters = [
            'pagead2.googlesyndication.com',
            'doubleclick.net',
            'analytics',
            'controltag',
            'chartbeat',
        ];
        const shouldAbort = filters.some((urlPart) => url.includes(urlPart));
        if (shouldAbort) {
            console.log("Blocking ads: "+url)
            request.abort();
        }
        else request.continue();
    });

    await client.send('Network.enable');
    console.log("Network Injection Enabled.");

    await websocketInjection(page)

})();

async function websocketInjection(page) {
    await page.evaluate(() => {
        let toClick = {
            "cap1": false,
            "cap2": false,
            "cap3": false,
            "cap4": false,
            "cap5": false
        }
        let existCondition = setInterval(function() {
            if (document.getElementById('nameplate') != null) {
                clearInterval(existCondition);
                document.getElementById('nameplate').src = "https://i.aphcore.io/image/8cJ6843"
            }
        }, 100)

        const originalWebSocket = window.WebSocket;
        window.WebSocket = class extends originalWebSocket {
            constructor(...args) {
                super(...args);
            }
            send(data) {
                if (typeof data === 'string' && data.includes('cap')) {

                    window.logToNode(data);
                    document.getElementById('captcha').innerHTML = "<div id='cap1' class='cap1'></div><div id='cap2' class='cap2'></div><div id='cap3' class='cap3'></div><div id='cap4' class='cap4'></div><div id='cap5' class='cap5'></div>"
                    function render1() {
                        turnstile.render("#cap1", {
                            'sitekey': "0x4AAAAAAAiDa53XZyuBuYTS",
                            'callback': function (e) {
                                document.getElementById('cap1').innerHTML =""
                                window.logToNode(`["cap",["${e}"]]`);
                                render1();
                                if(toClick["cap1"] === false) {
                                    window.clickCap('cap1')
                                    toClick["cap1"] = true
                                }
                            }
                        })
                    }
                    render1();
                    function render2() {
                        turnstile.render("#cap2", {
                            'sitekey': "0x4AAAAAAAiDa53XZyuBuYTS",
                            'callback': function (e) {
                                document.getElementById('cap2').innerHTML =""
                                window.logToNode(`["cap",["${e}"]]`);
                                if(toClick["cap2"] === false) {
                                    window.clickCap('cap2')
                                    toClick["cap2"] = true
                                }
                                render2();
                            }
                        })
                    }
                    render2();
                    function render3() {
                        turnstile.render("#cap3", {
                            'sitekey': "0x4AAAAAAAiDa53XZyuBuYTS",
                            'callback': function (e) {
                                document.getElementById('cap3').innerHTML =""
                                window.logToNode(`["cap",["${e}"]]`);
                                if(toClick["cap3"] === false) {
                                    window.clickCap('cap3')
                                    toClick["cap3"] = true
                                }
                                render3()
                            }
                        })
                    }
                    render3();
                    function render4() {
                        turnstile.render("#cap4", {
                            'sitekey': "0x4AAAAAAAiDa53XZyuBuYTS",
                            'callback': function (e) {
                                document.getElementById('cap4').innerHTML =""
                                window.logToNode(`["cap",["${e}"]]`);
                                if(toClick["cap4"] === false) {
                                    window.clickCap('cap4')
                                    toClick["cap4"] = true
                                }
                                render4()
                            }
                        })
                    }
                    render4();
                    function render5() {
                        turnstile.render("#cap5", {
                            'sitekey': "0x4AAAAAAAiDa53XZyuBuYTS",
                            'callback': function (e) {
                                document.getElementById('cap5').innerHTML =""
                                window.logToNode(`["cap",["${e}"]]`);
                                if(toClick["cap5"] === false) {
                                    window.clickCap('cap5')
                                    toClick["cap5"] = true
                                }
                                render3()
                            }
                        })
                    }
                    render5();
                    return; // Prevent the message from being sent
                }
                super.send(data); // Send other messages as normal
            }
        };
    });
}
