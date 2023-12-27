import { authorizedApi } from "../hooks/withAxiosIntercepted";
import { User } from "../models/User";
import { UserUpdateDTO } from "../models/user/UserUpdateDTO";

export class UserApi {
    static getUserById = async (userId: number) => await authorizedApi.get<User>(`/users/id/${userId}`);

    static searchUsersByEmail = async (searchTerm: string) =>
        await authorizedApi.get<User[]>(`/users/search`, {
            params: { searchTerm: searchTerm },
        });

    static updateUserById = async (userId: number, request: UserUpdateDTO) =>
        await authorizedApi.patch<User>(`/users/id/${userId}`, request);

    static deleteUserById = async (userId: number) => await authorizedApi.delete(`/users/${userId}`);
}
