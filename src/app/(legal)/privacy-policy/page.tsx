
export default function PrivacyPolicyPage() {
  return (
    <>
      <h1>Privacy Policy for Lakshya360</h1>
      <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      
      <p>Welcome to Lakshya360! Your privacy is important to us. This policy explains what information we collect, how we use it, and your choices regarding your data. We've tried to make it as clear and simple as possible.</p>
      
      <h2>1. What Information We Collect</h2>
      <p>To provide and improve our services, we collect a few types of information.</p>
      
      <h3>Information You Provide to Us:</h3>
      <ul>
        <li><strong>Account Information:</strong> When you create an account, we collect your full name and email address.</li>
        <li><strong>Profile Details:</strong> You can choose to provide additional information in your profile, such as your current class and academic interests.</li>
        <li><strong>Quiz & Form Data:</strong> We collect the answers and information you submit through our aptitude quiz and recommendation forms to generate personalized results.</li>
      </ul>

      <h3>Information We Collect Automatically:</h3>
       <ul>
        <li><strong>Usage Data:</strong> We may collect information on how you access and use the Service. This helps us understand what features are popular and how we can improve.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect for the following purposes:</p>
      <ul>
        <li><strong>To Personalize Your Experience:</strong> To provide you with AI-powered recommendations for courses, colleges, and careers based on your profile and quiz results.</li>
        <li><strong>To Operate and Maintain the Service:</strong> To run the platform, authenticate you, and ensure everything works correctly.</li>
        <li><strong>To Communicate with You:</strong> To send you important updates about the Service or notify you about changes.</li>
        <li><strong>To Improve Our Service:</strong> To analyze how users interact with our platform so we can make it better, more intuitive, and more useful.</li>
      </ul>

      <h2>3. How We Share Your Information</h2>
      <p>We do not sell your personal data. We only share information in the following limited circumstances:</p>
       <ul>
        <li><strong>With Your Consent:</strong> We will share information with third parties if you give us permission to do so.</li>
        <li><strong>For Legal Reasons:</strong> We may share information if required by law or to protect the rights and safety of our users and our company.</li>
      </ul>

      <h2>4. Data Security</h2>
      <p>The security of your data is a priority. We use commercially acceptable measures, including those provided by Google Cloud and Firebase, to protect your information. However, please remember that no method of transmission over the Internet or electronic storage is 100% secure.</p>

      <h2>5. Your Data Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access and update your profile information at any time through the Profile page.</li>
        <li>Delete your saved recommendations and quiz results directly from the dashboard.</li>
        <li>Delete your account by contacting us.</li>
      </ul>

      <h2>6. Changes to This Privacy Policy</h2>
      <p>We may update our Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page. We encourage you to review this Privacy Policy periodically.</p>
      
      <h2>7. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please feel free to contact us through our platform's support channels.</p>
    </>
  );
}
