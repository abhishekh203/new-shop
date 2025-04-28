import { useContext, useState } from "react";
import myContext from "../../context/myContext";
import { FiTrash2, FiEdit, FiSearch, FiFilter, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { format } from "date-fns";

const OrderDetail = () => {
  const context = useContext(myContext);
  const { getAllOrder, orderDelete } = context;
  
  // State management
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: ""
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Toggle order details expansion
  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Handle status change
  const handleStatusChange = (orderId, status) => {
    setSelectedStatus(prev => ({ ...prev, [orderId]: status }));
    // API call to update status would go here
  };

  // Format date
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  // Filter functions
  const filterOrdersByStatus = (orders) => {
    if (statusFilter === "all") return orders;
    return orders.filter(order => order.status === statusFilter);
  };

  const filterOrdersByDate = (orders) => {
    if (!dateFilter.startDate || !dateFilter.endDate) return orders;
    const start = new Date(dateFilter.startDate);
    const end = new Date(dateFilter.endDate);
    return orders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= start && orderDate <= end;
    });
  };

  const filterOrdersBySearch = (orders) => {
    if (!searchQuery) return orders;
    const query = searchQuery.toLowerCase();
    return orders.filter(order => 
      order.id.toLowerCase().includes(query) ||
      order.addressInfo.name.toLowerCase().includes(query) ||
      order.email.toLowerCase().includes(query) ||
      order.addressInfo.mobileNumber.includes(query)
    );
  };

  // Apply all filters
  const filteredOrders = filterOrdersBySearch(
    filterOrdersByDate(
      filterOrdersByStatus(getAllOrder)
    )
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-10 bg-white shadow-sm p-3 flex items-center justify-between">
        <button 
          onClick={() => setShowMobileMenu(true)}
          className="p-2 rounded-md text-gray-600"
        >
          <FiFilter className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Orders</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {/* Mobile Filter Menu */}
      {showMobileMenu && (
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
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={dateFilter.startDate}
                    onChange={(e) => setDateFilter({...dateFilter, startDate: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-transparent text-sm"
                  />
                  <input
                    type="date"
                    value={dateFilter.endDate}
                    onChange={(e) => setDateFilter({...dateFilter, endDate: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              
              <button
                onClick={() => setShowMobileMenu(false)}
                className="w-full mt-4 px-3 py-2 bg-pink-600 text-white rounded-md text-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-3 md:p-6">
        {/* Desktop Header */}
        <div className="hidden md:flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-0">
            Order Management
          </h1>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
            {/* Date Filter */}
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <input
                type="date"
                value={dateFilter.startDate}
                onChange={(e) => setDateFilter({...dateFilter, startDate: e.target.value})}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 w-full md:w-auto"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={dateFilter.endDate}
                onChange={(e) => setDateFilter({...dateFilter, endDate: e.target.value})}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 w-full md:w-auto"
              />
            </div>

            {/* Status Filter */}
            <div className="relative w-full md:w-auto">
              <select
                className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent w-full"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search orders..."
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent w-full md:w-auto"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="border-b border-gray-200 last:border-b-0">
                {/* Order Summary - Clickable Area */}
                <div 
                  className="p-4 flex flex-col hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  onClick={() => toggleExpand(order.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-semibold text-gray-900 truncate">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {order.cartItems.length} items • {formatDate(order.date)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        ₹{order.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                      </span>
                      {expandedOrder === order.id ? (
                        <FiChevronUp className="text-gray-400" />
                      ) : (
                        <FiChevronDown className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {expandedOrder === order.id && (
                  <div className="bg-gray-50 px-4 py-4 border-t border-gray-200">
                    <div className="space-y-4">
                      {/* Customer Info */}
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 mb-1">CUSTOMER</h4>
                        <p className="text-sm font-medium text-gray-900">{order.addressInfo.name}</p>
                        <p className="text-xs text-gray-500">{order.email}</p>
                        <p className="text-xs text-gray-500">{order.addressInfo.mobileNumber}</p>
                      </div>
                      
                      {/* Shipping Address */}
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 mb-1">SHIPPING ADDRESS</h4>
                        <p className="text-xs text-gray-900">{order.addressInfo.address}</p>
                        <p className="text-xs text-gray-900">{order.addressInfo.pincode}</p>
                      </div>
                      
                      {/* Status Update */}
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 mb-1">UPDATE STATUS</h4>
                        <select
                          value={selectedStatus[order.id] || order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-transparent text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      
                      {/* Order Items */}
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 mb-2">ORDER ITEMS</h4>
                        <div className="space-y-3">
                          {order.cartItems.map((item, index) => (
                            <div key={index} className="flex items-start space-x-3 p-2 bg-white rounded-md shadow-xs">
                              <img 
                                className="h-12 w-12 rounded-md object-cover" 
                                src={item.productImageUrl} 
                                alt={item.title} 
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                                <p className="text-xs text-gray-500">{item.category}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">₹{item.price}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Order Total */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between py-1 text-sm text-gray-600">
                          <span>Subtotal</span>
                          <span className="font-medium text-gray-900">
                            ₹{order.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 text-sm text-gray-600">
                          <span>Shipping</span>
                          <span className="font-medium text-gray-900">₹0</span>
                        </div>
                        <div className="flex justify-between py-1 text-sm text-gray-600">
                          <span>Tax</span>
                          <span className="font-medium text-gray-900">₹0</span>
                        </div>
                        <div className="flex justify-between py-2 text-base font-medium text-gray-900 border-t border-gray-200 mt-1">
                          <span>Total</span>
                          <span>
                            ₹{order.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex space-x-2 pt-4">
                        <button
                          onClick={() => orderDelete(order.id)}
                          className="flex-1 px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 flex items-center justify-center"
                        >
                          <FiTrash2 className="mr-2 h-4 w-4" />
                          Delete
                        </button>
                        <button className="flex-1 px-3 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center">
                          <FiEdit className="mr-2 h-4 w-4" />
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">No orders found matching your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;