import React, { useContext, useState, useEffect, useMemo } from "react";
import myContext from "../../context/myContext"; // Assuming context path is correct
import Loader from "../loader/Loader"; // Assuming Loader path is correct
import { deleteDoc, doc, updateDoc } from "firebase/firestore"; // Added updateDoc
import { fireDB } from "../../firebase/FirebaseConfig"; // Assuming Firebase config path is correct
import toast from "react-hot-toast"; // Using react-hot-toast
import {
    FiSearch, FiEdit, FiTrash2, FiUser, FiMail, FiKey, FiCalendar, FiCheck,
    FiX, FiFilter, FiRefreshCw, FiChevronDown, FiChevronUp, FiAlertCircle, FiUsers
} from "react-icons/fi"; // Added FiUsers, FiAlertCircle
import { format } from "date-fns"; // For date formatting
import { motion, AnimatePresence } from "framer-motion";

// --- Animation Variants ---
const pageContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
};

const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }, // Faster stagger
};

const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2, ease: "easeIn" } }
};

const expandVariants = {
    hidden: { opacity: 0, height: 0, y: -10 }, // Start slightly higher
    visible: { opacity: 1, height: "auto", y: 0, transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] } },
    exit: { opacity: 0, height: 0, y: -10, transition: { duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] } }
};

const filterVariants = {
    hidden: { opacity: 0, height: 0, y: -10 },
    visible: { opacity: 1, height: "auto", y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, height: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } }
};

const modalOverlayVariants = {
    initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 },
};
const modalContentVariants = {
    initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.9, opacity: 0 },
    transition: { type: "spring", damping: 15, stiffness: 200 }
};

// --- Helper Functions ---
const formatDate = (dateInput) => {
    const date = dateInput?.seconds ? new Date(dateInput.seconds * 1000) : new Date(dateInput);
    if (isNaN(date)) return "Invalid Date";
    return format(date, 'MMM d, yyyy'); // Format: Jan 5, 2024
};

