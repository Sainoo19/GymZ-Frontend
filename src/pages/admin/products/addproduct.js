import { useParams } from "react-router-dom";

import ProductDetail  from "../../../components/admin/product/ProductDetail";
const AddProduct = () => {
  const { id } = useParams(); // Lấy productId nếu có

  return (
    <div>
      <ProductDetail productId={id}></ProductDetail>
    </div>
  );
}
export default AddProduct;
