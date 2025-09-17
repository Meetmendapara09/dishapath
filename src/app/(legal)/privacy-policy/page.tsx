
export default function PrivacyPolicyPage() {
  return (
    <>
      <h1>Privacy Policy for Lakshya360</h1>
      <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      
      <p>Welcome to Lakshya360! Your privacy and trust are of utmost importance to us. This policy explains what information we collect, how we use it to fulfill our educational mission, and your choices regarding your data.</p>
      
      <h2>1. What Information We Collect</h2>
      <p>To provide and improve our services, we collect a few types of information.</p>
      
      <h3>Information You Provide to Us:</h3>
      <ul>
        <li><strong>Account Information:</strong> When you create an account, we collect your full name and email address to create and secure your profile.</li>
        <li><strong>Profile Details:</strong> You can choose to provide additional information in your profile, such as your current class and academic interests. This is used to tailor the guidance you receive.</li>
        <li><strong>Quiz & Form Data:</strong> We collect the answers and information you submit through our aptitude quiz, recommendation forms, and AI Counselor. This data is essential for the AI to generate personalized and relevant results.</li>
        <li><strong>Chat History:</strong> Your conversations with the AI Counselor are saved to your profile so you can review them later.</li>
      </ul>

      <h3>Information We Collect Automatically:</h3>
       <ul>
        <li><strong>Usage Data:</strong> We may collect anonymous information on how you access and use the Service (e.g., which features are most popular). This helps us understand what is working and how we can improve the platform for all students.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect for the sole purpose of advancing our educational mission:</p>
      <ul>
        <li><strong>To Personalize Your Experience:</strong> To provide you with AI-powered recommendations for courses, colleges, and careers based on your profile, interests, and quiz results.</li>
        <li><strong>To Operate and Maintain the Service:</strong> To run the platform, authenticate you, save your progress, and ensure everything works correctly and securely.</li>
        <li><strong>To Communicate with You:</strong> To send you important, non-promotional updates about the Service or notify you about changes.</li>
        <li><strong>To Improve Our Service:</strong> To analyze how users interact with our platform so we can make it better, more intuitive, and more useful for students across India.</li>
      </ul>

      <h2>3. How We Share and Protect Your Information</h2>
      <p>We do not sell, rent, or trade your personal data with any third parties for marketing purposes. Your information is not shared, except in the following limited circumstances:</p>
       <ul>
        <li><strong>AI Processing:</strong> Your anonymized inputs (without direct personal identifiers like email) are sent to our AI service provider (Google) solely to generate a response for you. These interactions are governed by strict privacy agreements.</li>
        <li><strong>For Legal Reasons:</strong> We may share information if required by law or to protect the rights and safety of our users, our organization, and the public.</li>
      </ul>

      <h2>4. Data Security</h2>
      <p>The security of your data is a top priority. We use robust, industry-standard security measures, including those provided by Google Cloud and Firebase (encryption, access controls, secure protocols), to protect your information. Our database is protected by strict security rules that prevent users from accessing each other's data. However, please remember that no method of transmission over the Internet is 100% secure.</p>

      <h2>5. Your Data Rights</h2>
      <p>You are in control of your data. You have the right to:</p>
      <ul>
        <li>Access and update your profile information at any time through the Profile page.</li>
        <li>Delete your saved recommendations, bookmarked colleges, and quiz results directly from the dashboard.</li>
        <li>Request the full deletion of your account and all associated data by contacting us.</li>
      </ul>

      <h2>6. Changes to This Privacy Policy</h2>
      <p>We may update our Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page. We encourage you to review this Privacy Policy periodically.</p>
      
      <h2>7. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please feel free to contact us through our platform's support channels.</p>
    </>
  );
}
