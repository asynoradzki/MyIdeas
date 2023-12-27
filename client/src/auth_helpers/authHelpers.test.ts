import { ACCESS_TOKEN } from "../constants/constants";
import { saveTokensToLocaleStorage } from "./authHelpers";

describe("LoginHelpers", () => {
    test("saveTokensToLocaleStorage should save values to local storage", () => {
        // given
        const localStorageSpy = jest.spyOn(Storage.prototype, "setItem");
        // when
        saveTokensToLocaleStorage({ access_token: "accessToken", refresh_token: "refreshToken" });
        // then
        expect(localStorageSpy).toHaveBeenCalledWith(ACCESS_TOKEN, "accessToken");
    });
});
// "test": "react-scripts test",
// "test": "react-scripts test",
