import { test, type Page, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { CartPage } from '../pages/cart-page';
import { CheckoutPage } from '../pages/checkout-page';
import { CheckoutPage_Review } from '../pages/checkout_review-page';
import { CheckoutPage_Finish } from '../pages/checkout_finish-page';

let homePage: HomePage;
let cartPage: CartPage;
let checkoutPage: CheckoutPage;
let checkout_reviewPage: CheckoutPage_Review;
let checkout_finish: CheckoutPage_Finish;


test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    checkout_reviewPage = new CheckoutPage_Review(page);
    checkout_finish = new CheckoutPage_Finish(page);
    await homePage.goToHomePage();
});


test.describe('Login', () => {
    
    test('Able to Log in', async ({ page }) => {

        await homePage.login_EnterUser('standard_user');
        await homePage.login_EnterPassword('secret_sauce');
        await homePage.login_EnterButton();
        await homePage.assertPageTitle("Products");
    });

    test('Message of incorrect Log in', async ({ page }) => {

        await homePage.login_EnterUser('aaa');
        await homePage.login_EnterPassword('aaa');
        await homePage.login_EnterButton();
        await homePage.errorMessageReceived("Epic sadface: Username and password do not match any user in this service");
    });

    test('Locked out user', async ({ page }) => {

        await homePage.login_EnterUser('locked_out_user');
        await homePage.login_EnterPassword('secret_sauce');
        await homePage.login_EnterButton();
        await homePage.errorMessageReceived("Epic sadface: Sorry, this user has been locked out.")
    });

    test('Problem user', async ({ page }) => {

        await homePage.login_EnterUser('problem_user');
        await homePage.login_EnterPassword('secret_sauce');
        await homePage.login_EnterButton();
        await homePage.assertPageTitle('Products');
        await homePage.assertProductImageAttribute('src', '/static/media/sl-404.168b1cce.jpg');
    });

});

test.describe('Log out', () =>{

    test('able to log out', async ({ page }) =>{

        await homePage.login_EnterUser('standard_user');
        await homePage.login_EnterPassword('secret_sauce');
        await homePage.login_EnterButton();
        await homePage.assertPageTitle("Products");
        await homePage.logOut();
    })
})

test.describe('Products', () => {

    test('Products are shown', async ({ page }) => {

        await homePage.login_EnterUser('standard_user');
        await homePage.login_EnterPassword('secret_sauce');
        await homePage.login_EnterButton();
        await homePage.assertPageTitle("Products");
        await homePage.inventoryListIsVisible();
    });

    test('Ordering products (Option 1)', async ({ page }) => {

        await homePage.login_EnterUser('standard_user');
        await homePage.login_EnterPassword('secret_sauce');
        await homePage.login_EnterButton();
        await homePage.useTheOrderDropdown('az', "Sauce Labs Backpack");
    });

    test('Ordering products (Option 2)', async ({ page }) => {

        await homePage.login_EnterUser('standard_user');
        await homePage.login_EnterPassword('secret_sauce');
        await homePage.login_EnterButton();
        await homePage.useTheOrderDropdown('za', "Test.allTheThings() T-Shirt (Red)");
    });

    test('Ordering products (Option 3)', async ({ page }) => {

        await homePage.login_EnterUser('standard_user');
        await homePage.login_EnterPassword('secret_sauce');
        await homePage.login_EnterButton();
        await homePage.useTheOrderDropdown('lohi', "Sauce Labs Onesie");
    });

    test('Ordering products (Option 4)', async ({ page }) => {

        await homePage.login_EnterUser('standard_user');
        await homePage.login_EnterPassword('secret_sauce');
        await homePage.login_EnterButton();
        await homePage.useTheOrderDropdown('hilo', "Sauce Labs Fleece Jacket");
    });

    test('Shopping cart is functional', async ({ page }) => {

        await homePage.login_EnterUser('standard_user');
        await homePage.login_EnterPassword('secret_sauce');
        await homePage.login_EnterButton();
        const selectedProduct = await homePage.takeAProduct();
        await homePage.moveToCartPage();

        //Verify the Shopping Cart 1 (Cart)
        await cartPage.goToCartPage();
        await cartPage.assertPageTitle('Your Cart');
        await cartPage.assertItemToShop(selectedProduct);
        await cartPage.moveToCheckOut();

        //Verify the Shopping Cart 2 (Checkout Step 1)
        await checkoutPage.goToCheckoutPage();
        await checkoutPage.assertPageTitle('Checkout: Your Information');
        await checkoutPage.fillUserInformation('Hugo', 'Olmos', '01000');

        //Verify the Shopping Cart 2 (Checkout Step 2)
        await checkout_reviewPage.goToCheckout2Page();
        await checkout_reviewPage.assertPageTitle('Checkout: Overview');
        const finalProduct = await checkout_reviewPage.getFinalProduct();
        await checkout_reviewPage.compareTheItemAtTheEnd(finalProduct, selectedProduct);

        //Finished shopping
        await checkout_finish.goToCheckout3Page();
        await checkout_finish.assertPageTitle('Checkout: Complete!');
        await checkout_finish.assertThankYouMessage('Thank you for your order!');
    });

    test('Delete product from the Shopping Cart', async ({ page }) => {

        await homePage.login_EnterUser('standard_user');
        await homePage.login_EnterPassword('secret_sauce');
        await homePage.login_EnterButton();

        //Take a product
        const selectedProduct = await homePage.takeAProduct();
        await homePage.moveToCartPage();

        //Verify the Shopping Cart 1 (Cart)
        await cartPage.assertPageTitle("Your Cart")
        await cartPage.assertItemToShop(selectedProduct);
    
        //Delete the product
        await cartPage.deleteItemToShop();
        await cartPage.assertDeletedItem();
        
    });
});

