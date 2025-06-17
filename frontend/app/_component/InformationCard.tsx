const InformationCard = () => {
  return (
    <div className="p-6  mx-auto text-black">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Address Information */}
        <div className="border border-gray-300 p-4 bg-white gap-2 rounded-md">
          <h2 className="text-lg font-bold mb-4">Address Information</h2>
          <p>
            <strong>Country:</strong> India
          </p>
          <p>
            <strong>State:</strong> Uttar Pradesh
          </p>
          <p>
            <strong>City:</strong> Noida
          </p>
          <p>
            <strong>Pin Code:</strong> 211307
          </p>
          <p>
            <strong>Street Address:</strong> Noida sector-63 D block
          </p>
          <p>
            <strong>Home Number:</strong> D-243 2nd Floor
          </p>
        </div>

        {/* Bank Information */}
        <div className="border border-gray-300 p-4 bg-white gap-2">
          <h2 className="text-lg font-bold mb-4">Bank Information</h2>
          <p>
            <strong>Bank Name:</strong> Punjab National Bank
          </p>
          <p>
            <strong>Account No:</strong> XXXXXXXXXX
          </p>
          <p>
            <strong>IFSC Code:</strong> ZZZZZZZZZZ
          </p>
          <p>
            <strong>Pin Code:</strong> 201307
          </p>
          <p>
            <strong>Bank Location:</strong> Noida sector-15 D block
          </p>
          <p>
            <strong>Aadhaar No:</strong> 632222222222
          </p>
          <p>
            <strong>PAN Card No:</strong> 6FFGDX2222
          </p>
        </div>
      </div>
    </div>
  );
};

export default InformationCard;
