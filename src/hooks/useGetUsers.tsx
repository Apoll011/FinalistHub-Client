import React, {useEffect, useState} from 'react';
import {useAuth, User} from "hooks/useAuth.tsx";

function useGetUsers(setError:  React.Dispatch<React.SetStateAction<string>>) {
    const { isAdmin, getUsers } = useAuth();
    
    const [users, setUsers] = useState<User[]>([]);
    
    useEffect(() => {
        if (isAdmin) {
            loadUsers().then(() => {});
        }
    }, [isAdmin]);
    
    const loadUsers = async () => {
        try {
            const userList: User[] = await getUsers();
            setUsers(userList);
        } catch {
            setError('Falha ao carregar os usuários');
        }
    };
    
    
    return {users, loadUsers};
}

export default useGetUsers;