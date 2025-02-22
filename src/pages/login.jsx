import React, { useEffect } from "react";
import Input from "../components/input";
import { FaUser, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../components/Spinner";
import { validateLogin } from "../utils/validation";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import {
  selectLoginStatus,
  selectLoginError,
  getIsAuthenticated,
  makeLogin,
  makeGoogleLogin,
} from "../redux/auth/authSlice";
import { GoogleOAuthProvider } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectLoginStatus);
  const loginError = useSelector(selectLoginError);
  const isAuthenticated = useSelector(getIsAuthenticated);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: validateLogin,
    onSubmit: async (values) => {
      await dispatch(makeLogin(values));
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      // Dispatch the makeGoogleLogin action with the Google token
      const response = await dispatch(
        makeGoogleLogin(credentialResponse.credential)
      );
      if (response.payload) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleGoogleLoginError = () => {
    console.log("Google login failed");
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <form action="" className="w-1/2 mx-auto ">
        {loginError && (
          <div className="text-sm text-red-800 font-normal mt-2">
            {loginError.message ? loginError.error : loginError}
          </div>
        )}
        <div className="flex flex-col">
          <Input
            type="input"
            placeholder="Email"
            id="email"
            icon={<FaUser />}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            values={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <p className="text-sm text-red-800 font-normal">
              {formik.errors.email}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col">
          <Input
            type="input"
            placeholder="Password"
            inputType="password"
            id="password"
            icon={<FaLock />}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            values={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <p className="text-sm text-red-800 font-normal">
              {formik.errors.password}
            </p>
          ) : null}
        </div>
        <Button
          click={() => formik.submitForm()}
          title={
            loading ? <Spinner classes={` !text-black !h-6 !w-6`} /> : "Login"
          }
          styles={`w-full !scale-100 mt-6 mdl:mt-12 !bg-slate-200 text-black`}
        />
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          click={handleGoogleLogin}
          title={
            <>
              <FcGoogle className="mr-2 font-bold text-base " /> Continue with
              Google
            </>
          }
          styles={`w-full !scale-100 mt-4  flex items-center justify-center`}
        />
      </form>
    </GoogleOAuthProvider>
  );
};

export default Login;
