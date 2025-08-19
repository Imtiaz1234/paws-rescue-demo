import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/AdoptionForm.css';


const AdoptionForm = () => {
  const { auth } = useContext(AuthContext);
  const { catId } = useParams();

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phone: '',
    email: '',
    householdMembers: '',
    existingPets: '',
    homeType: '',
    rentOwn: '',
    reasonAdopting: '',
    petExperience: '',
    workSchedule: '',
    petCareResponsible: '',
    willingVetCare: false,
    surrenderedPetBefore: '',
    allergies: '',
    homeEnvironment: '',
    outdoorSpace: false,
    smokingHome: false,
    additionalDetails: '',
    agreePolicies: false,
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!auth.token) {
    return <div>Please login to apply for adoption.</div>;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreePolicies) {
      setMessage('You must agree to the adoption policies.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
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
      setFormData({
        fullName: '',
        address: '',
        phone: '',
        email: '',
        householdMembers: '',
        existingPets: '',
        homeType: '',
        rentOwn: '',
        reasonAdopting: '',
        petExperience: '',
        workSchedule: '',
        petCareResponsible: '',
        willingVetCare: false,
        surrenderedPetBefore: '',
        allergies: '',
        homeEnvironment: '',
        outdoorSpace: false,
        smokingHome: false,
        additionalDetails: '',
        agreePolicies: false,
      });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Adoption Application</h3>
      {message && <p>{message}</p>}

      <label>
        Full Name:
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
      </label>

      <label>
        Address:
        <input type="text" name="address" value={formData.address} onChange={handleChange} required />
      </label>

      <label>
        Phone:
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
      </label>

      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </label>

      <label>
        Household Members (names/ages):
        <textarea name="householdMembers" value={formData.householdMembers} onChange={handleChange} />
      </label>

      <label>
        Existing Pets:
        <textarea name="existingPets" value={formData.existingPets} onChange={handleChange} />
      </label>

      <label>
        Home Type:
        <select name="homeType" value={formData.homeType} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="condo">Condo</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label>
        Do you rent or own?
        <select name="rentOwn" value={formData.rentOwn} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="rent">Rent</option>
          <option value="own">Own</option>
        </select>
      </label>

      <label>
        Reason for adopting:
        <textarea name="reasonAdopting" value={formData.reasonAdopting} onChange={handleChange} required />
      </label>

      <label>
        Previous pet experience:
        <textarea name="petExperience" value={formData.petExperience} onChange={handleChange} />
      </label>

      <label>
        Work schedule / lifestyle:
        <textarea name="workSchedule" value={formData.workSchedule} onChange={handleChange} />
      </label>

      <label>
        Who will be responsible for pet care?
        <textarea name="petCareResponsible" value={formData.petCareResponsible} onChange={handleChange} required />
      </label>

      <label>
        Willing to provide veterinary care including emergencies?
        <input type="checkbox" name="willingVetCare" checked={formData.willingVetCare} onChange={handleChange} />
      </label>

      <label>
        Have you ever surrendered a pet before? Why?
        <textarea name="surrenderedPetBefore" value={formData.surrenderedPetBefore} onChange={handleChange} />
      </label>

      <label>
        Allergies to cats or pets in household?
        <textarea name="allergies" value={formData.allergies} onChange={handleChange} />
      </label>

      <label>
        Describe your home environment:
        <textarea name="homeEnvironment" value={formData.homeEnvironment} onChange={handleChange} />
      </label>

      <label>
        Do you have a safe outdoor space for the cat?
        <input type="checkbox" name="outdoorSpace" checked={formData.outdoorSpace} onChange={handleChange} />
      </label>

      <label>
        Smoking home?
        <input type="checkbox" name="smokingHome" checked={formData.smokingHome} onChange={handleChange} />
      </label>

      <label>
        Additional information:
        <textarea name="additionalDetails" value={formData.additionalDetails} onChange={handleChange} />
      </label>

      <label>
        <input type="checkbox" name="agreePolicies" checked={formData.agreePolicies} onChange={handleChange} required />
        I agree to the adoption policies.
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
};

export default AdoptionForm;
