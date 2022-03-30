/*
  firefox.world.js
  by Chris DeFreitas
  - cucumber world definition that includes firefox webdriver

  usage within Cucumber steps:
  1. at start of steps: this.init()
  2. to open a page: this.open( url )
  3. use: this.focused(), this.qry(), this.qryAll()
  4. at end: this.quit()
  
  adapted from: https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/world.md

  references:
  - https://github.com/cucumber/cucumber-js/
  - https://www.selenium.dev/documentation/webdriver/elements/
  - https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebElement.html
    
*/
const { World, setWorldConstructor } = require('@cucumber/cucumber')
const { Builder, By } = require("selenium-webdriver")
const log = console.log

module.exports = class FireFoxWorld extends World {
// class FireFoxWorld extends World {

  name = 'FireFoxWorld'
  browser = null
  initted = false

  constructor(options) {
    /*
    * The options are an object with three members
    * {
    *   log: Cucumber log function,
    *   attach: Cucumber attachment function,
    *   params: World Parameters object
    * }
    */
    super(options);
  }

  async init(){
    log('browserInit')
    if( this.initted === true ) {
      this.log( `browserInit() already called.`)
      return
    }
    this.browser = await new Builder()
      .forBrowser( 'firefox' )
      .build()
    this.initted = true
  } 
  async quit(){
    if( this.browser !== null ){
      await this.browser.quit()
      this.initted = false
    }
  }
  
  async open( url ){
    if( this.initted !== true ) throw new Error(`${this.name}.open() error, innited===false.`)

    await this.browser.get( url ) 
    // wait for element to load:  https://www.selenium.dev/documentation/webdriver/waits/
    //await browser.wait(until.elementLocated(By.id('foo')), 30000);
  }
  
  async exec( jsCommands ){ // return results of javascript 
    const result = await this.browser.executeScript( jsCommands )
    return result
  }
  async exists( selector ){ // return true if selector found
    if( this.initted !== true ) throw new Error(`${this.name}.qryAll() error, innited===false.`)

    const element = await this.browser.findElement(By.css( selector ))
    return (element !== null)
  }
  async focused(){    // return focused element
    if( this.initted !== true ) throw new Error(`${this.name}.focused() error, innited===false.`)

    const element = await this.browser.switchTo().activeElement()
    return element
  }

  async qry( selector ){
    if( this.initted !== true ) throw new Error(`${this.name}.qry() error, innited===false.`)

    const element = await this.browser.findElement(By.css( selector ))
    return element
  }
  async qryAll( selector ){
    if( this.initted !== true ) throw new Error(`${this.name}.qryAll() error, innited===false.`)

    const elements = await this.browser.findElements(By.css( selector ))
    return elements
  }
  
}

// fails ???:
// setWorldConstructor( FireFoxWorld )