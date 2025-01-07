import {TransactionCategoryResponse} from "api";
import {useState} from "react";

export const useCategoryCard = (category: TransactionCategoryResponse) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);
    
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    const toggleExpand = () => setIsExpanded(!isExpanded);
    
    return {
        isHovered,
        isExpanded,
        localLoading,
        setLocalLoading,
        handleMouseEnter,
        handleMouseLeave,
        toggleExpand,
    };
};
