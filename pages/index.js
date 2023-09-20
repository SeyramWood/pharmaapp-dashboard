import { signInWithEmailAndPassword } from "firebase/auth";
import { atom, useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Spinner from "react-svg-spinner";

import useFormValidation from "../components/common/form/useFormValidation";
import { TextField } from "../components/common/input";
import { auth, db, doc, getDoc } from "../firebase";
import gb from "../public/login.svg";
import Axios from "../services/axios";
import { authUser } from "../store/auth";

const AsinyoSignin = () => {
  const [session, setSession] = useAtom(authUser);
  const router = useRouter();
  const {
    state,
    isSubmitting,
    errors,
    updateIsSubmitting,
    handleChange,
    handleBlur,
    handleKeyDown,
    handleSubmit,
    setServerErrors,
  } = useFormValidation(
    {
      username: "",
      password: "",
    },
    {
      merchantType: "required",
      username: "required|email_phone",
      password: "required|min:8",
    },
    login
  );

  async function login(values) {
    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        state.username.trim(),
        state.password.trim()
      );
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSession({
            data: {
              ...docSnap.data(),
            },
            isLoggedIn: true,
          });
          router.push("/dashboard/orders");
        } else {
          console.log("No such document!");
        }
        updateIsSubmitting(false);
      }
    } catch (error) {
      updateIsSubmitting(false);
      console.log(error);
    }
  }

  return (
    <main className="login__page">
      <div className="login__page__left">
        <div className="login__page__left__form__wrapper">
          <form
            onSubmit={handleSubmit}
            className="asinyo__account__wrapper__panel__form"
          >
            <TextField
              label="Username"
              id="username"
              placeholder="user@example.com"
              type="email"
              name="username"
              value={state.username}
              errors={errors.username}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
            <TextField
              label="Password"
              placeholder="Enter password"
              name="password"
              type="password"
              value={state.password}
              errors={errors.password}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
            <button
              type="submit"
              className="account__btn mt-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Spinner color="white" thickness={3} size="32px" />
              ) : (
                "sign in"
              )}
            </button>
            {/* <div className="forgot__password">
              <Link href="/auth/merchant/forgot-password">
                <a>forgot password?</a>
              </Link>
            </div> */}
          </form>
        </div>
      </div>
      <div className="login__page__right">
        <div className="login__page__right__image">
          <div className="login__page__right__image__wrapper">
            <Image src={gb} alt="logo" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default AsinyoSignin;
