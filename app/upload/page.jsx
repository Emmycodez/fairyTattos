"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Upload, Save } from "lucide-react";
import Image from "next/image";

export default function ContentManager() {
  const [items, setItems] = useState([]); // Holds image data
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemImage, setNewItemImage] = useState(null);

  // Fetch metadata.json on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/getImages"); // Fetch metadata
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        } else {
          console.error("Failed to fetch items");
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleSave = async (id) => {
    try {
      const response = await fetch("/api/editName", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: editName }),
      });

      if (response.ok) {
        const updatedItems = items.map((item) =>
          item.id === id ? { ...item, name: editName } : item
        );
        setItems(updatedItems);
        setEditingId(null);
      } else {
        console.error("Failed to save item");
      }
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleDelete = async (id, imageName) => {
    try {
      const response = await fetch("/api/deleteImage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageName }),
      });

      if (response.ok) {
        const filteredItems = items.filter((item) => item.id !== id);
        setItems(filteredItems);
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  const handleUpload = async (e) => {
    e.preventDefault();
    if (newItemName && newItemImage) {
      const formData = new FormData();
      formData.append('image', newItemImage);
      formData.append('name', newItemName);
  
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          const result = await response.json();
          setItems([...items, result.entry]);
          setNewItemName('');
          setNewItemImage(null);
        } else {
          console.error('Failed to upload item');
        }
      } catch (error) {
        console.error('Error uploading item:', error);
      }
    }
  };
  

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Content Manager</h1>

      {items.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Image
                    src={`/uploads/${item.image}`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                    width={150}
                    height={150}
                  />
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="max-w-xs"
                    />
                  ) : (
                    item.name
                  )}
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <Button onClick={() => handleSave(item.id)} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleEdit(item.id, item.name)}
                      size="sm"
                      variant="outline"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDelete(item.id, item.image)}
                    size="sm"
                    variant="destructive"
                    className="ml-2"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-center my-4">No images found</p>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">
            <Upload className="w-4 h-4 mr-2" />
            Upload New Contestant
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <Label htmlFor="itemName">Contestant Name</Label>
              <Input
                id="itemName"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="itemImage">Contestant Image</Label>
              <Input
                id="itemImage"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    console.log("Selected file:", file); // Debug log
                    setNewItemImage(file);
                  }
                }}
                accept="image/*"
                required
              />
            </div>
            <Button type="submit">Upload</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
