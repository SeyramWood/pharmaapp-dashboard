import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";

import { Card } from "../../../components/common";
import useFormValidation from "../../../components/common/form/useFormValidation";
import { InputFieldWrapper } from "../../../components/common/input";
import { Dashboard } from "../../../components/dashboard";
import { auth, collection, db, doc, getDocs, setDoc } from "../../../firebase";

const Users = () => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayModal, setDisplayModal] = useState(false);
  const toast = useRef(null);
  const router = useRouter();
  const newUser = useFormValidation(
    {
      firstName: "",
      lastName: "",
      phone: "",
      username: "",
      password: "",
    },
    {
      firstName: "required|string",
      lastName: "required|string",
      phone: "required|numeric|min:10|max:10",
      username: "required|email",
      password: "required|min:8",
    },
    addUser
  );

  async function addUser() {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        newUser.state.username.trim(),
        newUser.state.password.trim()
      );
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          firstName: newUser.state.firstName.trim(),
          lastName: newUser.state.lastName.trim(),
          phone: newUser.state.phone.trim(),
          email: newUser.state.username.trim(),
        });
      }
      newUser.updateIsSubmitting(false);
      newUser.clearValues();
      setTimeout(() => {
        getUsers();
      }, 1000);
    } catch (error) {
      newUser.updateIsSubmitting(false);
      console.log(error);
    }
  }

  const formatDate = (value) => {
    const d = new Date(value);
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return d.toLocaleDateString("en-GH", options);
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

  const avatarBody = (row) => {
    if (row.avatar) {
      return <Avatar image={row.avatar} size="large" shape="circle" />;
    }
    return (
      <Avatar
        icon="pi pi-user"
        size="large"
        style={{ color: "#ffffff" }}
        shape="circle"
      />
    );
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
  const getUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      users = [];
      snapshot.forEach((doc) => {
        users = [doc.data(), ...users];
      });
      setUsers((state) => (state = [...users]));
      setLoading(false);
      console.log(users);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Dashboard>
      <Toast ref={toast} />
      <Dialog
        header="Add New User"
        visible={displayModal}
        modal={false}
        style={{ width: "40vw" }}
        onHide={() => {
          setDisplayModal(false);
          newUser.clearValues();
        }}
      >
        <form onSubmit={newUser.handleSubmit}>
          <InputFieldWrapper
            label="First Name"
            id="firstName"
            errors={newUser.errors.firstName}
          >
            <InputText
              id="lastName"
              aria-describedby="firstName"
              name="firstName"
              value={newUser.state.firstName}
              onChange={newUser.handleChange}
              onBlur={newUser.handleBlur}
            />
          </InputFieldWrapper>

          <InputFieldWrapper
            label="Last Name"
            id="lastName"
            errors={newUser.errors.lastName}
          >
            <InputText
              id="lastName"
              aria-describedby="lastName"
              name="lastName"
              value={newUser.state.lastName}
              onChange={newUser.handleChange}
              onBlur={newUser.handleBlur}
            />
          </InputFieldWrapper>

          <InputFieldWrapper
            label="Phone"
            id="phone"
            errors={newUser.errors.phone}
          >
            <InputText
              id="phone"
              aria-describedby="phone"
              name="phone"
              value={newUser.state.phone}
              onChange={newUser.handleChange}
              onBlur={newUser.handleBlur}
            />
          </InputFieldWrapper>

          <InputFieldWrapper
            label="Username"
            id="username"
            errors={newUser.errors.username}
          >
            <InputText
              id="username"
              aria-describedby="username"
              name="username"
              value={newUser.state.username}
              onChange={newUser.handleChange}
              onBlur={newUser.handleBlur}
            />
          </InputFieldWrapper>
          <InputFieldWrapper
            label="Password"
            id="password"
            errors={newUser.errors.password}
          >
            <InputText
              type="password"
              id="password"
              aria-describedby="password"
              name="password"
              value={newUser.state.password}
              onChange={newUser.handleChange}
              onBlur={newUser.handleBlur}
            />
          </InputFieldWrapper>

          <div className="submit__button">
            <Button
              type="submit"
              label="Add"
              className="p-button-success"
              icon="pi pi-check"
              loading={newUser.isSubmitting}
            />
          </div>
        </form>
      </Dialog>
      <Card>
        <div className="table__header">
          <h3>Users</h3>
          <Button
            type="button"
            label="Add New User"
            className="p-button-primary"
            icon="pi pi-plus"
            onClick={() => setDisplayModal(true)}
          />
        </div>
        <DataTable
          value={users}
          paginator
          className="p-datatable-customers"
          rows={10}
          dataKey="id"
          loading={loading}
          responsiveLayout="scroll"
          header={renderHeader}
          emptyMessage="No user found."
        >
          <Column
            header="Username"
            filterField="users.username"
            style={{ minWidth: "12rem" }}
            body={usernameBody}
          />
          <Column
            header="Full Name"
            filterField="representative"
            showFilterMatchModes={false}
            filterMenuStyle={{ width: "14rem" }}
            style={{ minWidth: "14rem" }}
            body={fullNameBody}
          />
          <Column header="Phone" field="phone" style={{ minWidth: "10rem" }} />
          <Column body={actionTemplate} style={{ textAlign: "right" }} />
        </DataTable>
      </Card>
    </Dashboard>
  );
};

export default Users;
