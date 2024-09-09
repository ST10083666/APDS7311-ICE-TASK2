import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Ensure the correct import from react-router-dom

export default function Login() {
  const [form, setForm] = useState({
    name: "",
    password: ""
  });

  const navigate = useNavigate();

  function updateForm(value) {
    setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();

    // Prepare the form data for submission
    const newPerson = { ...form };

    try {
      const response = await fetch("https://localhost:3001/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPerson),
      });

      if (!response.ok) {
        throw new Error("Failed to login");
      }

      const data = await response.json();
      const { token, name } = data;

      console.log("Logged in as:", name);
      console.log("Token:", token);

      // Save the JWT to local storage
      localStorage.setItem("jwt", token);

      // Optionally, save the username if needed
      localStorage.setItem("name", name);

      // Clear the form after successful login
      setForm({ name: "", password: "" });

      // Navigate to the homepage or another page after login
      navigate("/");
    } catch (error) {
      window.alert(error.message);
      console.error("Login error:", error);
    }
  }

  // HTML for the login page.
  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={form.password}
            onChange={(e) => updateForm({ password: e.target.value })}
          />
        </div>
        <div className="form-group">
          <input
            type="submit"
            value="Login"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
  
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
  

