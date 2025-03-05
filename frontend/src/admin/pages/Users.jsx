import React, { useState } from 'react';
import { Layout } from '../layout/Layout';
import { UsersTable } from '../usersData/UserTable';
import { UserFormModal } from '../usersData/UserFormModal';
import { DeleteUserModal } from '../usersData/DeleteUserModal';
import { useToast } from '../../hooks/useToast';

// Mock data
const mockUsers = [
    {
        id: '1',
        avatar: 'https://i.pravatar.cc/150?img=1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        company: 'Apple Inc.',
        role: 'Admin',
        verified: true,
        status: 'active',
    },
    {
        id: '2',
        avatar: 'https://i.pravatar.cc/150?img=2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        company: 'Google LLC',
        role: 'Editor',
        verified: true,
        status: 'active',
    },
    {
        id: '3',
        avatar: 'https://i.pravatar.cc/150?img=3',
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        company: 'Microsoft Corp',
        role: 'User',
        verified: false,
        status: 'banned',
    },
    {
        id: '4',
        avatar: 'https://i.pravatar.cc/150?img=4',
        name: 'Sarah Williams',
        email: 'sarah.williams@example.com',
        company: 'Amazon Inc.',
        role: 'User',
        verified: true,
        status: 'active',
    },
    {
        id: '5',
        avatar: 'https://i.pravatar.cc/150?img=5',
        name: 'David Brown',
        email: 'david.brown@example.com',
        company: 'Tesla Motors',
        role: 'Editor',
        verified: true,
        status: 'active',
    },
    {
        id: '6',
        avatar: 'https://i.pravatar.cc/150?img=6',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        company: 'Netflix Inc.',
        role: 'User',
        verified: false,
        status: 'banned',
    },
    {
        id: '7',
        avatar: 'https://i.pravatar.cc/150?img=7',
        name: 'Robert Wilson',
        email: 'robert.wilson@example.com',
        company: 'Facebook Inc.',
        role: 'Admin',
        verified: true,
        status: 'active',
    },
    {
        id: '8',
        avatar: 'https://i.pravatar.cc/150?img=8',
        name: 'Lisa Taylor',
        email: 'lisa.taylor@example.com',
        company: 'Twitter Inc.',
        role: 'User',
        verified: true,
        status: 'active',
    },
];

export default function Users() {
    const [users, setUsers] = useState(mockUsers);
    const [userFormOpen, setUserFormOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(undefined);
    const { toast } = useToast();

    const handleNewUser = () => {
        setSelectedUser(undefined);
        setUserFormOpen(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setUserFormOpen(true);
    };

    const handleDeleteUser = (user) => {
        setSelectedUser(user);
        setDeleteModalOpen(true);
    };

    const handleUserFormSubmit = (userData) => {
        if (selectedUser) {
            // Edit user
            setUsers(users.map(user =>
                user.id === selectedUser.id ? { ...user, ...userData } : user
            ));
            toast({
                title: "User updated",
                description: `${userData.name} has been updated successfully.`,
            });
        } else {
            // Create new user
            const newUser = {
                id: String(Date.now()),
                ...userData,
            };

            setUsers([newUser, ...users]);
            toast({
                title: "User created",
                description: `${userData.name} has been added successfully.`,
            });
        }

        setUserFormOpen(false);
    };

    const handleConfirmDelete = () => {
        if (selectedUser) {
            setUsers(users.filter(user => user.id !== selectedUser.id));
            toast({
                title: "User deleted",
                description: `${selectedUser.name} has been deleted.`,
                variant: "destructive",
            });
            setDeleteModalOpen(false);
        }
    };

    return (
        <Layout>
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 animate-fade-in">User Management</h1>
            </div>

            <div className="animate-fade-in">
                <UsersTable
                    users={users}
                    onNewUser={handleNewUser}
                    onEditUser={handleEditUser}
                    onDeleteUser={handleDeleteUser}
                />
            </div>

            <UserFormModal
                open={userFormOpen}
                onClose={() => setUserFormOpen(false)}
                onSubmit={handleUserFormSubmit}
                user={selectedUser}
            />

            <DeleteUserModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                user={selectedUser}
            />
        </Layout>
    );
} 