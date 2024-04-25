describe("login", () => {
    it("first", () => {
        cy.visit("http://localhost:3000");

        cy.get(":nth-child(1) > .sc-gWHiUp").type("admin@admin.pl");

        cy.get(":nth-child(2) > .sc-gWHiUp").type("admin");

        cy.get("label > input").check();

        // cy.get(".sc-jcVcfa")
        //     .click()
        //     .should(() => {
        //         expect(localStorage.getItem("ACCESS_TOKEN")).to.be.string;
        //         expect(localStorage.getItem("REFRESH_TOKEN")).not.be.null;
        //     });

        cy.get(".sc-jcVcfa").click();

        cy.getAllLocalStorage().then((result) => {
            cy.log(`${JSON.stringify(result)}`);
        });
    });
});

//'input[name="email"]'
