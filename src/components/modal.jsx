import React from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  makeSignup,
  selectLoginError,
  selectLoginStatus,
} from "../redux/auth/authSlice";
import { validateAuth } from "../utils/validation";
import Input from "./input";
import Spinner from "./Spinner";
import Button from "./button";
import { notifySuccess } from "../utils/notification";
import { FaUser, FaLock, FaEnvelope, FaPhoneVolume } from "react-icons/fa";
const Modal = ({ isOpen, onClose, title }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form action="" className="w-full" onSubmit={formik.submitForm}>
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
              loading ? (
                <Spinner classes={` !text-black !h-6 !w-6`} />
              ) : (
                "Create a new user"
              )
            }
            styles={`w-full !scale-100 mt-6 mdl:mt-12 !bg-slate-200 text-black`}
          />
        </form>
      </div>
    </div>
  );
};

export default Modal;
