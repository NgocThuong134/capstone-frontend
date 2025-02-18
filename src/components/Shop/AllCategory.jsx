import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEye, AiOutlineEdit } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getAllcategory,
  deleteCategory,
  updateCategory,
} from "../../redux/actions/category";
import Loader from "../Layout/Loader";
import { backend_url } from "../../server";

const AllCategories = () => {
  const { categoriesData, isLoading } = useSelector((state) => state.category);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  const [openPreview, setOpenPreview] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  useEffect(() => {
    dispatch(getAllcategory(seller._id));
  }, [dispatch]);

  const handleDelete = (id) => {
    const confirmDelete = () => {
      dispatch(deleteCategory(id))
        .then(() => {
          toast.success("Xóa danh mục thành công!");
          dispatch(getAllcategory(seller._id));
        })
        .catch(() => {
          toast.error("Xóa danh mục thất bại.");
        });
    };

    toast(
      <div>
        <p>Bạn có chắc chắn muốn xóa danh mục này không?</p>
        <Button onClick={confirmDelete} color="primary">
          Có
        </Button>
        <Button onClick={() => toast.dismiss()} color="secondary">
          Không
        </Button>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };
  
  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setFormData({ title: "", description: "" });
  };

  const handlePreview = (category) => {
    setSelectedCategory(category);
    setOpenPreview(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      title: category.name,
      description: category.description,
    });
    setOpenEdit(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateCategory(selectedCategory.id, formData))
      .then(() => {
        toast.success("Cập nhật danh mục thành công!");
        dispatch(getAllcategory(seller._id));
        handleCloseEdit();
      })
      .catch(() => {
        toast.error("Cập nhật danh mục thất bại.");
      });
  };

  const columns = [
    {
      field: "thumbnail",
      headerName: "Hình Ảnh Danh Mục",
      minWidth: 150,
      flex: 0.7,
      renderCell: (params) => {
        return (
          <img
            src={`${backend_url}${params.value}`}
            alt="Thumbnail"
            style={{ width: "100%", height: "auto", borderRadius: "4px" }}
          />
        );
      },
    },
    {
      field: "name",
      headerName: "Tên",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "description",
      headerName: "Mô Tả",
      minWidth: 200,
      flex: 1.5,
    },
    {
      field: "Xem trước",
      headerName:"Xem trước",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      sortable: false,
      renderCell: (params) => {
        return (
          <Button onClick={() => handlePreview(params.row)}>
            <AiOutlineEye size={20} />
          </Button>
        );
      },
    },
    {
      field: "Hành động",
      headerName:"Hành động",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleEdit(params.row)}>
              <AiOutlineEdit size={20} />
            </Button>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const rows = [];

  if (Array.isArray(categoriesData) && categoriesData.length > 0) {
    categoriesData.forEach((item) => {
      rows.push({
        id: item._id,
        thumbnail: item.thumbnail.url,
        name: item.title,
        description: item.description || "Không có mô tả",
      });
    });
  } else {
    return (
      <>
        <p>Không có danh mục nào</p>
      </>
    );
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={openPreview} onClose={handleClosePreview}>
        <DialogTitle>Xem Trước Danh Mục</DialogTitle>
        <DialogContent>
          {selectedCategory && (
            <div>
              <img
                src={`${backend_url}${selectedCategory.thumbnail}`}
                alt="Thumbnail"
                style={{ width: "100%", height: "auto", borderRadius: "4px" }}
              />
              <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
                {selectedCategory.name}
              </h2>
              <p>{selectedCategory.description}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Chỉnh Sửa Danh Mục</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Tên"
              fullWidth
              margin="normal"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <TextField
              label="Mô Tả"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <DialogActions>
              <Button onClick={handleCloseEdit} color="secondary">
                Huỷ
              </Button>
              <Button type="submit" color="primary">
                Lưu
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AllCategories;