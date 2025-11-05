"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Loading from "@/components/Loading";
import { showToast } from "@/lib/toast";
import { AxiosError } from "axios";
import * as yup from "yup";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import axios from "@/lib/axiosInstance";
import AccordionHeader from "./components/AccordionHeader";
import BasicInformationSection from "./sections/BasicInformationSection";
import TaxInformationSection from "./sections/TaxInformationSection";
import AddressSection from "./sections/AddressSection";
import AccountDetailsSection from "./sections/AccountDetailsSection";

interface ClientModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modelType: any;
  setModelType: any;
  selectedClient: any;
  setSelectedClient: any;
  setClients?: any;
  rowsPerPage?: any;
}

export default function ClientModal({
  isOpen,
  closeModal,
  modelType,
  setModelType,
  selectedClient,
  setSelectedClient,
  setClients,
  rowsPerPage,
}: ClientModalProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<string[]>(["basic"]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    businessName: "",
    clientIndustry: "",
    countryCode: "IN",
    cityTown: "",
    logo: null as File | null,

    vatNumber: "",
    clientType: "individual",
    taxTreatment: "overseas",

    // Address
    addressLine1: "",
    addressLine2: "",
    state: "",
    zipCode: "",

    
    ledgerConfiguration: "none", 
    linkLedger: "",
    addressCountry: "",
    addressState: "",
    addressCity: "",
    addressZipCode: "",
    addressStreet: "",
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
    ifscCode: "",
    swiftCode: "",
  });

  const validationSchema = yup.object().shape({
    businessName: yup.string().required("Business name is required"),
    clientIndustry: yup.string().required("Industry is required"),
    countryCode: yup.string().required("Country is required"),
  });

  const validateForm = async (): Promise<boolean> => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((e) => {
          if (e.path) newErrors[e.path] = e.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    if (modelType === "edit" && selectedClient) {
      setFormData({
        businessName: selectedClient.clientName || "",
        clientIndustry: selectedClient.industry || "",
        countryCode: selectedClient.countryCode || "IN",
        cityTown: selectedClient.cityTown || "",
        logo: null,
        vatNumber: selectedClient.vatNumber || "",
        clientType: selectedClient.clientType || "individual",
        taxTreatment: selectedClient.taxTreatment || "overseas",
        addressLine1: selectedClient.addressLine1 || "",
        addressLine2: selectedClient.addressLine2 || "",
        state: selectedClient.state || "",
        zipCode: selectedClient.zipCode || "",
        ledgerConfiguration: selectedClient.ledgerConfiguration || "none",
        linkLedger: selectedClient.linkLedger || "",
        addressCountry: selectedClient.addressCountry || "",
        addressState: selectedClient.addressState || "",
        addressCity: selectedClient.addressCity || "",
        addressZipCode: selectedClient.addressZipCode || "",
        addressStreet: selectedClient.addressStreet || "",
        bankName: selectedClient.bankName || "",
        accountNumber: selectedClient.accountNumber || "",
        accountHolderName: selectedClient.accountHolderName || "",
        ifscCode: selectedClient.ifscCode || "",
        swiftCode: selectedClient.swiftCode || "",
      });
    } else {
      setFormData({
        businessName: "",
        clientIndustry: "",
        countryCode: "IN",
        cityTown: "",
        logo: null,
        vatNumber: "",
        clientType: "individual",
        taxTreatment: "overseas",
        addressLine1: "",
        addressLine2: "",
        state: "",
        zipCode: "",
        ledgerConfiguration: "none",
        linkLedger: "",
        addressCountry: "",
        addressState: "",
        addressCity: "",
        addressZipCode: "",
        addressStreet: "",
        bankName: "",
        accountNumber: "",
        accountHolderName: "",
        ifscCode: "",
        swiftCode: "",
      });
      setLogoPreview(null);
    }
  }, [isOpen, modelType, selectedClient]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) {
      setErrors((p) => {
        const copy = { ...p };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((p) => ({ ...p, logo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoRemove = () => {
    setLogoPreview(null);
    setFormData((p) => ({ ...p, logo: null }));
  };

  const handleCountryChange = (option: any) => {
    if (option) {
      setFormData((p) => ({ ...p, countryCode: option.value }));
    }
  };

  const handleIndustryChange = (option: any) => {
    if (option) {
      setFormData((p) => ({ ...p, clientIndustry: option.value }));
      if (errors.clientIndustry) {
        setErrors((p) => {
          const copy = { ...p };
          delete copy.clientIndustry;
          return copy;
        });
      }
    }
  };

  const handleTaxTreatmentChange = (option: any) => {
    if (option) {
      setFormData((p) => ({ ...p, taxTreatment: option.value }));
    }
  };

  const handleLedgerChange = (option: any) => {
    if (option) {
      setFormData((p) => ({ ...p, linkLedger: option.value }));
    }
  };

  const handleAddressCountryChange = (option: any) => {
    if (option) {
      setFormData((p) => ({ ...p, addressCountry: option.value }));
    }
  };

  const handleAddressStateChange = (option: any) => {
    if (option) {
      setFormData((p) => ({ ...p, addressState: option.value }));
    }
  };

  const handleAddressCityChange = (option: any) => {
    if (option) {
      setFormData((p) => ({ ...p, addressCity: option.value }));
    }
  };

  const getTaxLabel = (country: string) => {
    const taxLabels: Record<string, string> = {
      IN: "GST Number",
      US: "EIN (Employer Identification Number)",
      GB: "VAT Registration Number",
      DE: "USt-IdNr. (VAT ID)",
      FR: "Numéro de TVA",
      AU: "ABN (Australian Business Number)",
      CA: "Business Number (BN)",
      JP: "Corporate Number",
      SG: "GST Registration Number",
    };
    return taxLabels[country] || "VAT Number";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (modelType !== "delete") {
      const isValid = await validateForm();
      if (!isValid) return;
    }

    setLoading(true);

    try {
      if (modelType === "delete") {
        const res = await axios.delete(`/clients/${selectedClient?._id}`);
        showToast("success", res?.data?.title, res?.data?.message);

        setClients((prev: any) => ({
          ...prev,
          Clients: prev.Clients.filter(
            (client: any) => client?._id !== selectedClient?._id
          ),
          totalRecords: prev.totalRecords - 1,
        }));

        handleClose();
      } else {
        const payload = {
          ...formData,
        };

        if (modelType === "edit") {
          const res = await axios.put(
            `/clients/${selectedClient?._id}`,
            payload
          );
          showToast("success", res?.data?.title, res?.data?.message);

          setClients((prev: any) => ({
            ...prev,
            Clients: prev.Clients.map((client: any) =>
              client._id === selectedClient?._id
                ? { ...client, ...payload }
                : client
            ),
          }));

          handleClose();
        } else {
          const res = await axios.post(`/clients`, payload);
          showToast("success", res?.data?.title, res?.data?.message);
          const response = res?.data?.Response;

          setClients((prev: any) => {
            const updatedClients = [...prev.Clients];

            if (updatedClients.length >= rowsPerPage) {
              updatedClients.pop();
            }

            return {
              ...prev,
              Clients: [response, ...updatedClients],
              totalRecords: prev.totalRecords + 1,
            };
          });

          handleClose();
        }
      }
    } catch (err) {
      const axiosErr = err as AxiosError<any>;
      showToast(
        "error",
        axiosErr?.response?.data?.title || "Error",
        axiosErr?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setFormData({
      businessName: "",
      clientIndustry: "",
      countryCode: "IN",
      cityTown: "",
      logo: null,
      vatNumber: "",
      clientType: "individual",
      taxTreatment: "overseas",
      addressLine1: "",
      addressLine2: "",
      state: "",
      zipCode: "",
      ledgerConfiguration: "link",
      linkLedger: "",
      addressCountry: "",
      addressState: "",
      addressCity: "",
      addressZipCode: "",
      addressStreet: "",
      bankName: "",
      accountNumber: "",
      accountHolderName: "",
      ifscCode: "",
      swiftCode: "",
    });
    setErrors({});
    setModelType("");
    setSelectedClient(null);
    setLogoPreview(null);
    setOpenAccordions(["basic"]);
    closeModal();
  };

  const getModalTitle = () => {
    switch (modelType) {
      case "add":
        return "Add New Client";
      case "edit":
        return "Edit Client";
      case "delete":
        return "Delete Client";
      default:
        return "";
    }
  };

  const getModalDescription = () => {
    switch (modelType) {
      case "add":
        return "Add a new client to the system.";
      case "edit":
        return "Update the client details.";
      case "delete":
        return "This action cannot be undone.";
      default:
        return "";
    }
  };

  const toggleAccordion = (section: string) => {
    setOpenAccordions((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className={`${
        modelType === "delete" ? "max-w-[600px]" : "max-w-[900px]"
      } p-5 lg:p-10 m-4 max-h-[90vh] overflow-y-auto`}
    >
      <div className="space-y-6">
        <header className="px-2">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {getModalTitle()}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {getModalDescription()}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          {modelType === "delete" ? (
            <div className="space-y-5">
              <div>
                <Label>Client Name</Label>
                <p className="rounded-lg bg-gray-100 dark:bg-gray-700 p-4 text-lg text-foreground">
                  {selectedClient?.clientName}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <AccordionHeader
                  section="basic"
                  title="Basic Information"
                  isOpen={openAccordions.includes("basic")}
                  onToggle={toggleAccordion}
                />
                {openAccordions.includes("basic") && (
                  <BasicInformationSection
                    formData={formData}
                    errors={errors}
                    logoPreview={logoPreview}
                    onInputChange={handleInputChange}
                    onLogoUpload={handleLogoUpload}
                    onLogoRemove={handleLogoRemove}
                    onCountryChange={handleCountryChange}
                    onIndustryChange={handleIndustryChange}
                  />
                )}
              </div>

              <div>
                <AccordionHeader
                  section="tax"
                  title="Tax Information"
                  isOpen={openAccordions.includes("tax")}
                  onToggle={toggleAccordion}
                />
                {openAccordions.includes("tax") && (
                  <TaxInformationSection
                    formData={formData}
                    onInputChange={handleInputChange}
                    onTaxTreatmentChange={handleTaxTreatmentChange}
                    getTaxLabel={getTaxLabel}
                  />
                )}
              </div>

              <div>
                <AccordionHeader
                  section="address"
                  title="Address"
                  isOpen={openAccordions.includes("address")}
                  onToggle={toggleAccordion}
                />
                {openAccordions.includes("address") && (
                  <AddressSection
                    formData={formData}
                    onInputChange={handleInputChange}
                    onAddressCountryChange={handleAddressCountryChange}
                    onAddressStateChange={handleAddressStateChange}
                    onAddressCityChange={handleAddressCityChange}
                  />
                )}
              </div>

              <div>
                <AccordionHeader
                  section="account"
                  title="Account Details"
                  isOpen={openAccordions.includes("account")}
                  onToggle={toggleAccordion}
                />
                {openAccordions.includes("account") && (
                  <AccountDetailsSection
                    formData={formData}
                    onInputChange={handleInputChange}
                    onLedgerChange={handleLedgerChange}
                  />
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between gap-3 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading} className="min-w-[160px]">
              {loading ? (
                <Loading size={1} style={2} />
              ) : modelType === "delete" ? (
                "Delete"
              ) : modelType === "edit" ? (
                "Update"
              ) : (
                "Add"
              )}{" "}
              Client
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