test.describe('Error control', () => {

    test('Error for Empty Name', async ({ page }) =>{
        
        await homePage.login_EnterUser('standard_user');
        await homePage.login_EnterPassword('secret_sauce');
        await homePage.login_EnterButton();

        await homePage.moveToCartPage();

        await cartPage.moveToCheckOut();

        await checkoutPage.fillUserInformation('', 'aaa', '12345')
        const result = await checkoutPage.getUserDataError();
        expect(result).toBe('Error: First Name is required');
    })

    test('Error for Empty Last Name', async ({ page }) =>{
        
        await homePage.login_EnterUser('standard_user');
        await homePage.login_EnterPassword('secret_sauce');
        await homePage.login_EnterButton();
        await homePage.moveToCartPage();

        await cartPage.moveToCheckOut();

        await checkoutPage.fillUserInformation('aaa', '', '12345')
        const result = await checkoutPage.getUserDataError();
        expect(result).toBe('Error: Last Name is required');
    })

    test('Error for Empty Zip/Postal Code', async ({ page }) =>{
        
        await homePage.login_EnterUser('standard_user');
        await homePage.login_EnterPassword('secret_sauce');
        await homePage.login_EnterButton();
        await homePage.moveToCartPage();

        await cartPage.moveToCheckOut();

        await checkoutPage.fillUserInformation('aaa', 'aaa', '')
        const result = await checkoutPage.getUserDataError();
        expect(result).toBe('Error: Postal Code is required');
    })

    // test ('Error for having zero dollars', async ({ page }) =>{
    //     await homePage.login_EnterUser('standard_user');
    //  await homePage.login_EnterPassword('secret_sauce');
    //  await homePage.login_EnterButton();
    //     await homePage.moveToCartPage();

    //     await cartPage.goToCartPage();
    //     await cartPage.assertPageTitle('Your Cart');
    //     await cartPage.moveToCheckOut();

    //     await checkoutPage.goToCheckoutPage();
    //     await checkoutPage.assertPageTitle('Checkout: Your Information');
    //     await checkoutPage.fillUserInformation('Hugo', 'Olmos', '01000');

    //     await checkout_reviewPage.goToCheckout2Page();
    //     await checkout_reviewPage.assertPageTitle('Checkout: Overview');
    //     const totalMoney = await checkout_reviewPage.getTotalOfMoney();
    //     expect(totalMoney).toContain('0.00');

    //     await checkout_finish.goToCheckout3Page();
    //     await checkout_finish.assertPageTitle('Checkout: Complete!');
    //     await checkout_finish.assertThankYouMessage('It is not possible to buy 0 dollars in Objects'); //Test will fail as this is not in control
    // })
})