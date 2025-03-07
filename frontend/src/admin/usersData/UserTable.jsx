import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../../ui/Table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../ui/DropDownMenu';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import {
    CheckCircle2,
    XCircle,
    MoreHorizontal,
    Search,
    Filter,
    UserPlus
} from 'lucide-react';
import { cn } from '../../lib/util';

export function UsersTable({ users: initialUsers, onNewUser, onEditUser, onDeleteUser }) {
    const [users, setUsers] = useState(initialUsers || []);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    // Filter users based on search term and filter
    const filteredUsers = users.filter(user => {
        // Search filter
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase());

        // Status filter
        const matchesFilter =
            filter === 'all' ||
            (filter === 'active' && user.status === 'active') ||
            (filter === 'banned' && user.status === 'banned') ||
            (filter === 'verified' && user.verified) ||
            (filter === 'unverified' && !user.verified);

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-elevation-2 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
                <div className="relative w-full md:w-auto md:flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Search users..."
                        className="pl-10 h-10 bg-gray-50 focus:bg-white transition-all w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-10">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setFilter('all')}>
                                All Users
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter('active')}>
                                Active Users
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter('banned')}>
                                Banned Users
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter('verified')}>
                                Verified Users
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilter('unverified')}>
                                Unverified Users
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        className="h-10 bg-blue hover:bg-blue-dark transition-colors"
                        onClick={onNewUser}
                    >
                        <UserPlus className="h-4 w-4 mr-2" />
                        New User
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                            <TableHead className="w-12">Profile</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">Company</TableHead>
                            <TableHead className="hidden md:table-cell">Role</TableHead>
                            <TableHead className="hidden md:table-cell">Verified</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-12 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <TableCell>
                                        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-sm text-gray-500 md:hidden">{user.company}</div>
                                        <div className="text-xs text-gray-400">{user.email}</div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{user.company}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100">
                                            {user.role}
                                        </span>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {user.verified ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-gray-300" />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "px-2 py-1 rounded-full text-xs font-medium",
                                            user.status === 'active' ? 'bg-green-light text-green-dark' : 'bg-red-light text-red-dark'
                                        )}>
                                            {user.status === 'active' ? 'Active' : 'Banned'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onEditUser(user)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => onDeleteUser(user)}
                                                    className="text-red-500"
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <Search className="h-8 w-8 mb-2 text-gray-300" />
                                        <p>No users found</p>
                                        <p className="text-sm">Try adjusting your search or filter</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
} 