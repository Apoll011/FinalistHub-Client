import { useEffect, useState } from "react";
import { CategoriesApi } from "api";
import {useCachedData} from "hooks/useCachedData.ts";
import {TIMES} from "utils/times.ts";

interface CategoryState<T> {
    data: T;
    isLoading: boolean;
    error: Error | null;
}

export const useCategoryName = (categoryId: string | null | undefined) => {
    const cacheKey = `categoryName_${categoryId}`;
    const fetchCategoryName = async () => {
        if (!categoryId) return 'N/A';
        const response = await new CategoriesApi().getCategoryCategoriesCategoryIdGet({ categoryId });
        return response.name || 'N/A';
    };
    
    const cachedData = useCachedData(fetchCategoryName, cacheKey, TIMES.NEVER);
    
    const [state, setState] = useState<CategoryState<string>>({
        data: cachedData || 'N/A',
        isLoading: Boolean(categoryId && !cachedData),
        error: null,
    });
    
    useEffect(() => {
        if (!categoryId) {
            setState({ data: 'N/A', isLoading: false, error: null });
            return;
        }
        
        if (!cachedData) {
            const fetchCategory = async () => {
                try {
                    const data = await fetchCategoryName();
                    setState({ data, isLoading: false, error: null });
                } catch (error) {
                    setState({ data: 'N/A', isLoading: false, error: error as Error });
                }
            };
            fetchCategory();
        }
    }, [categoryId, cachedData]);
    
    return state;
};
