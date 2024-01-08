import { type Locator, type Page, expect } from "@playwright/test";
import CartPage from "./cart-page";

export class CheckoutPage_Review {
    //variables
    readonly page: Page;
    readonly URL: string;
    readonly title: Locator;
    readonly finishButton: Locator;
    readonly itemtoBuyEnd: Locator;
    readonly totalOfMoney: Locator;


    //constructor
    constructor(page) {
        this.page = page;
        this.URL = 'https://www.saucedemo.com/checkout-step-two.html';
        this.title = page.locator('.title');
        this.finishButton = page.locator("#finish");
        this.itemtoBuyEnd = page.locator(".inventory_item_name");
        this.totalOfMoney = page.locator("div[class='summary_info_label summary_total_label']");

    }

    //methods
    async goToCheckout2Page() {
        await this.page.goto(this.URL);
    }

    async assertPageTitle(titleReceived) {
        await this.title.waitFor({ state: 'visible' });
        await expect(this.title).toHaveText(titleReceived);
    }
    async finishShopping(){
        await this.finishButton.click();
    }

    async getFinalProduct(){
        const finalProduct = await this.itemtoBuyEnd.innerText()
        return finalProduct;
    }

    async compareTheItemAtTheEnd(selectedProduct : string, finalProduct : string){
        await expect(selectedProduct).toBe(finalProduct);
    }

    async getTotalOfMoney(){
        const totalOfMoneyValue = this.totalOfMoney;
        const totalMoney = await totalOfMoneyValue.innerText();
        return totalMoney;
    }

    async moveToCheckOut3(){
        await this.finishButton.click();
    }
}

export default CartPage;