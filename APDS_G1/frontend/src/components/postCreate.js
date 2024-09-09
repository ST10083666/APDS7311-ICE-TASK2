import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Corrected the import
import '../App.css';

export default function CreatePost() {
  const [form, setForm] = useState({
    user: "",  // Fixed case of 'user'
    content: "",
    image: ""
  });
  const navigate = useNavigate();

  // Retrieve the user from local storage when the component mounts
  useEffect(() => {
    const savedUser = localStorage.getItem("name"); // Ensure user is stored as a string
    if (savedUser) {
      setForm((prev) => ({
        ...prev,
        user: savedUser,
      }));
    } else {
      // Redirect to login if no user data is present
      navigate("/login");
    }
  }, [navigate]);

  function updateForm(value) {
    setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // Function to handle image file change
  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result.split(",")[1]; // Remove 'data:image/*;base64,' part
          updateForm({ image: base64String });
        };
        reader.readAsDataURL(file);
      } catch (error) {
        window.alert("Error reading image file.");
      }
    }
  }

  // Function to handle form submission
  async function onSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("jwt"); // Ensure the correct token name

    const newPost = {
      user: form.user,
      content: form.content,
      image: form.image
    };

    try {
      const response = await fetch("https://localhost:3001/post/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Fixed the token format
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Post created:", result);

      // Reset form but keep the user
      setForm({
        user: form.user,
        content: "",
        image: ""
      });

      // Navigate to the homepage or another page
      navigate("/");
    } catch (error) {
      window.alert(error);
    }
  }

  return (
    <div className="container">
      <h3 className="header">Create New Post</h3>
      <form onSubmit={onSubmit} className="form">
        <div className="form-group">
          <label htmlFor="user">User</label>
          <input
            type="text"
            className="form-control"
            id="user"
            value={form.user}
            disabled // Make the user field read-only
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <input
            type="text"
            className="form-control"
            id="content"
            value={form.content}
            onChange={(e) => updateForm({ content: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            className="form-control"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="form-group">
          <input
            type="submit"
            value="Create Post"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}
