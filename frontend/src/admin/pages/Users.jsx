import React, { useState } from 'react';
import { Layout } from '../layout/Layout';
import { UsersTable } from '../usersData/UserTable';
import { UserFormModal } from '../usersData/UserFormModal';
import { DeleteUserModal } from '../usersData/DeleteUserModal';
import { useToast } from '../../hooks/useToast';




export default function Users() {
    const [users, setUsers] = useState();
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