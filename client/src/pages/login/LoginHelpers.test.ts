import { validateEmailRFC2822 } from "./LoginHelpers";

describe("LoginHelpers", () => {
    // test("validateEmailRFC2822 should return true for valid e-mail", () => {
    //     // when
    //     const validEmail = "test@gmail.com";
    //     // given
    //     const result = validateEmailRFC2822(validEmail);
    //     // then
    //     expect(result).toBe(true);
    // });

    test.each`
        email               | expectedResult
        ${"testgmail.com"}  | ${false}
        ${"testgmail@.com"} | ${false}
        ${"testgmail@,com"} | ${false}
        ${"testgmailcom"}   | ${false}
        ${"test@gmail.com"} | ${true}
    `("validateEmailRFC2822 should return expected value for given e-mail", ({ email, expectedResult }) => {
        // when
        // given
        const result = validateEmailRFC2822(email);
        // then
        expect(result).toBe(expectedResult);
    });
});
