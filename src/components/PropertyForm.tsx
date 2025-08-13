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



const PropertyForm: React.FC<PropertyFormProps> = ({ onSubmit, locations, isloading, editing, setEditing, propertyBeingEdited, onEdit }) => {

  const [uploading, setUploading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])




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
      location: formData.get('location') as string,
      type: formData.get('category') as string,
      features: features,
      images: imageUrls,
      mapUrl: formData.get('mapUrl') as string,
      area: Number(formData.get('area')),
      bathrooms: formData.get("bathrooms") as string,
      bedrooms: formData.get("bedrooms") as string,
      buildYear: realYear,
      price: Number(formData.get("price")),
      status: formData.get("status") as "available" | "sold",
      additionalFees: {
        transferTax: Number(formData.get('transferTax')),
        inspection: Number(formData.get('homeInspection')),
        insurance: Number(formData.get("annualInsurance")),
        legalFees: Number(formData.get("legalFees")),
      },
      monthlyCosts: {
        hoa: Number(formData.get("hao")),
        propertyTaxes: Number(formData.get("propertyTaxes"))
      },
      monthlyExpenses: {
        hoa: Number(formData.get("hao")),
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

    }
    else {
      onSubmit(propertyData);
    }

    e.currentTarget.reset();
    setImageUrls([]);


  };


  useEffect(() => {
    if (editing && propertyBeingEdited) {
      setFeatures(propertyBeingEdited.features || []);
      setImageUrls(propertyBeingEdited.images || []);
    } else {
      setFeatures([]);
      setImageUrls([]);
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
              value={editing ? propertyBeingEdited?.location : ""}
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
              value={editing ? propertyBeingEdited?.type : ""}
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
            value={editing ? propertyBeingEdited?.status : ""}
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
            {/* review later */}
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
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FormField
            label="Annual Insurance"
            name="annualInsurance"
            type="number"
            required
            defaultValue={editing ? propertyBeingEdited?.additionalFees?.insurance : ""}
          />
        </div>

      </div>

      <div className="monthly_costs w-full mt-5">
        <h3 className='text-xl font-bold text-gray-800 dark:text-white mb-3'>Monthly Costs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FormField
            label="Property Taxes"
            name="propertyTaxes"
            type="number"
            required
            defaultValue={editing ? propertyBeingEdited?.monthlyCosts.propertyTaxes : ""}
          />

          <FormField
            label="Homeowners' Association Fee"
            name="hoa"
            type="number"
            required
            defaultValue={editing ? propertyBeingEdited?.monthlyCosts.hoa : ""}
          />
        </div>

      </div>
      <div className="totalIntialCosts w-full mt-5">
        <h3 className='text-xl font-bold text-gray-800 dark:text-white mb-3'>Total Initial Costs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FormField
            label="Down Payment"
            name="downPayment"
            type="number"
            required
            defaultValue={editing ? propertyBeingEdited?.totalInitialCosts.downPayment : ""}
          />
          <FormField
            label="Mortgage Amount"
            name="mortgageAmount"
            type="number"
            required
            defaultValue={editing ? propertyBeingEdited?.totalInitialCosts.mortgageAmount : ""}
          />
        </div>
      </div>
      <div className="mt-8 flex justify-end submit_area">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {editing ? 'Save Changes' : "Add Property"}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;