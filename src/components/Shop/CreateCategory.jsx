import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { createCategory } from "../../redux/actions/category";
import { toast } from "react-toastify";

const CreateCategory = () => {
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.category);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [isCreating, setIsCreating] = useState(false); // Trạng thái cho việc tạo danh mục

  useEffect(() => {
    if (isCreating) {
      if (error) {
        toast.error(error);
        setIsCreating(false); // Reset trạng thái tạo
      }
      if (success) {
        toast.success("Tạo danh mục thành công!");
        // Reset fields after successful creation
        setTitle("");
        setDescription("");
        setThumbnail(null);
        setIsCreating(false); // Reset trạng thái tạo
      }
    }
  }, [dispatch, error, success, isCreating]);

  const handleThumbnailChange = (e) => {
    e.preventDefault();
    setThumbnail(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsCreating(true); // Đặt trạng thái tạo là true
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    formData.append("shopId", seller._id);
    dispatch(createCategory(formData));
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Tạo Danh Mục</h5>
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={title}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề danh mục..."
            required
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Mô tả <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="4"
            name="description"
            value={description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả danh mục..."
          ></textarea>
        </div>
        <br />
        <div>
          <label className="pb-2">
            Tải Lên Hình Ảnh <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="upload"
            className="hidden"
            onChange={handleThumbnailChange}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            {thumbnail && (
              <img
                src={URL.createObjectURL(thumbnail)}
                alt="Uploaded"
                className="h-[120px] w-[120px] object-cover m-2"
              />
            )}
          </div>
          <br />
          <div>
            <input
              type="submit"
              value="Tạo"
              className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;