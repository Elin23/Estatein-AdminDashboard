import React, { useEffect, useState, type Dispatch } from 'react';
import { X } from 'lucide-react';
import type { Property, PropertyFormData } from '../types';
import FeaturesInput from './form/FeaturesInput';
import FormField from './InputField/FormField';

interface PropertyFormProps {
  onSubmit: (data: PropertyFormData) => void;
  locations: string[];
  isloading: boolean;
  editing: boolean;
  setEditing: Dispatch<React.SetStateAction<boolean>>;
  propertyBeingEdited: Property | null;
  onEdit: (id: any, property: any) => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  onSubmit,
  locations,
  isloading,
  editing,
  setEditing,
  propertyBeingEdited,
  onEdit
}) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);

  // State للـ dropdowns وحقول التحكم
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  // handle multiple images upload function
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=edeee7c6c2851a590946b20e9ce00b5d`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data?.success) {
        uploadedUrls.push(data.data.url);
      }
    }

    setImageUrls((prev) => [...prev, ...uploadedUrls]);
    e.target.value = "";
    setUploading(false);
  };

  // add property function
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const yearValue = formData.get("buildYear") as string;
    const realYear = yearValue.split("-")[0];

    const propertyData: PropertyFormData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      location,
      type: category,
      features,
      images: imageUrls,
      mapUrl: formData.get('mapUrl') as string,
      area: Number(formData.get('area')),
      bathrooms: formData.get("bathrooms") as string,
      bedrooms: formData.get("bedrooms") as string,
      buildYear: realYear,
      price: Number(formData.get("price")),
      status: status as "available" | "sold",
      additionalFees: {
        transferTax: Number(formData.get('transferTax')),
        inspection: Number(formData.get('homeInspection')),
        insurance: Number(formData.get("annualInsurance")),
        legalFees: Number(formData.get("legalFees")),
      },
      monthlyCosts: {
        hoa: Number(formData.get("hoa")),
        propertyTaxes: Number(formData.get("propertyTaxes"))
      },
      monthlyExpenses: {
        hoa: Number(formData.get("hoa")),
        insurance: Number(formData.get("annualInsurance")) / 12,
        propertyTaxes: Number(formData.get("propertyTaxes"))
      },
      totalInitialCosts: {
        downPayment: Number(formData.get("downPayment")),
        additionalFees: Number(formData.get('transferTax')) + Number(formData.get("legalFees")) + Number(formData.get('homeInspection')) + Number(formData.get("annualInsurance")),
        listingPrice: Number(formData.get("price")),
        mortgageAmount: Number(formData.get("mortgageAmount"))
      }
    };

    if (editing) {
      onEdit(propertyBeingEdited!.id, propertyData)
    } else {
      onSubmit(propertyData);
    }

    e.currentTarget.reset();
    setImageUrls([]);
    setFeatures([]);
    setLocation('');
    setCategory('');
    setStatus('');
  };

  useEffect(() => {
    if (editing && propertyBeingEdited) {
      setFeatures(propertyBeingEdited.features || []);
      setImageUrls(propertyBeingEdited.images || []);
      setLocation(propertyBeingEdited.location || '');
      setCategory(propertyBeingEdited.type || '');
      setStatus(propertyBeingEdited.status || '');
    } else {
      setFeatures([]);
      setImageUrls([]);
      setLocation('');
      setCategory('');
      setStatus('');
    }
  }, [editing, propertyBeingEdited]);

  return (
    <form onSubmit={handleSubmit} className="eco-form animate-fade-in huge:max-w-[1430px] mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Add New Property</h2>

      {isloading && <div className="loading_shape w-full h-full bg-gray10 text-white text-6xl font-semibold text-center animate-pulse"></div>}

      <div className="space-y-6">
        <div className='flex w-full justify-between'>
          <div className=' w-[47%] name/title'>
            <FormField
              name='title'
              label="Title"
              defaultValue={editing ? propertyBeingEdited?.title : ''}
              required
            />
          </div>
          <div className='w-[47%] price/totalPrice'>
            <FormField
              type="number"
              name='price'
              label="Price"
              defaultValue={editing ? propertyBeingEdited?.price : ''}
              required
            />
          </div>
        </div>

        <div className='description'>
          <FormField
            name="description"
            label="Description"
            rows={4}
            required
            defaultValue={editing ? propertyBeingEdited?.description : ''}
            multiline
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className='location'>
            <FormField
              label="Location"
              name="location"
              required
              select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              options={locations.map((loc) => ({ value: loc, label: loc }))}
              placeholder="Select Location"
            />
          </div>

          <div className='properyt_type'>
            <FormField
              label="Category"
              name="category"
              required
              select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Select Category"
              options={[
                { value: "villa", label: "villa" },
                { value: "apartment", label: "apartment" },
                { value: "house", label: "house" },
              ]}
            />
          </div>

          <div className='area'>
            <FormField
              type="number"
              name='area'
              label="Area(sq ft)"
              defaultValue={editing ? propertyBeingEdited?.area : ''}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className='buildYear'>
            <FormField
              type="date"
              name='buildYear'
              label="Build Year"
              defaultValue={editing ? propertyBeingEdited?.buildYear : ''}
              required
            />
          </div>

          <div className='bedRooms'>
            <FormField
              type="number"
              name='bedrooms'
              label="Bedrooms Count"
              defaultValue={editing ? propertyBeingEdited?.bedrooms : ''}
              required
            />
          </div>

          <div className='bathRooms'>
            <FormField
              label="Bathrooms Count"
              name="bathrooms"
              type="number"
              required
              defaultValue={editing ? propertyBeingEdited?.bathrooms : ""}
            />
          </div>
        </div>

        <div className="map_andStatus flex w-full gap-3">
          <FormField
            label="Map URL"
            name="mapUrl"
            type="url"
            required
            defaultValue={editing ? propertyBeingEdited?.mapUrl : ""}
            placeholder="Enter Google Maps URL"
            className="grow"
          />

          <FormField
            label="Status"
            name="status"
            required
            select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="Select Status"
            options={[
              { value: "available", label: "available" },
              { value: "sold", label: "sold" },
            ]}
            className="grow"
          />
        </div>

        <div className="space-y-4 images_input_and_display">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Images</label>
          <div className="flex gap-2 images_input">
            <FormField
              label="Upload Images"
              name="images"
              file
              accept=".png,.jpg,.jpeg,.webp"
              multiple
              onChange={(e) => {
                handleImageUpload(e as React.ChangeEvent<HTMLInputElement>);
              }} />
          </div>

          {uploading && <div className='w-10 h-10 animate-ping rounded-4xl bg-blue-700 mx-auto'></div>}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 selected_images_display">
            {imageUrls.map((image, index) => (
              <div key={index} className="relative group animate-fade-in">
                <img
                  src={image}
                  alt={`Property ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== index))}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='features'>
        <FeaturesInput features={features} setFeatures={setFeatures} />
      </div>

      <div className='additional_fees w-full mt-5'>
        <h3 className='text-xl font-bold text-gray-800 dark:text-white mb-3'>Additional Fees</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <FormField
            label="Transfer Tax"
            name="transferTax"
            type="number"
            required
            defaultValue={editing ? propertyBeingEdited?.additionalFees?.transferTax : ""}
          />

          <FormField
            label="Legal Fees"
            name="legalFees"
            type="number"
            required
            defaultValue={editing ? propertyBeingEdited?.additionalFees?.legalFees : ""}
          />

          <FormField
            label="Home Inspection"
            name="homeInspection"
            type="number"
            required
            defaultValue={editing ? propertyBeingEdited?.additionalFees?.inspection : ""}
          />

          <FormField
            label="Annual Insurance"
            name="annualInsurance"
            type="number"
            required
            defaultValue={editing ? propertyBeingEdited?.additionalFees?.insurance : ""}
          />
        </div>
      </div>

      <div className="mt-5 text-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={uploading}
        >
          {editing ? "Update Property" : "Add Property"}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;
