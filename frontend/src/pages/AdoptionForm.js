import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/AdoptionForm.css';

// Step 1: Personal Information (with editable Name and Email)
const PersonalInfoForm = ({ formData, onChange, nextStep, user }) => {
  const handleChange = (e) => {
    onChange({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="form-step">
      <h3>Step 1: Personal Information</h3>
      <label>
        Full Name:
        <input type="text" name="fullName" value={formData.fullName || ''} onChange={handleChange} required />
      </label>
      <label>
        Email:
        <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required />
      </label>
      <label>
        Phone:
        <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} required />
      </label>
      <label>
        Address:
        <input type="text" name="address" value={formData.address || ''} onChange={handleChange} required />
      </label>
      <div className="form-navigation">
        <button type="submit">Next →</button>
      </div>
    </form>
  );
};

// Step 2: Household Information
const HouseholdForm = ({ formData, onChange, nextStep, prevStep }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="form-step">
      <h3>Step 2: Household Information</h3>

      <label>
        Home Type:
        <select name="homeType" value={formData.homeType || ''} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="condo">Condo</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label>
        Do you rent or own?
        <select name="rentOwn" value={formData.rentOwn || ''} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="rent">Rent</option>
          <option value="own">Own</option>
        </select>
      </label>

      <label>
        Household Members (names/ages):
        <textarea name="householdMembers" value={formData.householdMembers || ''} onChange={handleChange} />
      </label>

      <label>
        Existing Pets:
        <textarea name="existingPets" value={formData.existingPets || ''} onChange={handleChange} />
      </label>

      <label className="checkbox-label">
        <input type="checkbox" name="smokingHome" checked={formData.smokingHome || false} onChange={handleChange} />
        Smoking home?
      </label>

      <label className="checkbox-label">
        <input type="checkbox" name="outdoorSpace" checked={formData.outdoorSpace || false} onChange={handleChange} />
        Do you have a safe outdoor space for the cat?
      </label>

      <div className="form-navigation">
        <button type="button" onClick={prevStep}>← Back</button>
        <button type="submit">Next →</button>
      </div>
    </form>
  );
};

// Step 3: Experience & Commitment
const ExperienceForm = ({ formData, onChange, nextStep, prevStep }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="form-step">
      <h3>Step 3: Experience & Commitment</h3>

      <label>
        Previous pet experience:
        <textarea name="petExperience" value={formData.petExperience || ''} onChange={handleChange} />
      </label>

      <label>
        Work schedule / lifestyle:
        <textarea name="workSchedule" value={formData.workSchedule || ''} onChange={handleChange} />
      </label>

      <label>
        Who will be responsible for pet care?
        <textarea name="petCareResponsible" value={formData.petCareResponsible || ''} onChange={handleChange} required />
      </label>

      <label className="checkbox-label">
        <input type="checkbox" name="willingVetCare" checked={formData.willingVetCare || false} onChange={handleChange} />
        Willing to provide veterinary care including emergencies?
      </label>

      <label>
        Have you ever surrendered a pet before? Why?
        <textarea name="surrenderedPetBefore" value={formData.surrenderedPetBefore || ''} onChange={handleChange} />
      </label>

      <div className="form-navigation">
        <button type="button" onClick={prevStep}>← Back</button>
        <button type="submit">Next →</button>
      </div>
    </form>
  );
};

// Step 4: Additional Information & Review
const ReviewForm = ({ formData, onChange, prevStep, onSubmit, loading, user }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <form onSubmit={onSubmit} className="form-step">
      <h3>Step 4: Review & Submit</h3>

      <label>
        Reason for adopting:
        <textarea name="reasonAdopting" value={formData.reasonAdopting || ''} onChange={handleChange} required />
      </label>

      <label>
        Allergies to cats or pets in household?
        <textarea name="allergies" value={formData.allergies || ''} onChange={handleChange} />
      </label>

      <label>
        Describe your home environment:
        <textarea name="homeEnvironment" value={formData.homeEnvironment || ''} onChange={handleChange} />
      </label>

      <label>
        Additional information:
        <textarea name="additionalDetails" value={formData.additionalDetails || ''} onChange={handleChange} />
      </label>

      <label className="checkbox-label">
        <input type="checkbox" name="agreePolicies" checked={formData.agreePolicies || false} onChange={handleChange} required />
        I agree to the adoption policies and understand that this is a lifelong commitment.
      </label>

      <div className="review-section">
        <h4>Application Summary:</h4>
        <p><strong>Name:</strong> {user?.name || 'N/A'}</p>
        <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
        <p><strong>Phone:</strong> {formData.phone}</p>
        <p><strong>Home Type:</strong> {formData.homeType}</p>
        <p><strong>Pet Experience:</strong> {formData.petExperience || 'None provided'}</p>
      </div>

      <div className="form-navigation">
        <button type="button" onClick={prevStep}>← Back</button>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
};

// Progress Indicator Component
const ProgressIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="progress-indicator">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`progress-step ${i + 1 === currentStep ? 'active' : ''} ${i + 1 < currentStep ? 'completed' : ''}`}
        >
          <span className="step-number">{i + 1}</span>
        </div>
      ))}
    </div>
  );
};

// Main AdoptionForm Component
const AdoptionForm = () => {
  const { auth } = useContext(AuthContext);
  const { catId } = useParams();
  const [step, setStep] = useState(1);
  // Pre-populate name and email from user
  const user = auth.user || auth;
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    homeType: '',
    rentOwn: '',
    householdMembers: '',
    existingPets: '',
    smokingHome: false,
    outdoorSpace: false,
    petExperience: '',
    workSchedule: '',
    petCareResponsible: '',
    willingVetCare: false,
    surrenderedPetBefore: '',
    reasonAdopting: '',
    allergies: '',
    homeEnvironment: '',
    additionalDetails: '',
    agreePolicies: false,
    contactDetails: '',
    homeCheckPassed: false
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const totalSteps = 4;

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  if (!auth.token) {
    return <div className="login-required">Please login to apply for adoption.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreePolicies) {
      setMessage('You must agree to the adoption policies.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Use formData.fullName and formData.email (editable)
      const res = await fetch('http://localhost:5000/api/adoption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify({ cat: catId, ...formData }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Application failed');

      setMessage('Adoption application submitted successfully!');
      // Reset form or redirect to success page
      setFormData({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        homeType: '',
        rentOwn: '',
        householdMembers: '',
        existingPets: '',
        smokingHome: false,
        outdoorSpace: false,
        petExperience: '',
        workSchedule: '',
        petCareResponsible: '',
        willingVetCare: false,
        surrenderedPetBefore: '',
        reasonAdopting: '',
        allergies: '',
        homeEnvironment: '',
        additionalDetails: '',
        agreePolicies: false,
        contactDetails: '',
        homeCheckPassed: false
      });
      setStep(1);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PersonalInfoForm formData={formData} onChange={setFormData} nextStep={nextStep} user={user} />;
      case 2:
        return <HouseholdForm formData={formData} onChange={setFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <ExperienceForm formData={formData} onChange={setFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return (
          <ReviewForm
            formData={formData}
            onChange={setFormData}
            prevStep={prevStep}
            onSubmit={handleSubmit}
            loading={loading}
            user={user}
          />
        );
      default:
        return <PersonalInfoForm formData={formData} onChange={setFormData} nextStep={nextStep} user={user} />;
    }
  };

  return (
    <div className="adoption-form-container">
      <h2>Adoption Application</h2>
      
      <ProgressIndicator currentStep={step} totalSteps={totalSteps} />
      
      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {renderStep()}
    </div>
  );
};

export default AdoptionForm;