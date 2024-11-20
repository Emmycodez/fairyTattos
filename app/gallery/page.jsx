"use client"

import React, { useEffect, useState } from 'react';

const Gallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch('/api/getImages');
      const data = await response.json();
      setImages(data);
    };
    fetchImages();
  }, []);

  return (
    <div>
      {images.map(({ id, image, name }) => (
        <div key={id}>
          <img src={`/uploads/${image}`} alt={name} width="200" />
          <p>{name}</p>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
