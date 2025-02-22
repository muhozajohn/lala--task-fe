import React from "react";
import Input from "../components/input";
import { FaUser, FaLock, FaEnvelope, FaPhoneVolume } from "react-icons/fa";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../components/Spinner";
import { validateAuth } from "../utils/validation";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import { FcGoogle } from "react-icons/fc";

import {
  selectLoginStatus,
  selectLoginError,
  makeSignup,
} from "../redux/auth/authSlice";
import { notifySuccess } from "../utils/notification";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectLoginStatus);
  const loginError = useSelector(selectLoginError);

  const formik = useFormik({
    initialValues: {
      fname: "",
      lname: "",
      email: "",
      phone: "",
      type: "",
      password: "",
    },
    validate: validateAuth,
    onSubmit: async (values) => {
      const resultAction = dispatch(makeSignup(values));
      if (resultAction) {
        formik.resetForm();
        notifySuccess("A new has been created successfully!");
        // set timeout
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        if (resultAction.payload) {
          console.log("Signup Error:", resultAction.payload);
          formik.resetForm();
        } else {
          console.log("Signup Error:", resultAction.error);
          formik.resetForm();
        }
      }
    },
  });

  const handleGoogleLogin = () => {
    console.log("Login with Google clicked");
  };

  return (
    <form action="" className="w-1/2 mx-auto ">
      {loginError && (
        <div className="text-sm text-red-800 font-normal mt-2">
          {loginError.message ? loginError.error : loginError}
        </div>
      )}
      <div className="flex items-center gap-4">
        <div className="flex flex-col w-full">
          <Input
            type="input"
            placeholder="Firstname"
            id="fname"
            icon={<FaUser />}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            values={formik.values.fname}
          />
          {formik.touched.fname && formik.errors.fname ? (
            <p className="text-sm text-red-800 font-normal">
              {formik.errors.fname}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col w-full">
          <Input
            type="input"
            placeholder="Lastname"
            id="lname"
            icon={<FaUser />}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            values={formik.values.lname}
          />
          {formik.touched.lname && formik.errors.lname ? (
            <p className="text-sm text-red-800 font-normal">
              {formik.errors.lname}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col w-full">
          <Input
            type="input"
            placeholder="Email"
            id="email"
            icon={<FaEnvelope />}
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
        <div className="flex flex-col w-full">
          <select
            className="text-black p-2 mt-2  duration-100 outline-none justify-between flex items-center gap-6 px-2  w-full rounded-md font-normal border-2 group-hover:border-slate-300 "
            id="type"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            values={formik.values.type}
          >
            <option>Select User Type</option>
            <option value="1">User</option>
            <option value="2">Admin</option>
          </select>
          {formik.touched.type && formik.errors.type ? (
            <p className="text-sm text-red-800 font-normal">
              {formik.errors.type}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col">
        <Input
          type="input"
          placeholder="Phone"
          id="phone"
          icon={<FaPhoneVolume />}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          values={formik.values.phone}
        />
        {formik.touched.phone && formik.errors.phone ? (
          <p className="text-sm text-red-800 font-normal">
            {formik.errors.phone}
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
          loading ? <Spinner classes={` !text-black !h-6 !w-6`} /> : "Sign Up"
        }
        styles={`w-full !scale-100 mt-6 mdl:mt-12 !bg-slate-200 text-black`}
      />
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      <Button
        click={handleGoogleLogin}
        title={
          <>
            <FcGoogle className="mr-2 font-bold text-base " /> Continue with Google
          </>
        }
        styles={`w-full !scale-100 mt-4  flex items-center justify-center`}
      />
    </form>
  );
};

export default Signup;