const getRoleColorClasses = (role) => {
    switch (role?.toLowerCase()) {
        case 'admin': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
        case 'user': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
        default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
};

// --- Component ---
const UserDetail = () => {
    const context = useContext(myContext);
    // Use setLoading from context if provided, otherwise manage locally
    const { loading: contextLoading, setLoading: contextSetLoading, getAllUser, getAllUserFunction } = context; // Renamed to avoid conflict

    // Local loading state if context doesn't provide setLoading
    const [internalLoading, setInternalLoading] = useState(false);
    const isLoading = contextLoading ?? internalLoading; // Use context loading if available
    const setLoading = contextSetLoading ?? setInternalLoading; // Use context setLoading if available

    // State management
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" }); // Default sort by date desc
    const [editingUserId, setEditingUserId] = useState(null); // Track which user's role is being edited
    const [editedRole, setEditedRole] = useState(""); // Temp storage for the role being edited
    const [selectedUsers, setSelectedUsers] = useState([]); // For bulk actions
    const [showFilters, setShowFilters] = useState(false); // Toggle filter visibility
    const [roleFilter, setRoleFilter] = useState("all"); // Role filter dropdown
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete confirmation modal visibility
    const [userToDelete, setUserToDelete] = useState(null); // Single user ID for deletion modal
    const [expandedUserId, setExpandedUserId] = useState(null); // For expanding user details on mobile

    // Update user role in Firestore
    const updateUserRole = async (uid, newRole) => {
        setLoading(true);
        try {
            const userRef = doc(fireDB, "users", uid); // Assuming collection name is 'users'
            await updateDoc(userRef, { role: newRole });
            toast.success(`User role updated to ${newRole}`);
            getAllUserFunction(); // Refresh user list from context/backend
        } catch (error) {
            console.error("Error updating user role: ", error);
            toast.error("Failed to update user role.");
            throw error; // Re-throw error to handle in calling function if needed
        } finally {
            setLoading(false);
        }
    };

    // Delete user function (now uses context's getAllUserFunction)
    const deleteUser = async (uid) => {
        // Note: setLoading is handled within the confirmation modal's confirmDelete function
        try {
            await deleteDoc(doc(fireDB, "users", uid)); // Assuming collection name is 'users'
            toast.success(`User ${uid.slice(0,6)}... deleted successfully`);
            getAllUserFunction(); // Refresh list
        } catch (error) {
            console.error("Error deleting user: ", error);
            toast.error("Failed to delete user.");
            throw error; // Re-throw to handle in confirmation modal
        }
    };


    // Memoized filtering and sorting logic
    const filteredAndSortedUsers = useMemo(() => {
        let result = [...getAllUser];

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase().trim();
            result = result.filter(user =>
                user.name?.toLowerCase().includes(term) ||
                user.email?.toLowerCase().includes(term) ||
                user.uid?.toLowerCase().includes(term)
            );
        }

        // Apply role filter
        if (roleFilter !== "all") {
            result = result.filter(user => user.role === roleFilter);
        }

        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle date sorting (assuming 'date' is a Firestore Timestamp or parsable string)
                if (sortConfig.key === 'date') {
                    aValue = aValue?.seconds ? aValue.seconds : new Date(aValue).getTime();
                    bValue = bValue?.seconds ? bValue.seconds : new Date(bValue).getTime();
                } else {
                    // Default string comparison
                    aValue = String(aValue || '').toLowerCase();
                    bValue = String(bValue || '').toLowerCase();
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [getAllUser, searchTerm, sortConfig, roleFilter]);

    // Toggle user details expansion (for mobile cards)
    const toggleExpand = (userId) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    // Handle column header click for sorting
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Get appropriate sort icon for table headers
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <FiChevronDown className="ml-1 h-3 w-3 text-gray-500 opacity-40" />;
        return sortConfig.direction === 'asc'
            ? <FiChevronUp className="ml-1 h-3 w-3 text-blue-400" />
            : <FiChevronDown className="ml-1 h-3 w-3 text-blue-400" />;
    };

    // Handle role edit button click
    const handleEditClick = (user) => {
        setEditingUserId(user.uid);
        setEditedRole(user.role);
    };

    // Save edited role
    const handleRoleSave = async (uid) => {
        if (editedRole === getAllUser.find(u => u.uid === uid)?.role) { // Avoid saving if role hasn't changed
            setEditingUserId(null);
            return;
        }
        try {
            await updateUserRole(uid, editedRole); // Call the async update function
            setEditingUserId(null); // Exit edit mode on success
        } catch (error) {
            // Error handled within updateUserRole via toast
        }
    };

    // Handle user selection checkbox toggle
    const toggleUserSelection = (uid) => {
        setSelectedUsers(prev =>
            prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
        );
    };

    // Handle select/deselect all users checkbox toggle
    const handleSelectAll = () => {
         if (selectedUsers.length === filteredAndSortedUsers.length) {
             setSelectedUsers([]); // Deselect all if all are selected
         } else {
             setSelectedUsers(filteredAndSortedUsers.map(user => user.uid)); // Select all filtered users
         }
    };

    // Open delete confirmation modal
    const openDeleteModal = (uid = null) => {
        setUserToDelete(uid); // Set single user ID or null (for bulk delete)
        setShowDeleteModal(true);
    };

    // Confirm and execute deletion
    const confirmDelete = async () => {
        setLoading(true);
        try {
            if (userToDelete) { // Single user deletion
                await deleteUser(userToDelete);
            } else if (selectedUsers.length > 0) { // Bulk deletion
                await Promise.all(selectedUsers.map(uid => deleteUser(uid)));
                setSelectedUsers([]); // Clear selection after bulk delete
            }
        } catch (error) {
             // Error is handled within deleteUser via toast
        } finally {
            setShowDeleteModal(false);
            setUserToDelete(null);
            setLoading(false);
        }
    };

    // Reset filters to default state
    const resetFilters = () => {
        setSearchTerm("");
        setRoleFilter("all");
        setSortConfig({ key: "date", direction: "desc" });
        // Optionally close filter section: setShowFilters(false);
    };

    // --- JSX Structure ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 p-4 md:p-8 text-gray-200 font-sans">
            {/* Loading Overlay */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"> <Loader /> </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="max-w-7xl mx-auto"
                variants={pageContainerVariants} initial="hidden" animate="visible"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-1 flex items-center gap-2">
                           <FiUsers/> User Management
                        </h1>
                        <p className="text-sm text-gray-400">
                            {filteredAndSortedUsers.length} user{filteredAndSortedUsers.length !== 1 ? 's' : ''} found
                            {selectedUsers.length > 0 && ` • ${selectedUsers.length} selected`}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* Filter Toggle Button */}
                        <motion.button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg text-sm transition duration-150"
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        >
                            <FiFilter className="h-4 w-4" /> Filters
                            <FiChevronDown className={`h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                        </motion.button>
                         {/* Bulk Delete Button (conditional) */}
                         <AnimatePresence>
                            {selectedUsers.length > 0 && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={() => openDeleteModal(null)} // Pass null for bulk delete
                                    className="flex items-center gap-1.5 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 rounded-lg text-sm transition duration-150"
                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                >
                                    <FiTrash2 className="h-4 w-4" /> Delete ({selectedUsers.length})
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Collapsible Filter Section */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            variants={filterVariants} initial="hidden" animate="visible" exit="exit"
                            className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700 mb-6 overflow-hidden"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
                                {/* Search Input */}
                                <div className="relative">
                                    <label htmlFor="user-search" className="block text-xs font-medium text-gray-400 mb-1">Search</label>
                                    <FiSearch className="absolute left-3 bottom-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                    <input id="user-search" type="text" placeholder="ID, Name, Email..."
                                        className="w-full pl-9 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-700/60 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-150 placeholder-gray-500"
                                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                {/* Role Select */}
                                <div>
                                    <label htmlFor="role-filter" className="block text-xs font-medium text-gray-400 mb-1">Role</label>
                                    <select id="role-filter"
                                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700/60 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-150 appearance-none pr-8 bg-no-repeat bg-right cursor-pointer"
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.2em 1.2em' }}
                                        value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
                                    >
                                        <option value="all" className="bg-gray-800">All Roles</option>
                                        <option value="admin" className="bg-gray-800">Admin</option>
                                        <option value="user" className="bg-gray-800">User</option>
                                    </select>
                                </div>
                                {/* Reset Button */}
                                <button
                                    onClick={resetFilters}
                                    className="self-end px-3 py-2 text-sm text-indigo-400 hover:text-indigo-300 transition duration-150 text-center border border-indigo-500/30 rounded-lg hover:bg-indigo-500/10 h-[42px] flex items-center justify-center gap-1.5" // Match height
                                > <FiRefreshCw className="h-4 w-4" /> Reset </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* User Display Area */}
                <div className="bg-gray-900/70 backdrop-blur-md rounded-xl shadow-lg border border-gray-700/50 overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <motion.table className="min-w-full divide-y divide-gray-700" variants={listVariants} initial="hidden" animate="visible">
                            <thead className="bg-gray-800/50 sticky top-0 z-10">
                                <tr>
                                    <th scope="col" className="w-12 px-4 py-3 text-left">
                                        <input type="checkbox"
                                            checked={selectedUsers.length > 0 && selectedUsers.length === filteredAndSortedUsers.length}
                                            onChange={handleSelectAll}
                                            className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-600 rounded bg-gray-700 cursor-pointer"
                                        />
                                    </th>
                                    {/* Table Headers with Sorting */}
                                    {[ { label: 'Name', key: 'name', icon: FiUser }, { label: 'Email', key: 'email', icon: FiMail }, { label: 'User ID', key: 'uid', icon: FiKey }, { label: 'Role', key: 'role', icon: null }, { label: 'Registered', key: 'date', icon: FiCalendar } ].map(header => (
                                        <th key={header.key} scope="col"
                                            className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-700/50 transition-colors"
                                            onClick={() => requestSort(header.key)}
                                        >
                                            <div className="flex items-center">
                                                {header.icon && <header.icon className="mr-1.5 h-3.5 w-3.5 text-gray-500" />}
                                                {header.label}
                                                {getSortIcon(header.key)}
                                            </div>
                                        </th>
                                    ))}
                                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/70">
                                <AnimatePresence>
                                    {filteredAndSortedUsers.length > 0 ? (
                                        filteredAndSortedUsers.map((user) => (
                                            <motion.tr
                                                key={user.uid}
                                                variants={itemVariants} layout // Apply item animation and layout animation
                                                className={`hover:bg-gray-800/40 transition-colors ${selectedUsers.includes(user.uid) ? 'bg-blue-900/20' : ''}`}
                                            >
                                                <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                                    <input type="checkbox"
                                                        checked={selectedUsers.includes(user.uid)}
                                                        onChange={() => toggleUserSelection(user.uid)}
                                                        className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-600 rounded bg-gray-700 cursor-pointer"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className="text-sm font-medium text-gray-200">{user.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{user.email}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-500">{user.uid.slice(0, 12)}...</td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {editingUserId === user.uid ? (
                                                        <div className="flex items-center space-x-1">
                                                            <select
                                                                value={editedRole} onChange={(e) => setEditedRole(e.target.value)} onClick={(e) => e.stopPropagation()}
                                                                className="flex-1 bg-gray-700 border border-gray-600 text-gray-200 text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                            >
                                                                <option value="user" className="bg-gray-800">User</option>
                                                                <option value="admin" className="bg-gray-800">Admin</option>
                                                            </select>
                                                            <button onClick={(e) => { e.stopPropagation(); handleRoleSave(user.uid); }} className="p-1 text-green-400 hover:text-green-300"> <FiCheck size={16} /> </button>
                                                            <button onClick={(e) => { e.stopPropagation(); setEditingUserId(null); }} className="p-1 text-red-400 hover:text-red-300"> <FiX size={16} /> </button>
                                                        </div>
                                                    ) : (
                                                        <span className={`px-2.5 py-1 inline-flex text-[11px] leading-4 font-semibold rounded-full border ${getRoleColorClasses(user.role)} capitalize`}>
                                                            {user.role}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{formatDate(user.date)}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end items-center space-x-2">
                                                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); handleEditClick(user); }} className="text-blue-400 hover:text-blue-300 transition-colors p-1 rounded-full hover:bg-blue-500/10" title="Edit role"> <FiEdit className="h-4 w-4" /> </motion.button>
                                                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); openDeleteModal(user.uid); }} className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-full hover:bg-red-500/10" title="Delete user"> <FiTrash2 className="h-4 w-4" /> </motion.button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        // No Results Row
                                        <motion.tr variants={itemVariants}>
                                            <td colSpan="7" className="px-6 py-10 text-center text-sm text-gray-400">
                                                <div className="flex flex-col items-center justify-center">
                                                    <FiSearch className="h-10 w-10 text-gray-500 mb-2" /> No users found.
                                                    <button onClick={resetFilters} className="mt-2 text-sm text-indigo-400 hover:text-indigo-300"> Reset filters </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </motion.table>
                    </div>

                    {/* Mobile Card List */}
                    <div className="md:hidden p-4 space-y-4">
                         <AnimatePresence initial={false}>
                            {filteredAndSortedUsers.length > 0 ? (
                                filteredAndSortedUsers.map((user) => {
                                    const isExpanded = expandedUserId === user.uid;
                                    return (
                                        <motion.div
                                            key={user.uid} layout
                                            variants={itemVariants} initial="hidden" animate="visible" exit="exit"
                                            className={`bg-gray-800/60 rounded-lg shadow-md border border-gray-700/60 overflow-hidden ${selectedUsers.includes(user.uid) ? 'border-blue-500/50 ring-1 ring-blue-500/30' : ''}`}
                                        >
                                            <div className="p-4 flex items-start space-x-4 cursor-pointer" onClick={() => toggleExpand(user.uid)}>
                                                {/* Checkbox */}
                                                <input type="checkbox"
                                                    checked={selectedUsers.includes(user.uid)}
                                                    onChange={() => toggleUserSelection(user.uid)}
                                                    onClick={(e) => e.stopPropagation()} // Prevent expand toggle
                                                    className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-600 rounded bg-gray-700 mt-1 cursor-pointer flex-shrink-0"
                                                />
                                                {/* Avatar */}
                                                 <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                 </div>
                                                 {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-100 truncate">{user.name}</p>
                                                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                                    <span className={`mt-1.5 px-2 py-0.5 inline-flex text-[10px] leading-4 font-semibold rounded-full border ${getRoleColorClasses(user.role)} capitalize`}> {user.role} </span>
                                                </div>
                                                {/* Expand Icon */}
                                                <div className={`text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                    <FiChevronDown className="h-5 w-5" />
                                                </div>
                                            </div>
                                            {/* Expanded Mobile Content */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                     <motion.div
                                                        variants={expandVariants} initial="hidden" animate="visible" exit="exit"
                                                        className="px-4 pb-4 pt-3 border-t border-gray-700/60 overflow-hidden text-xs"
                                                    >
                                                         <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                                                            <div><p className="font-semibold text-gray-500 uppercase text-[10px]">User ID</p> <p className="text-gray-300 font-mono break-all">{user.uid}</p></div>
                                                            <div><p className="font-semibold text-gray-500 uppercase text-[10px]">Registered</p> <p className="text-gray-300">{formatDate(user.date)}</p></div>
                                                         </div>
                                                         {/* Role Edit (Mobile) */}
                                                         {editingUserId === user.uid ? (
                                                            <div className="bg-gray-700/50 p-2 rounded-md mb-3">
                                                                <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Change Role</label>
                                                                <div className="flex items-center space-x-2">
                                                                    <select
                                                                        value={editedRole} onChange={(e) => setEditedRole(e.target.value)} onClick={(e) => e.stopPropagation()}
                                                                        className="flex-1 bg-gray-600 border border-gray-500 text-gray-200 text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                    >
                                                                        <option value="user" className="bg-gray-800">User</option>
                                                                        <option value="admin" className="bg-gray-800">Admin</option>
                                                                    </select>
                                                                    <button onClick={(e) => { e.stopPropagation(); handleRoleSave(user.uid); }} className="p-1 text-green-400 hover:text-green-300"> <FiCheck size={16} /> </button>
                                                                    <button onClick={(e) => { e.stopPropagation(); setEditingUserId(null); }} className="p-1 text-red-400 hover:text-red-300"> <FiX size={16} /> </button>
                                                                </div>
                                                            </div>
                                                         ) : (
                                                            <div className="flex justify-end space-x-3">
                                                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); handleEditClick(user); }} className="text-blue-400 hover:text-blue-300 transition-colors p-1.5 rounded-full text-xs flex items-center gap-1 hover:bg-blue-500/10" title="Edit Role"> <FiEdit className="h-3.5 w-3.5" /> Edit Role </motion.button>
                                                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); openDeleteModal(user.uid); }} className="text-red-400 hover:text-red-300 transition-colors p-1.5 rounded-full text-xs flex items-center gap-1 hover:bg-red-500/10" title="Delete User"> <FiTrash2 className="h-3.5 w-3.5" /> Delete </motion.button>
                                                            </div>
                                                         )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                // No Results Card (Mobile)
                                <motion.div variants={itemVariants} initial="hidden" animate="visible" className="bg-gray-800/60 p-6 rounded-lg shadow-md text-center border border-gray-700/60">
                                    <FiSearch className="mx-auto h-10 w-10 text-gray-500 mb-3" />
                                    <h3 className="text-sm font-medium text-gray-200">No users found</h3>
                                    <p className="mt-1 text-xs text-gray-400"> Try adjusting your search or filter. </p>
                                    <button onClick={resetFilters} className="mt-3 text-xs text-indigo-400 hover:text-indigo-300"> Reset filters </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

             {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        variants={modalOverlayVariants} initial="initial" animate="animate" exit="exit"
                    >
                        <motion.div
                            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
                            variants={modalContentVariants} // Use modal variant
                        >
                            <div className="flex items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <FiAlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Confirm Deletion
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            {userToDelete
                                                ? `Are you sure you want to delete user ${getAllUser.find(u=>u.uid === userToDelete)?.name || userToDelete.slice(0,8)+ '...'}? This action cannot be undone.`
                                                : `Are you sure you want to delete ${selectedUsers.length} selected user${selectedUsers.length !== 1 ? 's' : ''}? This action cannot be undone.`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm transition-colors"
                                    onClick={confirmDelete}
                                > Delete </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
                                    onClick={() => { setShowDeleteModal(false); setUserToDelete(null); }}
                                > Cancel </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default UserDetail;
