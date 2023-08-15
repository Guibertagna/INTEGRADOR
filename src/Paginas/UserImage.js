import React, { useState } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../CSS/Perfil.css";
function UserImage({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const storage = getStorage();

  const handleUpload = () => {
    const storageRef = ref(storage, `images/${user.uid}/${selectedImage.name}`);
    uploadBytes(storageRef, selectedImage)
      .then(() => {
        console.log("Image uploaded successfully");
      })
      .catch((error) => {
        console.error(error);
      });
    setIsEditing(false);
  };

  const handleFileChange = (event) => {
    setSelectedImage(event.target.files[0]);
    setImageUrl(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <div className="user-image">
      <img src={imageUrl || user.photoURL} alt="user" />
      {isEditing && (
        <div className="user-image-upload">
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload</button>
        </div>
      )}
      {!isEditing && (
        <button className="btnImg" onClick={() => setIsEditing(true)}> <FontAwesomeIcon icon={faEdit} /></button>
      )}
    </div>
  );
}

export default UserImage;