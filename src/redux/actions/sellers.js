import axios from "axios";
import { server } from "../../server";

// get all sellers --- admin
export const getAllSellers = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllSellersRequest",
    });

    const { data } = await axios.get(`${server}/shop/admin-all-sellers`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllSellersSuccess",
      payload: data.sellers,
    });
  } catch (error) {
    dispatch({
      type: "getAllSellerFailed",
      payload: error.response.data.message,
    });
  }
};
// get all sellers --- admin
export const getAllShops = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllShopsRequest",
    });

    // Gọi API mà không cần withCredentials
    const { data } = await axios.get(`${server}/shop/admin-all-shops`);

    dispatch({
      type: "getAllShopsSuccess",
      payload: data.sellers,
    });
  } catch (error) {
    dispatch({
      type: "getAllShopsFailed",
      payload: error.response ? error.response.data.message : "Lỗi không xác định",
    });
  }
};