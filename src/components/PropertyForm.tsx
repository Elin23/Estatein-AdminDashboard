import React, {useEffect, useState, type Dispatch} from 'react';
import { X} from 'lucide-react';
import type { Property, PropertyFormData } from '../types';
import FeaturesInput from './form/FeaturesInput';

interface PropertyFormProps {
  onSubmit: (data: PropertyFormData) => void;
  locations: string[];
  isloading:boolean;
  editing:boolean;
  setEditing:Dispatch<React.SetStateAction<boolean>>;
  propertyBeingEdited: Property | null;
  onEdit: (id: any, property: any) => void;
}



const PropertyForm: React.FC<PropertyFormProps> = ({ onSubmit, locations,isloading ,editing,setEditing,propertyBeingEdited,onEdit}) => {

  const [uploading, setUploading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [features , setFeatures] = useState<string[]>([])




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
      features:features,
      images:imageUrls,
      mapUrl: formData.get('mapUrl') as string,
      area: Number(formData.get('area')),
      bathrooms:formData.get("bathrooms") as string,
      bedrooms:formData.get("bedrooms") as string,
      buildYear:realYear,
      price:Number(formData.get("price")),
      status:formData.get("status") as "available" | "sold",
      additionalFees:{
        transferTax :Number(formData.get('transferTax')),
        inspection:Number(formData.get('homeInspection')),
        insurance:Number(formData.get("annualInsurance")),
        legalFees:Number(formData.get("legalFees")),
      },
      monthlyCosts:{
        hoa:Number(formData.get("hao")),
        propertyTaxes:Number(formData.get("propertyTaxes"))
      },
      monthlyExpenses:{
        hoa:Number(formData.get("hao")),
        insurance:Number(formData.get("annualInsurance")) / 12,
        propertyTaxes:Number(formData.get("propertyTaxes"))
      },
      totalInitialCosts:{
        downPayment:Number(formData.get("downPayment")),
        additionalFees:Number(formData.get('transferTax')) + Number(formData.get("legalFees")) + Number(formData.get('homeInspection')) + Number(formData.get("annualInsurance")),
        listingPrice:Number(formData.get("price")),
        mortgageAmount:Number(formData.get("mortgageAmount"))
      }
    };

    if(editing){
      onEdit(propertyBeingEdited!.id,propertyData)

    }
    else{
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
    <form onSubmit={handleSubmit} className="eco-form animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Add New Property</h2>

      {isloading && <div className="loading_shape w-full h-full bg-gray10 text-white text-6xl font-semibold text-center animate-pulse"></div>}
      <div className="space-y-6">

        <div className='flex w-full justify-between'>
          <div className=' w-[47%] name/title'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              name="title"
              required
              defaultValue={editing ? propertyBeingEdited?.title : ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className='w-[47%] price/totalPrice'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
            <input
              type="number"
              name="price"
              required
              defaultValue={editing ? propertyBeingEdited?.price : ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className='description'>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            name="description"
            rows={4}
            required
            defaultValue={editing ? propertyBeingEdited?.description : ''}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className='location'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
            <select
              name="location"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={editing ? propertyBeingEdited?.location : ''}
            >
              <option value="">Select Location</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>


          <div className='properyt_type'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select
              name="category"
              required
              value={editing ? propertyBeingEdited?.type : ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Category</option>
              <option value="villa">villa</option>
              <option value="apartment" >apartment</option>
              <option value="house" >house</option>
            </select>
          </div>

          <div className='area'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Area(sq ft)</label>
            <input
              type="number"
              name="area"
              required
              defaultValue={editing ? propertyBeingEdited?.area : ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className='buildYear'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Build Year</label>
            <input 
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
            defaultValue={editing ? propertyBeingEdited?.buildYear : ''}
            name="buildYear"
            />
          </div>


          <div className='bedRooms'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bedrooms Count</label>
            <input 
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
              defaultValue={editing ? propertyBeingEdited?.bedrooms : ''}
              name="bedrooms"
              />
          </div>

          <div className='bathRooms'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bathrooms Count</label>
            <input
              type="number"
              name="bathrooms"
              required
              defaultValue={editing ? propertyBeingEdited?.bathrooms : ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="map_andStatus flex w-full gap-3">
          <div className='mapURL grow'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Map URL</label>
            <input
              type="url"
              name="mapUrl"
              required
              defaultValue={editing ? propertyBeingEdited?.mapUrl : ''}
              placeholder="Enter Google Maps URL"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className=' grow'>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select
              name="status"
              required
              value={editing ? propertyBeingEdited?.status : ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Status</option>
              <option value="available">available</option>
              <option value="sold" >sold</option>
            </select>
          </div>
        </div>

        <div className="space-y-4 images_input_and_display">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Images</label>
          <div className="flex gap-2 images_input">
            <input
              type="file"
              onChange={handleImageUpload}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter image URL"
              accept=".png, .jpg, .jpeg, .webp"
              multiple
            />
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
            <FeaturesInput  features={features} setFeatures={setFeatures}/> 
      </div>


      <div className='additional_fees w-full mt-5'>
        <h3 className='text-xl font-bold text-gray-800 dark:text-white mb-3'>Additional Fees</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
          <div className="transfetTax">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Transfer Tax</label>
            <input 
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                defaultValue={editing ? propertyBeingEdited?.additionalFees?.transferTax : ''}
                name="transferTax"
                />
          </div>
          <div className="legalFees">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Legal Fees</label>
            <input 
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                defaultValue={editing ? propertyBeingEdited?.additionalFees?.legalFees : ''}
                name="legalFees"
                />
          </div>
          <div className="inspection">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Home Inspection</label>
            <input 
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                defaultValue={editing ? propertyBeingEdited?.additionalFees?.inspection : ''}
                name="homeInspection"
                />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="Annual Insurance">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Annual Insurance</label>
            <input 
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                defaultValue={editing ? propertyBeingEdited?.additionalFees?.insurance : ''}
                name="annualInsurance"
                />
          </div>

        </div>
      </div>

      <div className="monthly_costs w-full mt-5">
        <h3 className='text-xl font-bold text-gray-800 dark:text-white mb-3'>Monthly Costs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="PropertsTaxes">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Property Taxes</label>
            <input 
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                defaultValue={editing ? propertyBeingEdited?.monthlyCosts.propertyTaxes : ''}
                name="propertyTaxes"
                />
          </div>  
          <div className="hao">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Homeowners' Association Fee</label>
            <input 
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                defaultValue={editing ? propertyBeingEdited?.monthlyCosts.hoa : ''}
                name="hao"
                />
          </div>
        </div>    
      </div>
      <div className="totalIntialCosts w-full mt-5">
        <h3 className='text-xl font-bold text-gray-800 dark:text-white mb-3'>Total Initial Costs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="downPayment">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Down Payment</label>
            <input 
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                defaultValue={editing ? propertyBeingEdited?.totalInitialCosts.downPayment : ''}
                name="downPayment"
                />
          </div>
          <div className="mortgageAmount">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mortgage Amount</label>
            <input 
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                defaultValue={editing ? propertyBeingEdited?.totalInitialCosts.mortgageAmount : ''}
                name="mortgageAmount"
                />
          </div>
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