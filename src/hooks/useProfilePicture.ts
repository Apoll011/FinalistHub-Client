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
        console.log(username);
        return `https://api.dicebear.com/10.x/adventurer-neutral/svg?seed=${username.toLowerCase()}`;
    };
    
    return profileImage;
}