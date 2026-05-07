import React, { useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import "./addItem.css";

const AddItem = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // Handles file selection and generates preview of image
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert("Please select a file");
            return;
        }
        
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("image", file);

        try {
            // Sends post request from frontend to backend with form data including image file
            await axios.post("http://localhost:5000/add-item", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Item added successfully!");
            setName("");
            setPrice("");
            setFile(null);
            setPreview(null);
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        }
    };

    return (
        <>
            <Navbar />
            <div className="add-item-page">
                <div className="form-container">
                    <form className="add-item-form" onSubmit={handleSubmit}>
                        <h2>Add New Delicious Item</h2>
                        <div className="header-underline"></div>

                        <div className="input-group">
                            <label>Dish Name</label>
                            <input 
                                type="text"
                                placeholder="Enter item name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Price (₱)</label>
                            <input
                                type="number"
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Item Image</label>
                            <input
                                type="file"
                                id="file-upload"
                                onChange={handleFileChange}
                                required
                            />
                            <label htmlFor="file-upload" className="custom-file-upload">
                                {file ? "Change Image" : "Choose Image"}
                            </label>
                        </div>

                        {preview && (
                            <div className="image-preview">
                                <img src={preview} alt="Preview" />
                            </div>
                        )}

                        <button type="submit" className="submit-btn">Upload to Menu</button> 
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddItem;