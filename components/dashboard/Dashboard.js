import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Menu } from "primereact/menu";
import React, { useRef, useState } from "react";

import { auth, db, doc, getDoc, onAuthStateChanged } from "../../firebase";
import { authUser } from "../../store/auth";

const items = [
  {
    label: "Update ksdghdsjghjl dskllgkdlshgkldsg dskglhdsklhgdskg dkhslghkl",
    icon: "pi pi-refresh",
  },
  {
    label: "Delete",
    icon: "pi pi-times",
  },
  {
    label: "React Website",
    icon: "pi pi-external-link",
    command: () => {
      window.location.href = "https://reactjs.org/";
    },
  },
  {
    label: "Upload",
    icon: "pi pi-upload",
    command: () => {
      window.location.hash = "/fileupload";
    },
  },
];

const Dashboard = ({ children }) => {
  const [session, setSession] = useAtom(authUser);
  const [user, setUser] = React.useState(null);
  const menu = useRef(null);
  const router = useRouter();
  const [asideNav, setAsideNav] = useState(false);
  const toggleAside = () => {
    setAsideNav((state) => (state = !state));
  };
  const navClicked = (e) => {
    const el = e.target;
    el.classList.add("activeClick");
    setTimeout(() => {
      el.classList.remove("activeClick");
    }, 500);
    el.classList.toggle("active");
  };

  // React.useEffect(() => {
  //   (async () => {
  //     onAuthStateChanged(auth, (user) => {
  //       if (user) {
  //         setUser(user);
  //       }
  //     });
  //   })();
  // }, []);

  // React.useEffect(() => {
  //   (async () => {
  //     if (user) {
  //       const docRef = doc(db, "users", user.uid);
  //       const docSnap = await getDoc(docRef);
  //       if (docSnap.exists()) {
  //         console.log("====================================");
  //         console.log(...docSnap.data());
  //         console.log("====================================");
  //         // setSession({
  //         //   data: {
  //         //     ...docSnap.data(),
  //         //   },
  //         //   isLoggedIn: true,
  //         // });
  //         router.push("/dashboard");
  //       } else {
  //         console.log("No such document!");
  //       }
  //     } else {
  //       router.push("/");
  //     }
  //   })();
  // }, [user]);

  // if (!session.isLoggedIn) {
  //   return <h1>Loading...</h1>;
  // }

  React.useEffect(() => {
    const el = document.querySelector(".asinyo__dashboard__aside__nav");
    asideNav ? el.classList.remove("position") : el.classList.add("position");
  }, [asideNav]);

  return (
    <div className="asinyo__dashboard">
      <aside className={`asinyo__dashboard__aside ${asideNav && "active"}`}>
        <div className="asinyo__dashboard__aside__brand">LIFESPAN PHARMACY</div>
        <nav className="asinyo__dashboard__aside__nav">
          <ul className="asinyo__dashboard__aside__nav__lists">
            {/* <li
              className={`asinyo__dashboard__aside__nav__lists__list ${
                router.pathname == "/dashboard" && "link-active"
              }`}
              onClick={navClicked}
            >
              <Link href="/dashboard">
                <a className="link__wrapper">
                  <div className="label">
                    <div className="icon__mini">
                      <i className="pi pi-home"></i>
                    </div>
                    <span>Dashboard</span>
                  </div>
                </a>
              </Link>
            </li> */}
            <li
              className={`asinyo__dashboard__aside__nav__lists__list ${
                router.pathname == "/dashboard/orders" && "link-active"
              }`}
              onClick={navClicked}
            >
              <Link href="/dashboard/orders">
                <a className="link__wrapper">
                  <div className="label">
                    <div className="icon__mini">
                      <i className="pi pi-shopping-cart"></i>
                    </div>
                    <span>Orders</span>
                  </div>
                </a>
              </Link>
            </li>
            <li
              className={`asinyo__dashboard__aside__nav__lists__list ${
                router.pathname == "/dashboard/orders" && "link-active"
              }`}
              onClick={navClicked}
            >
              <Link href="/dashboard/prescriptions">
                <a className="link__wrapper">
                  <div className="label">
                    <div className="icon__mini">
                      <i className="pi pi-briefcase"></i>
                    </div>
                    <span>Prescriptions</span>
                  </div>
                </a>
              </Link>
            </li>
            {/* <li
              className={`asinyo__dashboard__aside__nav__lists__list ${
                router.pathname == "/dashboard/customers" && "link-active"
              }`}
              onClick={navClicked}
            >
              <Link href="/dashboard/customers">
                <a className="link__wrapper">
                  <div className="label">
                    <div className="icon__mini">
                      <i className="pi pi-users"></i>
                    </div>
                    <span>Customers</span>
                  </div>
                </a>
              </Link>
            </li> */}
            <li
              className={`asinyo__dashboard__aside__nav__lists__list ${
                (router.pathname === "/dashboard/products" ||
                  router.pathname === "/dashboard/products/catalogue") &&
                "link-active"
              }`}
            >
              <div
                className={`link__wrapper ${
                  (router.pathname === "/dashboard/products" ||
                    router.pathname === "/dashboard/products/catalogue") &&
                  "active"
                }`}
                onClick={navClicked}
              >
                <div className="label">
                  <div className="icon__mini">
                    <i className="pi pi-palette"></i>
                  </div>
                  <span>Products</span>
                </div>
                <div className="icon__right"></div>
              </div>
              <div className="dropdown">
                <ul>
                  <li
                    className={`${
                      router.pathname == "/dashboard/products" &&
                      "dropdown-active"
                    }`}
                  >
                    <Link href="/dashboard/products">
                      <a>View Products</a>
                    </Link>
                  </li>
                  {/* <li
                    className={`${
                      router.pathname == "/dashboard/products/catalogue" &&
                      "dropdown-active"
                    }`}
                  >
                    <Link href="/dashboard/products/catalogue">
                      <a>Catalogue</a>
                    </Link>
                  </li> */}
                </ul>
              </div>
            </li>
            <li
              className={`asinyo__dashboard__aside__nav__lists__list ${
                router.pathname === "/dashboard/users" && "link-active"
              }`}
            >
              <div
                className={`link__wrapper ${
                  router.pathname === "/dashboard/users" && "active"
                }`}
                onClick={navClicked}
              >
                <div className="label">
                  <div className="icon__mini">
                    <i className="pi pi-user-plus"></i>
                  </div>
                  <span>Users</span>
                </div>
                <div className="icon__right"></div>
              </div>
              <div className="dropdown">
                <ul>
                  <li
                    className={`${
                      router.pathname == "/dashboard/users" && "dropdown-active"
                    }`}
                  >
                    <Link href="/dashboard/users">
                      <a>View Users</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </nav>
        <div
          className="asinyo__dashboard__aside__toggle__icon"
          role="button"
          onClick={toggleAside}
        >
          <i className="pi pi-chevron-left"></i>
        </div>
      </aside>
      <main className="asinyo__dashboard__main">
        <header className="asinyo__dashboard__main__header">
          <div className="asinyo__dashboard__main__header__left">Search...</div>
          <ul className="asinyo__dashboard__main__header__right">
            <li className="asinyo__dashboard__main__header__right__list">
              <div className="label">
                <i
                  className="pi pi-bell p-text-secondary p-overlay-badge"
                  style={{ fontSize: "2rem" }}
                >
                  <Badge value="2"></Badge>
                </i>
              </div>
              <div className="dropdown">Notification</div>
            </li>
            <li className="asinyo__dashboard__main__header__right__list">
              <div className="label">
                {/* <Avatar image="images/avatar/asiyajavayant.png" className="mr-2" size="large" shape="circle" /> */}
                <Avatar
                  icon="pi pi-user"
                  size="large"
                  style={{ color: "#ffffff" }}
                  shape="circle"
                />
                <span>Admin</span>
              </div>
              <div className="dropdown">
                <ul>
                  <li>
                    <Link href="/profile">
                      <a>
                        <span>
                          <i className="pi pi-user"></i>
                        </span>
                        <span>Profile</span>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/preferences">
                      <a>
                        <span>
                          <i className="pi pi-cog"></i>
                        </span>
                        <span>Preferences</span>
                      </a>
                    </Link>
                  </li>
                  <div className="separator"></div>
                  <li className="profile">
                    <Link href="/sign-out">
                      <a>
                        <span>
                          <i className="pi pi-sign-out"></i>
                        </span>
                        <span>Sign Out</span>
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <Menu model={items} popup ref={menu} id="popup_menu" />
        </header>
        <section className="asinyo__dashboard__main__content">
          {children}
        </section>

        <footer className="footer">
          <div className="asinyo__footer__copyright">
            <strong>
              &copy;{new Date().getUTCFullYear()} LIFESPAN PHARMACY. All Rights Reserved
            </strong>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
