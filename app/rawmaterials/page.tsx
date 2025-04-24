"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Category {
  id: string;
  type: string;
  item: string;
  mrp: number;
  sellingPrice: number;
  discount: number;
  imageUrl: string;
  quantity: number;
}

interface FormData {
  type: string;
  item: string;
  mrp: string;
  sellingPrice: string;
  discount: string;
  imageFile: File | null;
  quantity: string;
}

export default function RawMaterials() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FormData>({
    type: "",
    item: "",
    mrp: "",
    sellingPrice: "",
    discount: "",
    imageFile: null,
    quantity: "",
  });
  const [isAddOpen, setIsAddOpen] = useState(false);
//   const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      type: "",
      item: "",
      mrp: "",
      sellingPrice: "",
      discount: "",
      imageFile: null,
      quantity: "",
    });
    setEditingId(null);
  };

  const handleSubmit = () => {
    const previewUrl = formData.imageFile
      ? URL.createObjectURL(formData.imageFile)
      : ""

    const newCat: Category = {
      id: editingId || uuidv4(),
      type: formData.type,
      item: formData.item,
      mrp: parseFloat(formData.mrp),
      sellingPrice: parseFloat(formData.sellingPrice),
      discount: parseFloat(formData.discount),
      imageUrl: previewUrl,
      quantity: parseInt(formData.quantity, 10),
    };

    if (editingId) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingId ? newCat : c))
      );
    } else {
      setCategories((prev) => [newCat, ...prev]);
    }

    resetForm();
    setIsAddOpen(false);
    // setIsEditOpen(false);
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormData({
      type: cat.type,
      item: cat.item,
      mrp: cat.mrp.toString(),
      sellingPrice: cat.sellingPrice.toString(),
      discount: cat.discount.toString(),
      imageFile: null,
      quantity: cat.quantity.toString(),
    });
    // setIsEditOpen(true);
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="p-12 space-y-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <CardTitle className="text-2xl font-medium">
          Raw Materials Categories
        </CardTitle>
        {/* Add New Category */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800">
              + Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Category" : "New Category"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {[
                { label: "Category Type", name: "type" },
                { label: "Item Name", name: "item" },
                { label: "MRP", name: "mrp" },
                { label: "Selling Price", name: "sellingPrice" },
                { label: "Discount", name: "discount" },
                { label: "Image File", name: "imageFile" },
                { label: "Quantity", name: "quantity" },
              ].map(({ label, name }) => (
                <div key={name} className="space-y-1">
                  <label className="block text-sm font-medium">{label}</label>
                  <Input
                    type={name === "imageFile" ? "file" : "text"}
                    accept={name === "imageFile" ? "image/*" : undefined}
                    onChange={(e) => {
                      if (name === "imageFile") {
                        const file = e.target.files?.[0] || null
                        setFormData((f) => ({ ...f, imageFile: file }))
                      } else {
                        setFormData((f) => ({ ...f, [name]: e.target.value }))
                      }
                    }}
                    className="w-full"
                  />
                </div>
              ))}
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsAddOpen(false);
                    // setIsEditOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingId ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <CardContent>
        <div className="overflow-auto rounded border border-slate-200">
          <Table>
            <TableHeader className="bg-black text-white">
              <TableRow>
                <TableHead>S.No.</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>MRP</TableHead>
                <TableHead>Sell Price</TableHead>
                <TableHead>Discount</TableHead>
                {/* <TableHead>Image</TableHead> */}
                <TableHead>Qty</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    No categories added
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((c, idx) => (
                  <TableRow key={c.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{c.type}</TableCell>
                    <TableCell>{c.item}</TableCell>
                    <TableCell>₹{c.mrp}</TableCell>
                    <TableCell>₹{c.sellingPrice}</TableCell>
                    <TableCell>{c.discount}%</TableCell>
                    {/* <TableCell>
                      {c.imageUrl ? (
                        <img
                          src={c.imageUrl}
                          alt={c.item}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        "—"
                      )}
                    </TableCell> */}
                    <TableCell>{c.quantity}</TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="link"
                        className="p-0 underline"
                        onClick={() => handleEdit(c)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="link"
                        className="p-0 underline text-red-600"
                        onClick={() => handleDelete(c.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </div>
  );
}
