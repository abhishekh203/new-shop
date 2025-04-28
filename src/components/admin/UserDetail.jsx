import { useContext, useState, useEffect } from "react";
import myContext from "../../context/myContext";
import { 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiUser,
  FiMail,
  FiKey,
  FiCalendar,
  FiCheck,
  FiX,
  FiPlus,
  FiFilter,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiMenu,
  FiChevronRight
} from "react-icons/fi";
import { format } from "date-fns";

const UserDetail = () => {
  const context = useContext(myContext);
  const { getAllUser, deleteUser, updateUserRole } = context;
  
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedRole, setEditedRole] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [roleFilter, setRoleFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Filter and sort users
  useEffect(() => {
    setIsLoading(true);
    let result = [...getAllUser];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.uid.toLowerCase().includes(term)
      );
    }
    
    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredUsers(result);
    setIsLoading(false);
  }, [getAllUser, searchTerm, sortConfig, roleFilter]);

  // Toggle user details expansion
  const toggleExpand = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  // Handle role edit
  const handleEditClick = (user) => {
    setEditingUserId(user.uid);
    setEditedRole(user.role);
  };

  // Save edited role
  const handleRoleSave = async (uid) => {
    try {
      await updateUserRole(uid, editedRole);
      setEditingUserId(null);
    } catch (error) {
      console.error("Failed to update user role:", error);
    }
  };

  // Handle user selection
  const toggleUserSelection = (uid) => {
    setSelectedUsers(prev => 
      prev.includes(uid) 
        ? prev.filter(id => id !== uid) 
        : [...prev, uid]
    );
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      if (userToDelete) {
        await deleteUser(userToDelete);
      } else if (selectedUsers.length > 0) {
        await Promise.all(selectedUsers.map(uid => deleteUser(uid)));
        setSelectedUsers([]);
      }
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-10 bg-white shadow-sm p-3 flex items-center justify-between">
        <button 
          onClick={() => setShowMobileSidebar(true)}
          className="p-2 rounded-md text-gray-600"
        >
          <FiMenu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">User Management</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {/* Mobile Sidebar */}
      {showMobileSidebar && (
        <div className="md:hidden fixed inset-0 z-20 bg-black bg-opacity-50">
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Filters</h2>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              
              <button 
                onClick={() => {
                  setRoleFilter("all");
                  setSearchTerm("");
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm flex items-center justify-center"
              >
                <FiRefreshCw className="mr-2" />
                Reset Filters
              </button>
              
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="w-full mt-4 px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-3 md:p-6">
        {/* Desktop Header */}
        <div className="hidden md:flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">User Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              {selectedUsers.length > 0 && ` • ${selectedUsers.length} selected`}
            </p>
          </div>
          
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FiFilter className="mr-2" />
              Filters
            </button>
            
            <div className="relative flex-1 md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Desktop Filters Panel */}
        {showFilters && (
          <div className="hidden md:block mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button 
                  onClick={() => {
                    setRoleFilter("all");
                    setSearchTerm("");
                  }}
                  className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 flex items-center"
                >
                  <FiRefreshCw className="mr-1" />
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Search */}
        <div className="md:hidden mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Mobile Status */}
        <div className="md:hidden mb-3 text-sm text-gray-500">
          {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
          {selectedUsers.length > 0 && ` • ${selectedUsers.length} selected`}
        </div>

        {/* Users List - Mobile */}
        <div className="md:hidden space-y-3">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
              No users found matching your criteria
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div 
                key={user.uid} 
                className={`bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 ${selectedUsers.includes(user.uid) ? 'border-blue-300 bg-blue-50' : ''}`}
              >
                <div 
                  className="p-3 flex items-center justify-between"
                  onClick={() => toggleExpand(user.uid)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                    {expandedUserId === user.uid ? (
                      <FiChevronUp className="text-gray-400" />
                    ) : (
                      <FiChevronDown className="text-gray-400" />
                    )}
                  </div>
                </div>
                
                {/* Expanded User Details - Mobile */}
                {expandedUserId === user.uid && (
                  <div className="border-t border-gray-200 p-3">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">User ID</p>
                          <p className="text-xs text-gray-900 font-mono truncate">{user.uid}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Registered</p>
                          <p className="text-xs text-gray-900">{formatDate(user.date)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Status</p>
                          <p className="text-xs text-gray-900">
                            <span className={`px-1.5 py-0.5 rounded-full ${
                              user.emailVerified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.emailVerified ? 'Verified' : 'Unverified'}
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(user);
                          }}
                          className="flex-1 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-md flex items-center justify-center"
                        >
                          <FiEdit className="mr-1" size={14} />
                          Edit Role
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUserToDelete(user.uid);
                            setShowDeleteModal(true);
                          }}
                          className="flex-1 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded-md flex items-center justify-center"
                        >
                          <FiTrash2 className="mr-1" size={14} />
                          Delete
                        </button>
                      </div>
                      
                      {editingUserId === user.uid && (
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="flex items-center space-x-2 mb-2">
                            <select
                              value={editedRole}
                              onChange={(e) => setEditedRole(e.target.value)}
                              className="flex-1 bg-white border border-gray-300 text-gray-700 text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRoleSave(user.uid);
                              }}
                              className="p-1 text-green-600 hover:text-green-800"
                            >
                              <FiCheck size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingUserId(null);
                              }}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <FiX size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {user.address && (
                        <div className="border-t border-gray-200 pt-3">
                          <h4 className="text-xs font-medium text-gray-500 mb-1 flex items-center">
                            <FiMapPin className="mr-1" size={12} />
                            Address
                          </h4>
                          <div className="text-xs text-gray-900 space-y-1">
                            <p>{user.address.street}</p>
                            <p>{user.address.city}, {user.address.state}</p>
                            <p>{user.address.country} - {user.address.zipCode}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Desktop Users Table */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="w-12 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                      onChange={() => {
                        if (selectedUsers.length === filteredUsers.length) {
                          setSelectedUsers([]);
                        } else {
                          setSelectedUsers(filteredUsers.map(user => user.uid));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FiUser className="mr-2" />
                      Name
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FiMail className="mr-2" />
                      Email
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FiKey className="mr-2" />
                      User ID
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2" />
                      Registered
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No users found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <>
                      <tr 
                        key={user.uid} 
                        className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedUsers.includes(user.uid) ? 'bg-blue-50' : ''}`}
                        onClick={() => toggleExpand(user.uid)}
                      >
                        <td className="px-4 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.uid)}
                            onChange={() => toggleUserSelection(user.uid)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 font-mono">
                            {user.uid.slice(0, 8)}...
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {editingUserId === user.uid ? (
                            <div className="flex items-center space-x-2">
                              <select
                                value={editedRole}
                                onChange={(e) => setEditedRole(e.target.value)}
                                className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRoleSave(user.uid);
                                }}
                                className="text-green-600 hover:text-green-800"
                              >
                                <FiCheck />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingUserId(null);
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                <FiX />
                              </button>
                            </div>
                          ) : (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.date)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end items-center space-x-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(user);
                              }}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Edit role"
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setUserToDelete(user.uid);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Delete user"
                            >
                              <FiTrash2 />
                            </button>
                            <span className="text-gray-400">
                              {expandedUserId === user.uid ? (
                                <FiChevronUp className="h-5 w-5" />
                              ) : (
                                <FiChevronDown className="h-5 w-5" />
                              )}
                            </span>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded User Details */}
                      {expandedUserId === user.uid && (
                        <tr className="bg-gray-50">
                          <td colSpan="7" className="px-4 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                                    <FiUser className="mr-2" />
                                    Personal Information
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-xs text-gray-500">Full Name</p>
                                      <p className="text-sm text-gray-900">{user.name}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Email</p>
                                      <p className="text-sm text-gray-900">{user.email}</p>
                                    </div>
                                    {user.phone && (
                                      <div>
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <p className="text-sm text-gray-900 flex items-center">
                                          <FiPhone className="mr-1" size={14} />
                                          {user.phone}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                                    <FiKey className="mr-2" />
                                    Account Details
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-xs text-gray-500">User ID</p>
                                      <p className="text-sm text-gray-900 font-mono">{user.uid}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Account Created</p>
                                      <p className="text-sm text-gray-900">{format(new Date(user.date), 'PPpp')}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Status</p>
                                      <p className="text-sm text-gray-900">
                                        <span className={`px-2 py-1 rounded-full ${
                                          user.emailVerified 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                          {user.emailVerified ? 'Verified' : 'Unverified'}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                {user.address && (
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                                      <FiMapPin className="mr-2" />
                                      Address Information
                                    </h4>
                                    <div className="text-sm text-gray-900 space-y-1">
                                      <p>{user.address.street}</p>
                                      <p>{user.address.city}, {user.address.state}</p>
                                      <p>{user.address.country} - {user.address.zipCode}</p>
                                    </div>
                                  </div>
                                )}
                                
                                {user.paymentMethods && user.paymentMethods.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                                      <FiCreditCard className="mr-2" />
                                      Payment Methods
                                    </h4>
                                    <div className="space-y-2">
                                      {user.paymentMethods.map((method, index) => (
                                        <div key={index} className="flex items-center space-x-3 p-2 bg-gray-100 rounded-md">
                                          <div className="text-sm">
                                            <p className="font-medium">{method.cardType} ending in {method.last4}</p>
                                            <p className="text-xs text-gray-500">Expires {method.expMonth}/{method.expYear}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {userToDelete 
                ? "Are you sure you want to delete this user? This action cannot be undone."
                : `Are you sure you want to delete ${selectedUsers.length} selected user${selectedUsers.length !== 1 ? 's' : ''}? This action cannot be undone.`}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;