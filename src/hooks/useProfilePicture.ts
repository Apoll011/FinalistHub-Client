import {useEffect, useState} from "react";


export const useProfilePicture = (username: string) => {
    const [profileImage, setProfileImage] = useState('');
    
    useEffect(() => {
        if (username) {
            const generatedImage = getProfileImage(username);
            setProfileImage(generatedImage);
        }
    }, [username]);
    
    const getProfileImage = (username: string) => {
        return `https://api.multiavatar.com/${username.toLowerCase()}.svg`;
    };
    
    return profileImage;
}