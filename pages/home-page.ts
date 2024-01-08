import { type Locator, type Page, expect } from "@playwright/test";

export class HomePage {
    //variables
    readonly page: Page;
    readonly URL: string;
    readonly loginButton: Locator;
    readonly logOutButton: Locator;
    readonly userName: Locator;
    readonly password: Locator;
    readonly title: Locator;
    readonly loginLogo: Locator;
    readonly errorMessage: Locator;
    readonly productImage: Locator;
    readonly products: Locator;
    readonly orderDropDown: Locator;
    readonly listOfResults: Locator;
    readonly inventoryItem: Locator;
    readonly buyProductButton: Locator;
    readonly removeProductButton: Locator;
    readonly shoppingCartButton: Locator;
    readonly burguerButton: Locator;


    //constructor
    constructor(page) {
        this.page = page;
        this.URL = 'https://www.saucedemo.com/';
        this.loginButton = page.locator('#login-button');
        this.logOutButton = page.locator('#logout_sidebar_link');
        this.userName = page.locator('#user-name');
        this.password = page.locator('#password');
        this.title = page.locator('.title');
        this.loginLogo = page.locator('.login_logo');
        this.errorMessage = page.locator('//h3[@data-test="error"]');
        this.productImage = page.locator('#item_4_img_link > .inventory_item_img');
        this.products = page.locator('.inventory_list');
        this.orderDropDown = page.locator('.product_sort_container');
        this.inventoryItem = page.locator(".inventory_item_name").first();
        this.buyProductButton = page.locator(".btn_primary.btn_small.btn_inventory");
        this.removeProductButton = page.locator(".btn_secondary.btn_small.btn_inventory").first();
        this.shoppingCartButton = page.locator(".shopping_cart_link");
        this.burguerButton = page.locator('#react-burger-menu-btn');

    }

    //methods
    async goToHomePage() {
        await this.page.goto(this.URL);
    }

    async login_EnterUser(username) {
        await this.userName.fill(username);
    }

    async login_EnterPassword(password) {
        await this.password.fill(password);
    }

    async login_EnterButton() {
        await this.loginButton.click();
    }

    async logOut(){
        await this.burguerButton.click();
        await this.logOutButton.click();
        
        expect(this.loginLogo).toBeVisible();
    }

    async assertPageTitle(titleReceived) {
        await this.title.waitFor({ state: 'visible' });
        await expect(this.title).toHaveText(titleReceived);
    }

    async errorMessageReceived(errorReceived) {
        await this.errorMessage.waitFor({ state: 'visible' });
        await expect(this.errorMessage).toHaveText(errorReceived);
    }

    async assertProductImageAttribute(getattribute, attribute) {
        let attributeObtained = await this.productImage.getAttribute(getattribute);
        await expect(attributeObtained).toBe(attribute);
    }

    async inventoryListIsVisible() {
        await expect(this.products).toBeVisible;
    }

    async useTheOrderDropdown(option: string, productResult: string) {
        await this.orderDropDown.selectOption({ value: option })
        await this.page.waitForTimeout(2000)
        
        const listOfResults = await this.page.$$('.inventory_item_name');
        if (listOfResults && listOfResults.length > 0) {
            const resultForOption = listOfResults.find(async (result) => {
                await result.waitForElementState('visible');
                const text = await result.innerText();
                return text.includes(productResult);
            });

            if (resultForOption) {
                await resultForOption.waitForElementState('visible');
                let result = await resultForOption.innerText();
                await expect(result).toBe(productResult);
            } else {
                throw new Error(`No se encontró el elemento para la opción ${option}.`);
            }
        } else {
            throw new Error('No se encontraron elementos en la lista de resultados.');
        }
    }

    async takeAProduct() {
        await this.clickButtons('.btn_primary.btn_small.btn_inventory', 'Buy');
        const selectedProduct = await this.getSelectedProduct();
        return selectedProduct;
    }
    
    async clickButtons(selector, action) {
        const button = await this.page.$(selector);
    
        if (button) {
                await button.waitForElementState('visible');
                await button.click();            
        } else {
            throw new Error(`No se encontraron elementos con el selector proporcionado para ${action}.`);
        }
    }
    
    async getSelectedProduct() {
        const inventoryItem = this.inventoryItem;
        await inventoryItem.waitFor({ state: 'attached' });
        return await inventoryItem.innerText();
    }

    async moveToCartPage (){
        const shoppingCartButton = this.shoppingCartButton;
        await shoppingCartButton.waitFor({ state: 'attached' });
        await shoppingCartButton.click();
    }
}

export default HomePage;