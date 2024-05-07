const { Builder, By, until } = require('selenium-webdriver');
require('geckodriver');

const fileUnderTest = 'file://' + __dirname.replace(/ /g, '%20') + '/../dist/index.html';
const defaultTimeout = 10000;
let driver;
jest.setTimeout(1000 * 60 * 5); // 5 minuter

// Det här körs innan vi kör testerna för att säkerställa att Firefox är igång
beforeAll(async () => {
console.log(fileUnderTest);
    driver = await new Builder().forBrowser('firefox').build();
    await driver.get(fileUnderTest);
});

// Allra sist avslutar vi Firefox igen
afterAll(async() => {
    await driver.quit();
}, defaultTimeout);

test('The stack should be empty in the beginning', async () => {
	let stack = await driver.findElement(By.id('top_of_stack')).getText();
	expect(stack).toEqual("n/a");
});

describe('Clicking "Pusha till stacken"', () => {
	it('should open a prompt box', async () => {
		let push = await driver.findElement(By.id('push'));
		await push.click();
		let alert = await driver.switchTo().alert();
		await alert.sendKeys("Bananer");
		await alert.accept();
	});
});

describe('Using "Pusha till stacken" and "Poppa stacken"', () => {
	it('should remove top item from stack', async () => {
    const push = await driver.findElement(By.id('push'));
    const pop = await driver.findElement(By.id('pop'));
    const peek = await driver.findElement(By.id('peek'));
    const topOfStack = await driver.findElement(By.id('top_of_stack'));

    await push.click();
    let alert = await driver.switchTo().alert();
    await alert.sendKeys("Grejer");
    await alert.accept();

    await driver.wait(until.elementTextContains(topOfStack, "Grejer"), defaultTimeout);

    await push.click();
    alert = await driver.switchTo().alert();
    await alert.sendKeys("Mer grejer");
    await alert.accept();

		await driver.wait(until.elementTextContains(topOfStack, "Mer grejer"), defaultTimeout);
    
    await pop.click();
    alert = await driver.switchTo().alert();
    await alert.accept();  

    await peek.click();
    const stackContent = await topOfStack.getText();
    expect(stackContent).toEqual('Grejer');
	});
});

