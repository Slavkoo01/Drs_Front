import React, { useState } from "react";
import axios from "axios";

export default function CreatePostForm({ onPostCreated, onCancel }) {
  const [formData, setFormData] = useState({
    text: "",
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const handleTextChange = (e) => {
    setFormData({ ...formData, text: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        setError("Please select a valid image file (PNG, JPG, JPEG)");
        return;
      }

      // Validate file size (example: max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image file must be less than 5MB");
        return;
      }

      setFormData({ ...formData, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
    // Reset file input
    document.getElementById('image-input').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.text.trim()) {
      setError("Post text cannot be empty");
      return;
    }

    if (formData.text.length > 500) {
      setError("Post text exceeds maximum length of 500 characters");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("DRS_user_token");
      
      // Create FormData for multipart/form-data
      const submitData = new FormData();
      submitData.append('text', formData.text);
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}posts/create`,
        submitData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setSuccess("Post created successfully! It will be visible after admin approval.");
      
      // Reset form
      setFormData({ text: "", image: null });
      setImagePreview(null);
      document.getElementById('image-input').value = '';
      
      // Call parent callback after a short delay to show success message
      setTimeout(() => {
        onPostCreated();
      }, 2000);

    } catch (err) {
      console.error("Error creating post:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to create post. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-blueGray-700 mb-4">Create New Post</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Text Input */}
        <div className="mb-4">
          <label className="block text-blueGray-600 text-sm font-bold mb-2">
            What's on your mind?
          </label>
          <textarea
            value={formData.text}
            onChange={handleTextChange}
            placeholder="Share your thoughts..."
            className="w-full px-3 py-2 text-blueGray-600 bg-white border border-blueGray-300 rounded text-sm shadow focus:outline-none focus:border-blue-500 resize-none"
            rows="4"
            maxLength="500"
          />
          <div className="text-right text-xs text-blueGray-400 mt-1">
            {formData.text.length}/500 characters
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-blueGray-600 text-sm font-bold mb-2">
            Add Image (Optional)
          </label>
          <input
            id="image-input"
            type="file"
            accept="image/png,image/jpg,image/jpeg"
            onChange={handleImageChange}
            className="w-full px-3 py-2 text-blueGray-600 bg-white border border-blueGray-300 rounded text-sm shadow focus:outline-none focus:border-blue-500"
          />
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-3 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full h-48 object-cover rounded border"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-blueGray-500 bg-blueGray-200 rounded hover:bg-blueGray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.text.trim()}
            className="px-6 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
}