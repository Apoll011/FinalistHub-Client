import {useCallback, useEffect, useState} from "react";
import {CategoriesApi, TransactionCategoryResponse} from "api";

export const useCategories = () => {
    const [categories, setCategories] = useState<TransactionCategoryResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const response = await new CategoriesApi().listCategoriesCategoriesGet({
                skip: 0,
                limit: 100
            });
            setCategories(response || []);
        } catch (err) {
            setError('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    }, []);
    
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);
    
    return { categories, loading, error, refetch: fetchCategories };
};
