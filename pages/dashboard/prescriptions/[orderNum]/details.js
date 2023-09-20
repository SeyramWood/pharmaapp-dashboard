import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import React, { useEffect } from "react";
import { useRef } from "react";
import AsinyoImage from "../../../../components/AsinyoImage";
import { Dashboard } from "../../../../components/dashboard";
import { db, doc, getDoc, updateDoc, toDate } from "../../../../firebase";
import { formatCurrency } from "../../../../helpers";
import { TextField } from "../../../../components/common/input";
import useFormValidation from "../../../../components/common/form/useFormValidation";

const OrderDetails = () => {
  const toast = useRef(null);
  const router = useRouter();
  const [order, setOrder] = React.useState({});
  const { orderNum } = router.query;

  const statusForm = useFormValidation(
    { status: "" },
    { status: "required" },
    saveOrderChanges
  );

  const formatDate = (value) => {
    const d = new Date(value);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return d.toLocaleDateString("en-US", options);
  };

  async function saveOrderChanges() {
    try {
      const orderRef = doc(db, "orders", orderNum);
      await updateDoc(orderRef, {
        status: statusForm.state.status,
      });

      setTimeout(() => {
        getOrder();
      }, 1000);
      toast.current.show({
        severity: "success",
        summary: "Status updated successfully.",
        life: 3000,
      });
    } catch (error) {
      console.log(error);
    }
  }

  const getOrder = async () => {
    try {
      const docRef = doc(db, "orders", orderNum);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setOrder(
          (state) =>
            (state = {
              ...docSnap.data(),
              date: formatDate(docSnap.data().date.toDate()),
              amount: formatCurrency(parseFloat(docSnap.data().amount)),
              products: docSnap.data().products.map((p) => {
                return {
                  ...p,
                  price: formatCurrency(parseFloat(p.price)),
                  amount: formatCurrency(parseFloat(p.price * p.quantity)),
                };
              }),
            })
        );
        console.log(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (orderNum) {
      getOrder();
    }
  }, [orderNum]);

  useEffect(() => {
    (() => {
      statusForm.setValues({ status: order.status });
    })();
  }, [order]);

  return (
    <>
      <Toast ref={toast} />

      <Dashboard>
        <Card className="p-4">
          <div className="table__header">
            <Button
              label="Orders"
              icon="pi pi-arrow-left"
              className="p-button-secondary p-button-text"
              onClick={() => router.push(`/dashboard/orders`)}
            />
            <h3>Order Details</h3>
          </div>

          {Object.keys(order).length > 0 ? (
            <div className="order__detail">
              <header className="order__detail__header">
                <div className="order__detail__header__top">
                  <h3 className="order__detail__header__top__id">{`Order #: ${order.orderNumber}`}</h3>
                  <div className="order__detail__header__top__btns">
                    <Button
                      label="Invoice"
                      icon="pi pi-print"
                      className="p-button-secondary p-button-text"
                    />
                    <Button
                      label="Track Order"
                      icon="pi pi-directions"
                      className="p-button-info p-button-text"
                    />
                  </div>
                </div>
                <div className="order__detail__header__bottom">
                  <span>
                    <span>Order status:</span>
                    <span className="status"> {order.status}</span>
                  </span>
                  <span>
                    <span>Order date:</span> {order.date}
                  </span>
                </div>
              </header>
              <section className="order__detail__content">
                <div className="order__detail__content__items">
                  {order.products.map((item) => (
                    <div
                      className="order__detail__content__items__item"
                      key={item.id}
                    >
                      <div className="order__detail__content__items__item__left">
                        <div className="image">
                          <AsinyoImage
                            src={item.src}
                            alt={item.name}
                            layout="fill"
                          />
                        </div>
                        <div className="info">
                          <p className="name">{`${item.name} | ${item.cat}`}</p>
                          <p className="meta">{`Price: ${formatCurrency(
                            item.price
                          )}`}</p>
                        </div>
                      </div>
                      <div className="order__detail__content__items__item__right">
                        <p className="amount">{formatCurrency(item.amount)}</p>
                        <p className="qty">{`Quantity: ${item.quantity}`}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <form onSubmit={statusForm.handleSubmit}>
                <section className="mb-2" style={{ display: "flex" }}>
                  <div style={{ marginRight: "2rem" }}>
                    <TextField
                      label="Delivered"
                      id="delivered"
                      type="radio"
                      name="status"
                      value="delivered"
                      checked={statusForm.state.status === "delivered"}
                      onChange={statusForm.handleChange}
                      severity="success"
                    />
                  </div>
                  <TextField
                    label="Pending"
                    id="pending"
                    type="radio"
                    name="status"
                    value="pending"
                    checked={statusForm.state.status === "pending"}
                    onChange={statusForm.handleChange}
                    severity="danger"
                  />
                </section>
                <Button
                  type="submit"
                  label="Update Status"
                  className="btn primary"
                />
              </form>

              <div className="order__detail__footer mt-4">
                <div className="order__detail__footer__payment">
                  <h4>Payment Method</h4>
                  <div className="content details">
                    <p>Pay on Delivery</p>
                  </div>
                  <h4>Payment Details</h4>
                  <div className="content details">
                    <p>{`Delivery Fee:  ${formatCurrency(
                      order.deliveryFee
                    )}`}</p>
                    <p>{`Subtotal:  ${formatCurrency(order.subTotal)}`}</p>
                    <p>{`Total:  ${formatCurrency(order.amount)}`}</p>
                  </div>
                </div>
                <div className="order__detail__footer__delivery">
                  <h4>Customer Details</h4>
                  <div className="content method">
                    <div className="content details">
                      <p>{`${order.user.firstName} ${order.user.lastName}`}</p>
                      <p>{`${order.user.phone}`}</p>
                      <p>{`${order.user.email}`}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <h3>Loading orders...</h3>
          )}
        </Card>
      </Dashboard>
    </>
  );
};

export default OrderDetails;
