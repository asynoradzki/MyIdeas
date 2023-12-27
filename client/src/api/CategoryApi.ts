import { authorizedApi } from "../hooks/withAxiosIntercepted";
import { Category } from "../models/Category";

export class CategoryApi {
    static getAllCategories = async () => await authorizedApi.get<Category[]>(`/categories/`);
}