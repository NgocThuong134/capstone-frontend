import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

export const categoryReducer = createReducer(initialState, {
  // Tạo category
  createCategoryRequest: (state) => {
    state.isLoading = true;
  },
  createCategorySuccess: (state, action) => {
    state.isLoading = false;
    state.categoriesData = action.payload;
    state.success = true;
  },
  createCategoryFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
    state.success = false;
  },

  // Lấy tất cả categoriesData
  getAllCategoryRequest: (state) => {
    state.isLoading = true;
  },
  getAllcategorySuccess: (state, action) => {
    state.isLoading = false;
    state.categoriesData = action.payload; 
  },
  getAllcategoryFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

    // Lấy tất cả categoriesData
    getAllCategoriesRequest: (state) => {
      state.isLoading = true;
    },
    getAllcategoriesSuccess: (state, action) => {
      state.isLoading = false;
      state.categoriesData = action.payload; 
    },
    getAllcategoriesFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

  // Xóa category
  deleteCategoryRequest: (state) => {
    state.isLoading = true;
  },
  deleteCategorySuccess: (state, action) => {
    state.isLoading = false;
    state.categoriesData = action.payload;
  },
  deleteCategoryFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // Cập nhật category
  updateCategoryRequest: (state) => {
    state.isLoading = true;
  },
  updateCategorySuccess: (state, action) => {
    state.isLoading = false;
    state.success = action.payload;
  },
  updateCategoryFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // Lấy thông tin một category
  getCategoryByIdRequest: (state) => {
    state.isLoading = true;
  },
  getCategoryByIdSuccess: (state, action) => {
    state.isLoading = false;
    // Bạn có thể xử lý nếu cần ở đây
  },
  getCategoryByIdFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // Xóa lỗi
  clearErrors: (state) => {
    state.error = null;
  },
});
