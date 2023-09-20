import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import useFormValidation from "../../../components/common/form/useFormValidation";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
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
const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayModal, setDisplayModal] = useState(false);
  const [imageURI, setImageURI] = useState("");
  const toast = useRef(null);
  const router = useRouter();

  const getPrescriptions = async () => {
    try {
      const snapshot = await getDocs(collection(db, "prescriptions"));
      let prescriptions = [];
      if (snapshot) {
        snapshot.forEach((doc) => {
          prescriptions = [
            {
              ...doc.data(),
            },
            ...prescriptions,
          ];
        });
        setPrescriptions((state) => (state = [...prescriptions]));
        setLoading(false);
        console.log(prescriptions);
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
      return (
        <Image
          src={row.src}
          alt="Image"
          width="200"
          preview
          imageStyle={{ zIndex: "99999" }}
        />
      );
    }
  };

  const usernameBody = (row) => {
    return <span className="image-text">{row.email}</span>;
  };

  const fullNameBody = (row) => {
    return (
      <span>
        {row.user.firstName} {row.user.lastName}
      </span>
    );
  };

  const actionTemplate = (data) => {
    return (
      <div>
        <Button
          type="button"
          icon="pi pi-eye"
          tooltip="View prescription"
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
    getPrescriptions();
  }, []);

  return (
    <Dashboard>
      <Toast ref={toast} />

      <Card>
        <div className="table__header">
          <h3>Prescriptions</h3>
          <div></div>
        </div>
        <DataTable
          value={prescriptions}
          paginator
          className="p-datatable-customers"
          rows={50}
          dataKey="id"
          loading={loading}
          responsiveLayout="scroll"
          header={renderHeader}
          emptyMessage="No product found."
        >
          <Column header="Customer" body={fullNameBody} />
          <Column
            header="Status"
            field="status"
            style={{ textTransform: "capitalize" }}
          />
          <Column header="Phone" field="user.phone" />
          <Column header="Email" field="user.email" />
          <Column header="Prescription" body={imageBody} />
          {/* <Column body={actionTemplate} style={{ textAlign: "right" }} /> */}
        </DataTable>
      </Card>
    </Dashboard>
  );
};

export default Prescriptions;
