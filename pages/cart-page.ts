import { type Locator, type Page, expect } from "@playwright/test";
const { context } = require('playwright');

export class CartPage {
    //variables
    readonly page: Page;
    readonly URL: string;
    readonly title: Locator;
    readonly itemToShop: Locator;
    readonly shoppingCheckout: Locator;
    readonly cartDeleteButton: Locator;
    readonly removedCartItem: Locator;


    //constructor
    constructor(page) {
        this.page = page;
        this.URL = 'https://www.saucedemo.com/cart.html';
        this.title = page.locator('.title');
        this.itemToShop = page.locator(".inventory_item_name");
        this.shoppingCheckout = page.locator("#checkout");
        this.cartDeleteButton = page.locator('.btn_secondary.btn_small');
        this.removedCartItem = page.locator('.removed_cart_item');

    }

    //methods
    async goToCartPage() {
        await this.page.goto(this.URL);
    }

    async assertPageTitle(titleReceived) {
        await this.title.waitFor({ state: 'visible' });
        await expect(this.title).toHaveText(titleReceived);
    }

    async assertItemToShop(selectedProduct : string){
        const itemToShopText = await this.itemToShop.innerText();
        await expect(itemToShopText).toBe(selectedProduct);
    }

    async deleteItemToShop(){
        const cardDeleteButton = this.cartDeleteButton;
        await cardDeleteButton.click();
    }

    async assertDeletedItem() {
        const removedCartItem = this.removedCartItem;
        await removedCartItem.waitFor({ state: 'hidden', timeout: 2000 });
        const itemIsHidden = await removedCartItem.isHidden;
        await expect(itemIsHidden).toBeTruthy();
    }

    async moveToCheckOut(){
        await this.shoppingCheckout.click();

    }
}

export default CartPage;