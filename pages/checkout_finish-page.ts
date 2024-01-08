import { type Locator, type Page, expect } from "@playwright/test";
import CartPage from "./cart-page";

export class CheckoutPage_Finish {
    //variables
    readonly page: Page;
    readonly URL: string;
    readonly title: Locator;
    readonly finishButton: Locator;
    readonly itemtoBuyEnd: Locator;
    readonly thankYouMessage: Locator;


    //constructor
    constructor(page) {
        this.page = page;
        this.URL = 'https://www.saucedemo.com/checkout-complete.html';
        this.title = page.locator('.title');
        this.finishButton = page.locator("#finish");
        this.itemtoBuyEnd = page.locator(".inventory_item_name");
        this.thankYouMessage = page.locator(".complete-header");

    }

    //methods
    async goToCheckout3Page() {
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

    async assertThankYouMessage(thankYouMessageResult: string){
        const ThankYouMessage = this.thankYouMessage;
        const ThankYouMessageText= await ThankYouMessage.innerText();
        await expect(ThankYouMessageText).toBe(thankYouMessageResult);
    }
}

export default CartPage;