import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button/Button";
// import { useSelector } from "react-redux";
// import {
//   addAccessGroup,
//   deleteAccessGroup,
//   updateAccessGroup,
// } from "@/redux/slices/appSlice";
import { showToast } from "@/lib/toast";
import { AxiosError } from "axios";
import * as yup from "yup";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Loading from "@/components/Loading";
import PermissionsMain from "../components/PermissionMain";
import { permissions } from "../constants/permissions";

export default function AccessGroupModel({
  isOpen,
  closeModal,
  editAccesssGroupData,
  setEditAccesssGroupData,
  modelType,
  setModelType,
}: {
  isOpen: boolean;
  closeModal: () => void;
  editAccesssGroupData: any;
  setEditAccesssGroupData: any;
  modelType: string;
  setModelType: any;
}) {
  const [errors, setErrors] = useState<any>({});

  const validationSchema = yup.object().shape({
    name: yup.string().required("Access group name is required"),
    description: yup.string().required("Description is required"),
    permissions: yup
      .array()
      .test(
        "permissions-required",
        "At least one permission must be selected",
        function (value) {
          // Only validate if permissionView is true
          if (permissionView) {
            return Array.isArray(value) && value.length > 0;
          }
          return true;
        }
      ),
  });

  // const dispatch = useAppDispatch();
  // const { permissions } = useSelector((state: any) => state.app);

  const initForm = {
    name: "",
    description: "",
    permissions: [],
    status: true,
  };
  const [formData, setFormData] = useState(initForm);
  const [loading, setLoading] = useState(false);
  const [permissionView, setPermissionView] = useState(false);

  useEffect(() => {
    if (editAccesssGroupData) {
      setFormData(editAccesssGroupData);
    }
  }, [editAccesssGroupData]);

  // const handleInputChange = (field: string, value: any) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));
  // };

  const validateForm = async (): Promise<boolean> => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (!isValid) {
      return;
    }
    setLoading(true);
    try {
      // if (modelType === "delete") {
      //   const res = await axios.delete(`access-group/${editAccesssGroupData?_id}`);
      //   showToast("success", "", res?.data?.message);
      //   dispatch(deleteAccessGroup(editAccesssGroupData?_id));
      //   handleClose();
      // } else {
      //   const payload: any = {
      //     name: formData.name,
      //     description: formData.description,
      //   };

      //   if (editAccesssGroupData) {
      //     payload.id = editAccesssGroupData?._id;

      //     // Compare permissions before including
      //     const existingPerms = JSON.stringify(
      //       editAccesssGroupData.permissions ?? []
      //     );
      //     const newPerms = JSON.stringify(formData.permissions ?? []);

      //     if (existingPerms !== newPerms) {
      //       payload.permissions = formData.permissions;
      //     }

      //     const res = await axios.put("update-access-group", payload);
      //     showToast("success", "", res?.data?.message);
      //     dispatch(
      //       updateAccessGroup({
      //         ...payload,
      //         _id: editAccesssGroupData?._id,
      //         permissions: formData.permissions,
      //         createdAt: editAccesssGroupData?.createdAt,
      //       })
      //     );
      //     handleClose();
      //   } else {
      //     payload.permissions = formData.permissions;
      //     const res = await axios.post("create-access-group", payload);
      //     showToast("success", "", res?.data?.message);
      //     dispatch(addAccessGroup(res?.data?.Response));
      //     handleClose();
      //   }
      // }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      const errData = axiosError?.response?.data;
      showToast(
        "error",
        errData?.title || "Error",
        errData?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setEditAccesssGroupData(null);
      setPermissionView(false);
      setErrors({});
      setFormData(initForm);
      setModelType("");
      setLoading(false);
      closeModal();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className={`${
        modelType === "Delete" ? "max-w-[600px]" : "max-w-[1000px]"
      } p-5 lg:p-10 m-4`}>
      <div className="px-2">
        <h4 className="mb-2 lg:text-2xl text-xl font-semibold text-gray-800 dark:text-white/90">
          {modelType === "Delete"
            ? "Delete"
            : modelType === "Read"
            ? "View"
            : editAccesssGroupData
            ? "Update"
            : "Add a new"}{" "}
          Access Group
        </h4>

        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
          {modelType === "Delete"
            ? "Are you sure you want to delete this access group?"
            : "Organize and manage access groups with ease."}
        </p>
      </div>
      <form className="flex flex-col gap-6 w-full  p-2" onSubmit={handleSubmit}>
        {modelType === "Delete" ? (
          <></>
        ) : (
          <div className="flex flex-col gap-6 w-full">
            {!permissionView ? (
              <div className="flex flex-col gap-5 w-full">
                <div className="w-full">
                  <Label required={modelType !== "Read"}>Name</Label>
                  <Input
                    type="text"
                    placeholder="Access Group"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }));
                      setErrors((prev: any) => ({ ...prev, name: "" }));
                    }}
                    readOnly={modelType === "Read"}
                    className="w-full"
                    error={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                <div className="w-full">
                  <Label required={modelType !== "Read"}>Description</Label>
                  <TextArea
                    placeholder="Type description here..."
                    value={formData.description}
                    onChange={(value: string) => {
                      setFormData((prev) => ({
                        ...prev,
                        description: value,
                      }));
                      setErrors((prev: any) => ({ ...prev, description: "" }));
                    }}
                    readOnly={modelType === "Read"}
                    className="w-full"
                    error={!!errors.description}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>
                
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <Label required={modelType !== "Read"}>Permissions</Label>
                <PermissionsMain
                  permissions={permissions}
                  selectedPermissions={formData?.permissions}
                  setSelectedPermissions={(newPerms: any) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      permissions: newPerms,
                    }))
                  }
                  readOnly={modelType === "Read"}
                  className="w-full"
                />
                {errors.permissions && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.permissions}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        <div
          className={`flex flex-wrap gap-3 pt-4 ${
            modelType === "Read" && !permissionView
              ? "justify-end"
              : "justify-between"
          }`}>
          {!(modelType === "Read" && !permissionView) && (
            <Button
              variant="outline"
              onClick={
                !permissionView ? handleClose : () => setPermissionView(false)
              }
              type="button"
              disabled={loading}
              className="flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] min-w-[100px] w-full sm:w-auto">
              {!permissionView ? "Cancel" : "Back"}
            </Button>
          )}
          {modelType !== "Delete" && !permissionView && (
            <Button
              type="button"
              onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                const isValid = await validateForm();
                if (isValid) {
                  setPermissionView(true);
                }
              }}
              className="flex  w-full sm:w-auto justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 min-w-[175px]">
              Next
            </Button>
          )}
          {permissionView && modelType !== "Read" && (
            <Button
              type="submit"
              disabled={loading}
              className="flex justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 min-w-[175px]  w-full sm:w-auto">
              {loading ? (
                <Loading size={1} style={2} />
              ) : (
                `${modelType === "Edit" ? "Update" : "Create"} Access Group`
              )}
            </Button>
          )}
          {modelType === "Delete" && (
            <Button
              type="submit"
              disabled={loading}
              className="flex justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 min-w-[175px]">
              {loading ? <Loading size={1} style={2} /> : "Delete"}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
