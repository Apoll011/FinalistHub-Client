import React, {useEffect, useState} from 'react';
import {useAuth, User} from "hooks/useAuth.ts";

function useGetUsers(setError: React.Dispatch<React.SetStateAction<string>>) {
    const { isAdmin, getUsers } = useAuth();
    
    const [users, setUsers] = useState<User[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    
    useEffect(() => {
        if (isAdmin) {
            loadUsers();
        } else {
            setLoaded(true); 
        }
    }, [isAdmin]);
    
    const loadUsers = async () => {
        try {
            const userList: User[] = await getUsers();
            setUsers(userList);
            setLoaded(true);
        } catch {
            setError('Falha ao carregar os usuários');
            setLoaded(true); // FIX: Stop spinning even if there's an error
        }
    };
    
    return {users, loaded, loadUsers};
}

export default useGetUsers;