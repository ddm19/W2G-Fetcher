const fs = require('fs')
const puppeteer = require('puppeteer')
const url = "https://w2g.tv/"
const timecycle = 20;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

let ACTUALTITLE;

async function run()
{
    const browser = await puppeteer.launch({headless:true}); // Con vistas

    //const browser = await puppeteer.launch();   // SIn vistas

    const page = await browser.newPage();

    await page.goto(url);
    


    await page.click('#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay.qc-cmp2-footer-scrolled > div > button:nth-child(2)')

    await page.focus('[type="text"]')

    for (let i = 0 ; i < 10 ; i++)
        await page.keyboard.press('Backspace')

    await page.keyboard.type("Espectador",{delay: 100})

    await page.keyboard.press('Enter')


    

    console.log("Espero la Carga de la página")
    await delay(5000);
    console.log("Página Cargada")

    
    while(true)
    {
        await page.screenshot({path: 'screenshot.png'});
        let title = await page.$$('.w2g-chat-item-text').then(async (elements) =>
        {
            let titletext;

            for(let i = 0 ; i < elements.length ; i++)
            {
                titletext = await elements[i].getProperty('textContent').then((promesa) => { return promesa.jsonValue()});
                //process.stdout.write('\n'+titletext)
            }
            
            return titletext;
        });

        ACTUALTITLE = title;

        fs.writeFile('NombreCancion.txt',title,err=>
        {
            if(err) {
            console.error(err);
        }
        
        });
        
        process.stdout.write('\033c');
        await Timer(timecycle);
    }
}


async function Timer(seconds)
{

    for(let i = seconds; i>=0 ; i--)
    {
        process.stdout.write('\r Esperando: '+i+' Canción Actual: '+ACTUALTITLE);
        await delay(1000);
    }
}
async function main()
{
    await run();
     
}
process.on('SIGINT', function() {
    process.stdout.write("\n Cerrando programa...");
    
    process.exit();
    
});

main();
