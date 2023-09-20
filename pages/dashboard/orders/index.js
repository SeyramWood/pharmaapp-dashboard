import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import useFormValidation from "../../../components/common/form/useFormValidation";
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
  toDate,
} from "../../../firebase";
import Loader from "../../../components/common/Loader";
import { formatCurrency } from "../../../helpers";

const categories = [
  { value: "Baby & Mom", label: "Baby & Mom" },
  { value: "Fitness", label: "Fitness" },
  { value: "Drug", label: "Drug" },
  { value: "Sexual Health", label: "Sexual Health" },
];
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayModal, setDisplayModal] = useState(false);
  const [imageURI, setImageURI] = useState("");
  const toast = useRef(null);
  const router = useRouter();

  const getOrders = async () => {
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      let orders = [];
      if (snapshot) {
        snapshot.forEach((doc) => {
          orders = [
            {
              ...doc.data(),
              date: formatDate(doc.data().date.toDate()),
              amount: formatCurrency(parseFloat(doc.data().amount)),
              products: doc.data().products.map((p) => {
                return {
                  ...p,
                  amount: formatCurrency(parseFloat(p.price * p.quantity)),
                };
              }),
            },
            ...orders,
          ];
        });
        setOrders((state) => (state = [...orders]));
        setLoading(false);
        console.log(orders);
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
          icon="pi pi-eye"
          tooltip="View order details"
          tooltipOptions={{ position: "left" }}
          style={{ marginRight: ".8rem" }}
          className="p-button-secondary p-button-text p-button-sm"
          onClick={() =>
            router.push(`/dashboard/orders/${data.orderNumber}/details`)
          }
        />
        <Button
          type="button"
          icon="pi pi-pencil"
          tooltip="Edit"
          tooltipOptions={{ position: "left" }}
          style={{ marginRight: ".8rem" }}
          className="p-button-secondary p-button-text p-button-sm"
          onClick={() =>
            router.push(`/dashboard/orders/${data.orderNumber}/details`)
          }
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
    getOrders();
  }, []);

  return (
    <Dashboard>
      <Toast ref={toast} />

      <Card>
        <div className="table__header">
          <h3>Orders</h3>
          <div></div>
        </div>
        <DataTable
          value={orders}
          paginator
          className="p-datatable-customers"
          rows={50}
          dataKey="id"
          loading={loading}
          responsiveLayout="scroll"
          header={renderHeader}
          emptyMessage="No product found."
        >
          <Column header="Order#" field="orderNumber" />
          <Column
            header="Status"
            field="status"
            style={{ textTransform: "capitalize" }}
          />
          <Column header="Amount" field="amount" />
          <Column header="Ordered On" field="date" />
          <Column body={actionTemplate} style={{ textAlign: "right" }} />
        </DataTable>
      </Card>
    </Dashboard>
  );
};

export default Orders;
