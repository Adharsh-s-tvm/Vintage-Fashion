import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const initialCategories = [
  { id: 1, name: "Trending Wears", createdAt: "2/13/2025, 7:18:03 PM" },
  { id: 2, name: "Shoes", createdAt: "2/13/2025, 7:17:47 PM" },
  { id: 3, name: "Caps", createdAt: "2/13/2025, 7:17:40 PM" },
  { id: 4, name: "New Category", createdAt: "2/9/2025, 9:04:59 PM" },
  { id: 5, name: "Track Pants", createdAt: "2/4/2025, 1:03:56 PM" },
];

const Category = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // Open & Close Modals
  function closeModal() {
    setIsOpen(false);
    setSelectedCategory(null);
  }
  function openModal(category) {
    setSelectedCategory(category);
    setUpdatedName(category.name);
    setIsOpen(true);
  }
  function closeAddModal() {
    setIsAddOpen(false);
    setNewCategory("");
  }
  function openAddModal() {
    setIsAddOpen(true);
  }

  // Update Category
  function handleUpdateCategory() {
    setCategories(
      categories.map((cat) =>
        cat.id === selectedCategory.id ? { ...cat, name: updatedName } : cat
      )
    );
    closeModal();
  }

  // Add New Category
  function handleAddCategory() {
    if (newCategory.trim() === "") return;
    const newCat = {
      id: categories.length + 1,
      name: newCategory,
      createdAt: new Date().toLocaleString(),
    };
    setCategories([...categories, newCat]);
    closeAddModal();
  }

  return (
    <div className={`container mx-auto p-6 ${isOpen || isAddOpen ? "backdrop-blur-sm" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-800">Category Management</h2>
        <button
          className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
          onClick={openAddModal}
        >
          + Add Category
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Created At</th>
              <th className="p-3 text-center">Edit</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-gray-300">
                <td className="p-3">{category.name}</td>
                <td className="p-3">{category.createdAt}</td>
                <td className="p-3 text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    onClick={() => openModal(category)}
                  >
                    Edit
                  </button>
                </td>
                <td className="p-3 text-center">
                  <button className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded">
                    Block
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Category Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="absolute inset-0 flex items-center justify-center p-4" onClose={closeModal}>
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-96">
            <Dialog.Title className="text-lg font-bold text-gray-700">
              Edit Category
            </Dialog.Title>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-600">
                Category Name
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
                onClick={handleUpdateCategory}
              >
                Update
              </button>
            </div>
          </Dialog.Panel>
        </Dialog>
      </Transition>

      {/* Add Category Modal */}
      <Transition appear show={isAddOpen} as={Fragment}>
        <Dialog as="div" className="absolute inset-0 flex items-center justify-center p-4" onClose={closeAddModal}>
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-96">
            <Dialog.Title className="text-lg font-bold text-gray-700">
              Add New Category
            </Dialog.Title>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-600">
                Category Name
              </label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:ring-green-300"
                placeholder="Enter category name"
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
                onClick={handleAddCategory}
              >
                Add Category
              </button>
            </div>
          </Dialog.Panel>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Category;
