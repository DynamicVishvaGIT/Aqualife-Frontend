// Mock pin code → city/state lookup. Replace with a real API call when available.
const PINCODE_LOOKUP = {
  "110001": { "city": "New Delhi", "state": "Delhi" },
  "110002": { "city": "New Delhi", "state": "Delhi" },

  "400001": { "city": "Mumbai", "state": "Maharashtra" },
  "400002": { "city": "Mumbai", "state": "Maharashtra" },
  "400003": { "city": "Mumbai", "state": "Maharashtra" },

  "411001": { "city": "Pune", "state": "Maharashtra" },
  "411002": { "city": "Pune", "state": "Maharashtra" },

  "560001": { "city": "Bengaluru", "state": "Karnataka" },
  "560002": { "city": "Bengaluru", "state": "Karnataka" },

  "600001": { "city": "Chennai", "state": "Tamil Nadu" },
  "600002": { "city": "Chennai", "state": "Tamil Nadu" },

  "500001": { "city": "Hyderabad", "state": "Telangana" },
  "500002": { "city": "Hyderabad", "state": "Telangana" },

  "700001": { "city": "Kolkata", "state": "West Bengal" },
  "700002": { "city": "Kolkata", "state": "West Bengal" },

  "380001": { "city": "Ahmedabad", "state": "Gujarat" },
  "380002": { "city": "Ahmedabad", "state": "Gujarat" },

  "302001": { "city": "Jaipur", "state": "Rajasthan" },
  "302002": { "city": "Jaipur", "state": "Rajasthan" },

  "226001": { "city": "Lucknow", "state": "Uttar Pradesh" },

  "208001": { "city": "Kanpur", "state": "Uttar Pradesh" },

  "201001": { "city": "Ghaziabad", "state": "Uttar Pradesh" },

  "122001": { "city": "Gurugram", "state": "Haryana" },

  "121001": { "city": "Faridabad", "state": "Haryana" },

  "160001": { "city": "Chandigarh", "state": "Chandigarh" },

  "682001": { "city": "Kochi", "state": "Kerala" },

  "695001": { "city": "Thiruvananthapuram", "state": "Kerala" },

  "641001": { "city": "Coimbatore", "state": "Tamil Nadu" },

  "620001": { "city": "Tiruchirappalli", "state": "Tamil Nadu" },

  "751001": { "city": "Bhubaneswar", "state": "Odisha" },

  "781001": { "city": "Guwahati", "state": "Assam" },

  "800001": { "city": "Patna", "state": "Bihar" },

  "834001": { "city": "Ranchi", "state": "Jharkhand" },

  "492001": { "city": "Raipur", "state": "Chhattisgarh" },

  "462001": { "city": "Bhopal", "state": "Madhya Pradesh" },

  "452001": { "city": "Indore", "state": "Madhya Pradesh" },

  "390001": { "city": "Vadodara", "state": "Gujarat" },

  "395003": { "city": "Surat", "state": "Gujarat" },

  "440001": { "city": "Nagpur", "state": "Maharashtra" },

  "422001": { "city": "Nashik", "state": "Maharashtra" },

  "431001": { "city": "Aurangabad", "state": "Maharashtra" },

  "248001": { "city": "Dehradun", "state": "Uttarakhand" },

  "171001": { "city": "Shimla", "state": "Himachal Pradesh" },

  "180001": { "city": "Jammu", "state": "Jammu & Kashmir" },

  "190001": { "city": "Srinagar", "state": "Jammu & Kashmir" },

  "796001": { "city": "Aizawl", "state": "Mizoram" },

  "797001": { "city": "Kohima", "state": "Nagaland" },

  "791001": { "city": "Itanagar", "state": "Arunachal Pradesh" },

  "799001": { "city": "Agartala", "state": "Tripura" },

  "737101": { "city": "Gangtok", "state": "Sikkim" },

  "403001": { "city": "Panaji", "state": "Goa" },

  "605001": { "city": "Puducherry", "state": "Puducherry" },

  "744101": { "city": "Port Blair", "state": "Andaman & Nicobar Islands" }
}

export default PINCODE_LOOKUP