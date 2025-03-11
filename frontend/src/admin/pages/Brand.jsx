import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:7000/api/admin/products';

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandToToggle, setBrandToToggle] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBrands, setFilteredBrands] = useState([]);

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (brands.length > 0) {
      const filtered = brands
        .filter(brand =>
          brand.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setFilteredBrands(filtered);
    }
  }, [brands, searchQuery]);

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/brands`);
      setBrands(response.data);
    } catch (error) {
      toast.error('Failed to fetch brands');
    }
  };

  // Modal functions
  function closeModal() {
    setIsOpen(false);
    setSelectedBrand(null);
  }

  function openModal(brand) {
    setSelectedBrand(brand);
    setUpdatedName(brand.name);
    setIsOpen(true);
  }

  function closeAddModal() {
    setIsAddOpen(false);
    setNewBrand("");
  }

  function openAddModal() {
    setIsAddOpen(true);
  }

  function closeConfirmModal() {
    setIsConfirmOpen(false);
    setBrandToToggle(null);
  }

  function openConfirmModal(brand) {
    setBrandToToggle(brand);
    setIsConfirmOpen(true);
  }

  // Update Brand
  const handleUpdateBrand = async () => {
    if (!selectedBrand || updatedName.trim() === "") return;

    try {
      const response = await axios.put(
        `${API_BASE_URL}/brand/${selectedBrand._id}`,
        { name: updatedName }
      );

      setBrands(prevBrands =>
        prevBrands.map(brand =>
          brand._id === selectedBrand._id
            ? { ...brand, name: response.data.name }
            : brand
        )
      );

      toast.success('Brand updated successfully');
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update brand');
    }
  };

  // Add New Brand
  const handleAddBrand = async () => {
    if (newBrand.trim() === "") return;

    try {
      const response = await axios.post(`${API_BASE_URL}/brand/add`, {
        name: newBrand
      });

      setBrands(prevBrands => [...prevBrands, response.data]);
      toast.success('Brand added successfully');
      closeAddModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add brand');
    }
  };

  // Handle Status Change
  const handleStatusChange = async (brandId, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/brand/${brandId}/status`, {
        status: newStatus
      });

      setBrands(prevBrands =>
        prevBrands.map(brand =>
          brand._id === brandId ? { ...brand, status: newStatus } : brand
        )
      );
      toast.success('Brand status updated successfully');
      closeConfirmModal();
    } catch (error) {
      toast.error('Failed to update brand status');
    }
  };

  return (
    <div className={`container mx-auto p-6 ${isOpen || isAddOpen || isConfirmOpen ? "backdrop-blur-sm" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-800">Brand Management</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
            onClick={openAddModal}
          >
            + Add Brand
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 text-left">Brand</th>
              <th className="p-3 text-left">Created At</th>
              <th className="p-3 text-center">Edit</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map((brand) => (
              <tr key={brand._id} className="border-b border-gray-300">
                <td className="p-3">{brand.name}</td>
                <td className="p-3">
                  {new Date(brand.createdAt).toLocaleString()}
                </td>
                <td className="p-3 text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    onClick={() => openModal(brand)}
                  >
                    Edit
                  </button>
                </td>
                <td className="p-3 text-center">
                  <button
                    className={`${brand.status === 'listed'
                      ? 'bg-red-500 hover:bg-red-700'
                      : 'bg-green-500 hover:bg-green-700'
                      } text-white px-4 py-2 rounded`}
                    onClick={() => openConfirmModal(brand)}
                  >
                    {brand.status === 'listed' ? 'Block' : 'Unblock'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Brand Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="absolute inset-0 flex items-center justify-center p-4" onClose={closeModal}>
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-96">
            <Dialog.Title className="text-lg font-bold text-gray-700">
              Edit Brand
            </Dialog.Title>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-600">
                Brand Name
              </label>
              <input
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                onClick={handleUpdateBrand}
              >
                Update
              </button>
            </div>
          </Dialog.Panel>
        </Dialog>
      </Transition>

      {/* Add Brand Modal */}
      <Transition appear show={isAddOpen} as={Fragment}>
        <Dialog as="div" className="absolute inset-0 flex items-center justify-center p-4" onClose={closeAddModal}>
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-96">
            <Dialog.Title className="text-lg font-bold text-gray-700">
              Add New Brand
            </Dialog.Title>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-600">
                Brand Name
              </label>
              <input
                type="text"
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:ring-green-300"
                placeholder="Enter Brand name"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                onClick={closeAddModal}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleAddBrand}
              >
                Add Brand
              </button>
            </div>
          </Dialog.Panel>
        </Dialog>
      </Transition>

      {/* Confirmation Modal */}
      <Transition appear show={isConfirmOpen} as={Fragment}>
        <Dialog as="div" className="absolute inset-0 flex items-center justify-center p-4" onClose={closeConfirmModal}>
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-96">
            <Dialog.Title className="text-lg font-bold text-gray-700">
              Confirm Status Change
            </Dialog.Title>
            <div className="mt-3">
              <p className="text-gray-600">
                Are you sure you want to {brandToToggle?.status === 'listed' ? 'block' : 'unblock'} the brand "{brandToToggle?.name}"?
              </p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                onClick={closeConfirmModal}
              >
                Cancel
              </button>
              <button
                className={`${brandToToggle?.status === 'listed' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white px-4 py-2 rounded`}
                onClick={() => handleStatusChange(
                  brandToToggle?._id,
                  brandToToggle?.status === 'listed' ? 'Not listed' : 'listed'
                )}
              >
                {brandToToggle?.status === 'listed' ? 'Block' : 'Unblock'}
              </button>
            </div>
          </Dialog.Panel>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Brand;
