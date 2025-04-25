"use client";
import { useState, useEffect } from "react";
import { CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Cookies from "js-cookie";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

interface CategoryItem {
  id: string;
  itemName: string;
  mrp: number;
  sellingPrice: number;
  quantity: number;
}

interface Category {
  id: string;
  name: string;
  data: CategoryItem[];
}

interface FormData {
  categoryId: string;
  itemName: string;
  mrp: string;
  sellingPrice: string;
  quantity: string;
}

export default function RawMaterials() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    categoryId: "",
    itemName: "",
    mrp: "",
    sellingPrice: "",
    quantity: "",
  });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CategoryItem | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);


  const fetchCategories = async () => {
    const token = Cookies.get("token");
    try {
      const response = await fetch('https://server.sivagroupmanpower.com/api/v1/raw-material/category', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.status === 200) {
        setCategories(result.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch categories",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      categoryId: "",
      itemName: "",
      mrp: "",
      sellingPrice: "",
      quantity: "",
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `https://server.sivagroupmanpower.com/api/v1/raw-material/category-data?categoryId=${formData.categoryId}`,
        {
          method: 'POST',
          body: JSON.stringify({
            itemName: formData.itemName,
            mrp: parseInt(formData.mrp),
            sellingPrice: parseInt(formData.sellingPrice),
            quantity: parseInt(formData.quantity),
          }),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Item uploaded successfully",
          className: 'bg-green-600 text-white'
        })
        resetForm();
        setIsAddOpen(false);
        fetchCategories();
      } else {
        toast({
          title: "Error",
          description: "Failed to add item",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: "Something went wrong while adding the item",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    const token = Cookies.get("token");
    try {
      const response = await fetch(
        `https://server.sivagroupmanpower.com/api/v1/raw-material/category-data?id=${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Item deleted successfully",
          variant: "default",
          className: 'bg-green-600 text-white'
        });
        fetchCategories();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete item",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Something went wrong while deleting the item",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: CategoryItem) => {
    setEditingItem(item);
    setFormData({
      categoryId: "",
      itemName: item.itemName,
      mrp: item.mrp.toString(),
      sellingPrice: item.sellingPrice.toString(),
      quantity: item.quantity.toString(),
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingItem) return;
    
    const token = Cookies.get("token");
    try {
      const response = await fetch(
        `https://server.sivagroupmanpower.com/api/v1/raw-material/category-data?id=${editingItem.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            itemName: formData.itemName,
            mrp: parseInt(formData.mrp),
            sellingPrice: parseInt(formData.sellingPrice),
            quantity: parseInt(formData.quantity),
          }),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Item updated successfully",
          variant: "default",
          className: 'bg-green-600 text-white'
        });
        setIsEditOpen(false);
        setEditingItem(null);
        resetForm();
        fetchCategories();
      } else {
        toast({
          title: "Error",
          description: "Failed to update item",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Something went wrong while updating the item",
        variant: "destructive",
      });
    }
  };
  

  return (
    <div className="p-12 space-y-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <CardTitle className="text-2xl font-medium">
          Raw Materials Categories
        </CardTitle>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black cursor-pointer text-white hover:bg-gray-800">
              + Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, categoryId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Item Name</label>
                <Input
                  value={formData.itemName}
                  onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                  placeholder="Enter item name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">MRP</label>
                <Input
                  type="number"
                  value={formData.mrp}
                  onChange={(e) => setFormData(prev => ({ ...prev, mrp: e.target.value }))}
                  placeholder="Enter MRP"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Selling Price</label>
                <Input
                  type="number"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, sellingPrice: e.target.value }))}
                  placeholder="Enter selling price"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="Enter quantity"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsAddOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-black text-white hover:bg-gray-800"
                  onClick={handleSubmit}
                >
                  Add Item
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category.id} className="space-y-4">
                {/* <h2 className="text-xl font-semibold border-b pb-2">{category.name}</h2> */}
                
                {category.data.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No items in this category
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.data.map((item, idx) => (
                      <Card key={item.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <h3 className="font-semibold text-lg">{item.itemName}</h3>
                              <div className="text-sm text-gray-500">Item #{idx + 1}</div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800"
                                onClick={() => handleEdit(item)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">MRP:</span>
                              <span className="font-medium">₹{item.mrp}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">Selling Price:</span>
                              <span className="font-medium text-green-600">₹{item.sellingPrice}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">Quantity:</span>
                              <span className="font-medium">{item.quantity}</span>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  item.quantity > 50
                                    ? 'bg-green-500'
                                    : item.quantity > 20
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{
                                  width: `${Math.min((item.quantity / 100) * 100, 100)}%`,
                                }}
                              />
                            </div>
                            <div className="mt-1 text-xs text-gray-500 text-right">
                              Stock Level
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Item Name</label>
              <Input
                value={formData.itemName}
                onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                placeholder="Enter item name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">MRP</label>
              <Input
                type="number"
                value={formData.mrp}
                onChange={(e) => setFormData(prev => ({ ...prev, mrp: e.target.value }))}
                placeholder="Enter MRP"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Selling Price</label>
              <Input
                type="number"
                value={formData.sellingPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, sellingPrice: e.target.value }))}
                placeholder="Enter selling price"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="Enter quantity"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsEditOpen(false);
                  setEditingItem(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                className="bg-black text-white hover:bg-gray-800"
                onClick={handleEditSubmit}
              >
                Update Item
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
