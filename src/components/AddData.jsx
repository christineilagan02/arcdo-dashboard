import { useState } from 'react';
import axios from 'axios';

const AddData = () => {
  const [formType, setFormType] = useState('');
  const [formData, setFormData] = useState({
    company: '',
    companyAddress: '',
    natureOfBusiness: '',
    dateOfValidation: '',
    dateOfExpiration: '',
    contactPerson: {
      firstName: '',
      middleName: '',
      lastName: '',
      contactNumber: '',
      emailAddress: '',
      position: '',
    },
    ojtCoordinator: {
      firstName: '',
      middleName: '',
      lastName: '',
      campus: '',
      college: '',
      emailAddress: '',
      assignStudent: '',
      officeLocation: '',
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (name.includes('ojtCoordinator')) {
        const field = name.split('.')[1];
        return {
          ...prevData,
          ojtCoordinator: { ...prevData.ojtCoordinator, [field]: value },
        };
      }
      if (name.includes('contactPerson')) {
        const field = name.split('.')[1];
        return {
          ...prevData,
          contactPerson: { ...prevData.contactPerson, [field]: value },
        };
      }
      return { ...prevData, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("📤 Submitting form data:", JSON.stringify({ formType, formData }, null, 2));
  
    try {
      const response = await axios.post("http://localhost:3001/api/addData", {
        formType,
        formData: {
          ...formData,
          dateOfValidation: formData.dateOfValidation || null,  // Ensures null if empty
          dateOfExpiration: formData.dateOfExpiration || null,  // Prevents undefined values
          remarks: formData.remarks || null,  // Ensures optional remarks
        }
      });
  
      console.log("✅ Success:", response.data);
      alert("Data added successfully!");
    } catch (error) {
      console.error("❌ Error submitting form:", error.response?.data || error.message);
      alert("Error: " + (error.response?.data?.message || "Failed to submit data."));
    }
  };
  
  
  

  return (
    <div className="bg-gray-50 md:ml-[250px] mt-10 p-7 min-h-screen overflow-auto">
        <p><b> Add Data</b></p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dropdown to select form type */}
        <div>
          <label htmlFor="formType" className="block text-gray-700 mt-10">Add Data For:</label>
          <select
            id="formType"
            name="formType"
            value={formType}
            onChange={(e) => setFormType(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="">Select Data Type</option>
            <option value="hte">HTE</option>
            <option value="moas">MOAs</option>
            <option value="industryPartner">Industry Partner</option>
            <option value="ojtCoordinator">OJT Coordinator</option>
          </select>
        </div>

        {/* Conditional inputs based on formType */}
        {formType !== 'ojtCoordinator' && (
          <div>
            <label htmlFor="company" className="block text-gray-700">Company Name</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        )}

        {formType !== 'ojtCoordinator' && (
          <div>
            <label htmlFor="companyAddress" className="block text-gray-700">Company Address</label>
            <input
              type="text"
              id="companyAddress"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleInputChange}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        )}

        {formType !== 'ojtCoordinator' && (
          <div>
            <label htmlFor="natureOfBusiness" className="block text-gray-700">Nature of Business</label>
            <input
              type="text"
              id="natureOfBusiness"
              name="natureOfBusiness"
              value={formData.natureOfBusiness}
              onChange={handleInputChange}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        )}

        {formType !== 'ojtCoordinator' && (
          <div>
            <label htmlFor="dateOfValidation" className="block text-gray-700">Date of Validation</label>
            <input
              type="date"
              id="dateOfValidation"
              name="dateOfValidation"
              value={formData.dateOfValidation}
              onChange={handleInputChange}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
        )}

        {formType !== 'ojtCoordinator' && (
          <div>
            <label htmlFor="dateOfExpiration" className="block text-gray-700">Date of Expiration</label>
            <input
              type="date"
              id="dateOfExpiration"
              name="dateOfExpiration"
              value={formData.dateOfExpiration}
              onChange={handleInputChange}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full mb-10"
            />
          </div>
        )}

        {/* Contact Person fields for HTE, MOAs, Industry Partner */}
        <p><b> Contact </b></p>
        {formType !== 'ojtCoordinator' && (
          <>
            <div className="grid grid-cols-2 gap-4 mt-10">
              <div>
                <label htmlFor="contactPerson.firstName" className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  id="contactPerson.firstName"
                  name="contactPerson.firstName"
                  value={formData.contactPerson.firstName}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div>
                <label htmlFor="contactPerson.middleName" className="block text-gray-700">Middle Name</label>
                <input
                  type="text"
                  id="contactPerson.middleName"
                  name="contactPerson.middleName"
                  value={formData.contactPerson.middleName}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactPerson.lastName" className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="contactPerson.lastName"
                  name="contactPerson.lastName"
                  value={formData.contactPerson.lastName}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div>
                <label htmlFor="contactPerson.contactNumber" className="block text-gray-700">Contact Number</label>
                <input
                  type="tel"
                  id="contactPerson.contactNumber"
                  name="contactPerson.contactNumber"
                  value={formData.contactPerson.contactNumber}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactPerson.emailAddress" className="block text-gray-700">Email Address</label>
                <input
                  type="email"
                  id="contactPerson.emailAddress"
                  name="contactPerson.emailAddress"
                  value={formData.contactPerson.emailAddress}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div>
                <label htmlFor="contactPerson.position" className="block text-gray-700">Position</label>
                <input
                  type="text"
                  id="contactPerson.position"
                  name="contactPerson.position"
                  value={formData.contactPerson.position}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>
          </>
        )}

        {/* OJT Coordinator fields */}
        {formType === 'ojtCoordinator' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="ojtCoordinator.firstName" className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  id="ojtCoordinator.firstName"
                  name="ojtCoordinator.firstName"
                  value={formData.ojtCoordinator.firstName}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div>
                <label htmlFor="ojtCoordinator.middleName" className="block text-gray-700">Middle Name</label>
                <input
                  type="text"
                  id="ojtCoordinator.middleName"
                  name="ojtCoordinator.middleName"
                  value={formData.ojtCoordinator.middleName}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="ojtCoordinator.lastName" className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="ojtCoordinator.lastName"
                  name="ojtCoordinator.lastName"
                  value={formData.ojtCoordinator.lastName}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div>
                <label htmlFor="ojtCoordinator.campus" className="block text-gray-700">Campus</label>
                <input
                  type="text"
                  id="ojtCoordinator.campus"
                  name="ojtCoordinator.campus"
                  value={formData.ojtCoordinator.campus}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div>
                <label htmlFor="ojtCoordinator.college" className="block text-gray-700">College</label>
                <input
                  type="text"
                  id="ojtCoordinator.college"
                  name="ojtCoordinator.college"
                  value={formData.ojtCoordinator.college}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div>
                <label htmlFor="ojtCoordinator.assignStudent" className="block text-gray-700">Assigned Student</label>
                <input
                  type="tel"
                  id="ojtCoordinator.assignStudent"
                  name="ojtCoordinator.assignStudent"
                  value={formData.ojtCoordinator.assignStudent}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="ojtCoordinator.emailAddress" className="block text-gray-700">Email Address</label>
                <input
                  type="email"
                  id="ojtCoordinator.emailAddress"
                  name="ojtCoordinator.emailAddress"
                  value={formData.ojtCoordinator.emailAddress}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div>
              <label htmlFor="ojtCoordinator.officeLocation" className="block text-gray-700">Office Location</label>
              <input
                type="text"
                id="ojtCoordinator.officeLocation"
                name="ojtCoordinator.officeLocation"
                value={formData.ojtCoordinator.officeLocation}
                onChange={handleInputChange}
                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            </div>
          </>
        )}

        <button type="submit" className="mt-4 bg-bg hover:bg-red-600 text-white px-4 py-2 rounded-md w-full sm:w-10/12 mx-auto flex justify-center">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddData;
