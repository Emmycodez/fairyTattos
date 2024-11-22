"use client";

import React, { useState, useEffect } from "react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash2, Upload, CheckCircle, Loader2 } from 'lucide-react';
import Image from "next/image";
import { deleteImage, fetchImages, getSignedURL } from "@/actions/queries";

export default function ContentManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState("");
  const [newItemImage, setNewItemImage] = useState(null);
  const [images, setImages] = useState([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const getImages = async () => {
      try {
        const s3data = await fetchImages();
        
        if (Array.isArray(s3data)) {
          setImages(s3data);
        } else {
          console.error("Fetched data is not an array:", s3data);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    getImages();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (newItemName && newItemImage) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", newItemImage);
      formData.append("name", newItemName);
    
      try {
        const signedUrlResult = await getSignedURL(
          newItemName,
          newItemImage.type
        );
        if (!signedUrlResult.success) {
          console.log("Failed to generate signed url");
          setIsUploading(false);
          return;
        }

        const url = signedUrlResult.success.url;
      
        await fetch(url, {
          method: "PUT",
          body: newItemImage,
          headers: {
            "Content-Type": newItemImage.type,
          },
        });

        const newImages = await fetchImages();
        setImages(newImages);
        setIsUploadDialogOpen(false);
        setIsSuccessModalOpen(true);
        setNewItemName("");
        setNewItemImage(null);
      } catch (error) {
        console.error("Error uploading item:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDelete = async (key) => {
    const result = await deleteImage(key);
    if (result.success) {
      const updatedImages = await fetchImages();
      setImages(updatedImages);
    } else {
      console.error("Failed to delete image:", key, result.message);
    }
  };

  const s3BaseUrl = "https://inkvote-bucket-one.s3.eu-north-1.amazonaws.com/";
  if (loading) return <p>Loading images...</p>;

  return (
    <div>
      {images.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {images.map((image) => (
              <TableRow key={image.id}>
                <TableCell>
                  <Image
                    src={`${s3BaseUrl}${image.image}`}
                    alt={image.name}
                    className="w-16 h-16 object-cover rounded"
                    width={150}
                    height={150}
                  />
                </TableCell>
                <TableCell>{image.name}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDelete(image.image)}
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
        <p>No images found</p>
      )}

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
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
                    setNewItemImage(file);
                  }
                }}
                accept="image/*"
                required
              />
            </div>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Successful</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <p className="text-lg text-center">
              Your image has been successfully uploaded!
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsSuccessModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Pencil, Trash2, Upload, Save } from "lucide-react";
// import Image from "next/image";
// import { deleteImage, fetchImages, getSignedURL } from "@/actions/queries";

// export default function ContentManager() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingId, setEditingId] = useState(null);
//   const [editName, setEditName] = useState("");
//   const [newItemName, setNewItemName] = useState("");
//   const [newItemImage, setNewItemImage] = useState(null);
//   const [images, setImages] = useState([]);

//   useEffect(() => {
//     const getImages = async () => {
//       try {
//         const s3data = await fetchImages();
        
//         if (Array.isArray(s3data)) {
//           setImages(s3data);
//         } else {
//           console.error("Fetched data is not an array:", s3data);
//         }
//       } catch (error) {
//         console.error("Error fetching images:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getImages();
//   }, []);

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (newItemName && newItemImage) {
//       const formData = new FormData();
//       formData.append("image", newItemImage);
//       formData.append("name", newItemName);
    

//       try {
//         const signedUrlResult = await getSignedURL(
//           newItemName,
//           newItemImage.type
//         );
//         if (!signedUrlResult.success) {
//           console.log("Failed to generate signed url");
//           return;
//         }

//         const url = signedUrlResult.success.url;
      

//         await fetch(url, {
//           method: "PUT",
//           body: newItemImage,
//           headers: {
//             "Content-Type": newItemImage.type,
//           },
//         });

//         const newImages = await fetchImages();

//         setImages(newImages); 
//       } catch (error) {
//         console.error("Error uploading item:", error);
//       }
//     }
//   };

//   const handleDelete = async (key) => {
    
//     const result = await deleteImage(key);
//     if (result.success) {
    
//       // Refetch the updated list of images from S3
//       const updatedImages = await fetchImages();
//       setImages(updatedImages);
//     } else {
//       console.error("Failed to delete image:", key, result.message);
//     }
//   };

//   const s3BaseUrl = "https://inkvote-bucket-one.s3.eu-north-1.amazonaws.com/"; // Your S3 bucket URL
//   if (loading) return <p>Loading images...</p>;

//   return (
//     <div>
//       {images.length > 0 ? (
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Image</TableHead>
//               <TableHead>Name</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {images.map((image) => (
//               <TableRow key={image.id}>
//                 <TableCell>
//                   <Image
//                     src={`${s3BaseUrl}${image.image}`}
//                     alt={image.name}
//                     className="w-16 h-16 object-cover rounded"
//                     width={150}
//                     height={150}
//                   />
//                 </TableCell>
//                 <TableCell>{image.name}</TableCell>
//                 <TableCell>
//                   <Button
//                     onClick={() => handleDelete(image.image)} // Pass the S3 key instead of image.name
//                     size="sm"
//                     variant="destructive"
//                     className="ml-2"
//                   >
//                     <Trash2 className="w-4 h-4 mr-2" />
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       ) : (
//         <p>No images found</p>
//       )}

//       <Dialog>
//         <DialogTrigger asChild>
//           <Button className="mt-4">
//             <Upload className="w-4 h-4 mr-2" />
//             Upload New Contestant
//           </Button>
//         </DialogTrigger>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Upload New Item</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleUpload} className="space-y-4">
//             <div>
//               <Label htmlFor="itemName">Contestant Name</Label>
//               <Input
//                 id="itemName"
//                 value={newItemName}
//                 onChange={(e) => setNewItemName(e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <Label htmlFor="itemImage">Contestant Image</Label>
//               <Input
//                 id="itemImage"
//                 type="file"
//                 onChange={(e) => {
//                   const file = e.target.files?.[0];
//                   if (file) {
                    
//                     setNewItemImage(file);
//                   }
//                 }}
//                 accept="image/*"
//                 required
//               />
//             </div>
//             <Button type="submit">Upload</Button>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// // export default function ContentManager () {
// //   const [images, setImages] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const getImages = async () => {
// //       try {
// //         const s3data = await fetchImages(); // Fetch images
// //         console.log("Fetched images data: ", s3data);
// //         // Ensure s3data is an array
// //         if (Array.isArray(s3data)) {
// //           setImages(s3data);
// //         } else {
// //           console.error("Fetched data is not an array:", s3data);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching images:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     getImages();
// //   }, []);
// //   const s3BaseUrl = "https://inkvote-bucket-one.s3.eu-north-1.amazonaws.com/"; // Your S3 bucket URL
// //   if (loading) return <p>Loading images...</p>;

// //   return (
// //     <div>
// //       {images.length > 0 ? (
// //         images.map((image) => (
// //           <Table>
// //             <TableHeader>
// //          <TableRow>
// //            <TableHead>Image</TableHead>
// //             <TableHead>Name</TableHead>
// //              <TableHead>Actions</TableHead>
// //           </TableRow>
// //           </TableHeader>

// //         <TableBody key={image.id}>
// //            {images.map((image) => (
// //               <TableRow key={image.id}>
// //                 <TableCell>
// //                   <Image
// //                    src={`${s3BaseUrl}${image.image}`}

// //                     alt={image.name}
// //                     className="w-16 h-16 object-cover rounded"
// //                     width={150}
// //                     height={150}
// //                   />
// //                 </TableCell>

// //                 <TableCell>

// //                   <Button
// //                     onClick={() => handleDelete(image.id, image.image)}
// //                     size="sm"
// //                     variant="destructive"
// //                     className="ml-2"
// //                   >
// //                     <Trash2 className="w-4 h-4 mr-2" />
// //                     Delete
// //                   </Button>
// //                 </TableCell>
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //           </Table>

// //         ))
// //       ) : (
// //         <p>No images found</p>
// //       )}
// //     </div>
// //   );
// // };

// // export default () => {
// //   const [images, setImages] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const getImages = async () => {
// //       try {
// //         const s3data = await fetchImages();Fetch images
// //         console.log("Fetched images data: ", s3data);
// //        Ensure s3data is an array
// //         if (Array.isArray(s3data)) {
// //           setImages(s3data);
// //         } else {
// //           console.error("Fetched data is not an array:", s3data);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching images:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     getImages();
// //   }, []);

// //   if (loading) return <p>Loading images...</p>;

// //   return (
// //     <div>
// //       {images.length > 0 ? (
// //         images.map((image) => (
// //           <div key={image.id}>
// //             <img src={`${s3BaseUrl}${image.image}`} alt={image.name} />
// //           </div>
// //         ))
// //       ) : (
// //         <p>No images found</p>
// //       )}
// //     </div>
// //   );
// // };

// // export default function ContentManager() {
// //   const [items, setItems] = useState([]);Holds image data
// //   const [loading, setLoading] = useState(true);Tracks loading state
// //   const [editingId, setEditingId] = useState(null);
// //   const [editName, setEditName] = useState("");
// //   const [newItemName, setNewItemName] = useState("");
// //   const [newItemImage, setNewItemImage] = useState(null);
// //   const [images, setImages] = useState

// //  Fetch metadata.json on component mount
// //   useEffect(() => {
// //     const getImages = async () => {
// //       try {
// //         const s3data = await fetchImages();Fetch images using the fetchImages function
// //         console.log("Fetched images data: ", s3data);
// //         setImages(s3data);
// //       } catch (error) {
// //         console.error("Error fetching images:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     getImages();
// //   }, []);

// //   const handleEdit = (id, name) => {
// //     setEditingId(id);
// //     setEditName(name);
// //   };

// //   const handleSave = async (id) => {
// //     try {
// //       const response = await fetch("/api/editName", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ id, name: editName }),
// //       });

// //       if (response.ok) {
// //         const updatedItems = items.map((item) =>
// //           item.id === id ? { ...item, name: editName } : item
// //         );
// //         setItems(updatedItems);
// //         setEditingId(null);
// //       } else {
// //         console.error("Failed to save item");
// //       }
// //     } catch (error) {
// //       console.error("Error saving item:", error);
// //     }
// //   };

// //   const handleDelete = async (id, imageName) => {
// //     try {
// //       const response = await fetch("/api/deleteImage", {
// //         method: "DELETE",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ imageName }),
// //       });

// //       if (response.ok) {
// //         const filteredItems = items.filter((item) => item.id !== id);
// //         setItems(filteredItems);
// //       } else {
// //         console.error("Failed to delete item");
// //       }
// //     } catch (error) {
// //       console.error("Error deleting item:", error);
// //     }
// //   };
// //   const handleUpload = async (e) => {
// //     e.preventDefault();
// //     if (newItemName && newItemImage) {
// //       const formData = new FormData();
// //       formData.append('image', newItemImage);
// //       formData.append('name', newItemName);
// //       console.log("New item name:", newItemName);
// //       console.log("New item image:", newItemImage);

// //       try {
// //         const signedUrlResult = await getSignedURL(newItemName,newItemImage.type);
// //         if (!signedUrlResult.success) {
// //           console.log("Failed to generate signed url");
// //           return;
// //         }

// //         const url = signedUrlResult.success.url;
// //         console.log("This is the signed url gotten: ", url);

// //         await fetch(url, {
// //           method: 'PUT',
// //           body: newItemImage,
// //           headers: {
// //             "Content-Type": newItemImage.type,
// //           }
// //         });
// //       } catch (error) {
// //         console.error('Error uploading item:', error);
// //       }
// //     }
// //   };

// //   const s3BaseUrl = "https://inkvote-bucket-one.s3.eu-north-1.amazonaws.com/";Your S3 bucket URL

// //   if (loading) return <p>Loading images...</p>;

// //   return (
// //     <div className="container mx-auto p-4">
// //       <h1 className="text-2xl font-bold mb-4">Content Manager</h1>

// //       {items.length > 0 ? (
// //         <Table>
// //           <TableHeader>
// //             <TableRow>
// //               <TableHead>Image</TableHead>
// //               <TableHead>Name</TableHead>
// //               <TableHead>Actions</TableHead>
// //             </TableRow>
// //           </TableHeader>
// //           <TableBody>
// //             {images.map((image) => (
// //               <TableRow key={image.id}>
// //                 <TableCell>
// //                   <Image
// //                    src={`${s3BaseUrl}${image.image}`}
// //                     alt={image.name}
// //                     className="w-16 h-16 object-cover rounded"
// //                     width={150}
// //                     height={150}
// //                   />
// //                 </TableCell>
// //                 <TableCell>
// //                   {editingId === image.id ? (
// //                     <Input
// //                       value={editName}
// //                       onChange={(e) => setEditName(e.target.value)}
// //                       className="max-w-xs"
// //                     />
// //                   ) : (
// //                     image.name
// //                   )}
// //                 </TableCell>
// //                 <TableCell>
// //                   {editingId === item.id ? (
// //                     <Button onClick={() => handleSave(image.id)} size="sm">
// //                       <Save className="w-4 h-4 mr-2" />
// //                       Save
// //                     </Button>
// //                   ) : (
// //                     <Button
// //                       onClick={() => handleEdit(image.id, image.name)}
// //                       size="sm"
// //                       variant="outline"
// //                     >
// //                       <Pencil className="w-4 h-4 mr-2" />
// //                       Edit
// //                     </Button>
// //                   )}
// //                   <Button
// //                     onClick={() => handleDelete(image.id, image.image)}
// //                     size="sm"
// //                     variant="destructive"
// //                     className="ml-2"
// //                   >
// //                     <Trash2 className="w-4 h-4 mr-2" />
// //                     Delete
// //                   </Button>
// //                 </TableCell>
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //         </Table>
// //       ) : (
// //         <p className="text-center my-4">No images found</p>
// //       )}

// //       <Dialog>
// //         <DialogTrigger asChild>
// //           <Button className="mt-4">
// //             <Upload className="w-4 h-4 mr-2" />
// //             Upload New Contestant
// //           </Button>
// //         </DialogTrigger>
// //         <DialogContent>
// //           <DialogHeader>
// //             <DialogTitle>Upload New Item</DialogTitle>
// //           </DialogHeader>
// //           <form onSubmit={handleUpload} className="space-y-4">
// //             <div>
// //               <Label htmlFor="itemName">Contestant Name</Label>
// //               <Input
// //                 id="itemName"
// //                 value={newItemName}
// //                 onChange={(e) => setNewItemName(e.target.value)}
// //                 required
// //               />
// //             </div>
// //             <div>
// //               <Label htmlFor="itemImage">Contestant Image</Label>
// //               <Input
// //                 id="itemImage"
// //                 type="file"
// //                 onChange={(e) => {
// //                   const file = e.target.files?.[0];
// //                   if (file) {
// //                     console.log("Selected file:", file); // Debug log
// //                     setNewItemImage(file);
// //                   }
// //                 }}
// //                 accept="image/*"
// //                 required
// //               />
// //             </div>
// //             <Button type="submit">Upload</Button>
// //           </form>
// //         </DialogContent>
// //       </Dialog>
// //     </div>
// //   );
// // }
