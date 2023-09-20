import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Avatar } from "primereact/avatar";
import { Toast } from "primereact/toast";
import { v4 } from "uuid";

import { Card } from "../../../components/common";
import { Dashboard } from "../../../components/dashboard";
import useFormValidation from "../../../components/common/form/useFormValidation";
import {
  InputFieldWrapper,
  SelectField,
  TextField,
} from "../../../components/common/input";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  db,
  doc,
  setDoc,
  collection,
  getDocs,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "../../../firebase";
import Loader from "../../../components/common/Loader";
import { async } from "@firebase/util";
import { formatCurrency } from "../../../helpers";

const categories = [
  { value: "Baby & Mom", label: "Baby & Mom" },
  { value: "Fitness", label: "Fitness" },
  { value: "Drug", label: "Drug" },
  { value: "Sexual Health", label: "Sexual Health" },
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayModal, setDisplayModal] = useState(false);
  const [imageURI, setImageURI] = useState("");
  const toast = useRef(null);
  const router = useRouter();

  const newProduct = useFormValidation(
    {
      category: "",
      name: "",
      description: "",
      quantity: "",
      price: "",
      image: null,
    },
    {
      category: "required|string",
      name: "required|string",
      description: "required",
      quantity: "required|numeric",
      price: "required|float",
      image: "required",
    },
    uploadImage
  );

  async function uploadImage() {
    try {
      const imageRef = ref(storage, `products/${v4()}`);
      uploadBytes(imageRef, newProduct.state.image[0]).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setImageURI(url);
        });
      });
    } catch (error) {
      newProduct.updateIsSubmitting(false);
      console.log(error);
    }
  }

  const addProduct = async () => {
    try {
      if (imageURI) {
        const productId = v4();
        await setDoc(doc(db, "products", productId), {
          id: productId,
          cat: newProduct.state.category,
          name: newProduct.state.name,
          desc: newProduct.state.description,
          qty: newProduct.state.quantity,
          price: newProduct.state.price,
          src: imageURI,
        });
      }
      newProduct.updateIsSubmitting(false);
      newProduct.clearValues();
      setImageURI("");
      setTimeout(() => {
        getProducts();
      }, 1000);
    } catch (error) {
      newProduct.updateIsSubmitting(false);
      console.log(error);
    }
  };

  const getProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));
      let products = [];
      if (snapshot) {
        snapshot.forEach((doc) => {
          products = [
            {
              ...doc.data(),
              price: formatCurrency(parseFloat(doc.data().price)),
            },
            ...products,
          ];
        });
        setProducts((state) => (state = [...products]));
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (value) => {
    const d = new Date(value);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return d.toLocaleDateString("en-US", options);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          className="p-button-outlined"
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText placeholder="Keyword Search" />
        </span>
      </div>
    );
  };

  const imageBody = (row) => {
    if (row.src) {
      // return <img src={row.image} alt={row.name} className='product-image' />;
      return <Avatar image={row.src} size="xlarge" shape="square" />;
    }
  };

  const usernameBody = (row) => {
    return <span className="image-text">{row.email}</span>;
  };

  const fullNameBody = (row) => {
    return (
      <span className="image-text">
        {row.firstName} {row.lastName}
      </span>
    );
  };

  const actionTemplate = (data) => {
    return (
      <div>
        <Button
          type="button"
          icon="pi pi-pencil"
          tooltip="Edit"
          tooltipOptions={{ position: "left" }}
          style={{ marginRight: ".8rem" }}
          className="p-button-secondary p-button-text p-button-sm"
        />
        <Button
          type="button"
          icon="pi pi-trash"
          tooltip="Delete"
          tooltipOptions={{ position: "left" }}
          className="p-button-danger p-button-text p-button-sm"
        ></Button>
      </div>
    );
  };

  const renderFooter = (name) => {
    return (
      <div>
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => setDisplayModal(false)}
          className="p-button-text"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          onClick={() => setDisplayModal(false)}
          autoFocus
        />
      </div>
    );
  };

  useEffect(() => {
    addProduct();
  }, [imageURI]);

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Dashboard>
      <Toast ref={toast} />
      <Dialog
        header="Add New Product"
        visible={displayModal}
        modal={false}
        style={{ width: "40vw" }}
        onHide={() => {
          setDisplayModal(false);
          newProduct.clearValues();
        }}
      >
        <form onSubmit={newProduct.handleSubmit}>
          <div className="s__row">
            <div className="s__col c--6 cx--12">
              <SelectField
                label="Category"
                placeholder="Select category"
                name="category"
                id="category"
                errors={newProduct.errors.category}
                value={newProduct.state.category}
                onChange={newProduct.handleChange}
                onBlur={newProduct.handleBlur}
                setValue={newProduct.setValues}
                options={categories.map((op) => ({
                  value: op.value,
                  label: op.label,
                }))}
              />
            </div>
            <div className="s__col c--6 cx--12">
              <TextField
                label="Name"
                id="name"
                placeholder="Enter name of product"
                type="text"
                name="name"
                errors={newProduct.errors.name}
                value={newProduct.state.name}
                onChange={newProduct.handleChange}
                onBlur={newProduct.handleBlur}
              />
            </div>
          </div>
          <TextField
            label="Description"
            id="description"
            placeholder="Enter description of product"
            type="textarea"
            name="description"
            errors={newProduct.errors.description}
            value={newProduct.state.description}
            onChange={newProduct.handleChange}
            onBlur={newProduct.handleBlur}
          />
          <div className="s__row">
            <div className="s__col c--6 cx--12">
              <TextField
                label="Quantity"
                id="quantity"
                placeholder="Enter quantity of product"
                type="number"
                name="quantity"
                min="1"
                errors={newProduct.errors.quantity}
                value={newProduct.state.quantity}
                onChange={newProduct.handleChange}
                onBlur={newProduct.handleBlur}
              />
            </div>
            <div className="s__col c--6 cx--12">
              <TextField
                label="Price"
                id="price"
                placeholder="Enter price of product"
                type="text"
                name="price"
                errors={newProduct.errors.price}
                value={newProduct.state.price}
                onChange={newProduct.handleChange}
                onBlur={newProduct.handleBlur}
              />
            </div>
          </div>

          <TextField
            label="Product Image"
            id="image"
            type="file"
            name="image"
            accept="image/*"
            required
            errors={newProduct.errors.image}
            onChange={newProduct.handleChange}
          />

          <button
            type="submit"
            disabled={newProduct.isSubmitting}
            className="account__btn"
          >
            {newProduct.isSubmitting ? <Loader /> : "Add"}
          </button>
        </form>
      </Dialog>
      <Card>
        <div className="table__header">
          <h3>Products</h3>
          <Button
            type="button"
            label="Add New Product"
            className="p-button-primary"
            icon="pi pi-plus"
            onClick={() => setDisplayModal(true)}
          />
        </div>
        <DataTable
          value={products}
          paginator
          className="p-datatable-customers"
          rows={50}
          dataKey="id"
          loading={loading}
          responsiveLayout="scroll"
          header={renderHeader}
          emptyMessage="No product found."
        >
          <Column
            field="src"
            header="Image"
            style={{ minWidth: "5rem" }}
            body={imageBody}
          />
          <Column header="Name" field="name" />
          <Column header="Category" field="cat" />
          <Column header="Quantity" field="qty" />
          <Column header="Price" field="price" />
          <Column
            header="Description"
            field="desc"
            style={{ width: "30rem" }}
          />
          <Column body={actionTemplate} style={{ textAlign: "right" }} />
        </DataTable>
      </Card>
    </Dashboard>
  );
};

export default Products;
