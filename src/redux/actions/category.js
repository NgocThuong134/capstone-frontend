import axios from "axios";
import { server } from "../../server";

// Tạo category mới
export const createCategory = (newForm) => async (dispatch) => {
  try {
    dispatch({
      type: "createCategoryRequest",
    });

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    const { data } = await axios.post(
      `${server}/category/create-category`,
      newForm,
      config
    );

    dispatch({
      type: "createCategorySuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "createCategoryFail",
      payload: error.response.data.message,
    });
  }
};

// Lấy tất cả các category
export const getAllcategory = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllcategoryRequest",
    });

    const { data } = await axios.get(`${server}/category/getAllCategories-shop/${id}`);
    dispatch({
      type: "getAllcategorySuccess",
      payload: data.categories,
    });
  } catch (error) {
    dispatch({
      type: "getAllcategoryFail",
      payload: error.response.data.message,
    });
  }
};

export const getAllcategories = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllcategoriesRequest",
    });

    const { data } = await axios.get(`${server}/category/getAllCategories`);
    dispatch({
      type: "getAllcategoriesSuccess",
      payload: data.categories,
    });
  } catch (error) {
    dispatch({
      type: "getAllcategoriesFail",
      payload: error.response.data.message,
    });
  }
};
// Xóa category
export const deleteCategory = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteCategoryRequest",
    });

    const { data } = await axios.delete(
      `${server}/category/delete-category/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "deleteCategorySuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteCategoryFail",
      payload: error.response.data.message,
    });
  }
};

// Cập nhật category
export const updateCategory = (id, updatedData) => async (dispatch) => {
  try {
    dispatch({
      type: "updateCategoryRequest",
    });

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    };

    const { data } = await axios.put(
      `${server}/category/update-category/${id}`,
      updatedData,
      config
    );

    dispatch({
      type: "updateCategorySuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "updateCategoryFail",
      payload: error.response.data.message,
    });
  }
};

// Lấy thông tin một category theo ID
export const getCategoryById = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getCategoryByIdRequest",
    });

    const { data } = await axios.get(`${server}/category/getCategory/${id}`);

    dispatch({
      type: "getCategoryByIdSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "getCategoryByIdFail",
      payload: error.response.data.message,
    });
  }
};
