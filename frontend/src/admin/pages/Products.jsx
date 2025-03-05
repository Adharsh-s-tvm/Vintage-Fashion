import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { ProductsTable } from '../components/products/ProductTable';
import { CreateProductDialog } from '../components/products/CreateProductDialog.jsx';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';

function Products() {
    const [open, setOpen] = useState(false);

    return (
        <Layout>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 animate-fade-in">Products</h1>
                    <p className="text-gray-500 mt-1 animate-fade-in">Manage your product inventory</p>
                </div>
                <Button
                    onClick={() => setOpen(true)}
                    className="w-full sm:w-auto animate-fade-in"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Product
                </Button>
            </div>

            <ProductsTable />
            <CreateProductDialog open={open} onOpenChange={setOpen} />
        </Layout>
    );
}

export default Products; 