import { type Locator, type Page, expect } from "@playwright/test";
import CartPage from "./cart-page";

export class CheckoutPage {
    //variables
    readonly page: Page;
    readonly URL: string;
    readonly title: Locator;
    readonly userFirstName: Locator;
    readonly userLastName: Locator;
    readonly userZipcode: Locator;
    readonly buttonContinue: Locator;
    readonly userInfoError: Locator;


    //constructor
    constructor(page) {
        this.page = page;
        this.URL = 'https://www.saucedemo.com/checkout-step-one.html';
        this.title = page.locator('.title');
        this.userFirstName = page.locator("#first-name");
        this.userLastName = page.locator("#last-name");
        this.userZipcode = page.locator("#postal-code");
        this.buttonContinue = page.locator("#continue");
        this.userInfoError= page.locator("h3[data-test='error']")

    }

    //methods
    async goToCheckoutPage() {
        await this.page.goto(this.URL);
    }

    async assertPageTitle(titleReceived) {
        await this.title.waitFor({ state: 'visible' });
        await expect(this.title).toHaveText(titleReceived);
    }

    async fillUserInformation(name : string, lastname : string, zipCode : string){
        await this.userFirstName.fill(name);
        await this.userLastName.fill(lastname);
        await this.userZipcode.fill(zipCode);
        await this.buttonContinue.click();
    }

    async getUserDataError(){
        const userError = this.userInfoError;
        const userErrorText = await userError.innerText();
        return userErrorText;
    }
}

export default CartPage;